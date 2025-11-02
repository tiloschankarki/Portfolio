import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://tfolio.duckdns.org/api";

const Education = () => {
  const [coursework, setCoursework] = useState([]);
  const [degreeProgress, setDegreeProgress] = useState(null);

  // Accent bar colors (rotating palette)
  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"];

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/education/`);
        const data = await res.json();
        setCoursework(data.coursework || []);
        setDegreeProgress(data.degree_progress || null);
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };

    fetchEducation();
  }, []);

  const progress = degreeProgress?.progress || 0;

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover text-navy"
      style={{
        backgroundImage: "url('/1.jpg')",
        backgroundBlendMode: "soft-light",
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">
            <span className="text-[#41EAD4]">Academic</span>{" "}
            <span className="text-[#011627]">Journey</span>
          </h1>
        </div>

        {/* Animated circular degree progress */}
        {degreeProgress && (
          <div className="flex flex-col items-center justify-center mb-20">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#41EAD4 ${progress * 3.6}deg, #E5E7EB ${progress * 3.6}deg)`,
                }}
              ></div>

              <div className="absolute inset-[8px] bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-[#011627]">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <p className="mt-4 text-gray-700 font-medium">Degree Completion</p>
          </div>
        )}

        {/* Coursework Cards */}
        <div>
          <h2 className="text-3xl font-semibold text-center text-navy mb-12">
            Coursework
          </h2>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {coursework.map((course, index) => {
              const accentColor = colors[index % colors.length];
              return (
                <div
                  key={index}
                  className="bg-white/80 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200 backdrop-blur-sm"
                >
                  {/* Accent Bar */}
                  <div
                    className="h-1.5 w-full rounded-t-xl"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-navy">
                      {course.course_name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-1">
                      <strong>Completed:</strong>{" "}
                      {new Date(course.completion_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm italic text-gray-700 leading-snug">
                      {course.skills_gained}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
