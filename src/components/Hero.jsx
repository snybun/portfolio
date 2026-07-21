import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import './Hero.css'

function Hero({ preloaderDone }) {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { margin: '-12% 0px -24% 0px' })
  const shouldAnimate = preloaderDone && heroInView

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Animation delay offset based on preloader
  const animDelay = preloaderDone ? 0.25 : 0

  const titleVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: animDelay,
      },
    },
  }

  const lineVariants = {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const metaVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: animDelay + 0.35,
      },
    },
  }

  const scrollVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: animDelay + 0.6,
      },
    },
  }

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <motion.div
        className="hero__reveal-panel"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: shouldAnimate ? 0 : 1 }}
        transition={{
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1],
          delay: preloaderDone ? 0.05 : 0,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="hero__meta hero__meta--left"
        variants={metaVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
      >
        <span>Available for freelance</span>
      </motion.div>

      <motion.div
        className="hero__meta hero__meta--right"
        variants={metaVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
      >
        <span>Philippines</span>
      </motion.div>

      <motion.h1
        className="hero__title"
        variants={titleVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
      >
        <span className="hero__title-line" style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span className="hero__title-line-inner" style={{ display: 'block' }} variants={lineVariants}>
            creative{' '}
          </motion.span>
        </span>
        <span className="hero__title-line" style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span className="hero__title-line-inner" style={{ display: 'block' }} variants={lineVariants}>
            <span className="hero__emphasis">designer</span> &{' '}
          </motion.span>
        </span>
        <span className="hero__title-line" style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span className="hero__title-line-inner" style={{ display: 'block' }} variants={lineVariants}>
            <span className="hero__emphasis">developer</span>.
          </motion.span>
        </span>
      </motion.h1>

      <motion.div
        className="hero__scroll-indicator"
        variants={scrollVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        onClick={scrollToAbout}
      >
        <span className="hero__scroll-text">Scroll to explore</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}

export default Hero
