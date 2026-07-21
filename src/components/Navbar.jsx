import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

function Navbar({ preloaderDone }) {
  const [time, setTime] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hidden, setHidden] = useState(false)

  // Live time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setHidden(true)
        } else {
          setHidden(false)
        }
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Smooth scroll to section
  const scrollToSection = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Animation delay offset based on preloader
  const animDelay = preloaderDone ? 0.2 : 0.8

  return (
    <>
      <motion.nav
        className={`navbar ${hidden ? 'navbar--hidden' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: preloaderDone ? 0 : -100, opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: animDelay }}
      >
        {/* Logo */}
        <div className="navbar__logo" onClick={scrollToTop}>
          Mark<span>.</span>
        </div>

        {/* Center - Location & Time */}
        <div className="navbar__center">
          <span>Philippines</span>
          <div className="navbar__center-divider" />
          <span className="navbar__time">{time}</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="navbar__link"
              onClick={(e) => scrollToSection(e, link.href)}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: preloaderDone ? 0 : -20, opacity: preloaderDone ? 1 : 0 }}
              transition={{ duration: 0.5, delay: animDelay + 0.2 + i * 0.08 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`navbar__menu-btn ${mobileOpen ? 'navbar__menu-btn--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-overlay navbar__mobile-overlay--open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="navbar__mobile-link"
                onClick={(e) => scrollToSection(e, link.href)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
