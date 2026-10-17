import React from 'react';
import { m } from 'framer-motion';
import { ease, VIEWPORT } from '../../lib/motion';

/**
 * Headline whose words rise into place one after another when it scrolls into view.
 * Screen readers get the plain text; reduced motion keeps only a fade (MotionConfig).
 *
 *   <TextReveal as="h2" className="text-display-xl" text="Where Vision Meets" accent="Timeless Design" />
 */
export const TextReveal = ({ as = 'h2', text = '', accent, className = '', accentClassName = 'text-accent', id }) => {
  const Tag = m[as] || m.h2;
  const words = [
    ...String(text).split(/\s+/).filter(Boolean).map((w) => ({ w, accent: false })),
    ...String(accent || '').split(/\s+/).filter(Boolean).map((w) => ({ w, accent: true })),
  ];
  return (
    <Tag
      id={id}
      className={className}
      aria-label={[text, accent].filter(Boolean).join(' ')}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      {words.map(({ w, accent: isAccent }, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <m.span
            className={`inline-block ${isAccent ? accentClassName : ''}`}
            variants={{ hidden: { y: '100%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: ease.out } } }}
          >
            {w}
          </m.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
