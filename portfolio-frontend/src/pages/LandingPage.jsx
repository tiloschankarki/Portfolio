import React, { useEffect, useState } from "react";
import { ArrowRight, Code2, Award, Send, Github } from "lucide-react";

// ✅ Backend base URL
const API_BASE_URL = "https://tfolio.duckdns.org/api";

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  // Fetch projects + certifications
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/`);
        const data = await res.json();
        setProjects(data.slice(0, 3)); // limit to top 3
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchCertifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/certifications/`);
        const data = await res.json();
        setCerts(data.slice(0, 2)); // limit to top 2
      } catch (error) {
        console.error("Error fetching certifications:", error);
      }
    };

    fetchProjects();
    fetchCertifications();
  }, []);

  return (
    <div className="bg-[#FDFFFC] text-[#011627]">
      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
        {/* Left: Text */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hey, I’m <span className="text-[#41EAD4]">Tiloschan Karki</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            A Computer Science senior at Texas State University passionate about
            building scalable and human-centered software solutions.
          </p>

          <div className="flex gap-4">
            {/* Resume Button */}
            <a
              href="/TiloschanResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#41EAD4] text-[#011627] px-6 py-3 rounded-lg font-semibold 
                         hover:bg-[#F71735] hover:text-white transition-all duration-300 no-underline hover:no-underline"
            >
              View My Resume 📜
            </a>

            {/* Contact Button */}
            <a
              href="/contact"
              className="border-2 border-[#41EAD4] text-[#011627] px-6 py-3 rounded-lg font-semibold 
                         hover:bg-[#41EAD4] hover:text-[#011627] transition-all duration-300 no-underline hover:no-underline"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right: Profile Image */}
        <div className="mt-10 lg:mt-0">
          <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-[#2a1719] shadow-lg">
            <img
              src="/profile.jpeg"
              alt="Tiloschan Karki"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section className="bg-cyan py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Code2 className="w-6 h-6 text-[#41EAD4]" />
            <h2 className="text-3xl font-semibold">Featured Projects</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200 
                           hover:border-[#41EAD4] hover:shadow-lg transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{proj.title}</h3>
                  {proj.repo_link && (
                    <a
                      href={proj.repo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#011627] hover:text-[#F71735] transition-colors no-underline hover:no-underline"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {proj.description}
                </p>
                <p className="text-sm font-medium text-[#F71735]">
                  {proj.tech_stack}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/projects"
              className="inline-flex items-center text-[#F71735] font-semibold 
                         hover:text-[#020605] transition-all no-underline hover:no-underline"
            >
              See All Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= CERTIFICATIONS SECTION ================= */}
      <section className="py-20 px-8 bg-[#FDFFFC]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-6 h-6 text-[#FFBB5C]" />
            <h2 className="text-3xl font-semibold">Certifications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#F7F7F7] p-6 rounded-lg border-l-4 border-[#FFBB5C] hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-bold mb-1">{cert.name}</h3>
                <p className="text-gray-600">{cert.organization}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/certifications"
              className="inline-flex items-center text-[#fdbc3b] font-semibold 
                         hover:text-[#41EAD4] transition-all no-underline hover:no-underline"
            >
              View All Certifications
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= AWARDS & ACHIEVEMENTS ================= */}
      <section className="bg-[#011627] text-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8 text-[#41EAD4]">
            Achievements & Involvements
          </h2>
          <ul className="space-y-5 text-lg">
            <li>🏆 Dean’s List – multiple semesters at Texas State University</li>
            <li>
              💡 Undergraduate Instructional Assistant – led 50+ students to
              30% improved performance
            </li>
            <li>🚀 STEM Hackathon, React Dev and BokoHacks Hackathon participant</li>
            <li>Texas State Presidential Scholarship holder</li>
            <li>🔗 Creator of Tfolio, ScholarGraph, and ResumeWizard</li>
          </ul>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-[#41EAD4] text-[#011627] text-center py-20">
        <h2 className="text-4xl font-bold mb-4">
          Let’s Build Something Amazing Together
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Have an idea or opportunity? I’d love to collaborate and bring your
          vision to life.
        </p>
        <a
          href="/contact"
          className="bg-[#011627] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#F71735] 
                     transition-all inline-flex items-center gap-2 no-underline hover:no-underline"
        >
          Get In Touch
          <Send className="w-5 h-5" />
        </a>
      </section>
    </div>
  );
};

export default LandingPage;
