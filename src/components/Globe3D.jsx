import { useEffect, useRef } from 'react'
import './Globe3D.css'

export default function Globe3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    // Sphere configuration
    const DOT_COUNT = 850
    const GLOBE_RADIUS_RATIO = 0.38 // percentage of min dimension
    let rotationX = 0.35 // initial tilt
    let rotationY = 0
    let targetRotationY = 0
    let targetRotationX = 0.35
    let mouseX = 0
    let mouseY = 0
    let isDragging = false
    let startMouseX = 0
    let startMouseY = 0

    // Fibonacci sphere point generation
    const points = []
    const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2 // From 1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = (2 * Math.PI * i) / phi

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      // Add slight size variation
      const size = Math.random() < 0.15 ? 2.2 : Math.random() < 0.4 ? 1.5 : 1.0

      points.push({ x, y, z, size, baseAlpha: 0.3 + Math.random() * 0.5 })
    }

    // Curved connection arcs between major coordinates
    const cityCoords = [
      { lat: 14.5995, lng: 120.9842, name: 'Manila' }, // Philippines
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
      { lat: 51.5074, lng: -0.1278, name: 'London' },
      { lat: 40.7128, lng: -74.006, name: 'New York' },
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
      { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
      { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
    ]

    function latLngToVector3(lat, lng) {
      const phiRad = (90 - lat) * (Math.PI / 180)
      const thetaRad = (lng + 180) * (Math.PI / 180)
      return {
        x: -(Math.sin(phiRad) * Math.cos(thetaRad)),
        y: Math.cos(phiRad),
        z: Math.sin(phiRad) * Math.sin(thetaRad),
      }
    }

    const cityPoints = cityCoords.map((c) => ({
      ...c,
      vec: latLngToVector3(c.lat, c.lng),
    }))

    const arcs = [
      { from: 0, to: 1 }, // Manila -> Tokyo
      { from: 0, to: 4 }, // Manila -> SF
      { from: 0, to: 6 }, // Manila -> Singapore
      { from: 1, to: 3 }, // Tokyo -> NY
      { from: 2, to: 3 }, // London -> NY
      { from: 3, to: 4 }, // NY -> SF
      { from: 6, to: 7 }, // Singapore -> Dubai
      { from: 7, to: 2 }, // Dubai -> London
    ]

    let pulseProgress = 0

    // Resize canvas
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas.parentElement || canvas)

    // Mouse & Touch interactions
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left - width / 2
      const my = e.clientY - rect.top - height / 2

      if (isDragging) {
        const deltaX = e.clientX - startMouseX
        const deltaY = e.clientY - startMouseY
        targetRotationY += deltaX * 0.005
        targetRotationX += deltaY * 0.005
        startMouseX = e.clientX
        startMouseY = e.clientY
      } else {
        targetRotationY += 0.0003 + mx * 0.000005
        targetRotationX = 0.35 + my * 0.0001
      }
    }

    const handleMouseDown = (e) => {
      isDragging = true
      startMouseX = e.clientX
      startMouseY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth rotation interpolation
      rotationY += (targetRotationY - rotationY) * 0.05
      rotationX += (targetRotationX - rotationX) * 0.05
      targetRotationY += 0.0018 // Constant subtle spin

      pulseProgress = (pulseProgress + 0.006) % 1

      const radius = Math.min(width, height) * GLOBE_RADIUS_RATIO
      const cx = width / 2
      const cy = height / 2

      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)

      // Project 3D vector
      const project = (x, y, z) => {
        // Y rotation
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        // X rotation
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const scale = 1 / (1 + z2 * 0.35)
        return {
          px: cx + x1 * radius * scale,
          py: cy + y2 * radius * scale,
          pz: z2,
          scale,
        }
      }

      // Outer atmosphere glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35)
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
      glowGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.025)')
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.save()
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Latitude grid rings
      const ringLatitudes = [-0.6, -0.3, 0, 0.3, 0.6]
      ctx.lineWidth = 0.75
      ringLatitudes.forEach((latY) => {
        const rRing = Math.sqrt(Math.max(0, 1 - latY * latY))
        ctx.beginPath()
        let first = true
        for (let a = 0; a <= Math.PI * 2; a += 0.15) {
          const rx = Math.cos(a) * rRing
          const rz = Math.sin(a) * rRing
          const p = project(rx, latY, rz)
          if (p.pz > -0.3) {
            const alpha = Math.max(0, (p.pz + 0.3) * 0.12)
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
            if (first) {
              ctx.moveTo(p.px, p.py)
              first = false
            } else {
              ctx.lineTo(p.px, p.py)
            }
          }
        }
        ctx.stroke()
      })

      // Draw sphere points
      points.forEach((pt) => {
        const p = project(pt.x, pt.y, pt.z)

        // Depth sorting effect (pz ranges from -1 to 1)
        if (p.pz > -0.45) {
          const depthFactor = (p.pz + 1) / 2 // 0 to 1
          const alpha = pt.baseAlpha * Math.pow(depthFactor, 1.8)
          const dotRadius = Math.max(0.6, pt.size * p.scale * (0.6 + depthFactor * 0.7))

          ctx.beginPath()
          ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2)

          if (depthFactor > 0.7) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(180, 180, 180, ${alpha * 0.8})`
          }
          ctx.fill()
        }
      })

      // Draw Arcs & Cities
      arcs.forEach((arc) => {
        const c1 = cityPoints[arc.from]
        const c2 = cityPoints[arc.to]

        const p1 = project(c1.vec.x, c1.vec.y, c1.vec.z)
        const p2 = project(c2.vec.x, c2.vec.y, c2.vec.z)

        // Only draw if at least one point is on front face
        if (p1.pz > -0.2 || p2.pz > -0.2) {
          const midX = (c1.vec.x + c2.vec.x) * 0.5 * 1.3
          const midY = (c1.vec.y + c2.vec.y) * 0.5 * 1.3
          const midZ = (c1.vec.z + c2.vec.z) * 0.5 * 1.3
          const pMid = project(midX, midY, midZ)

          const arcAlpha = Math.max(0, Math.min(p1.pz + 0.4, p2.pz + 0.4, 0.45))

          // Draw Quadratic Arc
          ctx.beginPath()
          ctx.moveTo(p1.px, p1.py)
          ctx.quadraticCurveTo(pMid.px, pMid.py, p2.px, p2.py)
          ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * 0.45})`
          ctx.lineWidth = 1.2
          ctx.stroke()

          // Animated Traveling Pulse along Arc
          const t = (pulseProgress + arc.from * 0.12) % 1
          const pulseX = (1 - t) * (1 - t) * p1.px + 2 * (1 - t) * t * pMid.px + t * t * p2.px
          const pulseY = (1 - t) * (1 - t) * p1.py + 2 * (1 - t) * t * pMid.py + t * t * p2.py

          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${arcAlpha * 1.8})`
          ctx.fill()
        }
      })

      // Highlight Manila (Philippines) with extra pulsing indicator
      const manila = cityPoints[0]
      const pm = project(manila.vec.x, manila.vec.y, manila.vec.z)
      if (pm.pz > -0.2) {
        const pulseR = 4 + Math.sin(Date.now() * 0.005) * 3
        ctx.beginPath()
        ctx.arc(pm.px, pm.py, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(pm.px, pm.py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="globe-container">
      <canvas ref={canvasRef} className="globe-canvas" />
    </div>
  )
}
