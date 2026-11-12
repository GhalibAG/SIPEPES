/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        musi: { 100: '#E3EEFF', 600: '#1D6FF2', 700: '#1558D6', 800: '#1447B0' },
        koral: { 100: '#FFE3E3', 500: '#FF6B57' },
        ceria: { 100: '#FFF1C9', 400: '#FFC93C', 800: '#8A5300' },
        toska: { 100: '#D5F7F1', 400: '#19D3BD', 800: '#0B6B5E' },
        ungu: { 100: '#EEE9FF', 600: '#6B4BF0', 800: '#5A3FD6' },
        ink: { DEFAULT: '#12213F', soft: '#4A5878', muted: '#5B6885' },
        krem: '#FFF9EF',
        garis: '#ECE6D9',
        abu: { 100: '#ECEFF5' },
        tingkat: {
          berat: '#D93A40', 'berat-bg': '#FFE3E3', 'berat-tx': '#B4232A',
          sedang: '#FFA63D', 'sedang-bg': '#FFF1C9', 'sedang-tx': '#8A5300',
          ringan: '#22B573', 'ringan-bg': '#D5F7F1', 'ringan-tx': '#0B6B5E'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        lembut: '0 8px 24px -8px rgba(18, 33, 63, 0.12)',
        angkat: '0 16px 40px -12px rgba(29, 111, 242, 0.28)'
      },
      transitionTimingFunction: {
        halus: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pantul: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: [],
}
