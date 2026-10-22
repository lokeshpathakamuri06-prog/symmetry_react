import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SmartImage from '../SmartImage';
import { formatINR } from '../../lib/shop';

/** "Added to cart" card after Add to Cart (as on Amazon): the piece, the cart total, and buttons to the cart or checkout */
export const CartToast = () => {
  const { lastAdded, dismissAdded, cartCount, subtotal } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!lastAdded) return undefined;
    const t = setTimeout(dismissAdded, 6000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissAdded]);

  // Leaving the page closes it
  useEffect(() => {
    dismissAdded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const p = lastAdded?.product;
  return (
    <AnimatePresence>
      {p && (
        <m.div
          key={lastAdded.at}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="fixed z-[1050] top-[calc(var(--gnav-offset)+12px)] inset-x-3 sm:inset-x-auto sm:right-6 sm:w-[360px] p-4 rounded-2xl bg-surface border border-line shadow-tile-hover"
        >
          <div className="flex items-start gap-3">
            <SmartImage sizes="56px" src={p.images?.[0] || p.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-sunken shrink-0" />
            <div className="flex-1 min-w-0">
              {lastAdded.error ? (
                <p className="flex items-center gap-1.5 text-[14px] font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" /> Not added
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Added to cart
                </p>
              )}
              <p className="text-[14px] text-fg truncate">{p.name}</p>
              <p className="text-[12px] text-muted">
                {lastAdded.error || `Cart: ${cartCount} ${cartCount === 1 ? 'item' : 'items'} · ${formatINR(subtotal)}`}
              </p>
            </div>
            <button type="button" onClick={dismissAdded} className="p-1 -m-1 text-muted hover:text-fg" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          {!lastAdded.error && <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/cart" className="py-2.5 rounded-full border border-line text-center text-[14px] font-semibold text-fg hover:border-accent">
              Go to cart
            </Link>
            <Link to="/checkout" className="py-2.5 rounded-full bg-accent text-on-accent text-center text-[14px] font-semibold hover:bg-accent-hover">
              Checkout
            </Link>
          </div>}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
