import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CategoryCard = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden block bg-[#E5ECEC] dark:bg-[#132838]"
    >
      <Link to={`/shop?category=${category.slug}`} className="block w-full h-full">
        <img
          src={category.image}
          alt={category.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
          }}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07121C]/90 via-[#07121C]/40 to-transparent" />

        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
          <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-semibold mb-2">
            {category.itemCount} Designs
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F1E8] font-normal leading-tight">
              {category.name}
            </h3>
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5F1E8] flex items-center justify-center group-hover:bg-[#BCA575] group-hover:text-[#07121C] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#F5F1E8]/70 mt-2 line-clamp-2 font-light">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
