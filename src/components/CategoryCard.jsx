import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AppleCardWrapper from './AppleCardWrapper';

export const CategoryCard = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <AppleCardWrapper className="group relative aspect-[4/5] rounded-3xl overflow-hidden block bg-[#E5ECEC] dark:bg-[#132838]">
        <Link to={`/shop?category=${category.slug}`} className="block w-full h-full relative">
          <img
            src={category.image}
            alt={category.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            }}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
          
          {/* Apple Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07121C]/90 via-[#07121C]/35 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

          {/* Top Pill Badge */}
          <div className="absolute top-5 left-5 z-20">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-luxury text-[#F4F7F6] bg-black/40 backdrop-blur-md font-semibold shadow-sm">
              {category.itemCount ? `${category.itemCount} Designs` : 'Curated Collection'}
            </span>
          </div>

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20">
            <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-semibold mb-1.5">
              Architectural Archetype
            </span>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F1E8] leading-tight group-hover:text-white transition-colors">
                {category.name}
              </h3>
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-[#F5F1E8] flex items-center justify-center group-hover:bg-[#BCA575] group-hover:text-[#07121C] group-hover:scale-110 transition-all duration-300 shrink-0">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
            <p className="text-xs text-[#F5F1E8]/75 mt-2 line-clamp-2 font-normal leading-relaxed">
              {category.description}
            </p>
          </div>
        </Link>
      </AppleCardWrapper>
    </motion.div>
  );
};

export default CategoryCard;

