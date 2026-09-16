import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none bg-gradient-to-r from-[#36656B] via-[#8AB3B8] to-[#BCA575] shadow-[0_0_12px_rgba(54,101,107,0.6)]"
    />
  );
};

export default ScrollProgressBar;
