/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./index.html",
    './src/components/**/*.vue',
    './src/components/**/*.{vue,js,ts,jsx,tsx}',
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['Alata', 'sans-serif'],
      }
    },
  },
  plugins: [],
  safelist: [],
}