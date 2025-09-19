import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 0,
  blurStrength = 6,
  containerClassName = '',
  animationEnd = 'top center'
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    // Grab all direct children of the container
    const items = Array.from(container.children);

    gsap.fromTo(
      items,
      {
        opacity: baseOpacity,
        y: 40,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        rotate: baseRotation
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        rotate: 0,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: container,
          scroller,
          start: 'top bottom-=10%',
          end: animationEnd,
          scrub: false // so it plays once instead of smearing
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseOpacity, baseRotation, blurStrength, animationEnd]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;