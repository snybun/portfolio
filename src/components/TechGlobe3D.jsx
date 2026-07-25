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
  const velocityRef = useRef({ x: 0.003, y: 0.002, z: 0.001 })
  const rotationRef = useRef({ x: 0.2, y: 0, z: 0.1 })

  // Static 3D coordinates for items distributed evenly on a sphere (Fibonacci sphere)
  const spherePointsRef = useRef([])

  useEffect(() => {
    if (!items || items.length === 0) return
    const pts = []
    const count = items.length
    const phi = (1 + Math.sqrt(5)) / 2

    // Apply a 45-degree initial 3D tilt so no items sit stationary on the rotational poles
    const tiltAngle = Math.PI / 4 // 45 degrees
    const sinT = Math.sin(tiltAngle)
    const cosT = Math.cos(tiltAngle)

    for (let i = 0; i < count; i++) {
      const rawY = 1 - (i / (count - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - rawY * rawY))
      const theta = (2 * Math.PI * i) / phi

      const rawX = Math.cos(theta) * radiusAtY
      const rawZ = Math.sin(theta) * radiusAtY

      // Tilt around X axis so pole points (i=0, i=count-1) move dynamically across vertical/horizontal loops
      const x = rawX
      const y = rawY * cosT - rawZ * sinT
      const z = rawY * sinT + rawZ * cosT

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

  // Animation Loop (Continuous Active Vertical & Horizontal 3D Revolution)
  useEffect(() => {
    let animId

    const animate = () => {
      if (!isDraggingRef.current) {
        velocityRef.current.x *= 0.95
        velocityRef.current.y *= 0.95

        // Active Vertical (top-to-bottom) & Horizontal (left-to-right) spin speeds (Slower, elegant pace)
        const speedX = 0.0028 // Vertical pitch speed
        const speedY = 0.0022 // Horizontal yaw speed

        rotationRef.current.x += speedX + velocityRef.current.y
        rotationRef.current.y += speedY + velocityRef.current.x
      }

      const rotX = rotationRef.current.x
      const rotY = rotationRef.current.y

      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      const baseRadius = Math.min(containerSize.width, containerSize.height)
      const globeRadius = baseRadius * 0.44 // True equal 3D sphere radius centered in middle
      const radiusX = globeRadius
      const radiusY = globeRadius
      const cx = containerSize.width / 2
      const cy = containerSize.height / 2

      // Complete 3D Euler Rotation Matrix (Pitch X -> Yaw Y)
      const project3D = (x, y, z) => {
        // 1. Rotate around X (pitch / vertical)
        const x1 = x
        const y1 = y * cosX - z * sinX
        const z1 = y * sinX + z * cosX

        // 2. Rotate around Y (yaw / horizontal)
        const x2 = x1 * cosY + z1 * sinY
        const y2 = y1
        const z2 = -x1 * sinY + z1 * cosY

        const scale = 1 / (1 + z2 * 0.38)
        return {
          px: cx + x2 * radiusX * scale,
          py: cy + y2 * radiusY * scale,
          pz: z2,
          scale,
        }
      }

      // Project points for DOM Overlay Logos
      const projected = spherePointsRef.current.map((pt) => {
        const p = project3D(pt.vec.x, pt.vec.y, pt.vec.z)

        // Subtle depth opacity & tight scale factor (matching Python icon size)
        const opacity = p.pz > 0 ? 0.85 + p.pz * 0.15 : 0.25 + (p.pz + 1) * 0.25
        const itemScale = p.pz > 0 ? 0.75 + p.pz * 0.15 : 0.5 + (p.pz + 1) * 0.12
        const zIndex = Math.round((p.pz + 1) * 100)

        return {
          ...pt.item,
          px: p.px,
          py: p.py,
          pz: p.pz,
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

              if (p.pz > -0.7) {
                const alpha = (p.pz + 0.7) * 0.075
                ctx.strokeStyle = `rgba(130, 145, 230, ${alpha})`
                ctx.lineWidth = 0.6
                if (first) {
                  ctx.moveTo(p.px, p.py)
                  first = false
                } else {
                  ctx.lineTo(p.px, p.py)
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

              if (p.pz > -0.7) {
                const alpha = (p.pz + 0.7) * 0.075
                ctx.strokeStyle = `rgba(130, 145, 230, ${alpha})`
                ctx.lineWidth = 0.6
                if (first) {
                  ctx.moveTo(p.px, p.py)
                  first = false
                } else {
                  ctx.lineTo(p.px, p.py)
                }
              } else {
                first = true
              }
            }
            ctx.stroke()
          }

          // 3. Atmosphere Outer Ambient Glow Gradient (Circular)
          const glowGrad = ctx.createRadialGradient(cx, cy, radiusX * 0.5, cx, cy, radiusX * 1.2)
          glowGrad.addColorStop(0, 'rgba(100, 120, 255, 0.035)')
          glowGrad.addColorStop(0.5, 'rgba(100, 120, 255, 0.01)')
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(cx, cy, radiusX * 1.2, 0, Math.PI * 2)
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
