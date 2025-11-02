import React, { useState } from "react";
import axios from "axios";
import { Linkedin, Github, Send, Instagram } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const API_BASE_URL = "https://tfolio.duckdns.org/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "message") setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/contact/`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
    } catch {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/2.jpg')",
        backgroundBlendMode: "soft-light",
      }}
    >
      {/* Overlay for glass effect */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#011627]">
          <span className="text-[#41EAD4]">Get</span> in Touch
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 shadow-md rounded-2xl p-8 border border-gray-200 backdrop-blur-sm"
          >
            {success && (
              <div className="mb-4 text-green-600 font-semibold text-center">
                ✅ Message sent successfully!
              </div>
            )}
            {error && (
              <div className="mb-4 text-red-600 font-semibold text-center">
                ❌ {error}
              </div>
            )}

            <div className="space-y-4">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[#011627] mb-1">
                    {field === "name" ? "Name" : "Email"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none 
                               focus:ring-2 focus:ring-[#41EAD4] text-[#011627]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-[#011627] mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none 
                             focus:ring-2 focus:ring-[#41EAD4] text-[#011627]"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {charCount}/500
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#011627] 
                         text-white font-semibold hover:bg-[#F71735] hover:shadow-md transition-all duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Right: Info Section */}
          <div className="flex flex-col justify-center items-start text-[#011627]">
            <h3 className="text-2xl font-semibold mb-4">Let’s Connect</h3>
            <p className="text-gray-700 mb-6">
              I’m always open to collaborations, internships, or a casual tech chat.
            </p>

            <ul className="space-y-2 mb-8">
              <li>
                📧{" "}
                <a
                  href="mailto:tiloschankarki@gmail.com"
                  className="text-[#F71735] hover:underline"
                >
                  tiloschankarki@gmail.com
                </a>
              </li>
              <li>🌐 tfolio.duckdns.org</li>
              <li>📍 Texas, USA</li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-5 mt-2">
              <a
                href="https://linkedin.com/in/tiloschankarki"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#41EAD4] rounded-full text-[#011627] hover:bg-[#F71735] hover:text-white 
                           transition-all duration-300 transform hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://github.com/tiloschankarki"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#41EAD4] rounded-full text-[#011627] hover:bg-[#F71735] hover:text-white 
                           transition-all duration-300 transform hover:-translate-y-1"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/tiloschan_13/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#41EAD4] rounded-full text-[#011627] hover:bg-[#F71735] hover:text-white 
                           transition-all duration-300 transform hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
