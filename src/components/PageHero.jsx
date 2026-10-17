import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useBanners } from '../context/PublicContentContext';
import { bannerImage } from '../lib/pageBanners';

const ease = [0.28, 0.11, 0.32, 1];

/**
 * The opening of every inner page, Apple style: headline on a calm background,
 * then a large rounded photograph that settles into place as you scroll.
 * Text never sits on the photo, so it stays readable whatever the image.
 *
 *   <PageHero
 *     breadcrumb={[{ label: 'About' }]}
 *     eyebrow="Our story"
 *     title="Built on legacy."
 *     highlight="Designed for modern living."
 *     subtitle="…"
 *     image={heroImage('/images/hero/hero-about.jpeg')}
 *     imageAlt="…"
 *     stats={[{ value: '25+', label: 'Years of expertise', sub: '…' }]}
 *     actions={<Link className="btn-primary" to="/contact">Start a project</Link>}
 *     page="about"
 *   />
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
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-4%', '4%']);

  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <div className="site-container text-center">
        {breadcrumb.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 flex items-center justify-center gap-1.5 text-[13px] text-subtle"
          >
            <Link to="/" className="hover:text-fg transition-colors">Home</Link>
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                {item.to ? (
                  <Link to={item.to} className="hover:text-fg transition-colors">{item.label}</Link>
                ) : (
                  <span className="text-fg/80">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="eyebrow mb-4"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease }}
          className="text-display-xl text-fg max-w-5xl mx-auto"
        >
          {title}
          {highlight && (
            <>
              {' '}
              <span className="text-accent">{highlight}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="mt-6 text-[18px] sm:text-[21px] leading-[1.5] text-muted max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {image && (
        <motion.div
          ref={frameRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="site-container mt-12 sm:mt-16"
        >
          <div className="relative overflow-hidden rounded-[22px] sm:rounded-panel bg-sunken aspect-[4/3] sm:aspect-[16/8] lg:aspect-[21/9]">
            <motion.img
              {...image}
              alt={imageAlt}
              fetchPriority="high"
              style={{ scale, y }}
              className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
            />
          </div>
        </motion.div>
      )}

      {stats && stats.length > 0 && (
        <div className="site-container mt-10 sm:mt-14">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 border-y border-line/80 dark:border-line py-8 sm:py-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease }}
                className={`text-center px-3 ${i % 2 === 1 ? 'border-l border-line/80 dark:border-line' : ''} ${i >= 1 ? 'lg:border-l lg:border-line/80 dark:lg:border-line' : ''}`}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[28px] sm:text-[40px] font-semibold tracking-tight text-fg leading-none">{s.value}</dd>
                <dd className="mt-2 text-[14px] font-medium text-fg/90">{s.label}</dd>
                {s.sub && <dd className="mt-0.5 text-[12.5px] text-subtle">{s.sub}</dd>}
              </motion.div>
            ))}
          </dl>
        </div>
      )}

      {children}
    </section>
  );
};

export default PageHero;
