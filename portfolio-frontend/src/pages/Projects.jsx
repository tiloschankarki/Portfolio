import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";

const API_BASE_URL = "https://tfolio.duckdns.org/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/`);
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover text-navy"
      style={{ backgroundImage: "url('/1.jpg')", backgroundBlendMode: "soft-light" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-16">
          <span className="text-[#011627]">My</span>{" "}
          <span className="text-[#41EAD4]">Projects</span>
        </h1>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const accentColor = colors[index % colors.length];
            return (
              <div
                key={project.id}
                className="relative group bg-white/85 rounded-xl shadow-md border border-gray-200 
                           hover:shadow-2xl hover:scale-[1.04] transition-all duration-500 overflow-hidden"
              >
                {/* Accent bar */}
                <div
                  className="h-1.5 w-full rounded-t-xl"
                  style={{ backgroundColor: accentColor }}
                ></div>

                {/* GitHub icon — always visible */}
                {project.repo_link && (
                  <a
                    href={project.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 text-[#011627] hover:text-[#F71735] transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}

                <div className="p-6 transition-all duration-500 group-hover:h-auto">
                  <h3 className="text-xl font-bold mb-2 text-[#011627]">
                    {project.title}
                  </h3>

                  {/* Description expands on hover */}
                  <p
                    className="text-gray-700 text-sm mb-3 leading-snug 
                               overflow-hidden transition-all duration-500 ease-in-out 
                               max-h-[60px] group-hover:max-h-[500px]"
                  >
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tech_stack &&
                      project.tech_stack.split(",").map((tech, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md font-medium"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
