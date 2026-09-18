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
        sym: {
          bg: {
            DEFAULT: '#F4F7F6',
            dark: '#07121C',
          },
          surface: {
            DEFAULT: '#FFFFFF',
            dark: '#0D1C29',
          },
          secondary: {
            DEFAULT: '#E5ECEC',
            dark: '#132838',
          },
          primary: {
            DEFAULT: '#131E20',
            dark: '#F5F1E8',
          },
          muted: {
            DEFAULT: '#4F6467',
            dark: '#AEB7BE',
          },
          accent: {
            DEFAULT: '#36656B',
            dark: '#BCA575',
            hover: '#254B50',
            light: '#A7C3C6',
          },
          border: {
            DEFAULT: '#D1DCDE',
            dark: '#1E3447',
          }
        }
      },
      fontFamily: {
        serif: ['"Inter"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.15em',
        'subtle': '0.05em',
      },
      boxShadow: {
        'apple': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'apple-dark': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'apple-dark-hover': '0 20px 45px rgba(0, 0, 0, 0.55)',
        'luxury': '0 12px 32px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 24px 48px rgba(0, 0, 0, 0.08)',
        'luxury-dark': '0 12px 32px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        'luxury': '16px',
        'card': '20px',
      }
    },
  },
  plugins: [],
}
