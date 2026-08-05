import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from 'framer-motion'
import './Work.css'

const projects = [
  {
    number: '01',
    name: 'Pincraft',
    year: '2025',
    tag: 'Java Desktop System',
    tech: ['Java', 'Java Swing', 'SQLite', 'SMTP Mail API'],
    description:
      'PinCraft is a Java Swing desktop application for designing custom button pins, saving projects per user account, arranging them on printable paper layouts, and exporting them as PDF files.',
    links: [
      { label: 'GitHub Repo', href: 'https://github.com/snybun/pincraft-sys', external: true },
    ],
  },
  {
    number: '02',
    name: 'Interactive Web Applications',
    year: '2024',
    tag: 'Frontend Dev',
    tech: ['React', 'TypeScript', 'Framer Motion', 'CSS3'],
    description:
      'High-performance web applications featuring fluid motion design, responsive layouts, and modern component-driven architectures.',
    links: [
      { label: 'GitHub Profile', href: 'https://github.com/snybun', external: true },
    ],
  },
  {
    number: '03',
    name: 'UI/UX & Systems Design',
    year: '2024',
    tag: 'UI/UX Design',
    tech: ['Figma', 'Prototyping', 'Design System', 'User Research'],
    description:
      'Comprehensive design systems and user experience design for web applications—from wireframing to interactive prototypes.',
    links: [
      { label: "Let's Talk", href: '#contact', external: false },
    ],
  },
]

function StackedCard({ project, index, total, progress, activeIndex }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })

  let xRange, yRange, rotateRange, opacityRange, scaleRange, progressInput, watermarkYRange

  if (index === 0) {
    progressInput = [0.0, 0.12, 0.36, 1.0]
    xRange = ['0%', '0%', '-120%', '-120%']
    yRange = ['0px', '0px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '-12deg', '-12deg']
    opacityRange = [1, 1, 0, 0]
    scaleRange = [1, 1, 1, 1]
    watermarkYRange = ['0px', '0px', '80px', '120px']
  } else if (index === 1) {
    progressInput = [0.0, 0.12, 0.36, 0.48, 0.72, 1.0]
    xRange = ['0%', '0%', '0%', '0%', '120%', '120%']
    yRange = ['20px', '20px', '0px', '0px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '0deg', '0deg', '12deg', '12deg']
    opacityRange = [0.65, 0.65, 1, 1, 0, 0]
    scaleRange = [0.94, 0.94, 1, 1, 1, 1]
    watermarkYRange = ['-40px', '-40px', '0px', '0px', '80px', '120px']
  } else {
    progressInput = [0.0, 0.12, 0.36, 0.48, 0.72, 1.0]
    xRange = ['0%', '0%', '0%', '0%', '0%', '0%']
    yRange = ['40px', '40px', '20px', '20px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '0deg', '0deg', '0deg', '0deg']
    opacityRange = [0.35, 0.35, 0.65, 0.65, 1, 1]
    scaleRange = [0.88, 0.88, 0.94, 0.94, 1, 1]
    watermarkYRange = ['-80px', '-80px', '-40px', '-40px', '0px', '0px']
  }

  const x = useTransform(progress, progressInput, xRange)
  const y = useTransform(progress, progressInput, yRange)
  const rotateZ = useTransform(progress, progressInput, rotateRange)
  const opacity = useTransform(progress, progressInput, opacityRange)
  const scale = useTransform(progress, progressInput, scaleRange)
  const watermarkY = useTransform(progress, progressInput, watermarkYRange)

  const zIndex = total - index

  const handleMouseMove = (e) => {
    if (activeIndex !== index) return
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = (e.clientX - rect.left) / width - 0.5
    const mouseYPos = (e.clientY - rect.top) / height - 0.5
    mouseX.set(mouseXPos)
    mouseY.set(mouseYPos)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const scrollToSection = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.article
      className={`work__card ${activeIndex === index ? 'work__card--active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        rotateZ,
        rotateX: activeIndex === index ? cardRotateX : 0,
        rotateY: activeIndex === index ? cardRotateY : 0,
        opacity,
        scale,
        zIndex,
      }}
    >
      {/* Internal Parallax Background Number Watermark */}
      <motion.span
        className="work__card-watermark-num"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        {project.number}
      </motion.span>

      <div className="work__card-header">
        <div className="work__card-badges">
          <span className="work__card-number">{project.number}</span>
          <span className="work__card-tag">{project.tag}</span>
        </div>
        <span className="work__card-year">{project.year}</span>
      </div>

      <div className="work__card-body">
        <h3 className="work__card-title">{project.name}</h3>
        <p className="work__card-description">{project.description}</p>

        {project.tech && (
          <div className="work__card-tech">
            {project.tech.map((t, idx) => (
              <span key={idx} className="work__card-tech-pill">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="work__card-footer">
        <div className="work__card-links">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="work__card-link"
              onClick={(e) => scrollToSection(e, link.href)}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              {link.label}
              <span className="work__card-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function Work() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Smooth scroll spring for silky parallax physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  })

  // Multi-layered Parallax Transforms
  const bgTextY = useTransform(smoothProgress, [0, 1], [-120, 120])
  const bgTextX = useTransform(smoothProgress, [0, 1], [-40, 40])
  const bgTextOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.02, 0.05, 0.02])

  const bgGlow1Y = useTransform(smoothProgress, [0, 1], [-150, 150])
  const bgGlow2Y = useTransform(smoothProgress, [0, 1], [180, -180])

  const headerY = useTransform(smoothProgress, [0, 0.5, 1], [0, -25, -50])
  const titleY = useTransform(smoothProgress, [0, 0.5, 1], [0, -15, -30])
  const stageY = useTransform(smoothProgress, [0, 0.5, 1], [20, 0, -20])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.35) {
      setActiveIndex(0)
    } else if (latest < 0.68) {
      setActiveIndex(1)
    } else {
      setActiveIndex(2)
    }
  })

  return (
    <section className="work-pinned-section" id="work" ref={sectionRef}>
      {/* Background Parallax Layer: Ambient Orbs */}
      <motion.div
        className="work__bg-glow work__bg-glow--1"
        style={{ y: bgGlow1Y }}
        aria-hidden="true"
      />
      <motion.div
        className="work__bg-glow work__bg-glow--2"
        style={{ y: bgGlow2Y }}
        aria-hidden="true"
      />

      {/* Background Parallax Layer: Watermark Text */}
      <motion.div
        className="work__bg-watermark"
        style={{ y: bgTextY, x: bgTextX, opacity: bgTextOpacity }}
        aria-hidden="true"
      >
        PROJECTS
      </motion.div>

      <div className="work-sticky-wrapper">
        <div className="work__container">
          {/* Section Header with Parallax Shift */}
          <motion.div className="work__header-bar" style={{ y: headerY }}>
            <div className="work__header-label">
              <span className="work__number">04</span>
              <span className="work__slash">/</span>
              <span className="work__subtitle">PROJECTS</span>
            </div>

            <div className="work__header-counter">
              <span className="work__counter-active">0{activeIndex + 1}</span>
              <span className="work__counter-divider">/</span>
              <span className="work__counter-total">0{projects.length}</span>
            </div>
          </motion.div>

          <motion.h2 className="work__title" style={{ y: titleY }}>
            Projects I've brought to life.
          </motion.h2>

          {/* Stacked Cards Stage with Parallax */}
          <motion.div className="work__cards-stage" style={{ y: stageY }}>
            {projects.map((project, index) => (
              <StackedCard
                key={project.number}
                project={project}
                index={index}
                total={projects.length}
                progress={scrollYProgress}
                activeIndex={activeIndex}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Work

