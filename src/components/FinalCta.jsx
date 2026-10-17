import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import TextReveal from './motion/TextReveal';

/** Closing call to action: a black band with one big line and two actions (Home, About, Services) */
export const FinalCta = ({ className = '' }) => (
  <section className={`band-dark section text-center ${className}`}>
    <div className="site-container max-w-3xl">
      <m.p {...reveal()} className="eyebrow mb-4 !text-[15px] justify-center flex-wrap">
        25+ Years of Expertise &bull; Global Sourcing &bull; Bespoke Interiors &bull; End-to-End Execution
      </m.p>
      <TextReveal as="h2" className="text-display-xl text-fg" text="Your Space." accent="Our Expertise." />
      <m.p {...reveal({ order: 2 })} className="lede mt-6 max-w-xl mx-auto">
        From globally sourced furniture to complete interior execution, we create spaces designed around your vision.
      </m.p>
      <m.div {...reveal({ order: 3 })} className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link to="/contact" className="btn-primary">Let’s Create Your Space</Link>
        <Link to="/projects" className="btn-secondary">Explore Our Work</Link>
      </m.div>
      <m.p {...reveal({ order: 4 })} className="mt-8 text-[13px] text-subtle">Studio visits in Hyderabad by appointment</m.p>
    </div>
  </section>
);

export default FinalCta;
