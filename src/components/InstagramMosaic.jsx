import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { useSiteText } from '../context/PublicContentContext';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const InstagramMosaic = () => {
  const { instagram } = useSiteText('company');
  const posts = [
    {
      image: '/drive_products/LC0001-1.jpeg',
      caption: 'Hans Sculptural Shell Chair • American Walnut & Nappa Leather',
      tag: '#SymmetryInteriors #TripodDesign',
    },
    {
      image: '/drive_products/LC0002.jpeg',
      caption: 'Forma Sculptural Seat • Steam-Bent Ash & Organic Ergonomics',
      tag: '#KyotoMinimalist #SolidHardwood',
    },
    {
      image: '/drive_products/LC0005.jpeg',
      caption: 'Aura Organic Bouclé Armchair in bespoke residence',
      tag: '#MilaneseMonolith #ItalianBouclé',
    },
    {
      image: '/drive_products/LC0007.jpeg',
      caption: 'Nordic Studio Occasional Chair with tailored saddle leather',
      tag: '#DanishHeritage #QuietLuxury',
    },
    {
      image: '/drive_products/LC0009.jpeg',
      caption: 'Pavilion Executive Club Chair • Obsidian Black Full-Grain',
      tag: '#JubileeAtelier #ExecutiveSuite',
    },
    {
      image: '/drive_products/LC0012.jpeg',
      caption: 'Checking the shape and finish in our studio',
      tag: '#CollectorFurniture #HyderabadArchitecture',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold mb-2 hover:opacity-80 transition-opacity group"
          >
            <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-[1.05]" />
            <span>@symmetryinteriors.ltd</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <h3 className="text-2xl sm:text-3xl font-serif text-fg">
            Follow Our Work on Instagram
          </h3>
        </div>

        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[14px] sm:text-[15px] tracking-[-0.01em] font-medium text-fg hover:text-accent transition-colors px-4 py-2 rounded-full border border-line hover:border-accent"
        >
          <span>Follow On Instagram</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* 6-Grid Mosaic */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {posts.map((post, idx) => (
          <m.a
            {...reveal({ order: idx })}
            key={idx}
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl overflow-hidden bg-sunken block"
          >
            <img
              src={post.image}
              alt={post.caption}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
              <div className="flex justify-end">
                <InstagramIcon className="w-4 h-4 text-[#BCA575]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-light leading-snug line-clamp-3 text-[#F5F1E8]">
                  {post.caption}
                </p>
                <span className="text-[11px] sm:text-xs uppercase tracking-luxury text-[#BCA575] mt-1.5 block font-medium">
                  {post.tag}
                </span>
              </div>
            </div>
          </m.a>
        ))}
      </div>
    </div>
  );
};

export default InstagramMosaic;
