import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useTestimonials } from '../context/PublicContentContext';
import SmartImage from './SmartImage';

export const TestimonialCarousel = () => {
  const { items: testimonials } = useTestimonials();
  if (testimonials.length === 0) return null;
  return <TestimonialCarouselView testimonials={testimonials} />;
};

const TestimonialCarouselView = ({ testimonials }) => {
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
      <div className="relative p-8 sm:p-14 lg:p-20 rounded-3xl bg-surface border border-line shadow-luxury overflow-hidden">
        <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-accent/10 absolute -top-4 -right-4 pointer-events-none" />

        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col justify-between min-h-[220px]"
          >
            {/* Stars */}
            <div className="flex items-center gap-1.5 text-accent mb-6">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-fg font-normal leading-relaxed italic mb-8">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-line/50 dark:border-line">
              {current.avatar && (
                <SmartImage sizes="96px"
                  src={current.avatar}
                  alt={current.author}
                  className="w-12 h-12 rounded-full object-cover border border-line"
                />
              )}
              <div>
                <h4 className="text-lg sm:text-xl font-medium text-fg">
                  {current.author}
                </h4>
                <p className="text-xs sm:text-sm text-accent uppercase tracking-luxury font-medium">
                  {current.role} &bull; {current.project}
                </p>
                <p className="text-xs sm:text-sm text-muted mt-0.5">
                  {current.location}
                </p>
              </div>
            </div>
          </m.div>
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
                    ? 'w-8 bg-accent'
                    : 'w-2 bg-line'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-full border border-line text-fg hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="p-2.5 rounded-full border border-line text-fg hover:border-accent hover:text-accent transition-colors"
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
