import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { useCategories } from '../context/PublicContentContext';
import CardGallery from './CardGallery';
import SmartImage from './SmartImage';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

/** Shop by Category: small square photo tiles with the name and piece count, in a swipeable row */
export const CategoryGallery = () => {
  const { items } = useCategories();
  if (!items.length) return null;
  return (
    <CardGallery label="Furniture categories">
      {items.map((cat, i) => (
        <m.div {...reveal({ order: i })} key={cat.id} className="w-[44vw] sm:w-[224px]">
          <Link to={`/shop?category=${cat.slug}`} className="group block">
            <div className="card-apple aspect-square overflow-hidden">
              <SmartImage
                sizes="224px"
                src={cat.image}
                alt={cat.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK;
                }}
                loading="lazy"
                className="tile-media w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-3 px-1 text-[15px] sm:text-[17px] font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
              {cat.name}
            </h3>
            <p className="px-1 text-[13px] text-muted">
              {cat.productCount} {cat.productCount === 1 ? 'Piece' : 'Pieces'}
            </p>
            <p className="px-1 mt-1 text-[13px] text-subtle line-clamp-2">{cat.description}</p>
          </Link>
        </m.div>
      ))}
    </CardGallery>
  );
};

export default CategoryGallery;
