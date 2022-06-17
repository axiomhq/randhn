/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      colors: {
        owhite: 'rgba(255, 251, 247, 1.00)',
        gray: colors.zinc,
      }
    }
  },
  plugins: [],
}
