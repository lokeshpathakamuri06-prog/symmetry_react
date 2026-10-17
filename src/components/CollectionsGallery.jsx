import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { reveal } from '../lib/motion';
import { useCollections } from '../context/PublicContentContext';
import SectionHeading from './SectionHeading';
import CardGallery from './CardGallery';
import SmartImage from './SmartImage';

/**
 * Home: "Designs That Inspire Living". Cards are the admin "Collections" marked Featured
 * that have a cover image, in admin order: a clean tall photo, then the words under it.
 */
export const CollectionsGallery = ({ className = '' }) => {
  const items = useCollections().items.filter((c) => c.featured && c.image);
  if (!items.length) return null;

  return (
    <section className={`section overflow-x-clip ${className}`}>
      <div className="site-container mb-10 sm:mb-14">
        <SectionHeading
          eyebrow="Our Featured Collection"
          title="Designs That Inspire Living"
          subtitle="Curated furniture pieces for modern spaces, crafted to last."
        />
      </div>

      <CardGallery label="Featured collections">
        {items.map((c, i) => (
          <m.div {...reveal({ order: i })} key={c.id} className="w-[78vw] sm:w-[372px]">
            <Link to={c.link || '/shop'} className="group block">
              <div className="relative aspect-[4/5] rounded-tile overflow-hidden bg-sunken">
                <SmartImage
                  src={c.image}
                  sizes="(min-width: 640px) 372px, 78vw"
                  alt={c.title}
                  loading="lazy"
                  className="tile-media absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="pt-5 px-1">
                <p className="text-[13px] font-semibold text-accent">
                  {[String(i + 1).padStart(2, '0'), c.label].filter(Boolean).join(' — ')}
                </p>
                <h3 className="mt-1 text-[24px] sm:text-[28px] font-semibold tracking-tight text-fg leading-tight">{c.title}</h3>
                {c.subtitle && <p className="mt-1 text-[15px] sm:text-[17px] text-muted leading-snug">{c.subtitle}</p>}
                <span className="link-apple mt-3 !text-[15px]">
                  View Product <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </m.div>
        ))}
      </CardGallery>
    </section>
  );
};

export default CollectionsGallery;
