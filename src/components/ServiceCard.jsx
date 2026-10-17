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
      <AppleCardWrapper className="p-8 sm:p-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-8">
            <span className="text-[40px] sm:text-[48px] font-semibold tracking-tight text-fg/15 leading-none">
              {service.number}
            </span>
            <div className="w-10 h-10 rounded-full bg-canvas dark:bg-sunken flex items-center justify-center text-fg group-hover:bg-accent group-hover:text-on-accent dark:group-hover:text-canvas transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-[1.05]" />
            </div>
          </div>

          <span className="text-[14px] text-accent font-semibold block mb-1.5">
            {service.subtitle}
          </span>

          <h3 className="text-[24px] sm:text-[28px] font-semibold tracking-tight text-fg leading-tight mb-3">
            {service.title}
          </h3>

          <p className="text-[15px] text-muted leading-relaxed mb-6">
            {service.shortDesc}
          </p>
        </div>

        <div className="pt-6">
          <Link
            to="/services"
            className="link-apple !text-[15px]"
          >
            <span>Explore Capabilities</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ServiceCard;
