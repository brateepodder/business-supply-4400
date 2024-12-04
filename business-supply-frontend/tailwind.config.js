const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Add your app and components' paths here
    "./components/**/*.{js,ts,jsx,tsx}", // Include all component files
    "./app/**/*.{js,ts,jsx,tsx}",       // Include all app files
    "./styles/src/**/*.{css,js,ts,jsx,tsx}", // Make sure to include the path to globals.css
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Include NextUI theme
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class", // Enable dark mode
  plugins: [nextui()],
};