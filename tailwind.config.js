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
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.2em',
        'subtle': '0.05em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(19, 30, 32, 0.05)',
        'luxury-hover': '0 30px 60px -15px rgba(19, 30, 32, 0.12)',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'luxury': '16px',
        'card': '20px',
      }
    },
  },
  plugins: [],
}
