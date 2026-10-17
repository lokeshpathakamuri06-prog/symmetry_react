import React from 'react';
import { m } from 'framer-motion';
import { ease, VIEWPORT } from '../lib/motion';

/**
 * ScribbleUnderline
 * Inspired by 21oaks.org's [data-scribble] dynamic SVG stroke reveal on scroll
 */
export const ScribbleUnderline = ({ children, className = '', color = '#36656B' }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-3 sm:h-4.5 overflow-visible pointer-events-none z-0"
        viewBox="0 0 200 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <m.path
          d="M2 11C45 4 155 3 198 12C140 7 70 8 3 14"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={{ ...VIEWPORT, amount: 0.8 }}
          transition={{ duration: 0.9, ease: ease.out, delay: 0.2 }}
        />
      </svg>
    </span>
  );
};

export default ScribbleUnderline;
