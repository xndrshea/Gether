/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
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
          1000: '#1a1a1a'
        },
        'custom-bg': '#1a1a1a',
        'custom-text': '#ffffff',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}