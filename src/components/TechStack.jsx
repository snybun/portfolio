import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TechIcon } from './TechIcons'
import './TechStack.css'

export const TECH_STACK_CATEGORIES = [
  {
    category: 'FRONTEND',
    items: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'JAVASCRIPT', icon: 'javascript' },
      { name: 'TYPESCRIPT', icon: 'typescript' },
      { name: 'REACT', icon: 'react' },
      { name: 'NEXT.JS', icon: 'nextjs' },
      { name: 'TAILWIND CSS', icon: 'tailwind' },
      { name: 'FRAMER MOTION', icon: 'framer' },
    ],
  },
  {
    category: 'BACKEND',
    items: [
      { name: 'NODE.JS', icon: 'nodejs' },
      { name: 'PYTHON', icon: 'python' },
      { name: 'EXPRESS', icon: 'express' },
      { name: 'POSTGRESQL', icon: 'postgresql' },
      { name: 'FASTAPI', icon: 'fastapi' },
      { name: 'PRISMA', icon: 'prisma' },
      { name: 'SUPABASE', icon: 'supabase' },
      { name: 'PHP', icon: 'php' },
      { name: 'MYSQL', icon: 'mysql' },
      { name: 'MONGODB', icon: 'mongodb' },
    ],
  },
  {
    category: 'DEVOPS & CLOUD',
    items: [
      { name: 'DOCKER', icon: 'docker' },
      { name: 'CLOUDINARY', icon: 'cloudinary' },
      { name: 'VERCEL', icon: 'vercel' },
      { name: 'RENDER', icon: 'render' },
    ],
  },
  {
    category: 'AI DEVELOPMENT & RAG',
    items: [
      { name: 'PYTORCH', icon: 'pytorch' },
      { name: 'LANGCHAIN', icon: 'langchain' },
      { name: 'TRANSFORMERS', icon: 'transformers' },
      { name: 'OPENAI', icon: 'openai' },
      { name: 'HUGGING FACE', icon: 'huggingface' },
      { name: 'BEAUTIFULSOUP', icon: 'python' },
      { name: 'LANGGRAPH', icon: 'langgraph' },
    ],
  },
  {
    category: 'DEV TOOLS',
    items: [
      { name: 'GIT', icon: 'git' },
      { name: 'VS CODE', icon: 'vscode' },
      { name: 'POSTMAN', icon: 'postman' },
      { name: 'FIGMA', icon: 'figma' },
    ],
  },
]

// Flatten all items for the marquee row
const ALL_TECH_ITEMS = TECH_STACK_CATEGORIES.flatMap((c) => c.items)

function TechStack() {
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (showAll) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showAll])

  return (
    <section className="tech-stack" id="tech-stack" ref={sectionRef}>
      <div className="tech-stack__container">
        {/* Header Bar */}
        <div className="tech-stack__header">
          <div className="tech-stack__label">
            <span className="tech-stack__number">04</span>
            <span className="tech-stack__divider">/</span>
            <span className="tech-stack__title">TECHNICAL ARSENAL</span>
          </div>

          <button className="tech-stack__see-all" onClick={() => setShowAll(true)}>
            SEE ALL
          </button>
        </div>

        {/* Single Row Infinite Moving Marquee */}
        <div className="tech-stack__marquee-box">
          <div className="tech-stack__marquee-track">
            {[...ALL_TECH_ITEMS, ...ALL_TECH_ITEMS, ...ALL_TECH_ITEMS].map((item, index) => (
              <div className="tech-stack__item" key={index}>
                <TechIcon name={item.icon} className="tech-stack__icon" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen View / Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            className="tech-modal"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="tech-modal__container">
              <button className="tech-modal__back" onClick={() => setShowAll(false)}>
                <span className="tech-modal__back-arrow">←</span> Back to Home
              </button>

              <h1 className="tech-modal__heading">TECH STACK</h1>

              <div className="tech-modal__categories">
                {TECH_STACK_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="tech-modal__category">
                    <h2 className="tech-modal__category-name">{cat.category}</h2>
                    <div className="tech-modal__pills">
                      {cat.items.map((item, i) => (
                        <div key={i} className="tech-modal__pill">
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default TechStack
