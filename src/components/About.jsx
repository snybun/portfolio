import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import aboutImage from '../assets/hero.png'
import './About.css'

function About() {
  const helloRef = useRef(null)
  const craftRef = useRef(null)
  const helloInView = useInView(helloRef, { margin: '-100px' })
  const craftInView = useInView(craftRef, { margin: '-100px' })

  const fadeUp = {
    hidden: { opacity: 0, y: 48 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    }),
  }

  const maskReveal = {
    hidden: { clipPath: 'inset(0 0 100% 0)' },
    visible: (delay = 0) => ({
      clipPath: 'inset(0 0 0% 0)',
      transition: {
        duration: 1.15,
        ease: [0.76, 0, 0.24, 1],
        delay,
      },
    }),
  }

  return (
    <section className="about" id="about">
      <div className="about__container">
        <div className="about__hello" ref={helloRef}>
          <motion.div
            className="about__header"
            variants={fadeUp}
            initial="hidden"
            animate={helloInView ? 'visible' : 'hidden'}
            custom={0}
          >
            <span className="about__number">01</span>
            <span className="about__subtitle">Designer & Developer</span>
          </motion.div>

          <div className="about__hello-content">
            <div className="about__hello-text">
              <motion.h2
                className="about__greeting"
                variants={fadeUp}
                initial="hidden"
                animate={helloInView ? 'visible' : 'hidden'}
                custom={0.1}
              >
                Hello, I'm <span className="about__greeting-name">Mark</span>.
              </motion.h2>
              <motion.p
                className="about__bio"
                variants={fadeUp}
                initial="hidden"
                animate={helloInView ? 'visible' : 'hidden'}
                custom={0.2}
              >
                A passionate designer and developer based in the Philippines. I craft
                digital experiences that combine clean aesthetics with thoughtful
                functionality - bringing ideas to life through code and creativity.
              </motion.p>
            </div>

            <motion.div
              className="about__hello-image"
              variants={maskReveal}
              initial="hidden"
              animate={helloInView ? 'visible' : 'hidden'}
              custom={0.3}
            >
              <motion.figure
                className="about__photo-wrapper"
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  className="about__photo"
                  src={aboutImage}
                  alt="pic ko"
                />
                <span className="about__photo-dots" aria-hidden="true" />
              </motion.figure>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="about__divider"
          initial={{ scaleX: 0 }}
          animate={helloInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.45 }}
        />

        <div className="about__craft" ref={craftRef}>
          <motion.div
            className="about__header"
            variants={fadeUp}
            initial="hidden"
            animate={craftInView ? 'visible' : 'hidden'}
            custom={0}
          >
            <span className="about__number">02</span>
            <span className="about__subtitle">Less, But Better</span>
          </motion.div>

          <div className="about__craft-content">
            <div className="about__craft-text">
              <motion.h2
                className="about__craft-title"
                variants={fadeUp}
                initial="hidden"
                animate={craftInView ? 'visible' : 'hidden'}
                custom={0.1}
              >
                My craft focuses on simplicity and impact.
              </motion.h2>
              <motion.p
                className="about__craft-description"
                variants={fadeUp}
                initial="hidden"
                animate={craftInView ? 'visible' : 'hidden'}
                custom={0.2}
              >
                I believe great design is invisible - it just works. Every pixel,
                every interaction, every line of code is intentional. I strive to
                create experiences that feel effortless while solving real problems.
              </motion.p>
            </div>

            <motion.div
              className="about__craft-skills"
              variants={fadeUp}
              initial="hidden"
              animate={craftInView ? 'visible' : 'hidden'}
              custom={0.3}
            >
              <div className="about__skill-group">
                <h4>Design</h4>
                <div className="about__skill-tags">
                  <span className="about__skill-tag">UI/UX</span>
                  <span className="about__skill-tag">Figma</span>
                  <span className="about__skill-tag">Prototyping</span>
                  <span className="about__skill-tag">Brand Identity</span>
                </div>
              </div>

              <div className="about__skill-group">
                <h4>Development</h4>
                <div className="about__skill-tags">
                  <span className="about__skill-tag">React</span>
                  <span className="about__skill-tag">JavaScript</span>
                  <span className="about__skill-tag">Next.js</span>
                  <span className="about__skill-tag">CSS</span>
                  <span className="about__skill-tag">Node.js</span>
                </div>
              </div>

              <div className="about__skill-group">
                <h4>Tools</h4>
                <div className="about__skill-tags">
                  <span className="about__skill-tag">Git</span>
                  <span className="about__skill-tag">VS Code</span>
                  <span className="about__skill-tag">Vercel</span>
                  <span className="about__skill-tag">Framer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
