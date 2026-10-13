import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBanners, useSiteText } from '../context/PublicContentContext';
import { heroImage } from '../lib/staticImages';
import { cloudinaryUrl, isCloudinary, srcSet } from '../lib/images';

// Slideshow photos come from admin "Hero Banners" (active + published, in admin order).
// The headline and buttons come from Page Content > Home. These local photos are only a fallback.
const FALLBACK_SLIDES = [
  { id: 'hero-1', title: 'HAJ0025 Architecture', image: '/images/hero/hero-haj-slide-1.jpeg' },
  { id: 'hero-2', title: 'HAJ0026 Interior', image: '/images/hero/hero-haj-slide-2.jpeg' },
  { id: 'hero-3', title: 'HAJ0035 Living Pavilion', image: '/images/hero/hero-haj-slide-3.jpeg' },
];

const HERO_WIDTHS = [800, 1280, 1600, 2048, 2560];

const slideImage = (src) => {
  if (isCloudinary(src)) return { src: cloudinaryUrl(src, { width: 1600 }), srcSet: srcSet(src, HERO_WIDTHS), sizes: '100vw' };
  if (src.startsWith('/images/')) return heroImage(src);
  return { src };
};

export const Hero = () => {
  const text = useSiteText('home');
  const banners = useBanners().filter((b) => b.image);
  const slides = banners.length ? banners : FALLBACK_SLIDES;
  const [slideIndex, setSlideIndex] = useState(0);
  const currentImageIndex = slideIndex % slides.length;
  const slide = slides[currentImageIndex];

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-advance hero background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] sm:min-h-[720px] w-full bg-[#07121C] overflow-hidden flex flex-col justify-between select-none">
      {/* =========================================================================
          1. FULL-BLEED HERO BACKGROUND IMAGE SLIDESHOW LAYER (admin Hero Banners)
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={slide.id}
            {...slideImage(slide.image)}
            fetchPriority={currentImageIndex === 0 ? 'high' : undefined}
            alt={slide.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>

        {/* Ambient Dark Luxury Gradient Vignette Overlay for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07121C]/90 via-[#07121C]/45 to-[#07121C]/60" />
      </div>

      {/* Hero Main Copy Layer */}
      <div className="relative z-10 pt-24 sm:pt-28 px-6 sm:px-12 flex flex-col justify-center items-center h-full max-w-[1632px] mx-auto w-full text-center">
        {/* Center Hero Copy Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl text-white leading-[1.08] tracking-tight font-bold mb-4 sm:mb-6 drop-shadow-md">
            {text.heroTitle} <span className="text-[#BCA575] font-bold">{text.heroTitleHighlight}</span>
          </h1>
          <p className="text-base sm:text-xl text-white/90 font-normal leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow-sm">
            {text.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('projects-section')}
              className="px-8 py-3.5 rounded-full bg-white text-[#131E20] hover:bg-[#36656B] hover:text-white transition-all duration-300 text-xs uppercase tracking-luxury font-semibold shadow-lg cursor-pointer"
            >
              {text.heroPrimaryCta}
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all duration-300 text-xs uppercase tracking-luxury font-semibold cursor-pointer shadow-md"
            >
              {text.heroSecondaryCta}
            </button>
          </div>
        </motion.div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-8 flex items-center justify-center gap-2">
          {slides.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentImageIndex === idx
                  ? 'w-8 bg-[#BCA575]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
