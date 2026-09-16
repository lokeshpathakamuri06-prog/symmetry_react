import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

export const FinalCta = ({ className = '' }) => {
  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-[#E5ECEC]/30 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] p-8 sm:p-12 lg:p-16 text-center shadow-sm"
      >
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold text-center">
              25+ Years of Expertise &bull; Global Sourcing &bull; Bespoke Interiors &bull; End-to-End Execution
            </span>
            <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal tracking-tight leading-tight">
            Your Space. Our Expertise.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed max-w-xl mx-auto">
            From globally sourced furniture to complete interior execution, we create spaces designed around your vision.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact" variant="primary" size="lg" showArrow>
              Let’s Create Your Space
            </Button>
            <Button to="/projects" variant="secondary" size="lg">
              Explore Our Work
            </Button>
          </div>

          {/* Subtle Atelier Detail */}
          <p className="pt-4 text-xs text-[#6B8083] dark:text-[#8E9CA8] font-light">
            Design Atelier: Road No. 36, Jubilee Hills, Hyderabad &bull; By Appointment
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCta;
