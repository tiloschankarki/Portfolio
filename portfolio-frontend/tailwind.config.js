/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ ensures Tailwind scans all your components
  ],
  theme: {
    extend: {
      colors: {
        navy: "#011627",
        cyan: "#41EAD4",
        red: "#F71735",
        offwhite: "#FDFFFC",
        gold: "#FFBB5C",
        graylight: "#F2F4F7",
        graydark: "#4B5563",
      },
      boxShadow: {
        subtle: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
