import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Check,
  Star,
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowRight,
  Maximize2,
  Sparkles,
  Sliders,
  Ruler,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import FullscreenGalleryModal from '../components/FullscreenGalleryModal';
import RazorpayModalPlaceholder from '../components/RazorpayModalPlaceholder';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, wishlist, toggleWishlist } = useCart();

  // All state hooks declared unconditionally at the top level
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(
    product ? (product.finishes?.[0] || product.defaultFinish || 'Standard Artisan Finish') : ''
  );
  const [selectedColor, setSelectedColor] = useState(
    product ? (product.colors?.[0]?.name || 'Natural Tone') : ''
  );
  const [quantity, setQuantity] = useState(1);

  const [addedToast, setAddedToast] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customSubmitted, setCustomSubmitted] = useState(false);
  const [careExpanded, setCareExpanded] = useState(true);

  const [customForm, setCustomForm] = useState({
    clientName: '',
    phoneOrEmail: '',
    customDimensions: product?.dimensions || '',
    preferredMaterial: product?.materials?.[0] || '',
    additionalNotes: ''
  });

  // Safe early return if product is not found
  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const isWishlisted = wishlist?.includes(product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 3);

  // Handlers
  const handleAddToCart = () => {
    addToCart(product, quantity, {
      finish: selectedFinish,
      color: selectedColor,
      fabric: selectedColor
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    setIsRazorpayOpen(true);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setCustomSubmitted(true);
    setTimeout(() => {
      setCustomSubmitted(false);
      setIsCustomModalOpen(false);
      setCustomForm({
        clientName: '',
        phoneOrEmail: '',
        customDimensions: product.dimensions || '',
        preferredMaterial: product.materials?.[0] || '',
        additionalNotes: ''
      });
    }, 2200);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="pt-28 pb-24 space-y-16 sm:space-y-24">
      <SeoMeta
        title={`${product.name} | Symmetry Luxury Interiors`}
        description={product.description}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Interactive Gallery & Fullscreen Trigger */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative group aspect-[4/3] rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Action Floating Buttons */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 shadow-md hover:scale-110 transition"
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700 dark:text-stone-200'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="p-3 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/50 dark:border-stone-700/50 shadow-md hover:scale-110 transition text-stone-700 dark:text-stone-200 flex items-center gap-1.5 text-xs font-medium"
                  title="View Fullscreen Lightbox & Zoom"
                  aria-label="Zoom Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Zoom</span>
                </button>
              </div>

              {/* Stock Status Badge Overlay */}
              <div className="absolute bottom-4 left-4 z-10">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md flex items-center space-x-2 shadow-sm border ${
                    product.stockStatus === 'In Stock'
                      ? 'bg-emerald-500/90 text-white border-emerald-400'
                      : 'bg-amber-500/90 text-stone-900 border-amber-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      product.stockStatus === 'In Stock' ? 'bg-white' : 'bg-stone-900'
                    }`}
                  />
                  <span className="font-semibold">{product.stockStatus || 'In Stock'}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-[#36656B] dark:border-[#BCA575] ring-2 ring-[#36656B]/30 opacity-100 scale-102'
                        : 'border-[#D1DCDE] dark:border-[#1E3447] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Metadata, Configuration & Ordering */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header / Category & Badges */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  {product.collection || product.category}
                </span>
                {product.badge && (
                  <span className="px-3 py-0.5 rounded-full text-[10px] uppercase tracking-luxury font-medium bg-[#131E20]/10 dark:bg-white/10 text-[#131E20] dark:text-[#F5F1E8]">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] leading-tight mt-2">
                {product.name}
              </h1>

              {/* Rating & Client Reviews */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-[#36656B] dark:text-[#BCA575]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-current'
                          : 'fill-current opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                  {product.rating || 4.9} ({product.reviewCount || 18} client evaluations)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-[#E5ECEC]/50 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#4F6467] dark:text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE] mt-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#36656B]" />
                <span>
                  Includes white-glove installation & insured architectural transit across India.
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Available Colours / Tones */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] font-medium">
                    Colour Palette / Tone:
                  </span>
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative flex items-center justify-center p-1 rounded-full transition ${
                          isSelected
                            ? 'ring-2 ring-[#36656B] dark:ring-[#BCA575]'
                            : 'hover:scale-105'
                        }`}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                      >
                        <span
                          className="w-7 h-7 rounded-full shadow-inner border"
                          style={{
                            backgroundColor: c.hex,
                            borderColor: c.border ? '#36656B' : 'rgba(0,0,0,0.15)',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Finishes */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] font-medium">
                    Artisan Finish:
                  </span>
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                    {selectedFinish}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.finishes.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                        selectedFinish === finish
                          ? 'border-[#36656B] bg-[#36656B]/15 text-[#131E20] dark:text-[#F5F1E8] font-medium ring-1 ring-[#36656B]'
                          : 'border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B]'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Primary Actions */}
            <div className="space-y-3.5 pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
              
              {/* Row 1: Quantity Selector + Add to Cart */}
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#D1DCDE] dark:border-[#1E3447] rounded-full overflow-hidden bg-white dark:bg-[#07121C]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3.5 text-sm text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC]/50 dark:hover:bg-[#132838] transition"
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className="px-4 py-3.5 text-xs font-mono font-bold text-[#131E20] dark:text-[#F5F1E8] min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3.5 text-sm text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC]/50 dark:hover:bg-[#132838] transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-all duration-300 text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 shadow-luxury cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
              </div>

              {/* Row 2: Buy Now (Razorpay Checkout Placeholder) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-full bg-[#36656B] hover:bg-[#254B50] text-white transition-all duration-300 text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Now (Instant Checkout)</span>
              </button>

              {/* Row 3: Request Customization */}
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full py-3 px-6 rounded-full border border-stone-300 dark:border-stone-700 hover:border-[#36656B] dark:hover:border-[#BCA575] text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC]/30 dark:hover:bg-[#132838]/40 transition text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-[#36656B]" />
                <span>Request Custom Dimensions or Fabric</span>
              </button>

              {/* Add to Cart Toast Notification */}
              <AnimatePresence>
                {addedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Added {quantity}x {product.name} ({selectedFinish}) to your cart!
                      </span>
                    </div>
                    <Link
                      to="/cart"
                      className="underline uppercase tracking-wider font-bold text-emerald-900 dark:text-emerald-200 ml-3"
                    >
                      View Cart &rarr;
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Value Guarantees */}
            <div className="pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] grid grid-cols-2 gap-4 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#36656B]" />
                <span>Lead Time: {product.leadTime || '4-6 Weeks'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#36656B]" />
                <span>10-Year Master Frame Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Dimensions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Architectural Specs */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-2">
              <Ruler className="w-4 h-4" />
              <span>Architectural Specifications</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] mb-6">
              Dimensions &amp; Materials
            </h2>

            <div className="space-y-4 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
              <div className="flex justify-between pb-3 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
                <span className="uppercase tracking-wider font-medium">Overall Dimensions</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] text-right">
                  {product.dimensions || 'Customizable to space'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
                <span className="uppercase tracking-wider font-medium">Primary Materiality</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] text-right">
                  {product.materials?.join(', ') || 'Solid Hardwood, Brass Hardware'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
                <span className="uppercase tracking-wider font-medium">Stock Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                  {product.stockStatus || 'In Stock'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
                <span className="uppercase tracking-wider font-medium">Assembly / White-Glove</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] text-right">
                  Fully Assembled On-Site
                </span>
              </div>
            </div>

            {/* Construction Highlights list */}
            {product.details && product.details.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#D1DCDE]/50 dark:border-[#1E3447]">
                <h4 className="text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] font-semibold mb-3">
                  Craftsmanship Highlights
                </h4>
                <ul className="space-y-2 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36656B] mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Care Instructions Accordion */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Conservation &amp; Longevity</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCareExpanded(!careExpanded)}
                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white transition"
                  aria-label="Toggle Care Instructions"
                >
                  {careExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <h2 className="text-2xl font-serif text-[#131E20] dark:text-[#F5F1E8] mb-6">
                Care &amp; Preservation Instructions
              </h2>

              <AnimatePresence>
                {careExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3.5 text-xs text-[#4F6467] dark:text-[#AEB7BE]"
                  >
                    {product.careInstructions && product.careInstructions.length > 0 ? (
                      product.careInstructions.map((instruction, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#36656B]/20 text-[#36656B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed">{instruction}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50">
                          <span className="w-5 h-5 rounded-full bg-[#36656B]/20 text-[#36656B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                          <p className="leading-relaxed">Dust regularly with a dry microfibre cloth along the grain.</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50">
                          <span className="w-5 h-5 rounded-full bg-[#36656B]/20 text-[#36656B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                          <p className="leading-relaxed">Avoid prolonged exposure to direct sunlight and extreme climatic humidity.</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50">
                          <span className="w-5 h-5 rounded-full bg-[#36656B]/20 text-[#36656B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                          <p className="leading-relaxed">Apply natural beeswax conditioning every 12 months for timber longevity.</p>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D1DCDE]/50 dark:border-[#1E3447] flex items-center justify-between text-xs">
              <span className="text-stone-500">Need specific restoration guidance?</span>
              <Link to="/contact" className="text-[#36656B] dark:text-[#BCA575] font-semibold hover:underline">
                Contact Atelier Care &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                Curated Pairings
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] mt-1">
                Related Pieces You May Admire
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] flex items-center gap-1.5 hover:underline font-semibold"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <FullscreenGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={product.images}
        initialIndex={selectedImage}
        productName={product.name}
      />

      {/* RAZORPAY FUTURE CHECKOUT PLACEHOLDER MODAL */}
      <RazorpayModalPlaceholder
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        product={product}
        quantity={quantity}
        selectedFinish={selectedFinish}
        selectedColor={selectedColor}
      />

      {/* REQUEST CUSTOMIZATION MODAL */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden p-6 sm:p-8"
            >
              <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-[#36656B] font-bold">
                    Bespoke Atelier Service
                  </span>
                  <h3 className="text-xl font-serif text-stone-900 dark:text-white mt-0.5">
                    Request Customization
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Customize <strong className="text-stone-700 dark:text-stone-200">{product.name}</strong> to your precise spatial specifications.
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {customSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-1">
                    Inquiry Transmitted
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                    Our lead furniture architect will contact you within 24 hours with a tailored quotation and preliminary render.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Your Name / Architectural Firm *
                    </label>
                    <input
                      type="text"
                      required
                      value={customForm.clientName}
                      onChange={(e) => setCustomForm({ ...customForm, clientName: e.target.value })}
                      placeholder="e.g. Ar. Ananya Roy / Design Studio"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Email or WhatsApp Contact *
                    </label>
                    <input
                      type="text"
                      required
                      value={customForm.phoneOrEmail}
                      onChange={(e) => setCustomForm({ ...customForm, phoneOrEmail: e.target.value })}
                      placeholder="+91 98765 43210 or studio@architect.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Custom Dimensions
                      </label>
                      <input
                        type="text"
                        value={customForm.customDimensions}
                        onChange={(e) => setCustomForm({ ...customForm, customDimensions: e.target.value })}
                        placeholder="e.g. 240cm W x 95cm D"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Finish / Material Request
                      </label>
                      <input
                        type="text"
                        value={customForm.preferredMaterial}
                        onChange={(e) => setCustomForm({ ...customForm, preferredMaterial: e.target.value })}
                        placeholder="e.g. Nero Marquina, Olive Velvet"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Project Notes &amp; Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={customForm.additionalNotes}
                      onChange={(e) => setCustomForm({ ...customForm, additionalNotes: e.target.value })}
                      placeholder="Specify site floor level, service lift dimensions, or acoustic fabric preferences..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#131E20] dark:bg-white text-white dark:text-stone-900 font-semibold uppercase tracking-luxury transition hover:bg-[#36656B] dark:hover:bg-[#36656B] dark:hover:text-white flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Bespoke Specification</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
