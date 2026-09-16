import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServiceCard = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] dark:hover:border-[#BCA575] transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-luxury"
    >
      <div>
        <div className="flex items-start justify-between mb-8">
          <span className="font-serif text-3xl sm:text-4xl text-[#36656B] dark:text-[#BCA575] font-light">
            {service.number}
          </span>
          <div className="w-10 h-10 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center text-[#131E20] dark:text-[#F5F1E8] group-hover:bg-[#131E20] group-hover:text-white dark:group-hover:bg-[#BCA575] dark:group-hover:text-[#07121C] transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
          </div>
        </div>

        <span className="text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-2">
          {service.subtitle}
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight mb-4">
          {service.title}
        </h3>

        <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light mb-6">
          {service.shortDesc}
        </p>
      </div>

      <div className="pt-6 border-t border-[#D1DCDE]/50 dark:border-[#1E3447]/60">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors"
        >
          <span>Explore Capabilities</span>
          <span className="w-4 h-px bg-current transition-all group-hover:w-7" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
