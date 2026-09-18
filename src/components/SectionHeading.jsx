import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
  className = '',
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignClasses[align]} ${className}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />
          <span
            className={`text-xs sm:text-sm uppercase tracking-luxury font-medium ${
              light
                ? 'text-[#BCA575]'
                : 'text-[#36656B] dark:text-[#BCA575]'
            }`}
          >
            {eyebrow}
          </span>
          {align === 'center' && <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />}
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] ${
            light ? 'text-[#F5F1E8]' : 'text-[#131E20] dark:text-[#F5F1E8]'
          }`}
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-4 text-base sm:text-lg md:text-xl leading-relaxed font-light ${
            light ? 'text-[#AEB7BE]' : 'text-[#4F6467] dark:text-[#AEB7BE]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
