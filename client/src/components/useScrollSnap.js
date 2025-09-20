// components/useScrollSnap.js
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function useScrollSnap({
  selector = "section",
  navbarSelector = null,
  snapDuration = 0.6,
  calibrationOffset = 0 // shift everything up/down
} = {}) {
  const [offsetY, setOffsetY] = useState(0);
  const isAnimating = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // measure navbar height
    if (typeof navbarSelector === "number") {
      setOffsetY(navbarSelector);
    } else if (typeof navbarSelector === "string") {
      const nav = document.querySelector(navbarSelector);
      setOffsetY(nav ? nav.offsetHeight || 0 : 0);
    } else {
      setOffsetY(0);
    }
  }, [navbarSelector]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(selector));
    if (!sections.length) return;

    const goToSection = (i) => {
      if (i < 0 || i >= sections.length) return;
      indexRef.current = i;
      isAnimating.current = true;

      const rect = sections[i].getBoundingClientRect();
      const targetY =
        window.scrollY +
        rect.top -
        offsetY +
        calibrationOffset;

      gsap.to(window, {
        scrollTo: targetY,
        duration: snapDuration,
        ease: "power2.out",
        onComplete: () => {
          isAnimating.current = false;
        }
      });
    };

    const handleWheel = (e) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      let i = indexRef.current + dir;
      if (i < 0) i = 0;
      if (i > sections.length - 1) i = sections.length - 1;
      goToSection(i);
    };

    // on load, detect which section we’re in
    let scrollY = window.scrollY;
    const vh = window.innerHeight;
    for (let i = 0; i < sections.length; i++) {
      if (scrollY >= sections[i].offsetTop - vh / 2) indexRef.current = i;
    }

    window.addEventListener("wheel", handleWheel, { passive: false });

    // touch support
    let startY = null;
    const onTouchStart = (e) => (startY = e.touches[0].clientY);
    const onTouchEnd = (e) => {
      if (startY === null) return;
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) > 30) {
        const dir = deltaY > 0 ? 1 : -1;
        let i = indexRef.current + dir;
        if (i < 0) i = 0;
        if (i > sections.length - 1) i = sections.length - 1;
        goToSection(i);
      }
      startY = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [selector, offsetY, snapDuration, calibrationOffset]);
}