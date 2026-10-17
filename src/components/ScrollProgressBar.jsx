import React from 'react';
import { m, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress line at the very top of the window (Journal articles only). */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[1001] pointer-events-none bg-accent"
    />
  );
};

export default ScrollProgressBar;
