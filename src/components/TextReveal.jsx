import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './TextReveal.css'

/**
 * TextReveal - Masked slide-up text reveal animation.
 * Text slides up from behind an overflow-hidden mask.
 *
 * @param {string} text - The text to animate
 * @param {string} element - HTML element tag (h1, h2, p, span, etc.)
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {boolean} triggerOnScroll - Use scroll trigger vs. immediate
 * @param {boolean} charByChar - Animate character by character
 * @param {object} style - Additional inline styles
 */
function TextReveal({
  text,
  element: Element = 'span',
  className = '',
  delay = 0,
  triggerOnScroll = true,
  charByChar = false,
  style = {},
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const shouldAnimate = triggerOnScroll ? isInView : true

  if (charByChar) {
    const chars = text.split('')
    return (
      <Element className={`${className}`} style={style} ref={ref}>
        <span className="char-reveal__wrapper">
          {chars.map((char, i) => (
            <span
              key={i}
              className="char-reveal"
            >
              {char === ' ' ? (
                <span className="char-reveal__space" />
              ) : (
                <motion.span
                  className="char-reveal__char"
                  initial={{ y: '100%' }}
                  animate={shouldAnimate ? { y: 0 } : { y: '100%' }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay + i * 0.03,
                  }}
                >
                  {char}
                </motion.span>
              )}
            </span>
          ))}
        </span>
      </Element>
    )
  }

  // Line-by-line (word-wrapped) reveal
  return (
    <Element className={`${className}`} style={style} ref={ref}>
      <span className="text-reveal">
        <motion.span
          className="text-reveal__inner"
          initial={{ y: '100%' }}
          animate={shouldAnimate ? { y: 0 } : { y: '100%' }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay,
          }}
        >
          {text}
        </motion.span>
      </span>
    </Element>
  )
}

/**
 * SplitTextReveal - Splits text into lines, each revealing independently.
 */
function SplitTextReveal({
  lines,
  element: Element = 'h1',
  className = '',
  delay = 0,
  triggerOnScroll = true,
  staggerDelay = 0.12,
  style = {},
  renderLine,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldAnimate = triggerOnScroll ? isInView : true

  return (
    <Element className={className} style={style} ref={ref}>
      {lines.map((line, i) => (
        <span key={i} className="text-reveal" style={{ display: 'block' }}>
          <motion.span
            className="text-reveal__inner"
            style={{ display: 'block' }}
            initial={{ y: '100%' }}
            animate={shouldAnimate ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {renderLine ? renderLine(line, i) : line}
          </motion.span>
        </span>
      ))}
    </Element>
  )
}

export { TextReveal, SplitTextReveal }
export default TextReveal
