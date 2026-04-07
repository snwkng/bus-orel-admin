/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'deep-orange': '#FF5722',
        'deep-pink': '#FF2061',
        'deep-brown': '#55433C',
        'ligth-brown': '#BDA69F',
        'ligth-blue': '#009EFF',
        'deep-blue': '#006DF0'
      },

      boxShadow: {
        'rounded-left': '-8px 0 10px -15px rgba(0, 0, 0, 0.2), -3px 0 10px -3px rgba(0, 0, 0, 0.14)'
      }
    },
    
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

