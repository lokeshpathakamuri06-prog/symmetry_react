import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { reveal } from '../lib/motion';
import { useCollections } from '../context/PublicContentContext';
import SectionHeading from './SectionHeading';
import SmartImage from './SmartImage';

/**
 * Grid placement for card i of n, as an editorial mosaic.
 * Phones (2 columns): the first card runs full width, the rest are squares; a lone last card runs full width.
 * Desktop (4 columns): the first card is a 2×2 feature, the next four are single tiles,
 * later cards pair up two columns wide, and a lone last card becomes a full-width banner.
 */
const placement = (i, n) => {
  const phoneWide = i === 0 || (i === n - 1 && (n - 1) % 2 === 1);
  let desktop = 'lg:col-span-1 lg:row-span-1';
  if (i === 0) desktop = 'lg:col-span-2 lg:row-span-2';
  else if (i >= 5) desktop = i === n - 1 && (n - 5) % 2 === 1 ? 'lg:col-span-4' : 'lg:col-span-2';
  return `${phoneWide ? 'col-span-2' : 'col-span-1'} ${desktop}`;
};

/**
 * Home: "Designs That Inspire Living". Cards are the admin "Collections" marked Featured
 * that have a cover image, in admin order, laid out as a photo mosaic with the words on the photo.
 */
export const CollectionsGallery = ({ className = '' }) => {
  const items = useCollections().items.filter((c) => c.featured && c.image);
  if (!items.length) return null;

  return (
    <section className={`section ${className}`}>
      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="Our Featured Collection"
            title="Designs That Inspire Living"
            subtitle="Curated furniture pieces for modern spaces, crafted to last."
          />
          <m.div {...reveal({ order: 2 })} className="shrink-0">
            <Link to="/shop" className="link-apple">
              Shop all collections <ChevronRight className="w-4 h-4" />
            </Link>
          </m.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[190px] sm:auto-rows-[240px] lg:auto-rows-[260px] gap-3 sm:gap-4">
          {items.map((c, i) => {
            const feature = i === 0;
            return (
              <m.div {...reveal({ variant: 'scaleIn', order: i % 4 })} key={c.id} className={placement(i, items.length)}>
                <Link
                  to={c.link || '/shop'}
                  className="group relative block h-full rounded-tile overflow-hidden bg-sunken isolate focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <SmartImage
                    src={c.image}
                    sizes={feature ? '(min-width: 1024px) 600px, 100vw' : '(min-width: 1024px) 600px, 50vw'}
                    alt={c.title}
                    loading="lazy"
                    className="tile-media absolute inset-0 -z-10 w-full h-full object-cover"
                  />
                  {/* Navy fade so the words read on any photo */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a1426]/90 via-[#0a1426]/45 via-40% to-transparent to-75% transition-opacity duration-500 group-hover:opacity-90"
                  />

                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-[12px] font-semibold tracking-[0.08em] text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-white text-[#0a1426] inline-flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
                    {c.label && (
                      <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-[#E3C892]">{c.label}</p>
                    )}
                    <h3
                      className={`mt-1 font-semibold tracking-tight leading-tight ${
                        feature ? 'text-[24px] sm:text-[36px] lg:text-[44px]' : 'text-[17px] sm:text-[22px]'
                      }`}
                    >
                      {c.title}
                    </h3>
                    {c.subtitle && (
                      <p
                        className={`mt-1 text-white/80 leading-snug ${
                          feature ? 'text-[14px] sm:text-[17px] max-w-md' : 'hidden sm:block text-[14px] line-clamp-2'
                        }`}
                      >
                        {c.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGallery;
