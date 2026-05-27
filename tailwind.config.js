/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Safestore brand blue  rgb(4, 42, 78) = #042A4E
        blue: {
          50:  '#e8f0f7',
          100: '#c5d8ea',
          200: '#9bbcda',
          300: '#6a9cc8',
          400: '#4280b5',
          500: '#1e619e',
          600: '#0f4d82',
          700: '#042A4E',
          800: '#031e38',
          900: '#021529',
          950: '#010c18',
        },
        // Safestore brand amber  #F99B1C
        yellow: {
          50:  '#fef5e4',
          100: '#fde9c0',
          200: '#fcd898',
          300: '#fbc770',
          400: '#F99B1C',
          500: '#e08910',
          600: '#c47b0f',
          700: '#a8680d',
          800: '#8c560b',
          900: '#703f08',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pop':      'pop 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        pop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
