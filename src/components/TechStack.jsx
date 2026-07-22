import { useRef } from 'react'
import TechGlobe3D from './TechGlobe3D'
import './TechStack.css'

// Exact tech stack provided by user
export const USER_TECH_STACK = [
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'JAVASCRIPT', icon: 'javascript' },
  { name: 'TYPESCRIPT', icon: 'typescript' },
  { name: 'BOOTSTRAP', icon: 'bootstrap' },
  { name: 'NODE.JS', icon: 'nodejs' },
  { name: 'REACT', icon: 'react' },
  { name: 'EXPO', icon: 'expo' },
  { name: 'VITE', icon: 'vite' },
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

  return (
    <section className="tech-stack" id="tech-stack" ref={sectionRef}>
      <div className="tech-stack__container">
        {/* Header Bar */}
        <div className="tech-stack__header">
          <div className="tech-stack__label">
            <span className="tech-stack__number">02</span>
            <span className="tech-stack__divider">/</span>
            <span className="tech-stack__title">TECH ARSENAL</span>
          </div>
        </div>

        {/* Interactive 3D Tech Globe directly in section */}
        <div className="tech-stack__globe-wrapper">
          <TechGlobe3D items={USER_TECH_STACK} />
        </div>
      </div>
    </section>
  )
}

export default TechStack
