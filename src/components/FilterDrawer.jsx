import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '../lib/scroll';

export const FilterDrawer = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  maxPrice,
  currentPrice,
  onPriceChange,
  stockFilter = 'all',
  onSelectStockFilter,
  onReset,
}) => {
  useScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] flex justify-end" data-lenis-prevent>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-surface text-fg h-full flex flex-col justify-between p-6 sm:p-8 shadow-apple-dark dark:shadow-apple-dark z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5">
              <div>
                <h3 className="text-xl font-semibold text-fg">
                  Filters
                </h3>
                <p className="text-xs text-muted">
                  Filter by category, price &amp; availability
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-canvas dark:bg-sunken text-[#4F6467] hover:text-[#1D1D1F] dark:hover:text-white cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
              {/* Categories */}
              <div className="pb-6 border-b border-line/60 dark:border-line">
                <h4 className="text-xs text-accent font-semibold mb-3">
                  Categories ({categories.length})
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => onSelectCategory('all')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-fg text-canvas font-semibold'
                        : 'hover:bg-sunken/60 dark:hover:bg-sunken text-muted'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-fg text-canvas font-semibold'
                          : 'hover:bg-sunken/60 dark:hover:bg-sunken text-muted'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount > 0 && (
                        <span className="text-[10px] opacity-70">({cat.productCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Filter */}
              {onSelectStockFilter && (
                <div className="pb-6 border-b border-line/60 dark:border-line">
                  <h4 className="text-xs text-accent font-semibold mb-3">
                    Availability
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'All', val: 'all' },
                      { label: 'In Stock', val: 'in-stock' },
                      { label: 'Made to Order', val: 'made-to-order' },
                    ].map((st) => (
                      <button
                        key={st.val}
                        onClick={() => onSelectStockFilter(st.val)}
                        className={`py-2 px-2 rounded-xl text-[11px] text-center border transition-all cursor-pointer ${
                          stockFilter === st.val
                            ? 'border-accent bg-accent/10 font-semibold text-fg'
                            : 'border-line text-muted hover:border-accent'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              {maxPrice && onPriceChange && (
                <div className="pb-6 border-b border-line/60 dark:border-line">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs text-accent font-semibold">
                      Max Price
                    </h4>
                    <span className="text-xs font-mono font-medium text-fg">
                      ₹{Number(currentPrice || maxPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max={maxPrice}
                    step="25000"
                    value={currentPrice || maxPrice}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    className="w-full accent-[#36656B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted mt-2 font-mono">
                    <span>₹50,000</span>
                    <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div>
                <h4 className="text-xs text-accent font-semibold mb-3">
                  Sort By
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Recommended', val: 'featured' },
                    { label: 'Newest First', val: 'newest' },
                    { label: 'Most Popular', val: 'rating' },
                    { label: 'Price: Low to High', val: 'price-asc' },
                    { label: 'Price: High to Low', val: 'price-desc' },
                  ].map((option) => (
                    <button
                      key={option.val}
                      onClick={() => onSelectSort(option.val)}
                      className={`p-2.5 rounded-xl text-xs text-center border transition-all cursor-pointer ${
                        sortBy === option.val
                          ? 'border-accent bg-accent/10 font-medium text-fg'
                          : 'border-line text-muted hover:border-accent'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-line/60 dark:border-line flex items-center gap-3">
              <button
                onClick={onReset}
                className="flex-1 py-3 rounded-full border border-line text-xs text-muted hover:border-accent flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-fg text-canvas text-xs font-medium hover:bg-accent transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
