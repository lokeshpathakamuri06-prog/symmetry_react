import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { scrollToTarget } from '../lib/scroll';
import { ease, enter } from '../lib/motion';
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
  // Banners with a page set (Admin → Page Banners) belong to other pages
  const banners = useBanners().items.filter((b) => b.image && !b.badge);
  const slides = banners.length ? banners : FALLBACK_SLIDES;
  const [slideIndex, setSlideIndex] = useState(0);
  const currentImageIndex = slideIndex % slides.length;
  const slide = slides[currentImageIndex];

  const scrollToSection = (id) => scrollToTarget(document.getElementById(id));

  // Auto-advance hero background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] sm:min-h-[720px] w-full bg-black overflow-hidden select-none">
      {/* Slideshow photos (admin Hero Banners) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* initial={false}: the first photo is on screen at once (it is the page's main image);
            later slides cross-fade in with a slow settle from a slight zoom */}
        <AnimatePresence mode="popLayout" initial={false}>
          <m.img
            key={slide.id}
            {...slideImage(slide.image)}
            fetchPriority={currentImageIndex === 0 ? 'high' : undefined}
            alt={slide.title}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2, ease: ease.apple }, scale: { duration: 6, ease: ease.out } }}
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>
        {/* Directional scrims: darken only where the text sits, so the photo stays bright and true.
            Phones: the copy spans the width, so shade from the bottom. Desktop: shade from the left. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent sm:from-black/45 sm:via-black/5" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        {/* Light shade under the transparent navigation bar */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      {/* Copy */}
      <div className="relative z-10 h-full site-container flex flex-col justify-end pb-24 sm:pb-28">
        <div className="max-w-3xl">
          <m.p {...enter({ variant: 'fadeIn' })} className="text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] uppercase text-white/90 mb-4 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
            Symmetry Interiors
          </m.p>
          <h1 className="text-display-xl text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.25)]">
            {text.heroTitle} <span className="text-[#D9C59A]">{text.heroTitleHighlight}</span>
          </h1>
          <m.p {...enter({ order: 1 })} className="mt-5 text-[18px] sm:text-[21px] text-white/90 leading-[1.5] max-w-2xl [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]">
            {text.heroSubtitle}
          </m.p>
          <m.div {...enter({ order: 2 })} className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => scrollToSection('projects-section')} className="btn-light cursor-pointer">
              {text.heroPrimaryCta}
            </button>
            <button type="button" onClick={() => scrollToSection('about-section')} className="btn-glass cursor-pointer">
              {text.heroSecondaryCta}
            </button>
          </m.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 right-5 sm:right-8 lg:right-10 flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md px-3 py-2">
          {slides.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentImageIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
