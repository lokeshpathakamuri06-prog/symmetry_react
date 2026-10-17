import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import Button from './Button';

export const FinalCta = ({ className = '' }) => {
  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 ${className}`}>
      <m.div
        {...reveal()}
        className="rounded-3xl bg-sunken/30 dark:bg-surface border border-line p-8 sm:p-12 lg:p-16 text-center shadow-sm"
      >
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-luxury text-accent font-semibold text-center">
              25+ Years of Expertise &bull; Global Sourcing &bull; Bespoke Interiors &bull; End-to-End Execution
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg tracking-tight leading-tight">
            Your Space. Our Expertise.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted font-light leading-relaxed max-w-xl mx-auto">
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
          <p className="pt-4 text-xs text-subtle font-light">
            Studio visits in Hyderabad by appointment
          </p>
        </div>
      </m.div>
    </section>
  );
};

export default FinalCta;
