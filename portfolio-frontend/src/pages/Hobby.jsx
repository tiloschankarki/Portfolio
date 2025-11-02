import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://tfolio.duckdns.org/api";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hobbies/`);
        const data = await res.json();
        setHobbies(data);
      } catch (error) {
        console.error("Error fetching hobbies:", error);
      }
    };
    fetchHobbies();
  }, []);

  // Reuse the brand palette
  const colors = ["#41EAD4", "#F71735", "#FFBB5C", "#011627"];

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/2.jpg')",
        backgroundBlendMode: "soft-light",
      }}
    >
      {/* background overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 text-[#011627]">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center mb-10">
          <span className="text-[#011627]">My</span>{" "}
          <span className="text-[#41EAD4]">Hobbies & Interests</span>
        </h1>
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16 text-lg">
          Here’s what keeps me creative, grounded, and inspired when I’m not
          writing code.
        </p>

        {/* Hobby Grid */}
        <div className="grid lg:grid-cols-2 gap-12 justify-items-center">
          {hobbies.map((hobby, index) => {
            const accentColor = colors[index % colors.length];
            return (
              <div
                key={hobby.id}
                className="relative w-full max-w-xl min-h-[260px] bg-white/90 rounded-2xl shadow-lg border border-gray-200 
                           hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between p-8"
              >
                {/* Accent Bar */}
                <div
                  className="absolute top-0 left-0 w-full h-2 rounded-t-2xl"
                  style={{ backgroundColor: accentColor }}
                ></div>

                {/* Title */}
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={{ color: accentColor }}
                >
                  {hobby.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-700 leading-relaxed">
                  {hobby.description}
                </p>

                {/* Tag */}
                <div className="text-right mt-6">
                  <span
                    className="inline-block px-4 py-1 text-sm font-medium rounded-full border"
                    style={{
                      color: accentColor,
                      borderColor: accentColor,
                    }}
                  >
                    #StayInspired
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hobby;
