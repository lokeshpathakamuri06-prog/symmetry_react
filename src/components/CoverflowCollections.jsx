import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoverflowCollections = () => {
  // 6 Curated collections: Living, Dining, Bedroom, Lounge, Office, Outdoor
  const items = [
    {
      id: '01',
      categoryNumber: '01 — LIVING',
      title: 'Luna Sofa',
      subtitle: 'A sculptural form for everyday comfort.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=living',
    },
    {
      id: '02',
      categoryNumber: '02 — DINING',
      title: 'Aurelia Table',
      subtitle: 'Where conversations feel at home.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=dining',
    },
    {
      id: '03',
      categoryNumber: '03 — BEDROOM',
      title: 'Nuvola Bed',
      subtitle: 'Sanctuary crafted for restful stillness.',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=bedroom',
    },
    {
      id: '04',
      categoryNumber: '04 — LOUNGE',
      title: 'Elysian Chair',
      subtitle: 'Designed for moments of quiet reflection.',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=lounge',
    },
    {
      id: '05',
      categoryNumber: '05 — OFFICE',
      title: 'Kyoto Desk',
      subtitle: 'Precision workspaces engineered for clarity.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=office',
    },
    {
      id: '06',
      categoryNumber: '06 — OUTDOOR',
      title: 'Pavilion Teak',
      subtitle: 'All-weather architectural comfort.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      link: '/shop?category=outdoor',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;

  // Auto-scroll / Auto-advance interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3600);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      className="relative py-4 sm:py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Clean Center Heading & Short Headline Above Cards */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-2.5">
            Our Featured Collection
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#131E20] dark:text-[#F5F1E8] tracking-tight leading-tight">
            Designs That Inspire Living
          </h2>
          <p className="mt-3 text-base sm:text-lg md:text-xl text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed max-w-xl mx-auto">
            Curated furniture pieces for modern spaces, crafted to last.
          </p>
        </div>

        {/* 3D Coverflow Perspective Stage */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center [perspective:1400px]">
          {/* Circular Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous card"
            className="absolute left-2 sm:left-6 md:left-10 z-40 w-12 h-12 rounded-full bg-white/95 dark:bg-[#0D1C29]/95 text-[#131E20] dark:text-[#F5F1E8] shadow-xl border border-[#D1DCDE]/70 dark:border-[#1E3447] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Circular Right Navigation Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next card"
            className="absolute right-2 sm:right-6 md:right-10 z-40 w-12 h-12 rounded-full bg-white/95 dark:bg-[#0D1C29]/95 text-[#131E20] dark:text-[#F5F1E8] shadow-xl border border-[#D1DCDE]/70 dark:border-[#1E3447] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {items.map((item, index) => {
              // Calculate circular offset relative to activeIndex
              let offset = index - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // 3D perspective positioning
              const xTranslate = offset * 230; // horizontal separation
              const zTranslate = -Math.abs(offset) * 110; // depth pushback
              const yRotate = offset > 0 ? -22 : offset < 0 ? 22 : 0; // 3D perspective angle
              const scale = 1 - Math.abs(offset) * 0.12; // perspective scale
              const zIndex = 30 - Math.abs(offset) * 5; // stacking order
              const opacity = 1 - Math.abs(offset) * 0.22; // subtle fade for adjacent cards

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    x: xTranslate,
                    z: zTranslate,
                    rotateY: yRotate,
                    scale: scale,
                    opacity: opacity,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  className={`absolute w-[290px] sm:w-[350px] md:w-[400px] h-[440px] sm:h-[500px] md:h-[560px] rounded-[32px] overflow-hidden cursor-pointer select-none transition-shadow ${
                    isCenter
                      ? 'shadow-[0_25px_60px_-15px_rgba(19,30,32,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-black/5'
                      : 'shadow-xl'
                  }`}
                >
                  {/* Card Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Gradient Overlay for Text Legibility */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isCenter
                        ? 'bg-gradient-to-t from-black/80 via-black/25 to-black/30'
                        : 'bg-gradient-to-t from-black/85 via-black/45 to-black/30'
                    }`}
                  />

                  {/* Card Content Top: Category Number, Title, Subtitle */}
                  <div className="absolute top-7 inset-x-7 text-white pointer-events-none">
                    <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#A7C3C6] font-semibold block mb-2">
                      {item.categoryNumber}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 mt-1.5 font-light leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Card Bottom: Centered "VIEW PRODUCT →" Pill Button */}
                  <div className="absolute bottom-7 inset-x-0 flex items-center justify-center px-6">
                    <Link
                      to={item.link}
                      onClick={(e) => {
                        if (!isCenter) {
                          e.preventDefault();
                          setActiveIndex(index);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/95 dark:bg-[#07121C]/95 backdrop-blur-md text-[#131E20] dark:text-[#F5F1E8] text-xs sm:text-sm font-semibold uppercase tracking-luxury shadow-lg hover:bg-[#36656B] hover:text-white dark:hover:bg-[#BCA575] dark:hover:text-[#07121C] transition-colors"
                    >
                      <span>View Product</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Clean Center Pagination Numbers with Active Indicator */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-[#D1DCDE]/50 dark:border-[#1E3447] flex items-center justify-center gap-6 sm:gap-8 font-mono text-sm sm:text-base">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative py-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#131E20] dark:text-[#F5F1E8] font-bold'
                    : 'text-[#4F6467]/60 dark:text-[#AEB7BE]/60 hover:text-[#131E20]'
                }`}
              >
                <span>{item.id}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeCoverflowDot"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131E20] dark:bg-[#BCA575] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoverflowCollections;
