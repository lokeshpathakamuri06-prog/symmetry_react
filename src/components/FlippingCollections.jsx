import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCw, Pause, Play } from 'lucide-react';

export const FlippingCollections = () => {
  const collections = [
    {
      id: 'living',
      name: 'Living',
      slug: 'living',
      tagline: 'Sculptural Seating & Compositions',
      frontImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      itemCount: '18 Curated Pieces',
      palette: ['Roman Travertine', 'Italian Bouclé', 'Smoked European Oak'],
      signaturePieces: 'Aurelia Curved Sofa &bull; Solarium Coffee Table',
      narrative: 'Continuous curved contours, deep lounging proportions, and monolithic raw travertine designed for open-plan entertaining.',
    },
    {
      id: 'dining',
      name: 'Dining',
      slug: 'dining',
      tagline: 'Monolithic Stone & Entertaining',
      frontImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80',
      itemCount: '14 Curated Pieces',
      palette: ['Nero Marquina Marble', 'Champagne Brass', 'Smoked Ash'],
      signaturePieces: 'Palazzo Dining Table &bull; Monolith Credenza',
      narrative: 'Continuously bookmatched 30mm marble slabs paired with fluted brass pedestals and acoustic dampening for intimate gatherings.',
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      slug: 'bedroom',
      tagline: 'Sanctuary & Architectural Beds',
      frontImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      itemCount: '12 Curated Pieces',
      palette: ['Belgian Washed Linen', 'Canaletto Walnut', 'Integrated 2700K LEDs'],
      signaturePieces: 'Nuvola Bedstead &bull; Floating Slat Nightstands',
      narrative: 'Low-profile architectural headboards incorporating concealed perimeter illumination channels and whisper-quiet structural joinery.',
    },
    {
      id: 'lounge',
      name: 'Lounge',
      slug: 'lounge',
      tagline: 'Tactile Chairs & Daybeds',
      frontImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80',
      itemCount: '16 Curated Pieces',
      palette: ['Cognac Saddle Leather', 'Smoked Solid Ash', 'Gunmetal Bronze'],
      signaturePieces: 'Kanso Minimalist Chair &bull; Leather Chaise Daybed',
      narrative: 'Japanese wood joinery blended with Danish ergonomic restraint. Hand-cut mortise joints cradling supple vegetable-tanned leather.',
    },
    {
      id: 'office',
      name: 'Office',
      slug: 'office',
      tagline: 'Executive Suites & Workspace',
      frontImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
      itemCount: '8 Curated Pieces',
      palette: ['Solid Canaletto Walnut', 'Italian Leather Blotter', 'Anodized Bronze'],
      signaturePieces: 'Kyoto Executive Desk &bull; Biometric Credenza',
      narrative: 'Authoritative yet airy executive desks with cantilevered walnut surfaces, concealed inductive chargers, and velvet-lined biometric drawers.',
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      slug: 'outdoor',
      tagline: 'All-Weather Teak & Bronze',
      frontImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      itemCount: '10 Curated Pieces',
      palette: ['Plantation Teak', 'Sunbrella Marine Weaves', 'Patinated Bronze'],
      signaturePieces: 'Pavilion Daybed &bull; Boulder Outdoor Dining',
      narrative: 'Kiln-dried tropical hardwoods treated to withstand subtropical moisture and intense sun, paired with quick-dry reticulated foam.',
    },
  ];

  // Track which card is currently flipped
  const [activeFlippedIndex, setActiveFlippedIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Automatic sequential card flip timer
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setActiveFlippedIndex((prev) => (prev + 1) % collections.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [autoPlay, collections.length]);

  const handleCardClick = (index) => {
    setUserInteracted(true);
    // If clicking already flipped card, flip it back, otherwise flip clicked card
    setActiveFlippedIndex((prev) => (prev === index ? -1 : index));
  };

  const flipAllCards = () => {
    setUserInteracted(true);
    setActiveFlippedIndex((prev) => (prev === -2 ? 0 : -2)); // -2 means all flipped
  };

  return (
    <div className="space-y-8">
      {/* Top Bar with Dynamic Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D1DCDE]/70 dark:border-[#1E3447]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#36656B] dark:bg-[#BCA575] animate-ping" />
          <span className="text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] font-medium">
            Sequential 3D Reveal &bull; Flip to Inspect Craft
          </span>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Active Card Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
            <span>Active Reveal:</span>
            <strong className="text-[#36656B] dark:text-[#BCA575] font-serif uppercase tracking-wider">
              {activeFlippedIndex >= 0 && activeFlippedIndex < collections.length
                ? collections[activeFlippedIndex].name
                : activeFlippedIndex === -2
                ? 'All Revealed'
                : 'Manual Mode'}
            </strong>
          </div>

          {/* Toggle AutoPlay */}
          <button
            onClick={() => setAutoPlay((prev) => !prev)}
            aria-label={autoPlay ? 'Pause automatic flip' : 'Resume automatic flip'}
            className="px-3.5 py-1.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] flex items-center gap-1.5 transition-colors"
          >
            {autoPlay ? (
              <>
                <Pause className="w-3 h-3 text-[#36656B]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#36656B]" />
                <span>Auto-Flip</span>
              </>
            )}
          </button>

          {/* Quick Flip All / Reset */}
          <button
            onClick={flipAllCards}
            aria-label="Flip all cards"
            className="px-3.5 py-1.5 rounded-full bg-[#E5ECEC]/60 dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3 h-3 text-[#36656B]" />
            <span>{activeFlippedIndex === -2 ? 'Reset Front' : 'Flip All'}</span>
          </button>
        </div>
      </div>

      {/* 6 Cards 3D Flip Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 [perspective:1400px]">
        {collections.map((col, index) => {
          const isFlipped = activeFlippedIndex === -2 || activeFlippedIndex === index;

          return (
            <div
              key={col.id}
              onClick={() => handleCardClick(index)}
              className="relative h-[480px] sm:h-[500px] w-full cursor-pointer group select-none [perspective:1200px]"
            >
              {/* Inner 3D Container */}
              <div
                className={`relative w-full h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] shadow-luxury ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* ================= FRONT FACE ================= */}
                <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] [backface-visibility:hidden] border border-[#D1DCDE] dark:border-[#1E3447]">
                  <img
                    src={col.frontImage}
                    alt={col.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07121C]/90 via-[#07121C]/40 to-transparent" />

                  {/* Front Top Badge */}
                  <div className="absolute top-5 inset-x-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-luxury font-medium bg-[#131E20]/80 backdrop-blur-md text-white border border-white/15">
                      Collection 0{index + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-semibold bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {col.itemCount}
                    </span>
                  </div>

                  {/* Front Bottom Content */}
                  <div className="absolute bottom-5 inset-x-5 text-white">
                    <span className="text-xs uppercase tracking-luxury text-[#BCA575] font-semibold block mb-1">
                      {col.tagline}
                    </span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl sm:text-4xl font-serif font-normal">
                        {col.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:bg-[#BCA575] group-hover:text-[#07121C] transition-colors">
                        <RotateCw className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-white/70 uppercase tracking-luxury">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#BCA575]" />
                      <span>Click to flip &amp; inspect craft</span>
                    </div>
                  </div>
                </div>

                {/* ================= BACK FACE ================= */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-7 sm:p-8 bg-[#0D1C29] text-[#F5F1E8] border border-[#BCA575]/40 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-2xl">
                  {/* Back Top Header */}
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-semibold block">
                          Architectural Curation
                        </span>
                        <h4 className="text-2xl font-serif text-white mt-0.5">
                          {col.name} Collection
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#BCA575] px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        0{index + 1}/06
                      </span>
                    </div>

                    {/* Narrative */}
                    <p className="text-xs sm:text-sm text-[#AEB7BE] leading-relaxed font-light mt-5">
                      {col.narrative}
                    </p>

                    {/* Materiality Palette */}
                    <div className="mt-5 space-y-2">
                      <span className="text-[10px] uppercase tracking-luxury text-white/80 font-semibold block">
                        Materiality Palette
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {col.palette.map((mat, mIdx) => (
                          <span
                            key={mIdx}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[#F5F1E8]"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Signature Pieces */}
                    <div className="mt-4 pt-3 border-t border-white/10 text-xs">
                      <span className="text-[10px] uppercase tracking-luxury text-[#BCA575] font-semibold block mb-1">
                        Signature Benchmark Pieces:
                      </span>
                      <p
                        className="text-[#F5F1E8]/90 font-serif text-sm italic"
                        dangerouslySetInnerHTML={{ __html: col.signaturePieces }}
                      />
                    </div>
                  </div>

                  {/* Back Bottom CTA Link */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-luxury text-[#AEB7BE]">
                      Click to flip back
                    </span>
                    <Link
                      to={`/shop?category=${col.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium px-4 py-2 rounded-full bg-[#BCA575] text-[#07121C] hover:bg-white transition-colors shadow-md"
                    >
                      <span>Explore {col.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlippingCollections;
