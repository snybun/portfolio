import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import TechGlobe3D from './TechGlobe3D'
import './TechStack.css'

// Exact tech stack provided by user
export const USER_TECH_STACK = [
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'JAVASCRIPT', icon: 'javascript' },
  { name: 'TYPESCRIPT', icon: 'typescript' },
  { name: 'BOOTSTRAP', icon: 'bootstrap' },
  { name: 'TAILWIND CSS', icon: 'tailwind' },
  { name: 'NODE.JS', icon: 'nodejs' },
  { name: 'REACT', icon: 'react' },
  { name: 'NEXT.JS', icon: 'nextjs' },
  { name: 'EXPO', icon: 'expo' },
  { name: 'VITE', icon: 'vite' },
  { name: 'PYTHON', icon: 'python' },
  { name: 'PHP', icon: 'php' },
  { name: 'LARAVEL', icon: 'laravel' },
  { name: 'MYSQL', icon: 'mysql' },
  { name: 'POSTGRESQL', icon: 'postgresql' },
  { name: 'SUPABASE', icon: 'supabase' },
  { name: 'VERCEL', icon: 'vercel' },
  { name: 'GIT', icon: 'git' },
  { name: 'GITHUB', icon: 'github' },
  { name: 'DOCKER', icon: 'docker' },
  { name: 'FIGMA', icon: 'figma' },
  { name: 'FRAMER MOTION', icon: 'framer' },
]

function TechStack() {
  const sectionRef = useRef(null)

  // Scroll driven parallax physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Parallax transform layers
  const headerY = useTransform(smoothProgress, [0, 1], [-35, 35])
  const globeY = useTransform(smoothProgress, [0, 1], [40, -40])
  const globeScale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.02, 0.97])

  // Parallax for upper-left "TECH"
  const techY = useTransform(smoothProgress, [0, 1], [-70, 70])
  const techX = useTransform(smoothProgress, [0, 1], [-30, 30])

  // Parallax for lower-right "ARSENAL"
  const arsenalY = useTransform(smoothProgress, [0, 1], [70, -70])
  const arsenalX = useTransform(smoothProgress, [0, 1], [30, -30])

  const bgTextOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.03, 0.07, 0.03])
  const glowY = useTransform(smoothProgress, [0, 1], [90, -90])

  return (
    <section className="tech-stack" id="tech-stack" ref={sectionRef}>
      {/* Background Parallax Watermark Texts */}
      <motion.div
        className="tech-stack__bg-watermark tech-stack__bg-watermark--tech"
        style={{ y: techY, x: techX, opacity: bgTextOpacity }}
        aria-hidden="true"
      >
        TECH
      </motion.div>

      <motion.div
        className="tech-stack__bg-watermark tech-stack__bg-watermark--arsenal"
        style={{ y: arsenalY, x: arsenalX, opacity: bgTextOpacity }}
        aria-hidden="true"
      >
        ARSENAL
      </motion.div>

      {/* Floating Parallax Ambient Orbs */}
      <motion.div
        className="tech-stack__glow-orb tech-stack__glow-orb--left"
        style={{ y: glowY }}
        aria-hidden="true"
      />
      <motion.div
        className="tech-stack__glow-orb tech-stack__glow-orb--right"
        style={{ y: useTransform(smoothProgress, [0, 1], [-70, 70]) }}
        aria-hidden="true"
      />

      <div className="tech-stack__container">
        {/* Parallax Header Bar */}
        <motion.div className="tech-stack__header" style={{ y: headerY }}>
          <div className="tech-stack__label">
            <span className="tech-stack__number">03</span>
            <span className="tech-stack__divider">/</span>
            <span className="tech-stack__title">TECH ARSENAL</span>
          </div>
        </motion.div>

        {/* Interactive 3D Tech Globe with Parallax Scroll */}
        <motion.div
          className="tech-stack__globe-wrapper"
          style={{ y: globeY, scale: globeScale }}
        >
          <TechGlobe3D items={USER_TECH_STACK} />
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack
