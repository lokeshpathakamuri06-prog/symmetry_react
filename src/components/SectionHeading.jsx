import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.28, 0.11, 0.32, 1];
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, delay, ease },
});

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
  className = '',
  titleClassName = '',
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignClasses[align]} ${className}`}>
      {eyebrow && (
        <motion.span {...reveal(0)} className={`eyebrow mb-3 ${light ? '!text-[#D9C59A]' : ''}`}>
          {eyebrow}
        </motion.span>
      )}

      {title && (
        <motion.h2
          {...reveal(0.06)}
          className={titleClassName || `text-display-lg ${light ? 'text-white' : 'text-fg'}`}
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          {...reveal(0.12)}
          className={`mt-4 sm:mt-5 text-[17px] sm:text-[19px] leading-relaxed ${light ? 'text-white/75' : 'text-muted'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
