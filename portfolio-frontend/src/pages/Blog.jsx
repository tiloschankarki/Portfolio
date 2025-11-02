import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, X } from "lucide-react";

const API_BASE_URL = "https://tfolio.duckdns.org/api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blog/`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover text-[#011627]"
      style={{ backgroundImage: "url('/1.jpg')" }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-[#FDFFFC]/85 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-12">
          <span className="text-[#011627]">My</span>{" "}
          <span className="text-[#41EAD4]">Blog</span>
        </h1>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className="relative group rounded-xl overflow-hidden shadow-md bg-[#FDFFFC]/90 border border-gray-200 
                         hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#011627]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card content */}
              <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-2 justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#F71735]" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>

                    {blog.reading_time && (
                      <div className="flex items-center text-[#011627]/70">
                        <Clock className="w-4 h-4 mr-1 text-[#41EAD4]" />
                        {blog.reading_time} min read
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-[#011627] group-hover:text-[#41EAD4] transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-700 mt-3 line-clamp-4">
                    {blog.content}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 mt-6 font-semibold text-[#011627] group-hover:text-[#41EAD4] transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== Modal for full post ===================== */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#FDFFFC] rounded-2xl shadow-xl max-w-3xl w-full relative p-8 max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-[#F71735] hover:text-[#011627]"
              onClick={() => setSelectedBlog(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-[#011627]">
              {selectedBlog.title}
            </h2>

            <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#F71735]" />
                {new Date(selectedBlog.created_at).toLocaleDateString()}
              </div>
              {selectedBlog.reading_time && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-[#41EAD4]" />
                  {selectedBlog.reading_time} min read
                </div>
              )}
            </div>

            <p className="whitespace-pre-line text-gray-800 leading-relaxed text-[1.05rem]">
              {selectedBlog.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;

