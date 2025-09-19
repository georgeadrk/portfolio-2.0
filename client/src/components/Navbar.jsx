// components/Navbar.jsx
import React from "react";

export default function Navbar() {
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
            <a href="#hero-section" className="hover:text-purple-400 transition-colors cursor-target">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-purple-400 transition-colors cursor-target">
              About
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-purple-400 transition-colors cursor-target">
              Projects
            </a>
          </li>
          <li>
            <a href="#chatbot" className="hover:text-purple-400 transition-colors cursor-target">
              Chatbot
            </a>
          </li>
        </ul>

        {/* Example button */}
        <button className="ml-6 px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors cursor-target">
          Contact
        </button>

        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
      </div>
    </nav>
  );
}