import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Contact.css'

function Contact() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { margin: '-100px' })

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
      <div className="contact__container">
        <motion.div
          className="contact__header"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="about__number">05</span>
          <span className="about__subtitle">Get In Touch</span>
        </motion.div>

        <motion.h2
          className="contact__title"
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
            href="https://twitter.com/"
            className="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
