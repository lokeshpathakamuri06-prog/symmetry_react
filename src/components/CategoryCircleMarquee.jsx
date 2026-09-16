import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { shopCategories } from '../data/categories';

export const CategoryCircleMarquee = () => {
  const scrollRef = useRef(null);
  // Double items array for seamless 50% loop with 33% fewer DOM nodes
  const loopedCategories = [...shopCategories, ...shopCategories];

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-4 group/marquee">
      {/* Soft edge gradient masks for luxury fade-in / fade-out */}
      <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#F4F7F6] dark:from-[#07121C] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#F4F7F6] dark:from-[#07121C] to-transparent z-10 pointer-events-none" />

      {/* Manual Scroll Buttons for quick exploration */}
      <button
        onClick={handleScrollLeft}
        aria-label="Scroll left"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-[#0D1C29]/90 backdrop-blur-md border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] shadow-md flex items-center justify-center opacity-0 group-hover/marquee:opacity-100 transition-opacity cursor-pointer hover:bg-[#36656B] hover:text-white dark:hover:bg-[#BCA575] dark:hover:text-[#07121C]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleScrollRight}
        aria-label="Scroll right"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-[#0D1C29]/90 backdrop-blur-md border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] shadow-md flex items-center justify-center opacity-0 group-hover/marquee:opacity-100 transition-opacity cursor-pointer hover:bg-[#36656B] hover:text-white dark:hover:bg-[#BCA575] dark:hover:text-[#07121C]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Smooth Marquee Track */}
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
        <div className="animate-marquee-circle gap-8 sm:gap-12 cursor-pointer py-2">
          {loopedCategories.map((cat, idx) => (
            <Link
              key={`${cat.id}-${idx}`}
              to={`/shop?category=${cat.slug}`}
              className="group/item flex flex-col items-center text-center shrink-0 w-44 sm:w-52 transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circular Image Container */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 border border-[#D1DCDE] dark:border-[#1E3447] group-hover/item:border-[#36656B] dark:group-hover/item:border-[#BCA575] bg-white dark:bg-[#0D1C29] shadow-sm group-hover/item:shadow-luxury transition-all duration-400 mb-3">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                    }}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/item:scale-108"
                  />
                </div>

                {/* Pill Badge with Item Count */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white dark:bg-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] text-[10px] sm:text-xs uppercase tracking-luxury font-medium text-[#36656B] dark:text-[#BCA575] shadow-xs whitespace-nowrap">
                  {cat.itemCount}
                </div>
              </div>

              {/* Title & Short Description */}
              <h3 className="text-base sm:text-lg font-serif text-[#131E20] dark:text-[#F5F1E8] group-hover/item:text-[#36656B] dark:group-hover/item:text-[#BCA575] transition-colors leading-snug">
                {cat.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] mt-1 font-light leading-relaxed line-clamp-2 max-w-[190px]">
                {cat.description}
              </p>

              <span className="mt-1.5 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1">
                <span>Explore</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCircleMarquee;
