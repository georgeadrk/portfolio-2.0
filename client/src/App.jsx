import React, { useState, useEffect } from "react";
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
import useSmartScrollSnap from "./components/useScrollSnap";

gsap.registerPlugin(ScrollToPlugin);

export default function App() {
  const [showNavbar, setShowNavbar] = useState(false);

  useSmartScrollSnap({
    selector: "section",
    duration: 0.8,
    threshold: 0.5,
    deadZone: 0.3,
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
      <div style={{ width: "100%", minHeight: "100vh", position: "relative", background: "#0a0a0a", color: "white" }}>
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
            <Hero />
          </section>
          <section>
            <About />
          </section>
          <section>
            <Projects />
          </section>
          <section>
            <ChatbotSection />
          </section>
          <Footer />
          <TargetCursor spinDuration={2} hideDefaultCursor={true} />
        </div>
      </div>
    </ChakraProvider>
  );
}