/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shop Theme (Elegant Retail)
        shop: {
          bg: '#FFFBF0', // Soft Cream
          text: '#2F4F4F', // Dark Slate
          accent: '#D4AF37', // Muted Gold
          muted: '#F5E6E0'
        },
        // Parlour Theme (Pastel/Soft)
        parlour: {
          bg: '#FFF0F5', // Lavender Blush
          primary: '#2F4F4F', // Dark Slate Gray
          secondary: '#FFE4E1', // Misty Rose
          accent: '#DB7093', // Pale Violet Red
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'], // Elegant serif for Parlour
      }
    },
  },
  plugins: [],
}
