import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-black border-b border-purple-700">
      <h1 className="text-xl font-bold text-purple-400">YourName</h1>
      <nav className="space-x-6">
        <a href="#about" className="hover:text-purple-300">About</a>
        <a href="#projects" className="hover:text-purple-300">Projects</a>
        <a href="#contact" className="hover:text-purple-300">Contact</a>
      </nav>
    </header>
  );
}