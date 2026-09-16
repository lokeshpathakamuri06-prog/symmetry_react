import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/testimonials';

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 sm:p-14 lg:p-20 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-luxury overflow-hidden">
        <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-[#36656B]/10 dark:text-[#BCA575]/10 absolute -top-4 -right-4 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col justify-between min-h-[220px]"
          >
            {/* Stars */}
            <div className="flex items-center gap-1.5 text-[#36656B] dark:text-[#BCA575] mb-6">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#131E20] dark:text-[#F5F1E8] font-normal leading-relaxed italic mb-8">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-[#D1DCDE]/50 dark:border-[#1E3447]">
              {current.avatar && (
                <img
                  src={current.avatar}
                  alt={current.author}
                  className="w-12 h-12 rounded-full object-cover border border-[#D1DCDE] dark:border-[#1E3447]"
                />
              )}
              <div>
                <h4 className="text-lg sm:text-xl font-medium text-[#131E20] dark:text-[#F5F1E8]">
                  {current.author}
                </h4>
                <p className="text-xs sm:text-sm text-[#36656B] dark:text-[#BCA575] uppercase tracking-luxury font-medium">
                  {current.role} &bull; {current.project}
                </p>
                <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] mt-0.5">
                  {current.location}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-between mt-8 pt-4">
          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? 'w-8 bg-[#36656B] dark:bg-[#BCA575]'
                    : 'w-2 bg-[#D1DCDE] dark:bg-[#1E3447]'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] hover:text-[#36656B] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] hover:text-[#36656B] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
