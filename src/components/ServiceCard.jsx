import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AppleCardWrapper from './AppleCardWrapper';

export const ServiceCard = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <AppleCardWrapper className="group relative p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0D1C29] flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-8">
            <span className="text-3xl sm:text-4xl text-[#36656B] dark:text-[#BCA575] font-light">
              {service.number}
            </span>
            <div className="w-10 h-10 rounded-full bg-[#F4F7F6] dark:bg-[#132838] flex items-center justify-center text-[#131E20] dark:text-[#F5F1E8] group-hover:bg-[#36656B] group-hover:text-white dark:group-hover:bg-[#BCA575] dark:group-hover:text-[#07121C] transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
          </div>

          <span className="text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-2">
            {service.subtitle}
          </span>

          <h3 className="text-2xl sm:text-3xl font-medium text-[#131E20] dark:text-[#F5F1E8] leading-tight mb-4">
            {service.title}
          </h3>

          <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light mb-6">
            {service.shortDesc}
          </p>
        </div>

        <div className="pt-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors"
          >
            <span>Explore Capabilities</span>
            <span className="w-4 h-px bg-current transition-all group-hover:w-7" />
          </Link>
        </div>
      </AppleCardWrapper>
    </motion.div>
  );
};

export default ServiceCard;
