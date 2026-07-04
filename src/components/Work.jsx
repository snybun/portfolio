import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Work.css'

const projects = [
  {
    number: '01',
    name: 'Project One',
    year: '2024',
    tag: 'Web Design',
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
    description:
      'A comprehensive design system and brand identity project. From initial research to final delivery, every detail was carefully considered to create a cohesive and memorable brand experience.',
    links: [
      { label: "Let's Talk", href: '#contact', external: false },
    ],
  },
]

function Work() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

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
    <section className="work" id="work" ref={sectionRef}>
      <div className="work__container">
        <motion.div
          className="work__header"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="about__number">04</span>
          <span className="about__subtitle">Selected Work</span>
        </motion.div>

        <motion.h2
          className="work__title"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          Projects I've brought to life.
        </motion.h2>

        <div className="work__projects">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              className="work__project"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.2 + index * 0.15}
            >
              <div className="work__project-top">
                <div className="work__project-info">
                  <span className="work__project-number">{project.number}</span>
                  <h3 className="work__project-name">{project.name}</h3>
                </div>
                <div className="work__project-meta">
                  <span className="work__project-year">{project.year}</span>
                  <span className="work__project-tag">{project.tag}</span>
                </div>
              </div>

              <p className="work__project-description">{project.description}</p>

              <div className="work__project-links">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="work__project-link"
                    onClick={(e) => scrollToSection(e, link.href)}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                    <span className="work__project-link-arrow">↗</span>
                  </a>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Work
