import { useEffect, useRef, useState } from 'react'
import { TechIcon } from './TechIcons'
import './TechGlobe3D.css'

export default function TechGlobe3D({ items }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 })
  const [projectedItems, setProjectedItems] = useState([])

  const isDraggingRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0.003, y: 0 })
  const rotationRef = useRef({ x: 0.2, y: 0 })

  // Static 3D coordinates for items distributed evenly on a sphere (Fibonacci sphere)
  const spherePointsRef = useRef([])

  useEffect(() => {
    if (!items || items.length === 0) return
    const pts = []
    const count = items.length
    const phi = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = (2 * Math.PI * i) / phi

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      pts.push({
        item: items[i],
        vec: { x, y, z },
      })
    }
    spherePointsRef.current = pts
  }, [items])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500,
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation Loop (Continuous spin + Inertia + Dense 3D Wireframe Canvas)
  useEffect(() => {
    let animId

    const animate = () => {
      if (!isDraggingRef.current) {
        velocityRef.current.x *= 0.95
        velocityRef.current.y *= 0.95
        rotationRef.current.y += 0.003 + velocityRef.current.x
        rotationRef.current.x += velocityRef.current.y
      }

      const rotX = rotationRef.current.x
      const rotY = rotationRef.current.y

      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      const baseRadius = Math.min(containerSize.width, containerSize.height)
      const radiusX = baseRadius * 0.56 // Wider horizontal axis for oval shape
      const radiusY = baseRadius * 0.38 // Vertical axis
      const cx = containerSize.width / 2
      const cy = containerSize.height / 2

      // Project points for DOM Overlay Logos
      const projected = spherePointsRef.current.map((pt) => {
        const { x, y, z } = pt.vec

        // Y & X rotation
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const scale = 1 / (1 + z2 * 0.38)
        const px = cx + x1 * radiusX * scale
        const py = cy + y2 * radiusY * scale

        // Depth opacity & scale
        const opacity = z2 > 0 ? 0.7 + z2 * 0.3 : 0.1 + (z2 + 1) * 0.25
        const itemScale = z2 > 0 ? 0.9 + z2 * 0.35 : 0.55 + (z2 + 1) * 0.25
        const zIndex = Math.round((z2 + 1) * 100)

        return {
          ...pt.item,
          px,
          py,
          pz: z2,
          scale: itemScale,
          opacity,
          zIndex,
        }
      })

      setProjectedItems(projected)

      // Draw Dense 3D Wireframe Sphere Mesh on Background Canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = containerSize.width * dpr
          canvas.height = containerSize.height * dpr
          ctx.scale(dpr, dpr)
          ctx.clearRect(0, 0, containerSize.width, containerSize.height)

          const project3D = (x, y, z) => {
            const rx1 = x * cosY - z * sinY
            const rz1 = x * sinY + z * cosY
            const ry2 = y * cosX - rz1 * sinX
            const rz2 = y * sinX + rz1 * cosX

            const rScale = 1 / (1 + rz2 * 0.38)
            return {
              rpx: cx + rx1 * radiusX * rScale,
              rpy: cy + ry2 * radiusY * rScale,
              rz2,
            }
          }

          // 1. Draw Latitudinal Rings (16 rings)
          const latRingsCount = 16
          for (let i = 1; i < latRingsCount; i++) {
            const latY = -1 + (i / latRingsCount) * 2
            const rRing = Math.sqrt(Math.max(0, 1 - latY * latY))
            ctx.beginPath()
            let first = true
            for (let a = 0; a <= Math.PI * 2; a += 0.08) {
              const rx = Math.cos(a) * rRing
              const rz = Math.sin(a) * rRing
              const p = project3D(rx, latY, rz)

              if (p.rz2 > -0.6) {
                const alpha = (p.rz2 + 0.6) * 0.065
                ctx.strokeStyle = `rgba(130, 140, 220, ${alpha})`
                ctx.lineWidth = 0.6
                if (first) {
                  ctx.moveTo(p.rpx, p.rpy)
                  first = false
                } else {
                  ctx.lineTo(p.rpx, p.rpy)
                }
              } else {
                first = true
              }
            }
            ctx.stroke()
          }

          // 2. Draw Longitudinal Meridians (20 meridians)
          const lonRingsCount = 20
          for (let i = 0; i < lonRingsCount; i++) {
            const lonAngle = (i / lonRingsCount) * Math.PI * 2
            ctx.beginPath()
            let first = true
            for (let latA = -Math.PI / 2; latA <= Math.PI / 2; latA += 0.08) {
              const rx = Math.cos(latA) * Math.cos(lonAngle)
              const ry = Math.sin(latA)
              const rz = Math.cos(latA) * Math.sin(lonAngle)
              const p = project3D(rx, ry, rz)

              if (p.rz2 > -0.6) {
                const alpha = (p.rz2 + 0.6) * 0.065
                ctx.strokeStyle = `rgba(130, 140, 220, ${alpha})`
                ctx.lineWidth = 0.6
                if (first) {
                  ctx.moveTo(p.rpx, p.rpy)
                  first = false
                } else {
                  ctx.lineTo(p.rpx, p.rpy)
                }
              } else {
                first = true
              }
            }
            ctx.stroke()
          }

          // 3. Atmosphere Outer Ambient Glow Gradient (Oval shape)
          const glowGrad = ctx.createRadialGradient(cx, cy, radiusX * 0.6, cx, cy, radiusX * 1.25)
          glowGrad.addColorStop(0, 'rgba(100, 120, 255, 0.04)')
          glowGrad.addColorStop(0.5, 'rgba(100, 120, 255, 0.015)')
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.ellipse(cx, cy, radiusX * 1.2, radiusY * 1.2, 0, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [containerSize])

  // Drag Interaction
  const handleMouseDown = (e) => {
    isDraggingRef.current = true
    lastMouseRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const deltaX = e.clientX - lastMouseRef.current.x
    const deltaY = e.clientY - lastMouseRef.current.y

    const rotSpeed = 0.005
    rotationRef.current.y += deltaX * rotSpeed
    rotationRef.current.x += deltaY * rotSpeed

    velocityRef.current = {
      x: deltaX * rotSpeed,
      y: deltaY * rotSpeed,
    }

    lastMouseRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      className="tech-globe-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        if (e.touches.length === 1) handleMouseDown(e.touches[0])
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) handleMouseMove(e.touches[0])
      }}
      onTouchEnd={handleMouseUp}
    >
      {/* Background Canvas Wireframe Sphere Mesh */}
      <canvas ref={canvasRef} className="tech-globe-canvas" />

      {/* Floating Pure Brand Logos (No Box) */}
      <div className="tech-globe-items">
        {projectedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`tech-globe-item ${item.pz > 0 ? 'tech-globe-item--front' : 'tech-globe-item--back'}`}
            style={{
              transform: `translate3d(${item.px}px, ${item.py}px, 0) translate(-50%, -50%) scale(${item.scale})`,
              opacity: item.opacity,
              zIndex: item.zIndex,
            }}
          >
            <div className="tech-globe-logo-wrapper">
              <TechIcon name={item.icon} className="tech-globe-logo-icon" />
              <span className="tech-globe-logo-label">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
