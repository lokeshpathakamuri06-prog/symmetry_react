import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { reveal } from '../lib/motion';
import SectionHeading from './SectionHeading';
import CardGallery from './CardGallery';

// 5 curated global sourcing hubs: Italy, China, Malaysia, Vietnam, Bali
const SOURCING_HUBS = [
  {
    id: '01',
    categoryNumber: '01 — ITALY',
    country: 'Italy',
    region: 'Milan, Brianza & Verona',
    title: 'Carrara Marble & Haute Ateliers',
    subtitle: 'Direct quarry blocks, bookmatched travertine & generational leather tailoring.',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80',
    link: '/sourcing',
    coords: '45.4642° N, 9.1900° E',
    curations: ['Bookmatched Travertine', 'Saddle Leather', 'Murano Glass'],
  },
  {
    id: '02',
    categoryNumber: '02 — CHINA',
    country: 'China',
    region: 'Foshan & Greater Bay Area',
    title: 'Precision 5-Axis CNC Joinery',
    subtitle: 'Precision metalwork, bronze details and sound-absorbing panels.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    link: '/sourcing',
    coords: '23.0215° N, 113.1214° E',
    curations: ['Anodized Metals', 'Acoustic Glazing', 'Precision Hardware'],
  },
  {
    id: '03',
    categoryNumber: '03 — MALAYSIA',
    country: 'Malaysia',
    region: 'Selangor & Penang',
    title: 'FSC Plantation Teak & Hardwoods',
    subtitle: 'Vacuum kiln-dried hardwoods seasoned to withstand high subtropical humidity.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    link: '/sourcing',
    coords: '3.0738° N, 101.5183° E',
    curations: ['Engineered Solid Teak', 'Marine Joinery', 'Balau Woodwork'],
  },
  {
    id: '04',
    categoryNumber: '04 — VIETNAM',
    country: 'Vietnam',
    region: 'Binh Duong & Da Nang',
    title: 'Handcrafted Cane & Ceramic Stoneware',
    subtitle: 'Generational weavers crafting organic weaves, cane panels & sculptural planters.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    link: '/sourcing',
    coords: '11.0168° N, 106.6663° E',
    curations: ['Hand-Woven Cane', 'Ceramic Vessels', 'Natural Cordage'],
  },
  {
    id: '05',
    categoryNumber: '05 — BALI',
    country: 'Bali',
    region: 'Gianyar & Ubud',
    title: 'Volcanic Basalt & Root Sculptures',
    subtitle: 'Solid river-stone basins and sculptural timber pieces.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    link: '/sourcing',
    coords: '8.5069° S, 115.2625° E',
    curations: ['Basalt Basins', 'Teak Root Carvings', 'Tactile Urns'],
  },
];


/** Home: "Sourced Directly from the Makers", one tall photo card per country in a swipeable gallery */
export const SourcingGallery = ({ className = '' }) => (
  <section className={`section overflow-x-clip ${className}`}>
    <div className="site-container mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <SectionHeading
        eyebrow="Global Sourcing"
        title="Sourced Directly from the Makers"
        subtitle="We buy directly from quarries, workshops and craftspeople in five countries, with no traders in between."
      />
      <m.div {...reveal({ order: 2 })} className="shrink-0">
        <Link to="/sourcing" className="link-apple">
          How We Source <ChevronRight className="w-4 h-4" />
        </Link>
      </m.div>
    </div>

    <CardGallery label="Sourcing countries">
      {SOURCING_HUBS.map((hub, i) => (
        <m.div {...reveal({ order: i })} key={hub.id} className="w-[44vw] sm:w-[400px]">
          <Link to={hub.link} className="group block">
            <div className="relative aspect-[4/5] rounded-tile overflow-hidden bg-sunken">
              <img
                src={hub.image}
                alt={`${hub.country}: ${hub.title}`}
                loading="lazy"
                decoding="async"
                className="tile-media absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="pt-3 sm:pt-5 px-1">
              <p className="text-[12px] sm:text-[13px] font-semibold text-accent truncate">{hub.region}</p>
              <h3 className="mt-0.5 sm:mt-1 text-[20px] sm:text-[32px] font-semibold tracking-tight text-fg leading-tight">{hub.country}</h3>
              <p className="mt-1 text-[13px] sm:text-[17px] text-muted leading-snug line-clamp-2 sm:line-clamp-none">{hub.title}</p>
            </div>
          </Link>
        </m.div>
      ))}
    </CardGallery>
  </section>
);

export default SourcingGallery;
