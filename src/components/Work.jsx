import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import './Work.css'

const projects = [
  {
    number: '01',
    name: 'Project One',
    year: '2024',
    tag: 'Web Design',
    tech: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    description:
      'A clean, modern web application built with React. Featuring responsive design, smooth animations, and an intuitive user interface that delivers a seamless experience across all devices.',
    links: [
      { label: 'Live Demo', href: '#', external: true },
      { label: 'GitHub', href: '#', external: true },
    ],
  },
  {
    number: '02',
    name: 'Project Two',
    year: '2024',
    tag: 'Full Stack',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
    description:
      'An end-to-end full-stack application with a focus on performance and scalability. Built with modern technologies and best practices for a robust and maintainable codebase.',
    links: [
      { label: 'Live Demo', href: '#', external: true },
      { label: 'GitHub', href: '#', external: true },
    ],
  },
  {
    number: '03',
    name: 'Project Three',
    year: '2023',
    tag: 'UI/UX',
    tech: ['Figma', 'Prototyping', 'Design System', 'CSS3'],
    description:
      'A comprehensive design system and brand identity project. From initial research to final delivery, every detail was carefully considered to create a cohesive and memorable brand experience.',
    links: [
      { label: "Let's Talk", href: '#contact', external: false },
    ],
  },
]

function ProjectCard({ project, index, total, progress, activeIndex }) {
  // Configured alternating swipe motion curves:
  // Card 0 (01): Starts centered, swipes out to LEFT
  // Card 1 (02): Enters from RIGHT, stays centered, swipes out to RIGHT
  // Card 2 (03): Enters from LEFT, stays centered till section end
  let xRange, rotateRange, opacityRange, scaleRange, progressInput

  if (index === 0) {
    progressInput = [0.0, 0.18, 0.38, 1.0]
    xRange = ['0%', '0%', '-120%', '-120%']
    rotateRange = ['0deg', '0deg', '-12deg', '-12deg']
    opacityRange = [1, 1, 0, 0]
    scaleRange = [1, 1, 0.88, 0.88]
  } else if (index === 1) {
    progressInput = [0.0, 0.22, 0.40, 0.58, 0.74, 1.0]
    xRange = ['120%', '120%', '0%', '0%', '120%', '120%']
    rotateRange = ['12deg', '12deg', '0deg', '0deg', '12deg', '12deg']
    opacityRange = [0, 0, 1, 1, 0, 0]
    scaleRange = [0.88, 0.88, 1, 1, 0.88, 0.88]
  } else {
    progressInput = [0.0, 0.54, 0.72, 1.0]
    xRange = ['-120%', '-120%', '0%', '0%']
    rotateRange = ['-12deg', '-12deg', '0deg', '0deg']
    opacityRange = [0, 0, 1, 1]
    scaleRange = [0.88, 0.88, 1, 1]
  }

  const x = useTransform(progress, progressInput, xRange)
  const rotate = useTransform(progress, progressInput, rotateRange)
  const opacity = useTransform(progress, progressInput, opacityRange)
  const scale = useTransform(progress, progressInput, scaleRange)

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
        rotate,
        opacity,
        scale,
      }}
    >
      {/* Glow highlight inside card */}
      <div className="work__card-glow" aria-hidden="true" />

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
        <div className="work__card-swipe-direction">
          {index === 0 ? '← Swipes Left' : index === 1 ? 'Swipes Right →' : '← Swipes Left'}
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

  const scrollToCard = (index) => {
    if (!sectionRef.current) return
    const sectionTop = sectionRef.current.offsetTop
    const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight
    const targetProgress = index === 0 ? 0.05 : index === 1 ? 0.48 : 0.88
    const targetY = sectionTop + targetProgress * sectionHeight
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  return (
    <section className="work-pinned-section" id="work" ref={sectionRef}>
      <div className="work-sticky-wrapper">
        <div className="work__container">
          {/* Header */}
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

          {/* Cards Swiping Stage */}
          <div className="work__cards-stage">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={index}
                total={projects.length}
                progress={scrollYProgress}
                activeIndex={activeIndex}
              />
            ))}
          </div>

          {/* Interactive Navigation Dots & Scroll Indicator */}
          <div className="work__pagination">
            <div className="work__dots">
              {projects.map((p, idx) => (
                <button
                  key={idx}
                  className={`work__dot ${activeIndex === idx ? 'work__dot--active' : ''}`}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`View ${p.name}`}
                >
                  <span className="work__dot-indicator" />
                  <span className="work__dot-label">{p.number}</span>
                </button>
              ))}
            </div>

            <div className="work__scroll-hint">
              <span className="work__scroll-hint-dot" />
              <span>Scroll down to swipe cards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Work
