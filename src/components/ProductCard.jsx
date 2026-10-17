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

  // Badge text colour, Apple Store style ("New" in orange above the name)
  const getBadgeConfig = () => {
    const raw = (product.badge || '').toLowerCase();
    if (raw.includes('bestseller') || raw.includes('hot') || raw.includes('popular')) {
      return {
        text: 'text-[#B64400] dark:text-[#FF8A3D]',
        label: 'Bestseller',
      };
    }
    if (raw.includes('new') || raw.includes('recent')) {
      return {
        text: 'text-[#B64400] dark:text-[#FF8A3D]',
        label: 'New Arrival',
      };
    }
    if (raw.includes('signature') || raw.includes('bespoke') || raw.includes('executive')) {
      return {
        text: 'text-accent',
        label: product.badge || 'Signature',
      };
    }
    return {
      text: 'text-accent',
      label: product.badge || 'Architect Choice',
    };
  };

  const badgeConfig = getBadgeConfig();

  const inStock = product.inStock !== false && product.stockStatus !== 'Made to Order';

  return (
    <m.div {...reveal({ order: index % 3 })} className="h-full">
      <AppleCardWrapper className="flex flex-col h-full">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden bg-sunken">
          <Link to={`/shop/${product.id}`} className="block w-full h-full" tabIndex={-1} aria-hidden="true">
            <SmartImage
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              loading="lazy"
              className="tile-media w-full h-full object-cover"
            />
          </Link>

          <button
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="glass absolute top-3 right-3 w-9 h-9 rounded-full text-fg flex items-center justify-center active:scale-90 transition-transform z-10 cursor-pointer"
          >
            <Heart className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'fill-[#E0533D] text-[#E0533D]' : 'text-current'}`} />
          </button>

          {/* Hover actions (desktop) */}
          <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0 transition-all duration-300 ease-apple z-10">
            <button
              onClick={handleQuickAdd}
              aria-label="Quick add to bag"
              className="glass flex-1 h-10 px-3 rounded-full text-fg text-[13px] font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97] transition-transform"
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
              className="glass w-10 h-10 rounded-full text-fg flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 sm:p-6 flex flex-col flex-1">
          <span className={`text-[12px] sm:text-[13px] font-semibold mb-1 ${badgeConfig.text}`}>{badgeConfig.label}</span>
          <Link to={`/shop/${product.id}`} className="block">
            <h3 className="text-[15px] sm:text-[19px] font-semibold tracking-tight text-fg leading-snug line-clamp-2 sm:line-clamp-1 hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="mt-0.5 text-[12.5px] sm:text-[14px] text-muted truncate">
            {product.categoryName || product.category || product.collection || 'Interiors'}
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px] text-muted">
            <span className="inline-flex items-center gap-1 text-fg">
              <Star className="w-3 h-3 fill-current" />
              {product.rating ? product.rating.toFixed(1) : '4.9'}
            </span>
            <span>({product.reviewCount || 18})</span>
            <span className={`sm:ml-auto inline-flex items-center gap-1.5 ${inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {product.stockStatus || (product.inStock !== false ? 'In Stock' : 'Made to Order')}
            </span>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-4">
              <span className="text-[16px] sm:text-[19px] font-semibold tracking-tight text-fg">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[12.5px] text-subtle line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-[12px] font-medium text-[#B64400] dark:text-[#FF8A3D]">{discountPercent}% off</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link to={`/shop/${product.id}`} aria-label={`View details of ${product.name}`} className="btn-primary btn-sm">
                Details
              </Link>
              <button
                onClick={handleQuickViewClick}
                aria-label="Quick View specifications"
                className="link-apple !text-[14px] cursor-pointer"
              >
                Quick view <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ProductCard;

