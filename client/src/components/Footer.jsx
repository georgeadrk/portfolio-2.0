export default function Footer() {
  return (
    <footer id="footer" className="bg-darkBlue text-gray-300 py-8 text-center mt-12">
      <p>© {new Date().getFullYear()} Your Name. Built with React + Tailwind CSS.</p>
      <div className="mt-4 space-x-4">
        <a href="https://github.com/yourusername" className="hover:text-purpleAccent cursor-target">GitHub</a>
        <a href="https://linkedin.com/in/yourusername" className="hover:text-purpleAccent cursor-target">LinkedIn</a>
      </div>
    </footer>
  );
}