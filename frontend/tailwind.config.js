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
          1100: '#0f0f0f',
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
      animation: {
        grid: "grid 15s linear infinite",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
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