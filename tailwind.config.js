/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{scss,css}", // ✅ Make sure SCSS is scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
