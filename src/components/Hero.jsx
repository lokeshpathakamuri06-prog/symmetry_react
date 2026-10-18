import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { m, AnimatePresence, useReducedMotion, useScroll } from 'framer-motion';
import { ease, enter, useScrollRange } from '../lib/motion';
import { useBanners } from '../context/PublicContentContext';
import { heroImageProps } from '../lib/images';
import TextReveal from './motion/TextReveal';

// Slideshow photos come from admin "Hero Banners" (active + published, in admin order).
// The headline, description and buttons (Page Content > Home) sit on the photos, over a soft
// dark fade at the bottom. These local photos are only a fallback.
const FALLBACK_SLIDES = [
  { id: 'hero-1', title: 'HAJ0025 Architecture', image: '/images/hero/hero-haj-slide-1.jpeg' },
  { id: 'hero-2', title: 'HAJ0026 Interior', image: '/images/hero/hero-haj-slide-2.jpeg' },
  { id: 'hero-3', title: 'HAJ0035 Living Pavilion', image: '/images/hero/hero-haj-slide-3.jpeg' },
];

const PHOTO_SECONDS = 6;

// A banner whose URL is a video file (or a Cloudinary video) plays as a silent clip
const isVideo = (src) => /\.(mp4|webm|mov)(\?.*)?$/i.test(src) || /res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(src);

const slideImage = (src) => heroImageProps(src);

/**
 * Home's opening: photos (or a video) about 80% of the screen tall, growing when the words need
 * it, with the headline, description and two
 * actions on them. Slim bars show each slide's progress; a photo moves on when its bar fills,
 * a video when it ends. The words lift and fade as the page scrolls.
 *
 *   <Hero eyebrow="Symmetry Interiors" title="Where Vision Meets" accent="Timeless Design"
 *         subtitle="…" actions={<>…buttons…</>} />
 */
export const Hero = ({ eyebrow, title, accent, subtitle, actions }) => {
  // Banners with a page set (Admin → Page Banners) belong to other pages
  const banners = useBanners().items.filter((b) => b.image && !b.badge);
  const slides = banners.length ? banners : FALLBACK_SLIDES;
  const [slideIndex, setSlideIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(!reduceMotion);
  const [videoSeconds, setVideoSeconds] = useState(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const currentImageIndex = slideIndex % slides.length;
  const slide = slides[currentImageIndex];
  const slideIsVideo = isVideo(slide.image);
  const many = slides.length > 1;
  const next = () => setSlideIndex((prev) => (prev + 1) % slides.length);

  // The pause button also pauses a playing video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, slide.id]);

  // Scrolling away: the photo drifts a little slower than the page, the words lift and fade
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const mediaY = useScrollRange(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '20%']);
  const textY = useScrollRange(scrollYProgress, [0, 0.7], reduceMotion ? [0, 0] : [0, -80]);
  const textOpacity = useScrollRange(scrollYProgress, [0.1, 0.55], reduceMotion ? [1, 1] : [1, 0]);

  const mediaClass = 'absolute inset-0 w-full h-full object-cover object-center';

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex flex-col justify-end min-h-[clamp(580px,80svh,820px)] w-full bg-[#1d1d1f] overflow-hidden select-none"
      aria-roledescription="carousel"
      aria-label="Our spaces"
    >
      <m.div style={{ y: mediaY }} className="absolute inset-0 -z-10 will-change-transform">
        {/* initial={false}: the first photo is on screen at once (it is the page's main image);
            later photos cross-fade in and settle slowly from a slight zoom */}
        <AnimatePresence mode="popLayout" initial={false}>
          {slideIsVideo ? (
            <m.video
              key={slide.id}
              ref={videoRef}
              src={slide.image}
              muted
              playsInline
              autoPlay={playing}
              loop={!many}
              preload="auto"
              onLoadedMetadata={(e) => setVideoSeconds(e.currentTarget.duration || null)}
              onEnded={next}
              aria-label={slide.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2, ease: ease.apple } }}
              className={mediaClass}
            />
          ) : (
            <m.img
              key={slide.id}
              {...slideImage(slide.image)}
              fetchPriority={currentImageIndex === 0 ? 'high' : undefined}
              alt={slide.title}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2, ease: ease.apple }, scale: { duration: 8, ease: ease.out } }}
              className={mediaClass}
            />
          )}
        </AnimatePresence>
      </m.div>

      {/* Fade: dark at the bottom (behind the words), a hint at the top for the header */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/15 via-40% to-transparent" />
      {/* Darker at the very top so the clear header's white links read on bright photos */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 -z-10 bg-gradient-to-b from-black/45 to-transparent" />
      {/* On phones the words cover most of the photo, so dim it a little all over */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/10 lg:hidden" />

      {/* Headline, description and actions */}
      <m.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative pt-[calc(var(--gnav-h)+48px)] pb-24 sm:pb-24 lg:pb-28 [text-shadow:0_1px_18px_rgb(0_0_0/0.35)]"
      >
        {/* pr-16 below lg: clear of the floating contact button */}
        <div className="site-container pr-16 lg:pr-0">
          {eyebrow && (
            <m.p {...enter({ variant: 'fadeIn' })} className="hero-eyebrow mb-3">
              {eyebrow}
            </m.p>
          )}
          {title && (
            <TextReveal
              as="h1"
              className="hero-title max-w-2xl"
              accentClassName="text-[#E3CF9F]"
              text={title}
              accent={accent}
            />
          )}
          {subtitle && (
            <m.p {...enter({ order: 3 })} className="hero-lede mt-3 sm:mt-4 max-w-xl">
              {subtitle}
            </m.p>
          )}
          {actions && (
            <m.div {...enter({ order: 4 })} className="mt-8 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4 [text-shadow:none]">
              {actions}
            </m.div>
          )}
        </div>
      </m.div>

      {/* Slide progress and pause (a lone video still gets its pause button) */}
      {(many || slideIsVideo) && (
        <div className="absolute bottom-8 sm:bottom-10 inset-x-0 z-10">
          <div className="site-container pr-20 lg:pr-0 flex items-center gap-3">
            {many && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 max-w-[360px]">
                {slides.map((s, idx) => {
                  const state = idx < currentImageIndex ? 'done' : idx === currentImageIndex ? 'now' : 'next';
                  const seconds = slideIsVideo ? videoSeconds : PHOTO_SECONDS;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlideIndex(idx)}
                      aria-label={`Show slide ${idx + 1} of ${slides.length}`}
                      aria-current={state === 'now' ? 'true' : undefined}
                      className="group flex-1 py-3 cursor-pointer"
                    >
                      <span className="block h-[3px] rounded-full bg-white/30 overflow-hidden group-hover:bg-white/45 transition-colors">
                        {state === 'done' && <span className="block h-full w-full bg-white" />}
                        {state === 'now' && seconds && (
                          <span
                            key={`${s.id}-${slideIndex}`}
                            className="hero-progress block h-full w-full bg-white"
                            style={{ animationDuration: `${seconds}s`, animationPlayState: playing ? 'running' : 'paused' }}
                            // A photo moves on when its bar fills; a video moves on when it ends
                            onAnimationEnd={slideIsVideo ? undefined : next}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-[1px]" />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
