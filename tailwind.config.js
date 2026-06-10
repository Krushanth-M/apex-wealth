/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        appBg: 'var(--bg-color)',
        appCard: 'var(--card-bg)',
        appBorder: 'var(--card-border)',
        appText: 'var(--text-color)',
        appTextSec: 'var(--text-secondary)',
        appPrimary: 'var(--primary)',
        appPrimaryHover: 'var(--primary-hover)',
        appGlow: 'var(--glow)',
        appHoverBg: 'var(--hover-bg)',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
        glassHover: 'var(--card-shadow-hover)',
      }
    },
  },
  plugins: [],
}
