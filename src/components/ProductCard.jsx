import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Star, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { useCart } from '../context/CartContext';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

/**
 * ProductCard Component
 * Enhanced with Apple Mac signature 3D tilt, spotlight glare tracking & architectural reveal:
 *  - Responsive viewport triggering (margin: 50px pre-trigger) so images always load on mobile/tablet
 *  - Fallback error handler so broken images automatically replace with luxury interior placeholders
 *  - Line-mask motion text for category, serif title, and price metadata
 */
export const ProductCard = ({ product, onQuickView, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => product.images?.[0] || product.image || FALLBACK_IMAGE);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('symmetry_wishlist') || '[]');
      return saved.includes(product.id);
    } catch {
      return false;
    }
  });

  // Stagger delay based on column index (wave effect)

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem('symmetry_wishlist') || '[]');
      let updated;
      if (saved.includes(product.id)) {
        updated = saved.filter((id) => id !== product.id);
        setIsWishlisted(false);
      } else {
        updated = [...saved, product.id];
        setIsWishlisted(true);
      }
      localStorage.setItem('symmetry_wishlist', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/shop/${product.id}`);
    }
  };

  // Discount percentage calculation
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Curated Luxury Accent Badges: Olive, Terracotta, Mustard, Deep Blue
  const getBadgeConfig = () => {
    const raw = (product.badge || '').toLowerCase();
    if (raw.includes('bestseller') || raw.includes('hot') || raw.includes('popular')) {
      return {
        bg: 'bg-[#C06C52]', // Terracotta
        text: 'text-[#FFFFFF]',
        label: 'BESTSELLER',
      };
    }
    if (raw.includes('new') || raw.includes('recent')) {
      return {
        bg: 'bg-[#C8963E]', // Mustard
        text: 'text-[#FFFFFF]',
        label: 'NEW ARRIVAL',
      };
    }
    if (raw.includes('signature') || raw.includes('bespoke') || raw.includes('executive')) {
      return {
        bg: 'bg-[#1D3557]', // Deep Blue
        text: 'text-[#FFFFFF]',
        label: product.badge ? product.badge.toUpperCase() : 'SIGNATURE',
      };
    }
    return {
      bg: 'bg-[#4A5D4E]', // Olive
      text: 'text-[#FFFFFF]',
      label: product.badge ? product.badge.toUpperCase() : 'ARCHITECT CHOICE',
    };
  };

  const badgeConfig = getBadgeConfig();

  return (
    <m.div
      {...reveal({ order: index % 3 })}
      className="h-full"
    >
      <AppleCardWrapper className="group relative flex flex-col h-full bg-surface overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-sunken">
        <m.div
          {...reveal({ variant: 'image', order: index % 3 })}
          className="w-full h-full relative"
        >
          <Link to={`/shop/${product.id}`} className="block w-full h-full overflow-hidden">
            <SmartImage sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.04]"
            />
          </Link>
        </m.div>

        {/* Badge */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="glass inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-luxury text-fg">
            <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.bg}`} />
            {badgeConfig.label}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="glass absolute top-3 right-3 w-9 h-9 rounded-full text-fg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'fill-[#C06C52] text-[#C06C52]' : 'text-current'}`} />
        </button>

        {/* Hover actions (desktop) */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-apple z-10">
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to bag"
            className="glass flex-1 h-10 px-3 rounded-full text-fg hover:bg-fg hover:text-canvas text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
          <button
            onClick={handleQuickViewClick}
            aria-label="Quick View specification"
            title="Quick View"
            className="glass w-10 h-10 rounded-full text-fg hover:bg-fg hover:text-canvas transition-colors flex items-center justify-center cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-[12px] font-medium text-accent truncate mb-1">
          {product.categoryName || product.category || product.collection || 'Interiors'}
        </span>

        <Link to={`/shop/${product.id}`} className="block mb-2">
          <h3 className="text-[16px] sm:text-[18px] font-semibold tracking-tight text-fg leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-1 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1 text-fg">
            <Star className="w-3 h-3 fill-current" />
            {product.rating ? product.rating.toFixed(1) : '4.9'}
          </span>
          <span>({product.reviewCount || 18})</span>
          <span className={`ml-auto inline-flex items-center gap-1.5 ${
            product.inStock !== false && product.stockStatus !== 'Made to Order'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              product.inStock !== false && product.stockStatus !== 'Made to Order' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            {product.stockStatus || (product.inStock !== false ? 'In Stock' : 'Made to Order')}
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-4">
            <span className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-fg">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[13px] text-subtle line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent && discountPercent > 0 && (
              <span className="text-[12px] font-medium text-[#B4583E] dark:text-[#E08B70]">
                {discountPercent}% off
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View specifications"
              className="h-10 rounded-full border border-fg/15 text-fg hover:border-fg/40 text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick</span> View
            </button>
            <Link
              to={`/shop/${product.id}`}
              aria-label="View Details"
              className="h-10 rounded-full bg-fg text-canvas hover:opacity-85 text-[13px] font-medium transition-opacity flex items-center justify-center gap-1 cursor-pointer group/btn"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ProductCard;

