import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import aboutImage from '../assets/gyu.jpg'
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
        className="about__photo-wrapper"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          className={`about__photo ${isHovered ? 'about__photo--hovered' : ''}`}
          src={src}
          alt={alt}
        />
        <span className="about__photo-dots" aria-hidden="true" />
      </motion.div>
    </div>
  )
}

const experiences = [
  {
    id: 'exp-1',
    role: 'Lead Frontend Developer & UI Designer',
    company: 'Freelance & Client Projects',
    period: '2024 — PRESENT',
    location: 'Philippines (Remote)',
    description:
      'Designing and engineering custom web applications, dynamic portfolio sites, and interactive web experiences. Focused on modern performance, responsive layouts, motion graphics, and clean user interfaces.',
    skills: ['React', 'JavaScript (ES6+)', 'Framer Motion', 'CSS3 / Tailwind', 'Figma', 'UI/UX Design'],
  },
  {
    id: 'exp-2',
    role: 'Full Stack Web Developer',
    company: 'Digital Solutions',
    period: '2023 — 2024',
    location: 'Philippines',
    description:
      'Architected end-to-end web applications and RESTful APIs. Collaborated on database schema design, UI component libraries, and optimized frontend bundle performance.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
  },
  {
    id: 'exp-3',
    role: 'Junior Web Developer & Designer',
    company: 'Creative Tech Studio',
    period: '2022 — 2023',
    location: 'Philippines',
    description:
      'Built responsive web interfaces, crafted interactive UI wireframes, improved cross-browser compatibility, and assisted with user experience testing and design iterations.',
    skills: ['HTML5 & CSS3', 'JavaScript', 'Responsive Design', 'Figma', 'UI Design'],
  },
]

function About() {
  const helloRef = useRef(null)
  const experienceRef = useRef(null)
  const helloInView = useInView(helloRef, { margin: '-100px' })
  const experienceInView = useInView(experienceRef, { margin: '-100px' })

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
            <span className="about__slash">/</span>
            <span className="about__subtitle">ABOUT ME</span>
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
              variants={fadeUp}
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
          variants={fadeUp}
          initial="hidden"
          animate={helloInView ? 'visible' : 'hidden'}
          custom={0.4}
        />

        {/* Experience Timeline Section */}
        <div className="about__experience" ref={experienceRef} id="experience">
          <motion.div
            className="about__experience-header"
            variants={fadeUp}
            initial="hidden"
            animate={experienceInView ? 'visible' : 'hidden'}
            custom={0}
          >
            <div className="about__header">
              <span className="about__number">02</span>
              <span className="about__slash">/</span>
              <span className="about__subtitle">CAREER & EXPERIENCE</span>
            </div>
            <h3 className="about__experience-title">Work Experience</h3>
            <p className="about__experience-intro">
              My professional journey, key roles, and technical contributions over the years.
            </p>
          </motion.div>

          <div className="about__timeline">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="about__timeline-item"
                variants={fadeUp}
                initial="hidden"
                animate={experienceInView ? 'visible' : 'hidden'}
                custom={0.15 + index * 0.12}
              >
                <div className="about__timeline-marker">
                  <div className="about__timeline-dot" />
                  <div className="about__timeline-line" />
                </div>
                <div className="about__timeline-content">
                  <div className="about__timeline-header">
                    <div className="about__timeline-title-group">
                      <h4 className="about__timeline-role">{exp.role}</h4>
                      <span className="about__timeline-company">
                        {exp.company} <span className="about__timeline-location">• {exp.location}</span>
                      </span>
                    </div>
                    <span className="about__timeline-period">{exp.period}</span>
                  </div>
                  <p className="about__timeline-description">{exp.description}</p>
                  <div className="about__timeline-skills">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="about__timeline-skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
