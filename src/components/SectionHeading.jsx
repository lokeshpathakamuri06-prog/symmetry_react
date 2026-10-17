import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';

/**
 * Section opening, Apple style: a short coloured line, a big semibold headline,
 * and a lead paragraph. `light` is for photos and black bands (white text).
 */
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
        <m.span {...reveal()} className={`eyebrow mb-2 sm:mb-3 ${light ? '!text-[#D9C59A]' : ''}`}>
          {eyebrow}
        </m.span>
      )}

      {title && (
        <m.h2
          {...reveal({ order: 1 })}
          className={titleClassName || `text-display-lg ${light ? 'text-white' : 'text-fg'}`}
        >
          {title}
        </m.h2>
      )}

      {subtitle && (
        <m.p {...reveal({ order: 2 })} className={`lede mt-4 sm:mt-5 ${light ? '!text-white/75' : ''}`}>
          {subtitle}
        </m.p>
      )}
    </div>
  );
};

export default SectionHeading;
