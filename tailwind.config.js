/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7B2C34', // Maroon/Wine color from logo/welcome
          light: '#A54B55',
          dark: '#5A1F25',
        },
        background: {
          DEFAULT: '#FDFCFB', // Off-white/Cream background
          alt: '#F5F2F0',
        },
        accent: {
          green: '#10B981',
          orange: '#F59E0B',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        accent: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
