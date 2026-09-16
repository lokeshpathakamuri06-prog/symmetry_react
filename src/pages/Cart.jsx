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
import { motion, AnimatePresence } from 'framer-motion';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../context/CartContext';

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'Shopping Bag' }
          ]}
        />

        {/* Page Title & Count */}
        <div className="mt-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D1DCDE]/60 dark:border-[#1E3447] pb-6">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Curation</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight mt-1">
              Your Curated Bag
            </h1>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center space-x-4 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-[#36656B]" />
                <span>{removedNotification}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content: Empty State vs Active Cart */}
        {cartItems.length === 0 ? (
          /* PREMIUM EMPTY CART STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 sm:py-24 px-6 sm:px-12 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-center max-w-3xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-[#E5ECEC]/60 dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center mx-auto mb-6 text-[#36656B]">
              <ShoppingBag className="w-9 h-9 stroke-[1.25]" />
            </div>

            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              Atelier Bag Unoccupied
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#131E20] dark:text-[#F5F1E8] mt-2 mb-4 font-normal">
              Your Architectural Curation is Empty
            </h2>

            <p className="text-sm sm:text-base text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed max-w-lg mx-auto font-light mb-8">
              Explore our handcrafted collections sourced across Milan, Verona, Bali, and Kyoto. Each piece is meticulously built with authentic natural travertine, solid timber, and Italian upholstery.
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
                  className="px-4 py-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] bg-[#F4F7F6]/50 dark:bg-[#07121C]/50 text-xs text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 py-4 px-8 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-all duration-300 text-xs uppercase tracking-luxury font-medium shadow-luxury"
            >
              <span>Explore Furniture Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* ACTIVE CART GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Line Items (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemImage = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop';
                  return (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative group"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <Link
                          to={`/shop/${item.id}`}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] shrink-0 block relative group/img"
                        >
                          <img
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                        </Link>

                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
                            {item.category || item.collection || 'Bespoke Atelier'}
                          </span>
                          
                          <Link
                            to={`/shop/${item.id}`}
                            className="text-base sm:text-lg font-serif text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] transition-colors leading-snug block font-medium"
                          >
                            {item.name}
                          </Link>

                          {/* Selected Finish / Fabric */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4F6467] dark:text-[#AEB7BE] pt-1">
                            {item.selectedFinish && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#36656B]" />
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
                            <span className="text-sm font-serif font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-[#4F6467] dark:text-[#AEB7BE] ml-2">
                                (₹{item.price.toLocaleString('en-IN')} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#D1DCDE]/60 dark:border-[#1E3447]">
                        {/* Quantity Controller Pill */}
                        <div className="flex items-center border border-[#D1DCDE] dark:border-[#1E3447] rounded-full overflow-hidden bg-[#F4F7F6] dark:bg-[#07121C]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, -1)}
                            className="p-2 sm:px-3.5 sm:py-2 text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC] dark:hover:bg-[#132838] transition disabled:opacity-40"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 sm:px-4 py-1.5 text-xs font-mono font-bold text-[#131E20] dark:text-[#F5F1E8] min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, 1)}
                            className="p-2 sm:px-3.5 sm:py-2 text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC] dark:hover:bg-[#132838] transition"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Desktop Line Total */}
                        <div className="hidden sm:block text-right min-w-[120px]">
                          <div className="text-base sm:text-lg font-serif font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Bottom Actions Row: Continue Shopping */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Exploring Furniture</span>
                </Link>

                <div className="text-xs text-[#4F6467] dark:text-[#AEB7BE] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#36656B]" />
                  <span>Pieces reserved for 60 minutes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Panel (4 Cols Sticky) */}
            <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-6 shadow-sm sticky top-28">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
                  Atelier Valuation
                </span>
                <h3 className="text-2xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-medium mt-0.5">
                  Order Summary
                </h3>
              </div>

              {/* Breakdown */}
              <div className="space-y-3.5 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Standard GST (18%)</span>
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] font-mono">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>White-Glove Architectural Delivery</span>
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Architectural Privilege (10%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#D1DCDE]/80 dark:border-[#1E3447] flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] block">
                      Total Investment
                    </span>
                    <span className="text-[10px] text-[#4F6467] dark:text-[#AEB7BE]">
                      (Incl. white-glove setup & transit insurance)
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Coupon / Privilege Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1.5">
                  Architect / Designer Privilege Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. ARCHITECT or SYMMETRY10"
                    disabled={couponApplied}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-[#F4F7F6]/50 dark:bg-[#07121C]/50 text-[#131E20] dark:text-[#F5F1E8] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#36656B] disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-[#36656B] dark:hover:bg-[#36656B] dark:hover:text-white transition disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Privilege discount verified & applied.</span>
                  </p>
                )}
              </form>

              {/* Primary Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to="/checkout"
                  className="w-full py-4 px-6 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-all duration-300 text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 shadow-luxury"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full py-3 px-6 rounded-full border border-stone-300 dark:border-stone-700 hover:border-[#36656B] dark:hover:border-[#BCA575] text-[#131E20] dark:text-[#F5F1E8] text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 transition"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Atelier Guarantees */}
              <div className="pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] text-[11px] text-[#4F6467] dark:text-[#AEB7BE] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#36656B] shrink-0" />
                  <span>Complimentary inside-placement across India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#36656B] shrink-0" />
                  <span>10-Year structural frame guarantee & authenticity seal</span>
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
