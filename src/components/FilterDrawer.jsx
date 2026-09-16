import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#07121C]/70 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#0D1C29] text-[#131E20] dark:text-[#F5F1E8] h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl z-10 border-l border-[#D1DCDE] dark:border-[#1E3447]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
              <div>
                <h3 className="text-xl font-serif text-[#131E20] dark:text-[#F5F1E8]">
                  Refine Collection
                </h3>
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                  Filter by category, price &amp; availability
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] hover:text-[#131E20] dark:hover:text-white cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
              {/* Categories */}
              <div className="pb-6 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                  Categories ({categories.length})
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => onSelectCategory('all')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] font-semibold'
                        : 'hover:bg-[#E5ECEC]/60 dark:hover:bg-[#132838] text-[#4F6467] dark:text-[#AEB7BE]'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] font-semibold'
                          : 'hover:bg-[#E5ECEC]/60 dark:hover:bg-[#132838] text-[#4F6467] dark:text-[#AEB7BE]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.itemCount && (
                        <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Filter */}
              {onSelectStockFilter && (
                <div className="pb-6 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                  <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
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
                            ? 'border-[#36656B] dark:border-[#BCA575] bg-[#36656B]/10 font-semibold text-[#131E20] dark:text-[#F5F1E8]'
                            : 'border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B]'
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
                <div className="pb-6 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                      Max Price
                    </h4>
                    <span className="text-xs font-serif font-medium text-[#131E20] dark:text-[#F5F1E8]">
                      &#8379;{Number(currentPrice || maxPrice).toLocaleString('en-IN')}
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
                  <div className="flex justify-between text-[10px] text-[#4F6467] dark:text-[#AEB7BE] mt-2 font-mono">
                    <span>&#8379;50,000</span>
                    <span>&#8379;{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div>
                <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                  Sort By
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Curated First', val: 'featured' },
                    { label: 'Rating: High to Low', val: 'rating' },
                    { label: 'Price: Low to High', val: 'price-asc' },
                    { label: 'Price: High to Low', val: 'price-desc' },
                  ].map((option) => (
                    <button
                      key={option.val}
                      onClick={() => onSelectSort(option.val)}
                      className={`p-2.5 rounded-xl text-xs text-center border transition-all cursor-pointer ${
                        sortBy === option.val
                          ? 'border-[#36656B] dark:border-[#BCA575] bg-[#36656B]/10 font-medium text-[#131E20] dark:text-[#F5F1E8]'
                          : 'border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] flex items-center gap-3">
              <button
                onClick={onReset}
                className="flex-1 py-3 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] text-xs uppercase tracking-luxury font-medium hover:bg-[#36656B] transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
