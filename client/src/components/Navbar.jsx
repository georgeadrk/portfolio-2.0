// components/Navbar.jsx
import React from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function Navbar() {
  const handleScroll = (e, target) => {
    e.preventDefault();

    const snapContainer = document.documentElement; // where snap classes are applied
    snapContainer.classList.remove("snap-y", "snap-mandatory");

    gsap.to(window, {
      duration: 1.2,
      ease: "power2.out",
      scrollTo: {
        y: target,
        offsetY: 80, // height of navbar
      },
      onComplete: () => {
        setTimeout(() => {
          snapContainer.classList.add("snap-y", "snap-mandatory");
        }, 300);
      },
    });
  };

  return (
    <nav className="w-full bg-black/70 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 relative">
        {/* Logo / Brand */}
        <div className="text-white text-xl font-bold tracking-wide">
          George A. K.
        </div>

        {/* Links */}
        <ul className="flex gap-8 text-white font-medium">
          <li>
            <a onClick={(e) => handleScroll(e, "#hero-section")} href="#hero-section">
              Home
            </a>
          </li>
          <li>
            <a onClick={(e) => handleScroll(e, "#about")} href="#about">
              About
            </a>
          </li>
          <li>
            <a onClick={(e) => handleScroll(e, "#projects")} href="#projects">
              Projects
            </a>
          </li>
          <li>
            <a onClick={(e) => handleScroll(e, "#chatbot")} href="#chatbot">
              Chatbot
            </a>
          </li>
        </ul>

        {/* Contact Button */}
        <button className="ml-6 px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors">
          Contact
        </button>

        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
      </div>
    </nav>
  );
}