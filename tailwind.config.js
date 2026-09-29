/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mpesa: {
          green: '#00A859',
          darkgreen: '#008746',
          lightgreen: '#E6F6ED',
          red: '#E11414',
          gold: '#FFB800',
        },
        safari: {
          dark: '#1E293B',
          sand: '#F8FAFC',
          card: '#FFFFFF',
          accent: '#0F766E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
