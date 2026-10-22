import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Check } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '../lib/scroll';
import { useCart } from '../context/CartContext';
import SmartImage from './SmartImage';
import { isSoldOut, productPath } from '../lib/shop';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(
    product ? product.defaultFinish || product.finishes?.[0] || 'Natural' : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  useScrollLock(Boolean(product));

  if (!product) return null;

  const handleAdd = async () => {
    // Signed out: goes to sign-in (the modal closes with the page change)
    if (!(await addToCart(product, quantity, { finish: selectedFinish }))) return;
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" data-lenis-prevent>
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-surface rounded-tile overflow-hidden z-10 my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-canvas dark:bg-sunken text-fg hover:text-accent transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-sunken">
                <SmartImage sizes="(min-width: 768px) 50vw, 100vw"
                  src={product.images?.[selectedImage] || product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-accent'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SmartImage sizes="96px"
                        src={img}
                        alt="Angle"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Right */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[12px] text-accent font-semibold block">
                  {product.collection} &bull; {product.category?.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3xl text-fg">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-medium text-fg">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#4F6467] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Finishes */}
                {product.finishes && (
                  <div className="pt-2">
                    <span className="text-[12px] text-muted font-medium block mb-2">
                      Finish: <strong className="text-fg">{selectedFinish}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.finishes.map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFinish(f)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            selectedFinish === f
                              ? 'border-accent bg-accent/10 text-fg font-medium'
                              : 'border-line text-muted'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                <div className="pt-2 text-xs text-muted">
                  <span className="font-semibold text-fg">Dimensions: </span>
                  <span>{product.dimensions}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-line/60 dark:border-line">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full overflow-hidden bg-canvas">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-xs text-fg hover:bg-[#E5ECEC]"
                    >
                      &minus;
                    </button>
                    <span className="px-3 py-2 text-xs font-mono font-medium text-fg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-xs text-fg hover:bg-[#E5ECEC]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={isSoldOut(product)}
                    className="flex-1 py-3 px-5 rounded-full bg-fg text-canvas hover:bg-accent transition-colors text-[14px] tracking-[-0.01em] font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSoldOut(product) ? (
                      <span>Out of stock</span>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <Link
                  to={productPath(product)}
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full border border-fg/15 text-[14px] font-medium text-center block text-fg hover:border-fg/40 transition-colors"
                >
                  See Full Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
