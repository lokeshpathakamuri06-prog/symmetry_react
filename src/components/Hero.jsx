import React, { useState, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { ease } from '../lib/motion';
import { useBanners } from '../context/PublicContentContext';
import { heroImage } from '../lib/staticImages';
import { cloudinaryUrl, isCloudinary, srcSet } from '../lib/images';

// Slideshow photos come from admin "Hero Banners" (active + published, in admin order).
// The photos are shown clean (no overlay, no text on them); the headline and buttons from
// Page Content > Home sit in the section below (HomeIntro). These local photos are only a fallback.
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
  // Banners with a page set (Admin → Page Banners) belong to other pages
  const banners = useBanners().items.filter((b) => b.image && !b.badge);
  const slides = banners.length ? banners : FALLBACK_SLIDES;
  const [slideIndex, setSlideIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const currentImageIndex = slideIndex % slides.length;
  const slide = slides[currentImageIndex];

  // Next photo every 6 seconds, until the visitor pauses
  useEffect(() => {
    if (!playing || slides.length < 2) return undefined;
    const timer = setInterval(() => setSlideIndex((prev) => (prev + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [playing, slides.length]);

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full bg-sunken overflow-hidden select-none"
      aria-roledescription="carousel"
      aria-label="Our spaces"
    >
      {/* initial={false}: the first photo is on screen at once (it is the page's main image);
          later photos cross-fade in and settle slowly from a slight zoom */}
      <AnimatePresence mode="popLayout" initial={false}>
        <m.img
          key={slide.id}
          {...slideImage(slide.image)}
          fetchPriority={currentImageIndex === 0 ? 'high' : undefined}
          alt={slide.title}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: ease.apple }, scale: { duration: 7, ease: ease.out } }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* Dots and pause, in one small glass pill */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex justify-center z-10">
          <div className="flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-xl pl-3 pr-1 py-1">
            {slides.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSlideIndex(idx)}
                aria-label={`Show photo ${idx + 1} of ${slides.length}`}
                aria-current={currentImageIndex === idx ? 'true' : undefined}
                className="h-6 px-1 flex items-center cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-apple ${
                    currentImageIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              className="ml-1 w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
