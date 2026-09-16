import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Curated architectural videos from Yoo Interior reference
const HERO_VIDEOS = [
  {
    id: 1,
    title: 'Minimalist Monolith & Daylight Choreography',
    src: 'https://media.yoointerior.com/yoo_web_1.mp4',
  },
  {
    id: 2,
    title: 'Textured Bouclé & Smoked Oak Living',
    src: 'https://media.yoointerior.com/yooweb_2.mp4',
  },
  {
    id: 3,
    title: 'Architectural Stone & Roman Travertine Portals',
    src: 'https://media.yoointerior.com/yoo_web_3.mp4',
  },
  {
    id: 4,
    title: 'Private Sky Penthouse Spatial Flow',
    src: 'https://media.yoointerior.com/yooweb_4.mp4',
  },
];

export const Hero = () => {
  const [videoIndex, setVideoIndex] = useState(0);
  const [activePillar, setActivePillar] = useState('EXPERTISE');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle video end or seamless switch
  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  // When video index changes, reload and play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may wait for user interaction in strict environments
      });
    }
  }, [videoIndex]);

  return (
    <section className="relative h-[100svh] min-h-[640px] sm:min-h-[720px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* =========================================================================
          1. FULL-BLEED CINEMATIC BACKGROUND VIDEO LAYER
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Fallback architectural poster during initial load */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85')`,
            opacity: videoLoaded ? 0 : 1,
          }}
        />

        <video
          ref={videoRef}
          key={HERO_VIDEOS[videoIndex].src}
          autoPlay
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-700 ease-out ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={HERO_VIDEOS[videoIndex].src} type="video/mp4" />
        </video>

      </div>

      {/* Hero Main Copy Layer (Clean, without dark overlay masks or floating overlay clutter) */}
      <div className="relative z-10 pt-24 sm:pt-28 px-6 sm:px-12 flex flex-col justify-center items-center h-full max-w-[1632px] mx-auto w-full text-center">
        {/* Center Hero Copy Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white leading-[1.08] tracking-tight font-normal mb-4 sm:mb-6 drop-shadow-md">
            Where Vision Meets <span className="italic font-light text-[#BCA575]">Timeless Design</span>
          </h1>
          <p className="text-base sm:text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow-sm">
            Global sourcing, bespoke interiors, and end-to-end execution for spaces that inspire and endure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('projects-section')}
              className="px-8 py-3.5 rounded-full bg-white text-[#131E20] hover:bg-[#36656B] hover:text-white transition-all duration-300 text-xs uppercase tracking-luxury font-semibold shadow-lg cursor-pointer"
            >
              Explore Our Work
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/30 hover:border-white transition-all duration-300 text-xs uppercase tracking-luxury font-semibold cursor-pointer"
            >
              Start Your Project
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
