import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

export const CoverflowSourcing = () => {
  // 5 Curated Global Sourcing Hubs: Italy, China, Malaysia, Vietnam, Bali
  const items = [
    {
      id: '01',
      categoryNumber: '01 — ITALY',
      country: 'Italy',
      region: 'Milan, Brianza & Verona',
      title: 'Carrara Marble & Haute Ateliers',
      subtitle: 'Direct quarry blocks, bookmatched travertine & generational leather tailoring.',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80',
      link: '/sourcing',
      coords: '45.4642° N, 9.1900° E',
      curations: ['Bookmatched Travertine', 'Saddle Leather', 'Murano Glass'],
    },
    {
      id: '02',
      categoryNumber: '02 — CHINA',
      country: 'China',
      region: 'Foshan & Greater Bay Area',
      title: 'Precision 5-Axis CNC Joinery',
      subtitle: 'State-of-the-art extruded architectural bronzes & acoustic structural millwork.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      link: '/sourcing',
      coords: '23.0215° N, 113.1214° E',
      curations: ['Anodized Metals', 'Acoustic Glazing', 'Precision Hardware'],
    },
    {
      id: '03',
      categoryNumber: '03 — MALAYSIA',
      country: 'Malaysia',
      region: 'Selangor & Penang',
      title: 'FSC Plantation Teak & Hardwoods',
      subtitle: 'Vacuum kiln-dried hardwoods seasoned to withstand high subtropical humidity.',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      link: '/sourcing',
      coords: '3.0738° N, 101.5183° E',
      curations: ['Engineered Solid Teak', 'Marine Joinery', 'Balau Woodwork'],
    },
    {
      id: '04',
      categoryNumber: '04 — VIETNAM',
      country: 'Vietnam',
      region: 'Binh Duong & Da Nang',
      title: 'Handcrafted Cane & Ceramic Stoneware',
      subtitle: 'Generational weavers crafting organic weaves, cane panels & sculptural planters.',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      link: '/sourcing',
      coords: '11.0168° N, 106.6663° E',
      curations: ['Hand-Woven Cane', 'Ceramic Vessels', 'Natural Cordage'],
    },
    {
      id: '05',
      categoryNumber: '05 — BALI',
      country: 'Bali',
      region: 'Gianyar & Ubud',
      title: 'Volcanic Basalt & Root Sculptures',
      subtitle: 'Monolithic riverstone basins and raw organic timber root statement artifacts.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      link: '/sourcing',
      coords: '8.5069° S, 115.2625° E',
      curations: ['Basalt Basins', 'Teak Root Carvings', 'Tactile Urns'],
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
      className="relative py-6 sm:py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#E5ECEC]/40 dark:bg-[#0D1C29]/60 border-y border-[#D1DCDE]/70 dark:border-[#1E3447]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Center Heading & Narrative */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-2.5">
            Global Procurement Network
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#131E20] dark:text-[#F5F1E8] tracking-tight leading-tight">
            Sourced Directly from Master Ateliers
          </h2>
          <p className="mt-3 text-base sm:text-lg md:text-xl text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed max-w-xl mx-auto">
            We eliminate trading intermediaries by forging direct agreements with quarries, foundries, and artisans across five key international regions.
          </p>
        </div>

        {/* 3D Coverflow Perspective Stage */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center [perspective:1400px]">
          {/* Circular Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous hub"
            className="absolute left-2 sm:left-6 md:left-10 z-40 w-12 h-12 rounded-full bg-white/95 dark:bg-[#0D1C29]/95 text-[#131E20] dark:text-[#F5F1E8] shadow-xl border border-[#D1DCDE]/70 dark:border-[#1E3447] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Circular Right Navigation Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next hub"
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
                    alt={item.country}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Subtle Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Card Overlay Content: ONLY Country Name */}
                  <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none px-6">
                    <h3 className="font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-white drop-shadow-md">
                      {item.country}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center Pagination Numbers with Active Indicator */}
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
                    layoutId="activeSourcingCoverflowDot"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131E20] dark:bg-[#BCA575] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Global Sourcing CTA Button */}
        <div className="mt-10 text-center">
          <Button to="/sourcing" variant="primary" size="md" showArrow>
            Learn About Our Sourcing Protocols
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoverflowSourcing;
