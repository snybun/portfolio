import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
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
  // Stack deck animation configuration:
  // Card 0 (01): Top of stack (zIndex: 3), swipes LEFT on scroll
  // Card 1 (02): Middle of stack (zIndex: 2), moves up to front, swipes RIGHT on scroll
  // Card 2 (03): Bottom of stack (zIndex: 1), moves up to front
  let xRange, yRange, rotateRange, opacityRange, scaleRange, progressInput

  if (index === 0) {
    progressInput = [0.0, 0.12, 0.36, 1.0]
    xRange = ['0%', '0%', '-120%', '-120%']
    yRange = ['0px', '0px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '-12deg', '-12deg']
    opacityRange = [1, 1, 0, 0]
    scaleRange = [1, 1, 1, 1]
  } else if (index === 1) {
    progressInput = [0.0, 0.12, 0.36, 0.48, 0.72, 1.0]
    xRange = ['0%', '0%', '0%', '0%', '120%', '120%']
    yRange = ['20px', '20px', '0px', '0px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '0deg', '0deg', '12deg', '12deg']
    opacityRange = [0.65, 0.65, 1, 1, 0, 0]
    scaleRange = [0.94, 0.94, 1, 1, 1, 1]
  } else {
    progressInput = [0.0, 0.12, 0.36, 0.48, 0.72, 1.0]
    xRange = ['0%', '0%', '0%', '0%', '0%', '0%']
    yRange = ['40px', '40px', '20px', '20px', '0px', '0px']
    rotateRange = ['0deg', '0deg', '0deg', '0deg', '0deg', '0deg']
    opacityRange = [0.35, 0.35, 0.65, 0.65, 1, 1]
    scaleRange = [0.88, 0.88, 0.94, 0.94, 1, 1]
  }

  const x = useTransform(progress, progressInput, xRange)
  const y = useTransform(progress, progressInput, yRange)
  const rotate = useTransform(progress, progressInput, rotateRange)
  const opacity = useTransform(progress, progressInput, opacityRange)
  const scale = useTransform(progress, progressInput, scaleRange)

  const zIndex = total - index

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
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
        zIndex,
      }}
    >
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
      <div className="work-sticky-wrapper">
        <div className="work__container">
          {/* Section Header */}
          <div className="work__header-bar">
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
          </div>

          <h2 className="work__title">Projects I've brought to life.</h2>

          {/* Stacked Cards Stage */}
          <div className="work__cards-stage">
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default Work
