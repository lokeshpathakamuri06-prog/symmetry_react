import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';

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
        <m.span {...reveal()} className={`eyebrow mb-3 ${light ? '!text-[#D9C59A]' : ''}`}>
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
        <m.p
          {...reveal({ order: 2 })}
          className={`mt-4 sm:mt-5 text-[17px] sm:text-[19px] leading-relaxed ${light ? 'text-white/75' : 'text-muted'}`}
        >
          {subtitle}
        </m.p>
      )}
    </div>
  );
};

export default SectionHeading;
