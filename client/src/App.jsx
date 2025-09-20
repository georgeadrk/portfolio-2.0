// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChakraProvider } from "@chakra-ui/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import ChatbotSection from "./components/ChatbotSection";
import Footer from "./components/Footer";
import TargetCursor from "./components/TargetCursor";
import DarkVeil from "./components/DarkVeil";
import useScrollSnap from "./components/useScrollSnap";
import ScrollReveal from "./components/ScrollReveal";

gsap.registerPlugin(ScrollToPlugin);

export default function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const scrollContainerRef = useRef(null);

  useScrollSnap({
    selector: "section",
    navbarSelector: 100,
    calibrationOffset: 40,
    snapDuration: 0.8,
    scrollContainerRef, // pass the ref here if your hook supports it
  });

  useEffect(() => {
    const heroSection = document.querySelector("#hero-section");
    const observer = new IntersectionObserver(
      ([entry]) => setShowNavbar(!entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (heroSection) observer.observe(heroSection);
    return () => {
      if (heroSection) observer.unobserve(heroSection);
    };
  }, []);

  return (
    <ChakraProvider>
      <div
        ref={scrollContainerRef}
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          background: "#0a0a0a",
          color: "white",
          overflowY: "scroll", // make scroll container explicit
          scrollSnapType: "y mandatory", // snap works on this container
        }}
      >
        <DarkVeil />
        <div className="darkveil-overlay"></div>

        <div className="site-content">
          <div
            className={`fixed top-0 left-0 w-full transition-all ease-in-out duration-1000 z-50 ${
              showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
          >
            <Navbar />
          </div>

          <section id="hero-section">
            <ScrollReveal scrollContainerRef={scrollContainerRef}>
              <Hero />
            </ScrollReveal>
          </section>

          <section>
            <ScrollReveal scrollContainerRef={scrollContainerRef}>
              <About />
            </ScrollReveal>
          </section>

          <section>
            <ScrollReveal scrollContainerRef={scrollContainerRef}>
              <Projects />
            </ScrollReveal>
          </section>

          <section>
            <ScrollReveal scrollContainerRef={scrollContainerRef}>
              <ChatbotSection />
            </ScrollReveal>
          </section>

          <Footer />
          <TargetCursor spinDuration={2} hideDefaultCursor={true} />
        </div>
      </div>
    </ChakraProvider>
  );
}