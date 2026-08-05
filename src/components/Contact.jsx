import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import './Contact.css'

function Contact() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { margin: '-100px' })

  // Scroll driven parallax physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  })

  // Multi-layered Parallax Transforms
  const bgTextY = useTransform(smoothProgress, [0, 1], [-80, 80])
  const bgGlowY = useTransform(smoothProgress, [0, 1], [100, -100])
  const titleY = useTransform(smoothProgress, [0, 1], [-25, 25])
  const ctaY = useTransform(smoothProgress, [0, 1], [-15, 15])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    }),
  }

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      {/* Background Parallax Ambient Glow */}
      <motion.div
        className="contact__bg-glow"
        style={{ y: bgGlowY }}
        aria-hidden="true"
      />

      {/* Background Parallax Watermark */}
      <motion.div
        className="contact__bg-watermark"
        style={{ y: bgTextY }}
        aria-hidden="true"
      >
        SAY HELLO
      </motion.div>

      <div className="contact__container">
        <motion.div
          className="contact__header"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="contact__number">05</span>
          <span className="contact__slash">/</span>
          <span className="contact__subtitle">GET IN TOUCH</span>
        </motion.div>

        <motion.h2
          className="contact__title"
          style={{ y: titleY }}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          Have a project in mind?
        </motion.h2>

        <motion.p
          className="contact__description"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.2}
        >
          I'm always open to new opportunities and collaborations. 
          Whether you have a project, a question, or just want to say hi — 
          feel free to reach out.
        </motion.p>

        <motion.div style={{ y: ctaY }} className="contact__cta-wrapper">
          <motion.a
            href="mailto:your.email@example.com"
            className="contact__cta"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.3}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Say Hello
            <span className="contact__cta-arrow">↗</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="contact__socials"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.4}
        >
          <a
            href="https://github.com/"
            className="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/"
            className="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://instagram.com/"
            className="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact

