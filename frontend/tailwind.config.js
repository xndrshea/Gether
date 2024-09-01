/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      screens: {
        'xl': '1400px',
        'custom': '900px',
      },
      caretColor: theme => theme('colors'),
      colors: {
        'blue': {
          600: '#0066ff',
          700: '#0052cc',
        },
        'gray': {
          200: '#e5e7eb',
          800: '#3a3a3a',
          900: '#2a2a2a',
          1000: '#1a1a1a',
        },
        'custom-bg': '#1a1a1a',
        'custom-text': '#ffffff',
        cursor: 'rgb(220, 90, 90)',
      },
      width: {
        'cursor': '10px',
        'cursor-outline': '12px',
      },
      height: {
        'cursor': '10px',
        'cursor-outline': '12px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}