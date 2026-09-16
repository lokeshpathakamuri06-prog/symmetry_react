import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] flex flex-col justify-between shadow-sm relative"
    >
      <Quote className="w-8 h-8 text-[#36656B]/20 dark:text-[#BCA575]/20 absolute top-6 right-6" />

      <div>
        {/* 5-star rating */}
        <div className="flex items-center gap-1 mb-6 text-[#36656B] dark:text-[#BCA575]">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>

        {/* Quote */}
        <p className="font-serif text-lg sm:text-xl text-[#131E20] dark:text-[#F5F1E8] font-normal leading-relaxed italic mb-8">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Author Details */}
      <div className="flex items-center gap-3 pt-6 border-t border-[#D1DCDE]/50 dark:border-[#1E3447]/60">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-11 h-11 rounded-full object-cover border border-[#D1DCDE] dark:border-[#1E3447]"
        />
        <div>
          <h4 className="text-sm font-medium text-[#131E20] dark:text-[#F5F1E8]">
            {testimonial.author}
          </h4>
          <p className="text-xs text-[#36656B] dark:text-[#BCA575]">
            {testimonial.role} &bull; {testimonial.project}
          </p>
          <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
            {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
