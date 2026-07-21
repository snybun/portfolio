import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './CustomCursor.css'

function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Smooth spring following
  const springConfig = { damping: 28, stiffness: 300, mass: 0.6 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches
    if (!hasHover) return

    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const isInteractive = (target) => {
      return (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('.navbar__link') ||
        target.closest('.navbar__logo') ||
        target.closest('.process__step-header') ||
        target.closest('.contact__cta') ||
        target.closest('.work__project-link') ||
        target.closest('.contact__social-link') ||
        target.closest('.footer__link') ||
        target.closest('.about__skill-tag') ||
        target.closest('.hero__scroll-indicator')
      )
    }

    const handleMouseOver = (e) => {
      if (isInteractive(e.target)) setIsHovering(true)
    }

    const handleMouseOut = (e) => {
      if (isInteractive(e.target)) setIsHovering(false)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY, isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className={`custom-cursor__ring ${isHovering ? 'custom-cursor__ring--hovering' : ''} ${isClicking ? 'custom-cursor__ring--clicking' : ''}`}
      style={{
        x: smoothX,
        y: smoothY,
      }}
    />
  )
}

export default CustomCursor
