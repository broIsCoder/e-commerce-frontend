/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  darkMode: "class", // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3498db',
          dark: '#2980b9',
        },
        secondary: {
          light: '#e74c3c',
          dark: '#c0392b',
        },
        accent: {
          light: '#2ecc71',
          dark: '#27ae60',
        },
        background: {
          light: '#f8f9fa',
          dark: '#1a202c',
        },
        text: {
          light: '#2d3748',
          dark: '#e2e8f0',
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "50%": { opacity: 0.5, transform: "translateY(50%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOutRight: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "50%": { opacity: 0.5, transform: "translateX(50%)" },
          "100%": { opacity: 0, transform: "translateX(100%)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
        fadeOutRight: "fadeOutRight 0.5s ease-out forwards",
        spin: "spin 1s linear infinite",
      },
    },
    screens: {
      xs: "480px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};