import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { useCart } from '../context/CartContext';
import { discountOf, isInStock, isSoldOut, fewLeft, stockLabel, formatINR, productPath } from '../lib/shop';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';
import Stars from './shop/Stars';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

/** Badge text colour, Apple Store style ("New" in orange above the name) */
const badgeOf = (product) => {
  const raw = (product.badge || '').toLowerCase();
  if (raw.includes('bestseller') || raw.includes('hot') || raw.includes('popular')) return { tone: 'text-[#B64400] dark:text-[#FF8A3D]', label: 'Bestseller' };
  if (raw.includes('new') || raw.includes('recent')) return { tone: 'text-[#B64400] dark:text-[#FF8A3D]', label: 'New Arrival' };
  if (raw.includes('signature') || raw.includes('bespoke') || raw.includes('executive')) return { tone: 'text-accent', label: product.badge || 'Signature' };
  return { tone: 'text-accent', label: product.badge || 'Architect Choice' };
};

/**
 * Product tile for the shop grid and Home: photo, badge, name, category, star rating,
 * stock, price with M.R.P. and discount, Add to Cart and Quick view. The whole photo
 * and the name open the product page.
 */
export const ProductCard = ({ product, onQuickView, index = 0 }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => product.images?.[0] || product.image || FALLBACK_IMAGE);

  const isWishlisted = wishlist?.includes(product.id);
  const discount = discountOf(product);
  const inStock = isInStock(product);
  const soldOut = isSoldOut(product);
  const left = fewLeft(product);
  const badge = badgeOf(product);

  const handleAdd = (e) => {
    e.preventDefault();
    // Signed out: addToCart sends the visitor to sign in and adds the item afterwards
    addToCart(product, 1).then((ok) => {
      if (!ok) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
  };

  return (
    <m.div {...reveal({ order: index % 3 })} className="h-full">
      <AppleCardWrapper className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-sunken">
          <Link to={productPath(product)} className="block w-full h-full" tabIndex={-1} aria-hidden="true">
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
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
            className="glass absolute top-3 right-3 w-9 h-9 rounded-full text-fg flex items-center justify-center active:scale-90 transition-transform z-10 cursor-pointer"
          >
            <Heart className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'fill-[#E0533D] text-[#E0533D]' : 'text-current'}`} />
          </button>

          {discount > 0 && (
            <span className="absolute top-3 left-3 z-10 rounded-full bg-[#B64400] text-white text-[11px] sm:text-[12px] font-semibold px-2 py-0.5">
              {discount}% off
            </span>
          )}

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="glass absolute bottom-3 left-1/2 -translate-x-1/2 z-10 hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-fg text-[13px] font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-300 ease-apple cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Quick view
            </button>
          )}
        </div>

        <div className="p-3.5 sm:p-5 flex flex-col flex-1">
          <span className={`text-[11.5px] sm:text-[12.5px] font-semibold ${badge.tone}`}>{badge.label}</span>
          <Link to={productPath(product)} className="block mt-0.5">
            <h3 className="text-[14.5px] sm:text-[17px] font-semibold tracking-tight text-fg leading-snug line-clamp-2 hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="mt-0.5 text-[12px] sm:text-[13px] text-muted truncate">
            {product.categoryName || product.category || product.collection || 'Interiors'}
          </span>

          <Stars rating={product.rating || 0} count={product.reviewCount} className="mt-2 text-[12px] sm:text-[13px]" />

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[17px] sm:text-[20px] font-semibold tracking-tight text-fg">{formatINR(product.price)}</span>
            {discount > 0 && (
              <span className="text-[12px] sm:text-[13px] text-subtle">
                M.R.P. <span className="line-through">{formatINR(product.originalPrice)}</span>
              </span>
            )}
          </div>

          <span className={`mt-1 inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] ${soldOut ? 'text-red-600 dark:text-red-400' : inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${soldOut ? 'bg-red-500' : inStock ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {stockLabel(product)}
            {left > 0 && <span className="font-semibold"> · Only {left} left</span>}
            {!inStock && !soldOut && product.leadTime && <span className="text-muted">· {product.leadTime}</span>}
          </span>

          <div className="mt-auto pt-4">
            <button
              onClick={handleAdd}
              disabled={soldOut}
              aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
              className={`btn btn-sm w-full !text-[13.5px] sm:!text-[14px] ${soldOut ? 'bg-sunken text-muted cursor-not-allowed' : added ? 'bg-emerald-600 text-white' : 'bg-accent text-on-accent hover:bg-accent-hover'}`}
            >
              {soldOut ? (
                'Out of stock'
              ) : added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ProductCard;
