import React, { useEffect, useState } from "react";
import { Award, ArrowRight } from "lucide-react";

const API_BASE_URL = "https://tfolio.duckdns.org/api";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/certifications/`);
        const data = await res.json();
        setCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      }
    };
    fetchCertifications();
  }, []);

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover text-[#011627]"
      style={{ backgroundImage: "url('/2.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#FDFFFC]/85 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">
            <span className="text-[#011627]">My</span>{" "}
            <span className="text-[#41EAD4]">Certifications</span>
          </h1>
          <p className="text-gray-600 mt-3">
            Credentials that reflect my learning journey and commitment to growth.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-10">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="relative bg-[#FDFFFC]/90 rounded-xl shadow-md border border-gray-200 p-6 
                         hover:shadow-xl hover:scale-[1.03] transition-all duration-300 overflow-hidden"
            >
              {/* Decorative bar */}
              <div
                className="absolute top-0 left-0 h-1.5 w-full"
                style={{
                  backgroundColor: ["#41EAD4", "#F71735", "#FFBB5C", "#456990"][
                    index % 4
                  ],
                }}
              ></div>

              {/* Icon + Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#011627]/10 p-3 rounded-full">
                    <Award className="w-6 h-6 text-[#011627]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#011627] mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{cert.organization}</p>
                  </div>
                </div>
              </div>

              {/* Issue Date & Skills */}
              <div className="text-sm text-gray-700 mb-4">
                <p>
                  <strong>Issued:</strong>{" "}
                  {new Date(cert.issue_date).toLocaleDateString()}
                </p>
                {cert.skills_covered && (
                  <p className="mt-2 leading-relaxed">
                    <strong>Skills Covered:</strong> {cert.skills_covered}
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <div className="mt-4">
                <a
                  href="/certifications"
                  className="inline-flex items-center gap-2 bg-[#011627] text-[#FDFFFC] px-5 py-2 rounded-md 
                             font-medium text-sm hover:bg-[#F71735] transition-all"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
