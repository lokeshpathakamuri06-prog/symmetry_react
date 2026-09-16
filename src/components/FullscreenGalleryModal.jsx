import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Fullscreen Lightbox / Zoom Gallery Modal
 */
export default function FullscreenGalleryModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  productName = 'Product'
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const [prevInitial, setPrevInitial] = useState(initialIndex);
  if (prevInitial !== initialIndex) {
    setPrevInitial(initialIndex);
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md text-white select-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div>
            <h3 className="text-sm font-medium tracking-wide text-stone-300">
              {productName}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition"
              title={isZoomed ? 'Reset Zoom' : 'Zoom In'}
              aria-label="Toggle Zoom"
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition"
              title="Close Gallery (Esc)"
              aria-label="Close Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage */}
        <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700/50 backdrop-blur transition hover:scale-105"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className={`relative max-w-5xl max-h-[75vh] transition-transform duration-300 ease-out cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: 1,
                scale: isZoomed ? 1.4 : 1,
              }}
              transition={{ duration: 0.25 }}
              src={currentImage}
              alt={`${productName} view ${currentIndex + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl mx-auto"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700/50 backdrop-blur transition hover:scale-105"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center space-x-3 py-4 border-t border-stone-800/80 bg-stone-950/80 overflow-x-auto px-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition flex-shrink-0 ${
                  currentIndex === idx
                    ? 'border-amber-500 ring-2 ring-amber-500/30 opacity-100 scale-105'
                    : 'border-stone-800 opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
