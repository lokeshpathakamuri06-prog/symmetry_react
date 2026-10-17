import React, { useRef } from 'react';
import { m, useScroll, useReducedMotion } from 'framer-motion';
import { reveal, useScrollRange } from '../lib/motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const DynamicScrollShowcase = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll progress through this pinned container for Desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Lenis already smooths the wheel; a spring on top only made the cards lag behind the scroll
  const smoothProgress = scrollYProgress;

  // Central Card Animations (Desktop)
  const centerScale = useScrollRange(smoothProgress, [0, 0.45, 0.9], [0.82, 1, 1.08]);
  const centerOpacity = useScrollRange(smoothProgress, [0, 0.15], [0.4, 1]);

  // Satellite Floating Cards - Fade in early, then drift outward in parallax (Desktop)
  const satelliteOpacity = useScrollRange(smoothProgress, [0, 0.15, 0.7, 0.95], [0, 1, 1, 0.2]);
  const satelliteScale = useScrollRange(smoothProgress, [0, 0.25], [0.8, 1]);

  // Left Cards Horizontal & Rotation Parallax Drift (Desktop)
  const leftX = useScrollRange(smoothProgress, [0.35, 0.85], [0, -220]);
  const leftYTop = useScrollRange(smoothProgress, [0, 0.85], [30, -50]);
  const leftYMid = useScrollRange(smoothProgress, [0, 0.85], [10, -10]);
  const leftYBottom = useScrollRange(smoothProgress, [0, 0.85], [-20, 60]);
  const leftRotate = useScrollRange(smoothProgress, [0.35, 0.85], [-2, -8]);

  // Right Cards Horizontal & Rotation Parallax Drift (Desktop)
  const rightX = useScrollRange(smoothProgress, [0.35, 0.85], [0, 220]);
  const rightYTop = useScrollRange(smoothProgress, [0, 0.85], [30, -50]);
  const rightYMid = useScrollRange(smoothProgress, [0, 0.85], [10, -10]);
  const rightYBottom = useScrollRange(smoothProgress, [0, 0.85], [-20, 60]);
  const rightRotate = useScrollRange(smoothProgress, [0.35, 0.85], [2, 8]);

  // Title fade & slide (Desktop)
  const titleY = useScrollRange(smoothProgress, [0, 0.3], [0, -25]);
  const titleOpacity = useScrollRange(smoothProgress, [0.65, 0.85], [1, 0.4]);

  // Bottom action bar reveal (Desktop)
  const actionOpacity = useScrollRange(smoothProgress, [0.45, 0.75], [0, 1]);
  const actionY = useScrollRange(smoothProgress, [0.45, 0.75], [25, 0]);

  // Satellite card data for Mobile View
  const mobileSatellites = [
    {
      id: '01',
      category: '01 • Portals',
      title: 'Roman Travertine',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      side: 'left',
    },
    {
      id: '04',
      category: '04 • Quarries',
      title: 'Verona Bookmatch',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
      side: 'right',
    },
    {
      id: '02',
      category: '02 • Monoliths',
      title: 'Fluted Cavern Stone',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      side: 'left',
    },
    {
      id: '05',
      category: '05 • Luminaires',
      title: 'Mouth-Blown Murano',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      side: 'right',
    },
    {
      id: '03',
      category: '03 • Ergonomics',
      title: 'Cognac Saddle Leather',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
      side: 'left',
    },
    {
      id: '06',
      category: '06 • Landscape',
      title: 'Kiln-Dried Hardwood',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      side: 'right',
    },
  ];

  return (
    <>
      {/* =========================================================================
          DESKTOP VERSION (Pinned Parallax Flythrough - md and up)
      ========================================================================= */}
      <section ref={containerRef} className="hidden md:block relative h-[240vh] sm:h-[260vh]">
        {/* Pinned Sticky Viewport Frame */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-black text-[#F5F5F7] border-y border-white/10">
          {/* Ambient Dark Luxury Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[800px] bg-[radial-gradient(closest-side,rgba(54,101,107,0.16),transparent)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(54,101,107,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

          {/* Section Header */}
          <m.div
            style={shouldReduceMotion ? {} : { y: titleY, opacity: titleOpacity }}
            className="relative z-20 text-center max-w-3xl mx-auto pt-4 shrink-0"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm uppercase tracking-luxury text-[#D9C59A] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Inside Our Work</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-tight">
              Curated Living, Expanded.
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#A1A1A6] font-light leading-relaxed max-w-lg mx-auto">
              Keep scrolling to step inside one of our homes.
            </p>
          </m.div>

          {/* Interactive Kinetic Multi-Layer Gallery Stage */}
          <div className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center my-auto">
            {/* LEFT 3 SATELLITE CARDS */}
            <m.div
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      x: leftX,
                      opacity: satelliteOpacity,
                      scale: satelliteScale,
                    }
              }
              className="absolute left-0 sm:left-4 md:left-8 lg:left-14 z-10 flex flex-col gap-5 pointer-events-auto"
            >
              {/* Top Left Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: leftYTop, rotate: leftRotate }}
                className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                  alt="Roman Travertine Portal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">01 &bull; Portals</span>
                  <span className="text-xs font-serif leading-tight">Roman Travertine</span>
                </div>
              </m.div>

              {/* Mid Left Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: leftYMid }}
                className="w-48 lg:w-60 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative ml-6 group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                  alt="Fluted Travertine Coffee Table"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">02 &bull; Monoliths</span>
                  <span className="text-xs font-serif leading-tight">Fluted Cavern Stone</span>
                </div>
              </m.div>

              {/* Bottom Left Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: leftYBottom, rotate: leftRotate }}
                className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"
                  alt="Saddle Leather Lounge"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">03 &bull; Ergonomics</span>
                  <span className="text-xs font-serif leading-tight">Cognac Saddle Leather</span>
                </div>
              </m.div>
            </m.div>

            {/* CENTER HERO FOCAL PAVILION */}
            <m.div
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      scale: centerScale,
                      opacity: centerOpacity,
                    }
              }
              className="relative z-20 w-[90%] sm:w-[480px] md:w-[560px] lg:w-[640px] aspect-[16/10] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/20 bg-black group"
            >
              <img loading="lazy" decoding="async"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Jubilee Hills Master Sky Pavilion"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-[#131E20]/85 backdrop-blur-md text-[#F4F7F6] border border-white/15 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Featured Project
                </span>
              </div>

              <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#D9C59A] font-semibold block mb-1">
                    Private Residence &bull; 8,500 Sq.Ft.
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                    The Obsidian Sky Villa
                  </h3>
                </div>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#1D1D1F] text-[14px] tracking-[-0.01em] font-medium hover:bg-white transition-colors shrink-0 shadow-md"
                >
                  <span>Explore Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </m.div>

            {/* RIGHT 3 SATELLITE CARDS */}
            <m.div
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      x: rightX,
                      opacity: satelliteOpacity,
                      scale: satelliteScale,
                    }
              }
              className="absolute right-0 sm:right-4 md:right-8 lg:right-14 z-10 flex flex-col gap-5 pointer-events-auto"
            >
              {/* Top Right Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: rightYTop, rotate: rightRotate }}
                className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"
                  alt="Milan Sourcing & Carrara Marble"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">04 &bull; Quarries</span>
                  <span className="text-xs font-serif leading-tight">Verona Bookmatch</span>
                </div>
              </m.div>

              {/* Mid Right Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: rightYMid }}
                className="w-48 lg:w-60 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative mr-6 group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
                  alt="Murano Glass Lighting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">05 &bull; Luminaires</span>
                  <span className="text-xs font-serif leading-tight">Mouth-Blown Murano</span>
                </div>
              </m.div>

              {/* Bottom Right Card */}
              <m.div
                style={shouldReduceMotion ? {} : { y: rightYBottom, rotate: rightRotate }}
                className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1C1C1E] relative group"
              >
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                  alt="Outdoor Plantation Teak"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-medium">06 &bull; Landscape</span>
                  <span className="text-xs font-serif leading-tight">Kiln-Dried Hardwood</span>
                </div>
              </m.div>
            </m.div>
          </div>

          {/* Bottom Navigation Strip */}
          <m.div
            style={shouldReduceMotion ? {} : { opacity: actionOpacity, y: actionY }}
            className="relative z-20 max-w-4xl mx-auto w-full pt-2 flex items-center justify-between text-xs sm:text-sm text-[#A1A1A6] border-t border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#D9C59A]">01 &mdash; 06</span>
              <span>Materials from this home</span>
            </div>

            <div className="flex items-center gap-4 font-light">
              <span className="hidden sm:inline">Keep scrolling</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <m.div
                  style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                  className="w-full h-full bg-accent"
                />
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* =========================================================================
          MOBILE VERSION (Scroll-triggered alternating left/right slide reveal - under md)
      ========================================================================= */}
      <section className="block md:hidden bg-black text-[#F5F5F7] py-12 px-4 border-y border-white/10 overflow-hidden">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Mobile Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs uppercase tracking-luxury text-[#D9C59A] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Inside Our Work</span>
            </div>

            <h2 className="text-3xl font-serif font-normal tracking-tight text-white leading-tight">
              Curated Living, Expanded.
            </h2>

            <p className="mt-2 text-xs text-[#A1A1A6] font-light leading-relaxed">
              A closer look at one of our homes.
            </p>
          </div>

          {/* Central Main Project Card */}
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
            <img loading="lazy" decoding="async"
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Jubilee Hills Master Sky Pavilion"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-luxury font-medium bg-[#131E20]/85 backdrop-blur-md text-[#F4F7F6] border border-white/15 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Featured Project
              </span>
            </div>

            <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-[#D9C59A] font-semibold block">
                  Private Residence &bull; 8,500 Sq.Ft.
                </span>
                <h3 className="font-serif text-lg text-white font-normal leading-tight mt-0.5">
                  The Obsidian Sky Villa
                </h3>
              </div>

              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1D1D1F] text-[10px] uppercase tracking-luxury font-semibold shadow-md"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 6 Mobile Satellite Cards Grid with Alternating Scroll Reveal */}
          <div className="space-y-3 pt-2">
            <span className="text-xs uppercase tracking-luxury text-[#D9C59A] font-semibold block text-center mb-2">
              Materials
            </span>

            <div className="grid grid-cols-2 gap-3">
              {mobileSatellites.map((card, idx) => {
                return (
                  <m.div
                    {...reveal({ order: idx % 2 })}
                    key={card.id}
                    className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-[#1C1C1E] relative group"
                  >
                    <img loading="lazy" decoding="async"
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2.5 flex flex-col justify-between text-white">
                      <span className="text-[9px] uppercase tracking-luxury text-[#D9C59A] font-medium">
                        {card.category}
                      </span>
                      <span className="text-[11px] font-serif leading-tight">
                        {card.title}
                      </span>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DynamicScrollShowcase;
