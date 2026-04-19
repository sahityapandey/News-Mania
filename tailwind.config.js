/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f8f7f4",
          100: "#eeebe4",
          200: "#d9d3c7",
          300: "#bfb5a3",
          400: "#a3957f",
          500: "#8c7c65",
          600: "#7d6e59",
          700: "#685a4a",
          800: "#564b3e",
          900: "#483f35",
          950: "#272118",
        },
        accent: "#c0392b",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        shimmer: "shimmer 1.5s infinite linear",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
