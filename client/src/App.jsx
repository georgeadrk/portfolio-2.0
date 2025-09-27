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

  // optional: only useScrollSnap if you still want snap scrolling on wheel
  useScrollSnap({
    selector: "section",
    navbarSelector: 80, // height of navbar
    calibrationOffset: 0,
    snapDuration: 0.8,
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
        className="snap-y snap-mandatory overflow-y-scroll"
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          background: "#0a0a0a",
          color: "white",
        }}
      >
        {/* Dark overlay */}
        <DarkVeil />

        {/* Fixed Navbar */}
        <div
          className={`fixed top-0 left-0 w-full transition-all ease-in-out duration-1000 z-50 ${
            showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <Navbar />
        </div>

        {/* Sections */}
        <section id="hero-section" className="snap-start">
          <ScrollReveal>
            <Hero />
          </ScrollReveal>
        </section>

        <section id="about" className="snap-start">
          <ScrollReveal>
            <About />
          </ScrollReveal>
        </section>

        <section id="projects" className="snap-start">
          <ScrollReveal>
            <Projects />
          </ScrollReveal>
        </section>

        <section id="chatbot" className="snap-start">
          <ScrollReveal>
            <ChatbotSection />
          </ScrollReveal>
        </section>

        <Footer />
        <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      </div>
    </ChakraProvider>
  );
}