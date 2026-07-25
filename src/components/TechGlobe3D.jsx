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
      const globeRadius = baseRadius * 0.46 // Large 3D sphere radius
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

        // Subtle depth opacity & compact scale factor for generous icon gaps
        const opacity = p.pz > 0 ? 0.85 + p.pz * 0.15 : 0.2 + (p.pz + 1) * 0.25
        const itemScale = p.pz > 0 ? 0.65 + p.pz * 0.12 : 0.42 + (p.pz + 1) * 0.1
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

          // 1. Draw Longitudinal Meridians (Lines connecting north & south poles)
          const lonLines = 18
          for (let j = 0; j < lonLines; j++) {
            const lonAngle = (j / lonLines) * Math.PI * 2
            let prevP = null
            for (let latStep = 0; latStep <= 32; latStep++) {
              const latA = -Math.PI / 2 + (latStep / 32) * Math.PI
              const rx = Math.cos(latA) * Math.cos(lonAngle)
              const ry = Math.sin(latA)
              const rz = Math.cos(latA) * Math.sin(lonAngle)
              const p = project3D(rx, ry, rz)

              if (prevP) {
                const avgZ = (prevP.pz + p.pz) / 2
                const alpha = avgZ > 0 ? 0.11 + avgZ * 0.07 : 0.025 + (avgZ + 1) * 0.03
                ctx.strokeStyle = `rgba(90, 175, 245, ${alpha})`
                ctx.lineWidth = 0.65
                ctx.beginPath()
                ctx.moveTo(prevP.px, prevP.py)
                ctx.lineTo(p.px, p.py)
                ctx.stroke()
              }
              prevP = p
            }
          }

          // 2. Draw Latitudinal Parallel Rings
          const latRings = 12
          for (let i = 1; i < latRings; i++) {
            const latA = -Math.PI / 2 + (i / latRings) * Math.PI
            const ry = Math.sin(latA)
            const rRing = Math.cos(latA)
            let prevP = null

            for (let lonStep = 0; lonStep <= 40; lonStep++) {
              const a = (lonStep / 40) * Math.PI * 2
              const rx = Math.cos(a) * rRing
              const rz = Math.sin(a) * rRing
              const p = project3D(rx, ry, rz)

              if (prevP) {
                const avgZ = (prevP.pz + p.pz) / 2
                const alpha = avgZ > 0 ? 0.11 + avgZ * 0.07 : 0.025 + (avgZ + 1) * 0.03
                ctx.strokeStyle = `rgba(90, 175, 245, ${alpha})`
                ctx.lineWidth = 0.65
                ctx.beginPath()
                ctx.moveTo(prevP.px, prevP.py)
                ctx.lineTo(p.px, p.py)
                ctx.stroke()
              }
              prevP = p
            }
          }

          // 3. Draw Grid Intersection Node Dots (matching user reference image)
          for (let i = 1; i < latRings; i++) {
            const latA = -Math.PI / 2 + (i / latRings) * Math.PI
            const ry = Math.sin(latA)
            const rRing = Math.cos(latA)

            for (let j = 0; j < lonLines; j++) {
              const a = (j / lonLines) * Math.PI * 2
              const rx = Math.cos(a) * rRing
              const rz = Math.sin(a) * rRing
              const p = project3D(rx, ry, rz)

              const alpha = p.pz > 0 ? 0.22 + p.pz * 0.22 : 0.04 + (p.pz + 1) * 0.06
              const dotRadius = p.pz > 0 ? 1.1 + p.pz * 0.6 : 0.75

              ctx.fillStyle = `rgba(110, 195, 255, ${alpha})`
              ctx.beginPath()
              ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      if (animId) {
        cancelAnimationFrame(animId)
      }
    }
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

  const isCompactIcon = (iconName = '') => {
    const compactList = ['framer', 'framer motion', 'bootstrap', 'js', 'javascript', 'ts', 'typescript', 'nodejs', 'node.js']
    return compactList.includes(iconName.toLowerCase())
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
              <TechIcon name={item.icon} className={`tech-globe-logo-icon ${isCompactIcon(item.icon) ? 'tech-globe-logo-icon--compact' : ''}`} />
            </div>
            <span className="tech-globe-logo-label">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
