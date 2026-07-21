import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Preloader.css'

const loadingSteps = [
  'Loading portfolio',
  'Preparing motion',
  'Composing interface',
  'Ready',
]

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)

  const handleComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const duration = 2600
    const start = performance.now()
    let frameId
    let exitTimer

    const tick = (now) => {
      const elapsed = now - start
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(nextProgress)

      if (nextProgress < 100) {
        frameId = requestAnimationFrame(tick)
        return
      }

      exitTimer = setTimeout(() => {
        setIsLeaving(true)
      }, 450)
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      clearTimeout(exitTimer)
    }
  }, [])

  const currentStep = loadingSteps[
    Math.min(loadingSteps.length - 1, Math.floor((progress / 100) * loadingSteps.length))
  ]

  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {!isLeaving && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 1,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <motion.div
            className="preloader__wipe preloader__wipe--top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="preloader__wipe preloader__wipe--bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
          />

          <div className="preloader__meta">
            <span>Mark</span>
            <span>Portfolio / 2026</span>
          </div>

          <div className="preloader__center">
            <div className="preloader__name-mask">
              <motion.h1
                className="preloader__name"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              >
                Mark
              </motion.h1>
            </div>

            <div className="preloader__status-mask">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStep}
                  className="preloader__status"
                  initial={{ y: '120%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-120%', opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {currentStep}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="preloader__footer">
            <span className="preloader__counter">{String(progress).padStart(3, '0')}%</span>
            <div className="preloader__bar" aria-hidden="true">
              <motion.div
                className="preloader__bar-fill"
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
