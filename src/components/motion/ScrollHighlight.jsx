import React, { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Apple-style statement paragraph: words start faint and brighten one by one as the
 * paragraph moves up the screen. Reduced motion shows the finished text.
 *
 *   <ScrollHighlight className="text-display-md" text="Symmetry Interiors & Building Solutions…" />
 */
export const ScrollHighlight = ({ text = '', className = '', as = 'p' }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = String(text).split(/\s+/).filter(Boolean);
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={reduce}>
            {w}
          </Word>
        ))}
      </span>
    </Tag>
  );
};

const Word = ({ children, progress, range, still }) => {
  const opacity = useTransform(progress, [0, range[0], range[1], 1], [0.18, 0.18, 1, 1]);
  return (
    <>
      <m.span style={{ opacity: still ? 1 : opacity }}>{children}</m.span>{' '}
    </>
  );
};

export default ScrollHighlight;
