import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import AppleCardWrapper from './AppleCardWrapper';

export const ServiceCard = ({ service }) => {
  return (
    <m.div
      {...reveal()}
      className="h-full"
    >
      <AppleCardWrapper className="group relative p-8 sm:p-10 rounded-3xl bg-surface flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-8">
            <span className="text-3xl sm:text-4xl text-accent font-light">
              {service.number}
            </span>
            <div className="w-10 h-10 rounded-full bg-canvas dark:bg-sunken flex items-center justify-center text-fg group-hover:bg-accent group-hover:text-on-accent dark:group-hover:text-canvas transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-[1.05]" />
            </div>
          </div>

          <span className="text-[11px] uppercase tracking-luxury text-accent font-semibold block mb-2">
            {service.subtitle}
          </span>

          <h3 className="text-2xl sm:text-3xl font-medium text-fg leading-tight mb-4">
            {service.title}
          </h3>

          <p className="text-sm text-muted leading-relaxed font-light mb-6">
            {service.shortDesc}
          </p>
        </div>

        <div className="pt-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-fg group-hover:text-accent transition-colors"
          >
            <span>Explore Capabilities</span>
            <span className="w-4 h-px bg-current transition-all group-hover:w-7" />
          </Link>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ServiceCard;
