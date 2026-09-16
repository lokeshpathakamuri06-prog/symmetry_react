import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Compass, Layers } from 'lucide-react';
import ScribbleUnderline from './ScribbleUnderline';

export const DynamicScrollShowcase = () => {
  const containerRef = useRef(null);

  // Track scroll progress through this pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Central Card Animations
  const centerScale = useTransform(smoothProgress, [0, 0.45, 0.9], [0.82, 1, 1.08]);
  const centerOpacity = useTransform(smoothProgress, [0, 0.15], [0.4, 1]);

  // Satellite Floating Cards - Fade in early, then drift outward in parallax
  const satelliteOpacity = useTransform(smoothProgress, [0, 0.15, 0.7, 0.95], [0, 1, 1, 0.2]);
  const satelliteScale = useTransform(smoothProgress, [0, 0.25], [0.8, 1]);

  // Left Cards Horizontal & Rotation Parallax Drift
  const leftX = useTransform(smoothProgress, [0.35, 0.85], [0, -220]);
  const leftYTop = useTransform(smoothProgress, [0, 0.85], [30, -50]);
  const leftYMid = useTransform(smoothProgress, [0, 0.85], [10, -10]);
  const leftYBottom = useTransform(smoothProgress, [0, 0.85], [-20, 60]);
  const leftRotate = useTransform(smoothProgress, [0.35, 0.85], [-2, -8]);

  // Right Cards Horizontal & Rotation Parallax Drift
  const rightX = useTransform(smoothProgress, [0.35, 0.85], [0, 220]);
  const rightYTop = useTransform(smoothProgress, [0, 0.85], [30, -50]);
  const rightYMid = useTransform(smoothProgress, [0, 0.85], [10, -10]);
  const rightYBottom = useTransform(smoothProgress, [0, 0.85], [-20, 60]);
  const rightRotate = useTransform(smoothProgress, [0.35, 0.85], [2, 8]);

  // Title fade & slide
  const titleY = useTransform(smoothProgress, [0, 0.3], [0, -25]);
  const titleOpacity = useTransform(smoothProgress, [0.65, 0.85], [1, 0.4]);

  // Bottom action bar reveal
  const actionOpacity = useTransform(smoothProgress, [0.45, 0.75], [0, 1]);
  const actionY = useTransform(smoothProgress, [0.45, 0.75], [25, 0]);

  return (
    <section ref={containerRef} className="relative h-[240vh] sm:h-[260vh]">
      {/* Pinned Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#0C1622] text-[#F5F1E8] border-y border-[#1E3447]/60">
        {/* Ambient Dark Luxury Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#36656B]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(54,101,107,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

        {/* Section Header (Sticks gently) */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-20 text-center max-w-3xl mx-auto pt-4 shrink-0"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm uppercase tracking-luxury text-[#BCA575] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#36656B]" />
            <span>Interactive Space Flythrough</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-tight">
            Curated Living,{' '}
            <ScribbleUnderline color="#BCA575">Expanded.</ScribbleUnderline>
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#AEB7BE] font-light leading-relaxed max-w-lg mx-auto">
            Scroll to disperse architectural elements and enter the private Jubilee Hills pavilion.
          </p>
        </motion.div>

        {/* Interactive Kinetic Multi-Layer Gallery Stage */}
        <div className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center my-auto">
          {/* =========================================================================
              LEFT 3 SATELLITE CARDS (Drift leftward on scroll like 21oaks)
          ========================================================================= */}
          <motion.div
            style={{
              x: leftX,
              opacity: satelliteOpacity,
              scale: satelliteScale,
            }}
            className="absolute left-0 sm:left-4 md:left-8 lg:left-14 z-10 hidden md:flex flex-col gap-5 pointer-events-none sm:pointer-events-auto"
          >
            {/* Top Left Card: Travertine Portal */}
            <motion.div
              style={{ y: leftYTop, rotate: leftRotate }}
              className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="Roman Travertine Portal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">01 &bull; Portals</span>
                <span className="text-xs font-serif leading-tight">Roman Travertine</span>
              </div>
            </motion.div>

            {/* Mid Left Card: Monolithic Marble */}
            <motion.div
              style={{ y: leftYMid }}
              className="w-48 lg:w-60 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative ml-6 group"
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                alt="Fluted Travertine Coffee Table"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">02 &bull; Monoliths</span>
                <span className="text-xs font-serif leading-tight">Fluted Cavern Stone</span>
              </div>
            </motion.div>

            {/* Bottom Left Card: Minimalist Leather */}
            <motion.div
              style={{ y: leftYBottom, rotate: leftRotate }}
              className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"
                alt="Saddle Leather Lounge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">03 &bull; Ergonomics</span>
                <span className="text-xs font-serif leading-tight">Cognac Saddle Leather</span>
              </div>
            </motion.div>
          </motion.div>

          {/* =========================================================================
              CENTER HERO FOCAL PAVILION (Expands smoothly on scroll)
          ========================================================================= */}
          <motion.div
            style={{
              scale: centerScale,
              opacity: centerOpacity,
            }}
            className="relative z-20 w-[90%] sm:w-[480px] md:w-[560px] lg:w-[640px] aspect-[16/10] sm:aspect-[16/10] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/20 bg-[#07121C] group"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Jubilee Hills Master Sky Pavilion"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07121C]/90 via-transparent to-[#07121C]/30" />

            {/* Floating Top Badge */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-[#131E20]/85 backdrop-blur-md text-[#F4F7F6] border border-white/15 shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36656B] animate-pulse" />
                Featured Commission
              </span>
            </div>

            {/* Bottom Focal Headline & Details */}
            <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#BCA575] font-semibold block mb-1">
                  Private Residence &bull; 8,500 Sq.Ft.
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                  The Obsidian Sky Villa
                </h3>
              </div>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#36656B] text-[#07121C] text-xs uppercase tracking-luxury font-semibold hover:bg-white transition-colors shrink-0 shadow-md"
              >
                <span>Explore Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* =========================================================================
              RIGHT 3 SATELLITE CARDS (Drift rightward on scroll like 21oaks)
          ========================================================================= */}
          <motion.div
            style={{
              x: rightX,
              opacity: satelliteOpacity,
              scale: satelliteScale,
            }}
            className="absolute right-0 sm:right-4 md:right-8 lg:right-14 z-10 hidden md:flex flex-col gap-5 pointer-events-none sm:pointer-events-auto"
          >
            {/* Top Right Card: Carrara Ateliers */}
            <motion.div
              style={{ y: rightYTop, rotate: rightRotate }}
              className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"
                alt="Milan Sourcing & Carrara Marble"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">04 &bull; Quarries</span>
                <span className="text-xs font-serif leading-tight">Verona Bookmatch</span>
              </div>
            </motion.div>

            {/* Mid Right Card: Murano Glass */}
            <motion.div
              style={{ y: rightYMid }}
              className="w-48 lg:w-60 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative mr-6 group"
            >
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
                alt="Murano Glass Lighting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">05 &bull; Luminaires</span>
                <span className="text-xs font-serif leading-tight">Mouth-Blown Murano</span>
              </div>
            </motion.div>

            {/* Bottom Right Card: Outdoor Teak */}
            <motion.div
              style={{ y: rightYBottom, rotate: rightRotate }}
              className="w-44 lg:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#132838] relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                alt="Outdoor Plantation Teak"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between text-white">
                <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-medium">06 &bull; Landscape</span>
                <span className="text-xs font-serif leading-tight">Kiln-Dried Hardwood</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Interactive Scroll Navigation Strip */}
        <motion.div
          style={{ opacity: actionOpacity, y: actionY }}
          className="relative z-20 max-w-4xl mx-auto w-full pt-2 flex items-center justify-between text-xs sm:text-sm text-[#AEB7BE] border-t border-white/10"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[#BCA575]">01 &mdash; 06</span>
            <span>Spatial Perspectives in Synchronized Parallax</span>
          </div>

          <div className="flex items-center gap-4 font-light">
            <span className="hidden sm:inline">Keep Scrolling To Unveil</span>
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                className="w-full h-full bg-[#36656B]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DynamicScrollShowcase;
