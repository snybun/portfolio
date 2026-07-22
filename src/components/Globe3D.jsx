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

    // Globe parameters
    const DOT_COUNT = 2400 // High density dot matrix sphere
    const MOVING_DOT_COUNT = 140 // Independently traveling satellite dots
    const AMBIENT_PARTICLE_COUNT = 180 // Floating 3D space particles
    const GLOBE_RADIUS_RATIO = 0.38

    let rotationX = 0.25
    let rotationY = 0
    let targetRotationX = 0.25
    let targetRotationY = 0

    // Fibonacci sphere point generation (Static surface points)
    const points = []
    const phi = (1 + Math.sqrt(5)) / 2
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = (2 * Math.PI * i) / phi

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      // Size and opacity variation for realistic texture
      const rand = Math.random()
      const size = rand < 0.08 ? 2.4 : rand < 0.25 ? 1.8 : rand < 0.6 ? 1.2 : 0.85
      const baseAlpha = 0.25 + Math.random() * 0.55

      points.push({ x, y, z, size, baseAlpha })
    }

    // Moving dots along orbital paths on the sphere surface
    const movingDots = []
    for (let i = 0; i < MOVING_DOT_COUNT; i++) {
      movingDots.push({
        lat: (Math.random() - 0.5) * Math.PI,
        lng: Math.random() * Math.PI * 2,
        speed: (0.004 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1),
        latSpeed: (Math.random() - 0.5) * 0.002,
        size: 1.5 + Math.random() * 1.8,
        color: Math.random() < 0.2 ? '#ffffff' : Math.random() < 0.5 ? '#d0d0d0' : '#a0a0a0',
        tail: [],
      })
    }

    // Ambient floating 3D dust particles outside the sphere
    const ambientParticles = []
    for (let i = 0; i < AMBIENT_PARTICLE_COUNT; i++) {
      const r = 1.15 + Math.random() * 0.75
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phiAngle = Math.acos(2.0 * v - 1.0)
      ambientParticles.push({
        x: r * Math.sin(phiAngle) * Math.cos(theta),
        y: r * Math.sin(phiAngle) * Math.sin(theta),
        z: r * Math.cos(phiAngle),
        size: 0.6 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.45,
        speedY: (Math.random() - 0.5) * 0.001,
      })
    }

    // Curved connection arcs between major coordinates
    const cityCoords = [
      { lat: 14.5995, lng: 120.9842, name: 'Manila' },
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

    // Canvas Resize Observer
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

    // Cursor Movement Listener - Smoothly follow cursor anywhere on the window!
    const handleWindowMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5 // -0.5 to 0.5
      const normY = (e.clientY / window.innerHeight) - 0.5 // -0.5 to 0.5

      // Target angles based on cursor offset
      targetRotationY = normX * Math.PI * 0.85
      targetRotationX = 0.25 + normY * Math.PI * 0.45
    }

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true })

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Continuous rotation + smooth lerp cursor tracking
      rotationY += (targetRotationY - rotationY) * 0.04
      rotationX += (targetRotationX - rotationX) * 0.04
      targetRotationY += 0.0016 // Natural continuous spin

      pulseProgress = (pulseProgress + 0.005) % 1

      const radius = Math.min(width, height) * GLOBE_RADIUS_RATIO
      const cx = width / 2
      const cy = height / 2

      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)

      // 3D Perspective Projection Function
      const project = (x, y, z) => {
        // Rotate Y
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY

        // Rotate X
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        // Enhanced perspective depth scaling
        const scale = 1 / (1 + z2 * 0.42)
        return {
          px: cx + x1 * radius * scale,
          py: cy + y2 * radius * scale,
          pz: z2,
          scale,
        }
      }

      // 1. Outer 3D Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.65, cx, cy, radius * 1.4)
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.07)')
      glowGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.035)')
      glowGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.008)')
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.save()
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 2. Render Ambient 3D Space Particles (Behind sphere first)
      ambientParticles.forEach((p) => {
        p.y += p.speedY
        if (p.y > 2) p.y = -2
        if (p.y < -2) p.y = 2

        const proj = project(p.x, p.y, p.z)
        if (proj.pz < 0) {
          const alpha = p.alpha * Math.max(0, (proj.pz + 1) * 0.4)
          ctx.beginPath()
          ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fill()
        }
      })

      // 3. Render 3D Tilted Orbital Rings
      const ringLatitudes = [-0.65, -0.32, 0, 0.32, 0.65]
      ctx.lineWidth = 0.85
      ringLatitudes.forEach((latY) => {
        const rRing = Math.sqrt(Math.max(0, 1 - latY * latY))
        ctx.beginPath()
        let first = true
        for (let a = 0; a <= Math.PI * 2; a += 0.12) {
          const rx = Math.cos(a) * rRing
          const rz = Math.sin(a) * rRing
          const p = project(rx, latY, rz)
          if (p.pz > -0.35) {
            const alpha = Math.max(0, (p.pz + 0.35) * 0.14)
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

      // 4. Render Static Sphere Dot Grid (2,400 dots)
      points.forEach((pt) => {
        const p = project(pt.x, pt.y, pt.z)

        if (p.pz > -0.5) {
          const depthFactor = (p.pz + 1) / 2 // 0 to 1
          const alpha = pt.baseAlpha * Math.pow(depthFactor, 2.2)
          const dotRadius = Math.max(0.5, pt.size * p.scale * (0.5 + depthFactor * 0.8))

          ctx.beginPath()
          ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2)

          if (depthFactor > 0.72) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(170, 170, 170, ${alpha * 0.75})`
          }
          ctx.fill()
        }
      })

      // 5. Render Moving Satellite/Trajectory Dots (140+ moving dots across globe)
      movingDots.forEach((md) => {
        md.lng += md.speed
        md.lat += md.latSpeed
        if (md.lat > Math.PI / 2.2 || md.lat < -Math.PI / 2.2) md.latSpeed *= -1

        const x = Math.cos(md.lat) * Math.sin(md.lng)
        const y = Math.sin(md.lat)
        const z = Math.cos(md.lat) * Math.cos(md.lng)

        const p = project(x, y, z)

        if (p.pz > -0.3) {
          const depthFactor = (p.pz + 1) / 2
          const alpha = Math.pow(depthFactor, 1.5) * 0.95
          const r = md.size * p.scale * (0.7 + depthFactor * 0.6)

          // Glowing dot ring
          ctx.beginPath()
          ctx.arc(p.px, p.py, r * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`
          ctx.fill()

          // Core dot
          ctx.beginPath()
          ctx.arc(p.px, p.py, r, 0, Math.PI * 2)
          ctx.fillStyle = md.color
          ctx.fill()
        }
      })

      // 6. Render Connecting Arcs & Pulse Signals
      arcs.forEach((arc) => {
        const c1 = cityPoints[arc.from]
        const c2 = cityPoints[arc.to]

        const p1 = project(c1.vec.x, c1.vec.y, c1.vec.z)
        const p2 = project(c2.vec.x, c2.vec.y, c2.vec.z)

        if (p1.pz > -0.25 || p2.pz > -0.25) {
          const midX = (c1.vec.x + c2.vec.x) * 0.5 * 1.35
          const midY = (c1.vec.y + c2.vec.y) * 0.5 * 1.35
          const midZ = (c1.vec.z + c2.vec.z) * 0.5 * 1.35
          const pMid = project(midX, midY, midZ)

          const arcAlpha = Math.max(0, Math.min(p1.pz + 0.45, p2.pz + 0.45, 0.5))

          ctx.beginPath()
          ctx.moveTo(p1.px, p1.py)
          ctx.quadraticCurveTo(pMid.px, pMid.py, p2.px, p2.py)
          ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * 0.45})`
          ctx.lineWidth = 1.25
          ctx.stroke()

          // Multiple travelling pulses along each arc
          const pulseOffsets = [0, 0.35, 0.7]
          pulseOffsets.forEach((offset) => {
            const t = (pulseProgress + offset) % 1
            const pulseX = (1 - t) * (1 - t) * p1.px + 2 * (1 - t) * t * pMid.px + t * t * p2.px
            const pulseY = (1 - t) * (1 - t) * p1.py + 2 * (1 - t) * t * pMid.py + t * t * p2.py

            ctx.beginPath()
            ctx.arc(pulseX, pulseY, 2.2 * pMid.scale, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${arcAlpha * 1.6})`
            ctx.fill()
          })
        }
      })

      // 7. Render Front Ambient Space Particles
      ambientParticles.forEach((p) => {
        const proj = project(p.x, p.y, p.z)
        if (proj.pz >= 0) {
          const alpha = p.alpha * (proj.pz * 0.8 + 0.2)
          ctx.beginPath()
          ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fill()
        }
      })

      // 8. Manila / Philippines Focal Location Beacon
      const manila = cityPoints[0]
      const pm = project(manila.vec.x, manila.vec.y, manila.vec.z)
      if (pm.pz > -0.2) {
        const pulseR = (4.5 + Math.sin(Date.now() * 0.006) * 3.5) * pm.scale
        ctx.beginPath()
        ctx.arc(pm.px, pm.py, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(pm.px, pm.py, 3 * pm.scale, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [])

  return (
    <div className="globe-container">
      <canvas ref={canvasRef} className="globe-canvas" />
    </div>
  )
}
