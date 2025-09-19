// src/components/Projects.jsx
export default function Projects() {
  const projects = [
    {
      title: 'AI Chatbot',
      description: 'An interactive AI chatbot built with React and OpenAI.',
      link: '#',
      image: '/images/project1.jpg'
    },
    {
      title: 'Portfolio Website',
      description: 'My personal website built with React and Tailwind.',
      link: '#',
      image: '/images/project2.jpg'
    },
    {
      title: '3D Visualizer',
      description: 'A WebGL/Three.js based 3D model viewer.',
      link: '#',
      image: '/images/project3.jpg'
    }
  ];

  return (
    <section id="projects" className="py-20 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Projects</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              className="relative block group rounded-xl overflow-hidden glow-card cursor-target"
            >
              {/* Image */}
              <div className="h-48 bg-gray-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 bg-black bg-opacity-70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}