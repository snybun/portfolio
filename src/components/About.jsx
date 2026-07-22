import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import aboutImage from '../assets/hero.png'
import './About.css'

function ProfilePicture({ src, alt }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tracking relative cursor coordinates (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for fluid 3D motion response
  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 20 })

  // Transform normalized mouse position to 3D tilt angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [16, -16])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-16, 16])

  // Parallax translation offsets for dynamic shadow depth
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [-18, 18])
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [-18, 18])

  // Dynamic light reflection/glare positioning
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [15, 85])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [15, 85])

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 65%)`
  )

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div className="about__photo-3d-perspective">
      <motion.div
        ref={cardRef}
        className={`about__photo-wrapper ${isHovered ? 'about__photo-wrapper--hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      >
        {/* Dynamic 3D depth shadow */}
        <motion.div
          className="about__photo-shadow"
          style={{
            x: shadowX,
            y: shadowY,
          }}
        />

        {/* Floating image layer popped out in 3D */}
        <div className="about__photo-layer">
          <img
            className={`about__photo ${isHovered ? 'about__photo--hovered' : ''}`}
            src={src}
            alt={alt}
          />
        </div>

        {/* Dot pattern floating layer */}
        <span className="about__photo-dots" aria-hidden="true" />

        {/* Ambient border glow */}
        <div className="about__photo-border-glow" aria-hidden="true" />

        {/* Interactive Specular Glare light source */}
        <motion.div
          className="about__photo-glare"
          style={{
            background: glareBg,
            opacity: isHovered ? 1 : 0,
          }}
        />
      </motion.div>
    </div>
  )
}

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
              <ProfilePicture src={aboutImage} alt="pic ko" />
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
