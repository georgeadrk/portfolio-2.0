import React from "react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-black text-white text-center">
      <h3 className="text-3xl font-bold mb-6 text-purple-400">Contact Me</h3>
      <p className="text-gray-300 mb-4">Feel free to reach out for collaborations or just a friendly hello!</p>
      <a
        href="mailto:your@email.com"
        className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold"
      >
        Email Me
      </a>
    </section>
  );
}