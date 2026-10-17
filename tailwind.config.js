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
        adm: {
          bg: 'rgb(var(--adm-bg) / <alpha-value>)',
          surface: 'rgb(var(--adm-surface) / <alpha-value>)',
          surface2: 'rgb(var(--adm-surface-2) / <alpha-value>)',
          border: 'rgb(var(--adm-border) / <alpha-value>)',
          fg: 'rgb(var(--adm-fg) / <alpha-value>)',
          muted: 'rgb(var(--adm-muted) / <alpha-value>)',
          accent: 'rgb(var(--adm-accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--adm-accent-hover) / <alpha-value>)',
          'on-accent': 'rgb(var(--adm-on-accent) / <alpha-value>)',
        },
        // Website theme tokens: values live in src/index.css (:root and .dark)
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        sunken: 'rgb(var(--c-sunken) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        subtle: 'rgb(var(--c-subtle) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          hover: 'rgb(var(--c-accent-hover) / <alpha-value>)',
        },
        'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
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
        serif: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        display: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        sans: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        // No typewriter faces on the site: "mono" labels use Inter with tabular figures (see index.css)
        mono: ['"Inter Variable"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        // Small capitals labels: restrained, Apple-like spacing used site-wide
        'luxury': '0.09em',
        'subtle': '0.04em',
        'tight': '-0.022em',
        'tighter': '-0.035em',
      },
      fontWeight: {
        // Inter variable: Apple-style headings sit between semibold and bold; body text never goes thin
        light: '380',
        bold: '640',
      },
      fontSize: {
        // Fluid display sizes for page and section headlines
        'display-xl': ['clamp(2.75rem, 6.4vw, 5.75rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '640' }],
        'display-lg': ['clamp(2.25rem, 4.8vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '640' }],
        'display-md': ['clamp(1.875rem, 3.4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '640' }],
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.28, 0.11, 0.32, 1)',
      },
      boxShadow: {
        // Softer, wider shadows (Apple-style) for every card that uses the Tailwind defaults
        'lg': '0 2px 6px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 0, 0, 0.05)',
        'xl': '0 2px 8px rgba(0, 0, 0, 0.03), 0 16px 44px rgba(0, 0, 0, 0.07)',
        '2xl': '0 4px 12px rgba(0, 0, 0, 0.04), 0 28px 70px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 2px rgba(0, 0, 0, 0.03), 0 6px 24px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 2px 6px rgba(0, 0, 0, 0.04), 0 22px 50px rgba(0, 0, 0, 0.10)',
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
        'card': '22px',
        'panel': '28px',
      }
    },
  },
  plugins: [],
}
