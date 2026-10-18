import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import SmartImage from '../components/SmartImage';
import CheckoutSteps from '../components/shop/CheckoutSteps';
import PriceDetails from '../components/shop/PriceDetails';
import { useCart, MAX_QTY } from '../context/CartContext';
import { useProducts } from '../context/PublicContentContext';
import { discountOf, formatINR, isInStock, isSoldOut, productPath, stockLabel } from '../lib/shop';
import useBuyBar from '../lib/useBuyBar';

const FALLBACK = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop';

const QtyStepper = ({ item, onChange }) => (
  <div className="inline-flex items-center rounded-full border border-line overflow-hidden" role="group" aria-label={`Quantity of ${item.name}`}>
    <button
      type="button"
      onClick={() => onChange(-1)}
      disabled={item.quantity <= 1}
      className="w-9 h-9 inline-flex items-center justify-center text-fg hover:bg-sunken disabled:opacity-40 disabled:hover:bg-transparent"
      aria-label="Decrease quantity"
    >
      <Minus className="w-3.5 h-3.5" />
    </button>
    <span className="w-9 text-center text-[15px] font-semibold text-fg tabular-nums" aria-live="polite">
      {item.quantity}
    </span>
    <button
      type="button"
      onClick={() => onChange(1)}
      disabled={item.quantity >= MAX_QTY}
      className="w-9 h-9 inline-flex items-center justify-center text-fg hover:bg-sunken disabled:opacity-40 disabled:hover:bg-transparent"
      aria-label="Increase quantity"
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  </div>
);

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, saveForLater, addToCart, wishlist, toggleWishlist, totalAmount, cartCount } = useCart();
  const { items: products } = useProducts();
  const [notice, setNotice] = useState(null); // { text, undo }
  useBuyBar(cartItems.length > 0);

  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const say = (text, undo) => {
    clearTimeout(timer.current);
    setNotice({ text, undo });
    timer.current = setTimeout(() => setNotice(null), 5000);
  };

  const handleRemove = (item) => {
    removeFromCart(item.cartKey);
    say(`${item.name} removed from your cart.`, () =>
      addToCart(item, item.quantity, { finish: item.selectedFinish, fabric: item.selectedFabric, silent: true })
    );
  };

  const handleSaveForLater = (item) => {
    saveForLater(item);
    say(`${item.name} moved to Saved for later.`);
  };

  const inCart = new Set(cartItems.map((i) => i.id));
  // Pieces that sold out after they were added (live stock); checkout would refuse them
  const live = Object.fromEntries(products.map((p) => [p.id, p]));
  const soldOut = cartItems.filter((i) => live[i.id] && isSoldOut(live[i.id]));
  const blocked = soldOut.length > 0;
  const saved = products.filter((p) => wishlist.includes(p.id) && !inCart.has(p.id));

  return (
    <div className="pt-[calc(var(--gnav-h)+32px)] pb-32 lg:pb-24 min-h-[75vh]">
      <SeoMeta title="Your order" noindex />

      <div className="site-container">
        {cartItems.length > 0 && <CheckoutSteps current={0} />}
        <div className="mt-8 flex items-end justify-between gap-4">
          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight text-fg leading-tight">
            Your cart{cartCount > 0 && <span className="text-muted font-normal text-[0.6em] ml-3">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>}
          </h1>
          {cartItems.length > 0 && (
            <Link to="/shop" className="hidden sm:inline text-[15px] font-medium text-accent hover:underline">
              Continue shopping
            </Link>
          )}
        </div>

        {/* Removed / saved notice with Undo */}
        <AnimatePresence>
          {notice && (
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="status"
              className="mt-6 px-4 py-3 rounded-xl bg-surface border border-line text-[14px] text-fg flex items-center justify-between gap-4"
            >
              <span>{notice.text}</span>
              {notice.undo && (
                <button
                  type="button"
                  onClick={() => {
                    notice.undo();
                    setNotice(null);
                  }}
                  className="inline-flex items-center gap-1.5 font-semibold text-accent shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Undo
                </button>
              )}
            </m.div>
          )}
        </AnimatePresence>

        {cartItems.length === 0 ? (
          <div className="mt-8 py-16 sm:py-20 px-6 rounded-tile bg-surface text-center">
            <div className="w-20 h-20 rounded-full bg-sunken flex items-center justify-center mx-auto mb-6 text-accent">
              <ShoppingBag className="w-9 h-9" strokeWidth={1.25} />
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-fg">Your cart is empty</h2>
            <p className="mt-2 text-[16px] text-muted max-w-md mx-auto">
              Browse handcrafted furniture made with natural stone, solid wood and Italian fabrics.
            </p>
            <Link to="/shop" className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-on-accent text-[15px] font-semibold hover:bg-accent-hover transition-colors">
              Shop now
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Items */}
            <ul className="lg:col-span-8 rounded-tile bg-surface divide-y divide-line">
              <AnimatePresence initial={false}>
                {cartItems.map((item) => {
                  const off = discountOf(item);
                  const current = live[item.id] || item;
                  const inStock = isInStock(current);
                  const gone = isSoldOut(current);
                  return (
                    <m.li
                      key={item.cartKey}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 sm:p-6 flex gap-4 sm:gap-6"
                    >
                      <Link to={productPath(item)} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-sunken shrink-0">
                        <SmartImage sizes="128px" src={item.images?.[0] || item.image || FALLBACK} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={productPath(item)} className="text-[16px] sm:text-[18px] font-semibold text-fg hover:text-accent leading-snug line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-[13px] text-muted">
                          {[item.selectedFinish, item.selectedFabric].filter(Boolean).join(' · ')}
                        </p>
                        <p className={`mt-1 text-[13px] ${gone ? 'text-red-600 dark:text-red-400 font-semibold' : inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          {gone ? 'Out of stock: remove it to place your order' : stockLabel(current)}
                          {!inStock && !gone && item.leadTime && <span className="text-muted"> · {item.leadTime}</span>}
                        </p>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[18px] sm:text-[20px] font-semibold text-fg tabular-nums">{formatINR(item.price * item.quantity)}</span>
                          {off > 0 && (
                            <>
                              <span className="text-[14px] text-muted line-through tabular-nums">{formatINR(item.originalPrice * item.quantity)}</span>
                              <span className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">{off}% off</span>
                            </>
                          )}
                        </div>
                        {item.quantity > 1 && <p className="text-[12px] text-muted">{formatINR(item.price)} each</p>}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                          <QtyStepper item={item} onChange={(d) => updateQuantity(item.cartKey, d)} />
                          <button type="button" onClick={() => handleSaveForLater(item)} className="text-[14px] font-semibold text-fg hover:text-accent uppercase tracking-[0.04em]">
                            Save for later
                          </button>
                          <button type="button" onClick={() => handleRemove(item)} className="text-[14px] font-semibold text-fg hover:text-red-500 uppercase tracking-[0.04em]">
                            Remove
                          </button>
                        </div>
                      </div>
                    </m.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            {/* Price details + Place order */}
            <aside className="lg:col-span-4 lg:sticky lg:top-[calc(var(--gnav-offset)+24px)]">
              <div className="p-5 sm:p-6 rounded-tile bg-surface">
                <PriceDetails />
                {blocked && (
                  <p role="alert" className="mt-4 text-[13px] text-red-600 dark:text-red-400">
                    {soldOut.map((i) => i.name).join(', ')} {soldOut.length === 1 ? 'is' : 'are'} out of stock. Remove {soldOut.length === 1 ? 'it' : 'them'} or save for later to continue.
                  </p>
                )}
                <Link
                  to={blocked ? '#' : '/checkout'}
                  aria-disabled={blocked}
                  onClick={(e) => blocked && e.preventDefault()}
                  className={`hidden lg:flex mt-5 w-full py-4 rounded-full bg-accent hover:bg-accent-hover text-on-accent text-[16px] font-semibold items-center justify-center gap-2 transition-colors ${blocked ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  <Lock className="w-4 h-4" /> Place order
                </Link>
                <ul className="mt-5 space-y-2 text-[13px] text-muted">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> Safe and secure payments
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-accent shrink-0" /> Delivery and placement in your home
                  </li>
                </ul>
              </div>
            </aside>

            {/* Phones: total and Place order stay at the bottom of the screen */}
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 glass border-t border-line px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-[18px] font-semibold text-fg tabular-nums leading-tight">{formatINR(totalAmount)}</p>
                <p className="text-[12px] text-muted">Incl. GST and delivery</p>
              </div>
              <Link
                to={blocked ? '#' : '/checkout'}
                aria-disabled={blocked}
                onClick={(e) => blocked && e.preventDefault()}
                className={`px-6 py-3 rounded-full bg-accent text-on-accent text-[15px] font-semibold ${blocked ? 'opacity-40' : ''}`}
              >
                {blocked ? 'Remove sold-out items' : 'Place order'}
              </Link>
            </div>
          </div>
        )}

        {/* Saved for later (the wishlist) */}
        {saved.length > 0 && (
          <section className="mt-10 lg:max-w-[calc(66.666%-14px)]" aria-labelledby="saved-title">
            <h2 id="saved-title" className="text-[20px] font-semibold tracking-tight text-fg">
              Saved for later ({saved.length})
            </h2>
            <ul className="mt-4 rounded-tile bg-surface divide-y divide-line">
              {saved.map((p) => (
                <li key={p.id} className="p-4 sm:p-5 flex items-center gap-4">
                  <Link to={productPath(p)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-sunken shrink-0">
                    <SmartImage sizes="80px" src={p.images?.[0] || p.image || FALLBACK} alt={p.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={productPath(p)} className="text-[15px] font-semibold text-fg hover:text-accent line-clamp-1">
                      {p.name}
                    </Link>
                    <p className="text-[15px] text-fg tabular-nums">{formatINR(p.price)}</p>
                    <div className="mt-2 flex gap-5">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p, 1, { silent: true });
                          toggleWishlist(p.id);
                        }}
                        className="text-[13px] font-semibold text-accent uppercase tracking-[0.04em]"
                      >
                        Move to cart
                      </button>
                      <button type="button" onClick={() => toggleWishlist(p.id)} className="text-[13px] font-semibold text-muted hover:text-red-500 uppercase tracking-[0.04em]">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Cart;
