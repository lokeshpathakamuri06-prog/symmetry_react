import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(
    product ? product.defaultFinish || product.finishes?.[0] || 'Natural' : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, { finish: selectedFinish });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#07121C]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0D1C29] rounded-3xl shadow-2xl border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden z-10 my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#F4F7F6] dark:bg-[#132838] text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838]">
                <img
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
                          ? 'border-[#36656B]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
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
                <span className="text-[10px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
                  {product.collection} &bull; {product.category?.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8]">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-medium text-[#131E20] dark:text-[#F5F1E8]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#4F6467] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light line-clamp-3">
                  {product.description}
                </p>

                {/* Finishes */}
                {product.finishes && (
                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] font-medium block mb-2">
                      Finish Selection: <strong className="text-[#131E20] dark:text-[#F5F1E8]">{selectedFinish}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.finishes.map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFinish(f)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            selectedFinish === f
                              ? 'border-[#36656B] bg-[#36656B]/10 text-[#131E20] dark:text-[#F5F1E8] font-medium'
                              : 'border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                <div className="pt-2 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">Dimensions: </span>
                  <span>{product.dimensions}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D1DCDE] dark:border-[#1E3447] rounded-full overflow-hidden bg-[#F4F7F6] dark:bg-[#07121C]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-xs text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC]"
                    >
                      &minus;
                    </button>
                    <span className="px-3 py-2 text-xs font-mono font-medium text-[#131E20] dark:text-[#F5F1E8]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-xs text-[#131E20] dark:text-[#F5F1E8] hover:bg-[#E5ECEC]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 px-5 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-colors text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2"
                  >
                    {added ? (
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
                  to={`/shop/${product.id}`}
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury text-center block text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B]"
                >
                  View Complete Architectural Specs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
