import React, { useRef } from 'react';
import { m, useScroll, useReducedMotion, useTransform } from 'framer-motion';
import { reveal, enter, useScrollRange } from '../lib/motion';
import CountUp from './motion/CountUp';
import LocalNav from './LocalNav';
import { useBanners } from '../context/PublicContentContext';
import { bannerImage } from '../lib/pageBanners';

/**
 * The opening of every inner page, Apple product-page style:
 *   1. a sticky page bar (LocalNav) with the page name and one action;
 *   2. a large centred headline on a calm background;
 *   3. a clean photograph (no overlay) that starts as a rounded inset card and
 *      widens to the full screen as you scroll;
 *   4. optional figures that count up.
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

  const frameRef = useRef(null);
  const reduce = useReducedMotion();
  // 0 when the photo's top enters at the bottom of the screen, 1 when it reaches the top
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'start start'] });
  const frameScale = useScrollRange(scrollYProgress, [0.35, 0.95], reduce ? [1, 1] : [0.9, 1]);
  const radius = useScrollRange(scrollYProgress, [0.35, 0.95], reduce ? [0, 0] : [28, 0]);
  const borderRadius = useTransform(radius, (r) => `${r}px`);
  const photoScale = useScrollRange(scrollYProgress, [0.35, 1], reduce ? [1, 1] : [1.12, 1]);

  const navTitle = breadcrumb.length ? breadcrumb[breadcrumb.length - 1].label : title;

  return (
    <>
      <LocalNav title={navTitle} cta={navCta} />
      <section className="pt-14 sm:pt-20">
        <div className="site-container text-center">
          {eyebrow && (
            <m.p {...enter({ variant: 'fadeIn' })} className="eyebrow mb-3 sm:mb-4">
              {eyebrow}
            </m.p>
          )}

          <h1 className="text-display-xl text-fg max-w-5xl mx-auto">
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-accent">{highlight}</span>
              </>
            )}
          </h1>

          {subtitle && (
            <m.p {...enter({ order: 1 })} className="lede mt-5 sm:mt-6 max-w-3xl mx-auto">
              {subtitle}
            </m.p>
          )}

          {actions && (
            <m.div {...enter({ order: 2 })} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {actions}
            </m.div>
          )}
        </div>

        {image && (
          <div ref={frameRef} className="mt-12 sm:mt-16">
            <m.div
              style={{ scale: frameScale, borderRadius }}
              className="relative overflow-hidden bg-sunken h-[58svh] min-h-[340px] sm:h-[72svh] sm:min-h-[460px] max-h-[860px] origin-top will-change-transform"
            >
              <m.img
                {...image}
                alt={imageAlt}
                fetchPriority="high"
                style={{ scale: photoScale }}
                className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
              />
            </m.div>
          </div>
        )}

        {stats && stats.length > 0 && (
          <div className="site-container mt-14 sm:mt-20">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {stats.map((s, i) => (
                <m.div {...reveal({ order: i })} key={i} className="text-center px-2">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.035em] text-fg leading-none">
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
