import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fromVars = {
      opacity: 0,
    }
    if (direction === 'up') fromVars.y = distance
    if (direction === 'down') fromVars.y = -distance
    if (direction === 'left') fromVars.x = distance
    if (direction === 'right') fromVars.x = -distance

    gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: `top bottom-=${threshold * 100}%`,
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [direction, delay, duration, distance, threshold])

  return <Tag ref={ref} className={className}>{children}</Tag>
}

export default ScrollReveal
