import { motion } from 'framer-motion'
import './Hero.css'

function Hero() {
  // Scroll to about section
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6,
      },
    },
  }

  const lineVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const scrollVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, delay: 1.8 },
    },
  }

  return (
    <section className="hero" id="hero">
      <motion.h1
        className="hero__title"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero__title-line" variants={lineVariants}>
          creative{' '}
        </motion.span>
        <motion.span className="hero__title-line" variants={lineVariants}>
          <span className="hero__emphasis">designer</span> &{' '}
        </motion.span>
        <motion.span className="hero__title-line" variants={lineVariants}>
          <span className="hero__emphasis">developer</span>.
        </motion.span>
      </motion.h1>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        variants={scrollVariants}
        initial="hidden"
        animate="visible"
        onClick={scrollToAbout}
      >
        <span className="hero__scroll-text">Scroll to explore</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}

export default Hero
