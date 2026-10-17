import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { m } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '', onPhoto = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${onPhoto ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-fg/80 hover:text-fg hover:bg-fg/[0.06]'} ${className}`}
    >
      <m.span
        key={theme}
        initial={{ rotate: -60, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.28, 0.11, 0.32, 1] }}
        className="inline-flex"
      >
        {isDark ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.8} /> : <Moon className="w-[18px] h-[18px]" strokeWidth={1.8} />}
      </m.span>
    </button>
  );
};

export default ThemeToggle;
