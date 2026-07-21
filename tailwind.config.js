/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bgBase: 'var(--theme-bg-base)',
          bgPanel: 'var(--theme-bg-panel)',
          bgHover: 'var(--theme-bg-hover)',
          textMain: 'var(--theme-text-main)',
          textSub: 'var(--theme-text-sub)',
          border: 'var(--theme-border)',
        }
      }
    },
  },
  plugins: [],
}