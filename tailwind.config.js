/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'; // Add this line

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui, // Change 'require('daisyui')' to 'daisyui'
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}


