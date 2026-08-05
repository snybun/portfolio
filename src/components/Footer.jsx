import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import './Footer.css'

function Footer() {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { margin: '-50px' })

  // Scroll driven parallax physics
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  })

  const footerY = useTransform(smoothProgress, [0, 1], [30, 0])

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    }),
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" ref={footerRef}>
      <motion.div className="footer__container" style={{ y: footerY }}>
        <motion.div
          className="footer__left"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="footer__location">Based in the Philippines</span>
          <span className="footer__availability">
            <span className="footer__availability-dot" />
            Available for freelance worldwide
          </span>
        </motion.div>

        <motion.div
          className="footer__right"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          <span className="footer__copyright">
            © {currentYear} Mark. All rights reserved.
          </span>
          <div className="footer__links">
            <a href="#hero" className="footer__link" onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
              Back to top ↑
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer
