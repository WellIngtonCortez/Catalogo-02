/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#F27121', // Laranja
          secondary: '#1A2B4C', // Azul Marinho
          background: '#FFFFFF',
          soft: '#F8FAFC',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(26, 43, 76, 0.04), 0 4px 6px -2px rgba(26, 43, 76, 0.02)',
        'premium': '0 20px 50px -12px rgba(26, 43, 76, 0.12)',
      }
    },
  },
  plugins: [],
}
