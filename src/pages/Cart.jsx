import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Lock,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../context/CartContext';
import SmartImage from '../components/SmartImage';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    shipping,
    totalAmount,
    clearCart
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [removedNotification, setRemovedNotification] = useState('');

  const handleRemove = (item) => {
    removeFromCart(item.cartKey);
    setRemovedNotification(`${item.name} removed from your bag.`);
    setTimeout(() => setRemovedNotification(''), 3000);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SYMMETRY10' || couponCode.trim().toUpperCase() === 'ARCHITECT') {
      setCouponApplied(true);
    }
  };

  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, totalAmount - discount);

  return (
    <div className="pt-28 pb-24 space-y-12 sm:space-y-16 min-h-[75vh]">
      <SeoMeta
        title="Client Shopping Bag & Curated Order Review | Symmetry Interiors"
        description="Review your curated bespoke furniture pieces, finishes, specifications, and white-glove delivery options at Symmetry Interiors."
      />

      <section className="site-container">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'Shopping Bag' }
          ]}
        />

        {/* Page Title & Count */}
        <div className="mt-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line/60 dark:border-line pb-6">
          <div>
            <span className="text-xs text-accent font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shopping Bag</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg leading-tight mt-1">
              Your Curated Bag
            </h1>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center space-x-4 text-xs text-muted">
              <span>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {cartItems.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'Piece' : 'Pieces'} Selected
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-500 transition underline underline-offset-4 cursor-pointer"
              >
                Clear Entire Bag
              </button>
            </div>
          )}
        </div>

        {/* Removed Item Toast Notification */}
        <AnimatePresence>
          {removedNotification && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-accent" />
                <span>{removedNotification}</span>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Content: Empty State vs Active Cart */}
        {cartItems.length === 0 ? (
          /* PREMIUM EMPTY CART STATE */
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 sm:py-24 px-6 sm:px-12 rounded-tile bg-surface text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-sunken/60 dark:bg-sunken border border-line flex items-center justify-center mx-auto mb-6 text-accent">
              <ShoppingBag className="w-9 h-9 stroke-[1.25]" />
            </div>

            <span className="text-xs text-accent font-semibold">
              Nothing Here Yet
            </span>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg mt-2 mb-4">
              Your Bag is Empty
            </h2>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-lg mx-auto mb-8">
              Browse our handcrafted furniture, made with natural stone, solid wood and Italian fabrics.
            </p>

            {/* Quick Category Shortcut Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                { label: 'Luxury Sofas', link: '/shop?category=Luxury%20Sofas' },
                { label: 'Lounge Chairs', link: '/shop?category=Lounge%20Chairs' },
                { label: 'Dining Furniture', link: '/shop?category=Dining%20Furniture' },
                { label: 'Coffee Tables', link: '/shop?category=Coffee%20Tables' },
                { label: 'Lighting', link: '/shop?category=Lighting' },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.link}
                  className="px-4 py-2 rounded-full border border-line bg-canvas/50 text-xs text-fg hover:border-accent transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 py-4 px-8 rounded-full bg-fg text-canvas hover:bg-accent transition-all duration-300 text-[14px] tracking-[-0.01em] font-medium shadow-luxury"
            >
              <span>Explore Furniture Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </m.div>
        ) : (
          /* ACTIVE CART GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Line Items (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemImage = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop';
                  return (
                    <m.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="p-5 sm:p-7 rounded-tile bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative group"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <Link
                          to={`/shop/${item.id}`}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-sunken shrink-0 block relative group/img"
                        >
                          <SmartImage sizes="96px"
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                        </Link>

                        <div className="space-y-1 flex-1">
                          <span className="text-[12px] text-accent font-semibold block">
                            {item.category || item.collection || 'Symmetry Interiors'}
                          </span>
                          
                          <Link
                            to={`/shop/${item.id}`}
                            className="text-base sm:text-lg font-bold text-fg hover:text-accent transition-colors leading-snug block"
                          >
                            {item.name}
                          </Link>

                          {/* Selected Finish / Fabric */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted pt-1">
                            {item.selectedFinish && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <span>Finish: <strong>{item.selectedFinish}</strong></span>
                              </span>
                            )}
                            {item.selectedFabric && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                <span>Tone: <strong>{item.selectedFabric}</strong></span>
                              </span>
                            )}
                          </div>

                          {/* Mobile Unit Price */}
                          <div className="sm:hidden pt-2">
                            <span className="text-sm font-bold text-fg">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-muted ml-2">
                                (₹{item.price.toLocaleString('en-IN')} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-line/60 dark:border-line">
                        {/* Quantity Controller Pill */}
                        <div className="flex items-center rounded-full overflow-hidden bg-canvas">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, -1)}
                            className="p-2 sm:px-3.5 sm:py-2 text-fg hover:bg-sunken transition disabled:opacity-40"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 sm:px-4 py-1.5 text-xs font-mono font-bold text-fg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, 1)}
                            className="p-2 sm:px-3.5 sm:py-2 text-fg hover:bg-sunken transition"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Desktop Line Total */}
                        <div className="hidden sm:block text-right min-w-[120px]">
                          <div className="text-base sm:text-lg font-bold text-fg">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-muted">
                              ₹{item.price.toLocaleString('en-IN')} / unit
                            </div>
                          )}
                        </div>

                        {/* Remove Item Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="p-2.5 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </m.div>
                  );
                })}
              </AnimatePresence>

              {/* Bottom Actions Row: Continue Shopping */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-medium text-fg hover:text-accent transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Exploring Furniture</span>
                </Link>

                <div className="text-xs text-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Items are held for 60 minutes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Panel (4 Cols Sticky) */}
            <div className="lg:col-span-4 p-6 sm:p-8 rounded-tile bg-surface space-y-6 sticky top-28">
              <div>
                <span className="text-[12px] text-accent font-semibold block">
                  Your Order
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-fg mt-0.5">
                  Order Summary
                </h3>
              </div>

              {/* Breakdown */}
              <div className="space-y-3.5 text-xs text-muted">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-fg font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Standard GST (18%)</span>
                  <span className="font-semibold text-fg font-mono">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery & Installation</span>
                  <span className="font-semibold text-fg">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[12px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Trade Discount (10%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-line/80 dark:border-line flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-semibold text-fg block">
                      Total
                    </span>
                    <span className="text-[10px] text-muted">
                      (Includes installation and transit insurance)
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Coupon / Privilege Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-line/60 dark:border-line">
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1.5">
                  Architect or Designer Discount Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. ARCHITECT or SYMMETRY10"
                    disabled={couponApplied}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-line bg-canvas/50 text-fg focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 rounded-full bg-stone-900 dark:bg-white text-on-accent dark:text-stone-900 text-[14px] font-medium tracking-[-0.01em] hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Discount applied.</span>
                  </p>
                )}
              </form>

              {/* Primary Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to="/checkout"
                  className="w-full py-4 px-6 rounded-full bg-fg text-canvas hover:bg-accent transition-all duration-300 text-[14px] tracking-[-0.01em] font-medium flex items-center justify-center gap-2 shadow-luxury"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full py-3 px-6 rounded-full border border-stone-300 dark:border-stone-700 hover:border-accent text-fg text-[14px] tracking-[-0.01em] font-medium flex items-center justify-center gap-2 transition"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Atelier Guarantees */}
              <div className="pt-4 border-t border-line/60 dark:border-line text-[11px] text-muted space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-accent shrink-0" />
                  <span>Free delivery and placement across India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>10-year frame warranty and certificate of authenticity</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
