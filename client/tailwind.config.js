/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet Resmi SIPEPES
        river: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          500: '#0EA5E9',
          600: '#0284C7', // Primary Brand
          700: '#0369A1',
          800: '#075985',
        },
        eco: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A', // Secondary Green (Green Generation)
          700: '#15803D',
        },
        pollution: {
          light: '#059669',    // Ringan (Emerald)
          moderate: '#D97706', // Sedang (Amber)
          severe: '#DC2626',   // Berat (Red)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
