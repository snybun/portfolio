import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Preloader.css'

const greetings = [
  { text: 'ようこそ', lang: 'Japanese' },
  { text: 'Bienvenue', lang: 'French' },
  { text: 'Welcome', lang: 'English' },
]

function Preloader({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const handleComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // Cycle through greetings with timing
    const timings = [800, 800, 1000] // Duration for each greeting
    let timeoutId

    const cycleGreeting = (index) => {
      if (index >= greetings.length) {
        // All greetings shown, start exit
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(handleComplete, 900)
        }, 200)
        return
      }

      setCurrentIndex(index)
      timeoutId = setTimeout(() => {
        cycleGreeting(index + 1)
      }, timings[index])
    }

    // Start after brief pause
    timeoutId = setTimeout(() => cycleGreeting(0), 300)

    return () => clearTimeout(timeoutId)
  }, [handleComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 0.85,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div className="preloader__text-wrapper">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                className="preloader__text"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {greetings[currentIndex].text}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
