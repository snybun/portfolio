import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import './Process.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding your vision',
    description:
      'Before I design anything, I listen. I take the time to understand your brand, your goals, and the people you\'re trying to reach. Every great project starts with asking the right questions.',
    deliverables: [
      'Brand & market research',
      'Competitor analysis',
      'User persona development',
      'Project scope & goals',
    ],
  },
  {
    number: '02',
    title: 'Design',
    subtitle: 'Where ideas take shape',
    description:
      'With a clear direction in hand, I begin crafting wireframes and visual concepts. This is where strategy meets creativity — where ideas become something you can see, feel, and interact with.',
    deliverables: [
      'Wireframes & user flows',
      'High-fidelity mockups',
      'Design system & components',
      'Interactive prototypes',
    ],
  },
  {
    number: '03',
    title: 'Develop',
    subtitle: 'Pixel-perfect, production-ready',
    description:
      'Design is only as good as its implementation. I build with clean, performant code that brings the design to life exactly as envisioned — responsive, accessible, and fast.',
    deliverables: [
      'Clean, semantic code',
      'Responsive development',
      'Animations & interactions',
      'Performance optimization',
    ],
  },
  {
    number: '04',
    title: 'Deliver',
    subtitle: 'Launch is just the beginning',
    description:
      'Once everything is polished and tested, we launch. But my involvement doesn\'t end there — I provide support and guidance to ensure your project continues to succeed.',
    deliverables: [
      'Quality assurance & testing',
      'Deployment & launch',
      'Documentation & handoff',
      'Post-launch support',
    ],
  },
]

function Process() {
  const [openIndex, setOpenIndex] = useState(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const toggleStep = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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

  return (
    <section className="process" id="process" ref={sectionRef}>
      <div className="process__container">
        <motion.div
          className="process__header"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <span className="about__number">03</span>
          <span className="about__subtitle">My Process</span>
        </motion.div>

        <motion.h2
          className="process__title"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          A clear path from idea to launch.
        </motion.h2>

        <div className="process__steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="process__step"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.2 + index * 0.1}
            >
              <div
                className="process__step-header"
                onClick={() => toggleStep(index)}
              >
                <div className="process__step-left">
                  <span className="process__step-number">{step.number}</span>
                  <span className="process__step-title">{step.title}</span>
                  <span className="process__step-subtitle">{step.subtitle}</span>
                </div>

                <div
                  className={`process__step-toggle ${
                    openIndex === index ? 'process__step-toggle--open' : ''
                  }`}
                >
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="7" y1="0" x2="7" y2="14" />
                    <line x1="0" y1="7" x2="14" y2="7" />
                  </svg>
                </div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="process__step-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3, delay: 0.1 },
                    }}
                  >
                    <div className="process__step-body">
                      <p className="process__step-description">
                        {step.description}
                      </p>
                      <div className="process__step-deliverables">
                        <h4>Deliverables</h4>
                        <ul>
                          {step.deliverables.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
