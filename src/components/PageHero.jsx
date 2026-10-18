import React, { useRef } from 'react';
import { m, useScroll, useReducedMotion } from 'framer-motion';
import { reveal, enter, useScrollRange } from '../lib/motion';
import CountUp from './motion/CountUp';
import LocalNav from './LocalNav';
import { useBanners } from '../context/PublicContentContext';
import { bannerImage } from '../lib/pageBanners';

/**
 * The opening of every inner page:
 *   1. a sticky page bar (LocalNav) with the page name and one action;
 *   2. a full-width photograph (about 60% of the screen; taller when the words need it) with the
 *      headline and description on it, over a soft dark fade
 *      at the bottom so the words always read; the photo drifts and the words fade as you scroll;
 *   3. optional buttons and figures (count up) under the photo.
 *
 *   <PageHero
 *     page="about"
 *     breadcrumb={[{ label: 'About' }]}      // its last label names the page bar
 *     eyebrow="Our story"
 *     title="Built on legacy."
 *     highlight="Designed for modern living."
 *     subtitle="…"
 *     image={heroImage('/images/hero/stock-about.jpeg')}
 *     imageAlt="…"
 *     stats={[{ value: '25+', label: 'Years of expertise', sub: '…' }]}
 *     actions={<Link className="btn-primary" to="/contact">Start a project</Link>}
 *     navCta={{ label: 'Apply now', href: '#apply' }}   // page-bar action (default: Book a consultation)
 *   />
 *
 * Must be the first child of the page's root element (see LocalNav). The headline and photo are
 * visible from the first frame (they are what the browser measures as "page loaded").
 * Without a photo, the headline sits centred on the page background instead.
 *
 * With `page`, a published banner from Admin → Page Banners replaces the headline
 * (and the photo / text under it, when those are filled in). Without one, the props are used.
 */
export const PageHero = ({
  page,
  breadcrumb = [],
  eyebrow,
  title,
  highlight,
  subtitle,
  image,
  imageAlt = '',
  imageClassName = '',
  stats,
  actions,
  navCta,
  children,
}) => {
  const banners = useBanners().items;
  const banner = page ? banners.find((b) => b.badge === page) : null;
  if (banner) {
    title = banner.title;
    highlight = banner.cta_text || null;
    if (banner.subtitle) subtitle = banner.subtitle;
    if (banner.image) image = bannerImage(banner.image);
  }

  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  // 0 with the hero at the top of the screen, 1 once it has scrolled away
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const photoY = useScrollRange(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '18%']);
  const textY = useScrollRange(scrollYProgress, [0, 0.8], reduce ? [0, 0] : [0, -60]);
  const textOpacity = useScrollRange(scrollYProgress, [0.15, 0.7], reduce ? [1, 1] : [1, 0]);

  const navTitle = breadcrumb.length ? breadcrumb[breadcrumb.length - 1].label : title;

  const heading = (onPhoto) => (
    <>
      {eyebrow && (
        <m.p {...enter({ variant: 'fadeIn' })} className={onPhoto ? 'hero-eyebrow mb-3' : 'eyebrow mb-3 sm:mb-4'}>
          {eyebrow}
        </m.p>
      )}
      <h1 className={onPhoto ? 'hero-title max-w-2xl' : 'text-display-xl max-w-5xl text-fg mx-auto'}>
        {title}
        {highlight && (
          <>
            {' '}
            <span className={onPhoto ? 'text-[#E3CF9F]' : 'text-accent'}>{highlight}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <m.p
          {...enter({ order: 1 })}
          className={onPhoto ? 'hero-lede mt-3 sm:mt-4 max-w-xl' : 'lede mt-5 sm:mt-6 max-w-3xl mx-auto'}
        >
          {subtitle}
        </m.p>
      )}
    </>
  );

  return (
    <>
      <LocalNav title={navTitle} cta={navCta} />
      {/* !mt-0: pages space their sections with space-y-*, but the photo sits right under the page bar */}
      <section className={image ? '!mt-0' : ''}>
        {image ? (
          <div
            ref={heroRef}
            className="relative isolate overflow-hidden bg-[#1d1d1f] flex flex-col justify-end min-h-[clamp(440px,60svh,640px)]"
          >
            <m.img
              {...image}
              alt={imageAlt}
              fetchPriority="high"
              style={{ y: photoY }}
              className={`absolute inset-x-0 top-0 -z-10 w-full h-[118%] object-cover will-change-transform ${imageClassName}`}
            />
            {/* Fade: dark at the bottom (behind the words), clear at the top */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/15 via-40% to-black/0"
            />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 -z-10 bg-gradient-to-b from-black/25 to-transparent" />
            {/* On phones the words cover most of the photo, so dim it a little all over */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/10 lg:hidden" />

            <m.div
              style={{ y: textY, opacity: textOpacity }}
              className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 lg:pb-16 [text-shadow:0_1px_18px_rgb(0_0_0/0.35)]"
            >
              {/* pr-16 below lg: clear of the floating contact button */}
              <div className="site-container pr-16 lg:pr-0">{heading(true)}</div>
            </m.div>
          </div>
        ) : (
          <div className="site-container text-center pt-14 sm:pt-20">{heading(false)}</div>
        )}

        {actions && (
          <m.div
            {...enter({ order: 2 })}
            className="site-container mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {actions}
          </m.div>
        )}

        {stats && stats.length > 0 && (
          <div className="site-container mt-14 sm:mt-20">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {stats.map((s, i) => (
                <m.div {...reveal({ order: i })} key={i} className="text-center px-2">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-[30px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.035em] text-fg leading-none whitespace-nowrap">
                    <CountUp value={s.value} />
                  </dd>
                  <dd className="mt-3 text-[15px] sm:text-[17px] font-semibold text-fg">{s.label}</dd>
                  {s.sub && <dd className="mt-1 text-[13px] sm:text-[14px] text-muted">{s.sub}</dd>}
                </m.div>
              ))}
            </dl>
          </div>
        )}

        {children}
      </section>
    </>
  );
};

export default PageHero;
