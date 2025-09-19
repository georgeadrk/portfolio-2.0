// components/useScrollSnap.js
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function useScrollSnap({
  selector = "section",
  duration = 0.8,
  deadZone = 0.25,
  delayBetweenSnaps = 600 // ms
}) {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(selector));
    let currentIndex = 0;
    let isAnimating = false;
    let lastSnap = 0;

    const goToSection = (index) => {
      if (index < 0 || index >= sections.length) return;
      isAnimating = true;
      currentIndex = index;

      gsap.to(window, {
        scrollTo: sections[index].offsetTop,
        duration,
        ease: "power2.out",
        onComplete: () => {
          isAnimating = false;
          lastSnap = Date.now();
          ScrollTrigger.refresh(); // ✅ refresh after snap
        }
      });
    };

    const onWheel = (e) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }
      if (Date.now() - lastSnap < delayBetweenSnaps) {
        // still in cooldown
        return;
      }

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // find section index
      let index = 0;
      for (let i = 0; i < sections.length; i++) {
        if (scrollY >= sections[i].offsetTop - viewportHeight / 2) index = i;
      }
      currentIndex = index;

      const currentSection = sections[index];
      const elTop = currentSection.offsetTop;
      const elHeight = currentSection.offsetHeight;
      const elBottom = elTop + elHeight;

      const delta = e.deltaY;

      // tall section free scroll
      if (elHeight > viewportHeight) {
        const freeTop = elTop + elHeight * deadZone;
        const freeBottom = elBottom - viewportHeight * deadZone;

        if (scrollY < freeTop && delta < 0) {
          // near top → snap up
          goToSection(index - 1);
          e.preventDefault();
          return;
        }

        if (scrollY > freeBottom && delta > 0) {
          // near bottom → snap down
          goToSection(index + 1);
          e.preventDefault();
          return;
        }

        // inside free zone → let browser scroll normally
        return;
      }

      // normal sections
      if (delta > 0) {
        goToSection(index + 1);
        e.preventDefault();
      } else if (delta < 0) {
        goToSection(index - 1);
        e.preventDefault();
      }
    };

    // start at correct section
    const scrollY = window.scrollY;
    for (let i = 0; i < sections.length; i++) {
      if (scrollY >= sections[i].offsetTop) currentIndex = i;
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [selector, duration, deadZone, delayBetweenSnaps]);
}