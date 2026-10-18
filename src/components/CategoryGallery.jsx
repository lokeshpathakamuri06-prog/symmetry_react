import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { useCategories } from '../context/PublicContentContext';
import SmartImage from './SmartImage';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

/** Shop by Category: every category at once, as round photo tiles with the name and piece count */
export const CategoryGallery = () => {
  const { items } = useCategories();
  if (!items.length) return null;
  return (
    <ul className="site-container grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12" aria-label="Furniture categories">
      {items.map((cat, i) => (
        <m.li {...reveal({ order: i % 6 })} key={cat.id}>
          <Link to={`/shop?category=${cat.slug}`} className="group flex flex-col items-center text-center rounded-tile">
            <div className="relative w-full max-w-[150px] aspect-square rounded-full p-1 ring-1 ring-line group-hover:ring-2 group-hover:ring-accent transition-[box-shadow] duration-300">
              <div className="absolute inset-1 rounded-full overflow-hidden bg-sunken">
                <SmartImage
                  sizes="150px"
                  src={cat.image}
                  alt={`${cat.name} collection`}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK;
                  }}
                  loading="lazy"
                  className="tile-media w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-on-accent text-[11px] font-semibold leading-tight whitespace-nowrap shadow-sm">
                {cat.productCount} {cat.productCount === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <h3 className="mt-4 text-[14px] sm:text-[16px] font-semibold tracking-tight text-fg leading-snug group-hover:text-accent transition-colors">
              {cat.name}
            </h3>
          </Link>
        </m.li>
      ))}
    </ul>
  );
};

export default CategoryGallery;
