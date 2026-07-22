import { useEffect, useRef, useState } from 'react'
import { TechIcon } from './TechIcons'
import './TechGlobe3D.css'

export default function TechGlobe3D({ items }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [rotation, setRotation] = useState({ x: 0.2, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 600, height: 480 })
  const [projectedItems, setProjectedItems] = useState([])

  const isDraggingRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0.003, y: 0 })
  const rotationRef = useRef({ x: 0.2, y: 0 })

  // Static 3D coordinates for all items distributed evenly on a sphere (Fibonacci sphere)
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
          height: containerRef.current.clientHeight || 480,
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation Loop (Continuous spin + Inertia + Projection)
  useEffect(() => {
    let animId

    const animate = () => {
      if (!isDraggingRef.current) {
        // Natural friction decay of drag velocity + base continuous spin
        velocityRef.current.x *= 0.95
        velocityRef.current.y *= 0.95
        rotationRef.current.y += 0.003 + velocityRef.current.x
        rotationRef.current.x += velocityRef.current.y
      }

      const rotX = rotationRef.current.x
      const rotY = rotationRef.current.y
      setRotation({ x: rotX, y: rotY })

      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      const radius = Math.min(containerSize.width, containerSize.height) * 0.38
      const cx = containerSize.width / 2
      const cy = containerSize.height / 2

      // Project points for DOM overlay icons
      const projected = spherePointsRef.current.map((pt) => {
        const { x, y, z } = pt.vec

        // Y rotation
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        // X rotation
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const scale = 1 / (1 + z2 * 0.38)
        const px = cx + x1 * radius * scale
        const py = cy + y2 * radius * scale

        // Depth calculations
        const opacity = z2 > 0 ? 0.65 + z2 * 0.35 : 0.12 + (z2 + 1) * 0.3
        const itemScale = z2 > 0 ? 0.85 + z2 * 0.35 : 0.55 + (z2 + 1) * 0.25
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

      // Draw Wireframe Sphere on Background Canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = containerSize.width * dpr
          canvas.height = containerSize.height * dpr
          ctx.scale(dpr, dpr)
          ctx.clearRect(0, 0, containerSize.width, containerSize.height)

          // Draw 3D wireframe latitude/longitude rings
          const rings = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75]
          ctx.lineWidth = 0.75

          rings.forEach((latY) => {
            const rRing = Math.sqrt(Math.max(0, 1 - latY * latY))
            ctx.beginPath()
            let first = true
            for (let a = 0; a <= Math.PI * 2; a += 0.1) {
              const rx = Math.cos(a) * rRing
              const rz = Math.sin(a) * rRing

              // Project Y & X rot
              const rx1 = rx * cosY - rz * sinY
              const rz1 = rx * sinY + rz * cosY
              const ry2 = latY * cosX - rz1 * sinX
              const rz2 = latY * sinX + rz1 * cosX

              const rScale = 1 / (1 + rz2 * 0.38)
              const rpx = cx + rx1 * radius * rScale
              const rpy = cy + ry2 * radius * rScale

              if (rz2 > -0.5) {
                const alpha = Math.max(0, (rz2 + 0.5) * 0.08)
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                if (first) {
                  ctx.moveTo(rpx, rpy)
                  first = false
                } else {
                  ctx.lineTo(rpx, rpy)
                }
              } else {
                first = true
              }
            }
            ctx.stroke()
          })

          // Draw outer atmospheric halo circle
          const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.2)
          glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)')
          glowGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.015)')
          glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [containerSize])

  // Mouse / Touch Drag Events for spinning globe in 3D
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
        if (e.touches.length === 1) {
          handleMouseDown(e.touches[0])
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          handleMouseMove(e.touches[0])
        }
      }}
      onTouchEnd={handleMouseUp}
    >
      {/* Background Canvas Wireframe */}
      <canvas ref={canvasRef} className="tech-globe-canvas" />

      {/* Foreground Tech Icons floating on 3D Globe */}
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
            <div className="tech-globe-badge">
              <TechIcon name={item.icon} className="tech-globe-icon" />
              {item.pz > 0.1 && <span className="tech-globe-name">{item.name}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Drag Hint */}
      <div className="tech-globe-hint">
        <span>← DRAG TO ROTATE GLOBE →</span>
      </div>
    </div>
  )
}
