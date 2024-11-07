/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50, #fff1f2)',
          100: 'var(--primary-100, #ffe4e6)',
          200: 'var(--primary-200, #fecdd3)',
          300: 'var(--primary-300, #fda4af)',
          400: 'var(--primary-400, #fb7185)',
          500: 'var(--primary-500, #f43f5e)',
          600: 'var(--primary-600, #e11d48)',
          700: 'var(--primary-700, #be123c)',
          800: 'var(--primary-800, #9f1239)',
          900: 'var(--primary-900, #881337)',
        },
        secondary: {
          50: 'var(--secondary-50, #f0f9ff)',
          100: 'var(--secondary-100, #e0f2fe)',
          200: 'var(--secondary-200, #bae6fd)',
          300: 'var(--secondary-300, #7dd3fc)',
          400: 'var(--secondary-400, #38bdf8)',
          500: 'var(--secondary-500, #0ea5e9)',
          600: 'var(--secondary-600, #0284c7)',
          700: 'var(--secondary-700, #0369a1)',
          800: 'var(--secondary-800, #075985)',
          900: 'var(--secondary-900, #0c4a6e)',
        },
      },
      borderRadius: {
        'bubble': '30px',
      },
    },
  },
  plugins: [],
};