import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Star, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

/**
 * ProductCard Component
 * Enhanced with Yoo Interior signature architectural reveal tuned for mobile, tablet, and desktop:
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
  const staggerDelay = (index % 3) * 0.1;

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px 0px' }}
      transition={{ duration: 0.5, delay: staggerDelay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col h-full bg-[#FCFAF6] dark:bg-[#0D1C29] rounded-2xl sm:rounded-3xl border border-[#ECE5D8] dark:border-[#1E3447] overflow-hidden shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(19,30,32,0.12)] dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-400"
    >
      {/* =========================================================================
          YOO INTERIOR SIGNATURE SHUTTER REVEAL IMAGE CONTAINER
      ========================================================================= */}
      <div className="relative aspect-square overflow-hidden bg-[#F3EFE6] dark:bg-[#132838]">
        {/* Shutter Clip-Path Wipe Layer with pre-trigger viewport margin for tablet/mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1.0 }}
          viewport={{ once: true, margin: '50px 0px' }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: staggerDelay,
          }}
          className="w-full h-full relative"
        >
          {/* Image with smooth zoom on hover */}
          <Link to={`/shop/${product.id}`} className="block w-full h-full overflow-hidden">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          </Link>
        </motion.div>

        {/* NEW / BESTSELLER Luxury Pill Badge (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 pointer-events-none z-10">
          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-luxury font-medium shadow-sm backdrop-blur-xs flex items-center gap-1.5 ${badgeConfig.bg} ${badgeConfig.text}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            {badgeConfig.label}
          </span>
        </div>

        {/* Wishlist Frosted Button (Top-Right) */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-[#07121C]/85 backdrop-blur-md border border-[#D1DCDE]/70 dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-sm z-10 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isWishlisted ? 'fill-[#C06C52] text-[#C06C52] scale-110' : 'text-current'
            }`}
          />
        </button>

        {/* Desktop Image Hover Floating Quick-Add / Quick-View Strip */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to bag"
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/95 dark:bg-[#07121C]/95 backdrop-blur-md text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#36656B] hover:text-white dark:hover:bg-[#BCA575] dark:hover:text-[#07121C] text-xs sm:text-sm font-medium tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="p-2.5 rounded-xl bg-white/95 dark:bg-[#07121C]/95 backdrop-blur-md text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] shadow-md transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          LINE-MASK MOTION TEXT: CATEGORY, SERIF NAME, RATING & PRICING
      ========================================================================= */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1">
        {/* Category Line */}
        <div className="mb-1">
          <span className="text-[11px] sm:text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block truncate">
            {product.categoryName ? product.categoryName.toUpperCase() : product.category ? product.category.toUpperCase() : product.collection || 'INTERIORS'}
          </span>
        </div>

        {/* Elegant Serif Product Name */}
        <div className="mb-2">
          <Link to={`/shop/${product.id}`} className="block">
            <h3 className="font-serif text-base sm:text-lg md:text-xl font-normal text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Review Row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#4A5D4E] text-white text-[11px] font-semibold tracking-wide shadow-2xs">
            <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
            <Star className="w-2.5 h-2.5 fill-white text-white" />
          </div>

          <span className="text-[11px] sm:text-xs text-[#4F6467] dark:text-[#AEB7BE] font-light">
            ({product.reviewCount || 18})
          </span>

          {/* Stock Status Badge */}
          <span className={`ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-medium ${
            product.inStock !== false && product.stockStatus !== 'Made to Order'
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
              : 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              product.inStock !== false && product.stockStatus !== 'Made to Order'
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-amber-500'
            }`} />
            <span>{product.stockStatus || (product.inStock !== false ? 'In Stock' : 'Made to Order')}</span>
          </span>
        </div>

        {/* Price & Discount Section */}
        <div className="mt-auto pt-3 border-t border-[#ECE5D8]/80 dark:border-[#1E3447]/60">
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-3">
            <span className="text-base sm:text-lg md:text-2xl font-serif font-semibold text-[#131E20] dark:text-[#F5F1E8]">
              &#8379;{product.price.toLocaleString('en-IN')}
            </span>

            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-[#6B8083] dark:text-[#7D8A95] line-through font-light">
                &#8379;{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}

            {discountPercent && discountPercent > 0 && (
              <span className="text-[10px] sm:text-xs font-semibold text-[#C06C52] bg-[#C06C52]/10 border border-[#C06C52]/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Quick View & View Details Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View specifications"
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] hover:text-[#36656B] dark:hover:border-[#BCA575] dark:hover:text-[#BCA575] text-[11px] sm:text-xs md:text-sm font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#4A5D4E] dark:text-[#7E9683]" />
              <span className="hidden sm:inline">Quick</span> View
            </button>

            <Link
              to={`/shop/${product.id}`}
              aria-label="View Details"
              className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] hover:text-white text-[11px] sm:text-xs md:text-sm font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group/btn"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

