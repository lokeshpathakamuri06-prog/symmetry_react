import React, { useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  Sliders,
  MapPin
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import ProductCard from '../components/ProductCard';
import FilterDrawer from '../components/FilterDrawer';
import QuickViewModal from '../components/QuickViewModal';
import { products } from '../data/products';
import { shopCategories } from '../data/categories';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  // State
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(500000);
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in-stock', 'made-to-order'
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const itemsPerPage = 6; // Allows immediate multi-page navigation across our curated catalog
  const gridTopRef = useRef(null);

  const handleCategorySelect = (catSlug) => {
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      next.delete('category');
    } else {
      next.set('category', catSlug);
    }
    setSearchParams(next);
  };

  const handleReset = () => {
    setSortBy('featured');
    setSearchQuery('');
    setPriceRange(500000);
    setStockFilter('all');
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    next.delete('category');
    setSearchParams(next);
  };

  // Helper for category counts
  const getCategoryCount = (slug) => {
    if (slug === 'all') return products.length;
    return products.filter((p) => p.category === slug).length;
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Match
        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;

        // Price Match
        const matchesPrice = p.price <= priceRange;

        // Stock Match
        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'in-stock' && (p.inStock !== false && p.stockStatus !== 'Made to Order')) ||
          (stockFilter === 'made-to-order' && (p.inStock === false || p.stockStatus === 'Made to Order'));

        // Search Match across name, materials, category, description, collection
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.collection && p.collection.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.materials && p.materials.some((m) => m.toLowerCase().includes(q)));

        return matchesCategory && matchesPrice && matchesStock && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, priceRange, stockFilter, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (gridTopRef.current) {
        gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    priceRange < 500000 ||
    stockFilter !== 'all';

  return (
    <div className="pb-20 sm:pb-32 space-y-12 sm:space-y-16 overflow-hidden">
      <SeoMeta
        title="Furniture Shop &amp; Architectural Objects — Symmetry Interiors"
        description="Browse handcrafted luxury furniture: bouclé sofas, Nero Marquina marble dining tables, travertine coffee tables, and Murano chandeliers by Symmetry Interiors."
      />

      {/* =========================================================================
          SECTION 1: ARCHITECTURAL CINEMATIC HERO FOR SHOP
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[680px] sm:min-h-[760px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed background hero image with luxury vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85"
            alt="Symmetry Interiors Curated Furniture &amp; Architectural Objects"
            className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Top Header Spacing with Breadcrumbs */}
        <div className="relative z-10 pt-28 px-4 sm:px-8 lg:px-12 max-w-[1632px] mx-auto w-full flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 text-xs uppercase tracking-luxury"
          >
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-[#BCA575] font-semibold">Furniture Collection</span>
          </motion.div>
        </div>

        {/* Center Viewport Editorial Headline */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-5 my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.08] tracking-tight drop-shadow-md"
          >
            Curated Furniture <br />
            <span className="text-[#BCA575] font-bold">
              &amp; Architectural Objects.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
          >
            Every piece is built to order from monolithic Italian travertine, kiln-dried European hardwoods, and tactile vegetable-tanned leathers in our dedicated fabrication atelier.
          </motion.p>
        </div>
      </section>

      {/* Elevated Metrics Strip Floating Directly Below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { value: '12', label: 'Curated Categories', sub: 'From Sofas to Objets' },
            { value: '100%', label: 'Solid Authentic Materials', sub: 'Travertine, Hardwoods & Leather' },
            { value: '0.5mm', label: 'CNC Laser Tolerances', sub: 'German 5-Axis Precision' },
            { value: '10-Yr', label: 'Structural Warranty', sub: 'Comprehensive Atelier Guarantee' },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#0D1C29]/90 backdrop-blur-xl border border-[#D1DCDE] dark:border-[#1E3447] shadow-lg text-center group hover:border-[#36656B]/60 transition-colors"
            >
              <p className="font-bold text-2xl sm:text-3xl text-[#36656B] dark:text-[#BCA575] group-hover:scale-105 transition-transform duration-300">
                {m.value}
              </p>
              <p className="text-xs uppercase tracking-luxury font-semibold text-[#131E20] dark:text-[#F5F1E8] mt-1">
                {m.label}
              </p>
              <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE] font-light mt-0.5 hidden sm:block">
                {m.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2 & 3: SEARCH & HORIZONTAL CATEGORY NAVIGATION
          ========================================================================= */}
      <section id="shop-navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-28">
        {/* Search Bar & Mobile Trigger Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Real-time Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-[#36656B] dark:text-[#BCA575] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by piece name, materials (travertine, bouclé, walnut)..."
              className="w-full pl-10 pr-10 py-3 rounded-full bg-white dark:bg-[#0D1C29] text-xs sm:text-sm text-[#131E20] dark:text-[#F5F1E8] placeholder:text-[#6B8083] dark:placeholder:text-[#8E9CA8] focus:outline-none shadow-apple dark:shadow-apple-dark transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6B8083] hover:text-[#131E20] dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button (Triggers Drawer on small screens) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden px-5 py-3 rounded-full bg-white dark:bg-[#0D1C29] text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] flex items-center justify-center gap-2 shadow-apple dark:shadow-apple-dark cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#36656B]" />
            <span>Filters &amp; Sort</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#36656B] animate-pulse" />
            )}
          </button>
        </div>

        {/* Category Navigation Pills Bar (All 12 Categories + All) */}
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all duration-300 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-md'
                  : 'bg-white dark:bg-[#0D1C29] text-[#4F6467] dark:text-[#AEB7BE] shadow-xs hover:bg-[#E5ECEC]/50'
              }`}
            >
              <span>All Pieces ({products.length})</span>
            </button>

            {shopCategories.map((cat) => {
              const count = getCategoryCount(cat.slug);
              const isActive = selectedCategory === cat.slug;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-md font-semibold'
                      : 'bg-white dark:bg-[#0D1C29] text-[#4F6467] dark:text-[#AEB7BE] shadow-xs hover:bg-[#E5ECEC]/50 dark:hover:bg-[#132838]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4, 5, 6, 7: FILTER SIDEBAR (DESKTOP) + SORT DROPDOWN + PRODUCT GRID
          ========================================================================= */}
      <section ref={gridTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6 p-6 rounded-3xl bg-white dark:bg-[#0D1C29] shadow-apple dark:shadow-apple-dark">
            <div className="flex items-center justify-between pb-4">
              <h3 className="font-bold tracking-tight text-xl text-[#131E20] dark:text-[#F5F1E8] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#36656B] dark:text-[#BCA575]" />
                <span>Refine Catalog</span>
              </h3>
              {isFiltered && (
                <button
                  onClick={handleReset}
                  className="text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Categories List */}
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                Categories
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] font-semibold'
                      : 'text-[#4F6467] dark:text-[#AEB7BE] hover:bg-[#E5ECEC]/50 dark:hover:bg-[#132838]'
                  }`}
                >
                  <span>All Pieces</span>
                  <span className="font-mono text-[10px]">{products.length}</span>
                </button>

                {shopCategories.map((cat) => {
                  const count = getCategoryCount(cat.slug);
                  const isSelected = selectedCategory === cat.slug;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] font-semibold'
                          : 'text-[#4F6467] dark:text-[#AEB7BE] hover:bg-[#E5ECEC]/50 dark:hover:bg-[#132838]'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="font-mono text-[10px] opacity-70 shrink-0">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Status Availability Filter */}
            <div className="pt-5 border-t border-[#D1DCDE]/70 dark:border-[#1E3447]">
              <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                Availability
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: 'All Items', val: 'all' },
                  { label: 'In Stock (Ready to Ship)', val: 'in-stock' },
                  { label: 'Made to Order', val: 'made-to-order' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      setStockFilter(item.val);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      stockFilter === item.val
                        ? 'bg-[#36656B]/15 text-[#131E20] dark:text-[#F5F1E8] font-medium border border-[#36656B]/30'
                        : 'text-[#4F6467] dark:text-[#AEB7BE] hover:bg-[#E5ECEC]/40 dark:hover:bg-[#132838]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {stockFilter === item.val && (
                      <Check className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-5 border-t border-[#D1DCDE]/70 dark:border-[#1E3447]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  Max Price
                </h4>
                <span className="text-xs font-mono font-medium text-[#131E20] dark:text-[#F5F1E8]">
                  ₹{priceRange.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="25000"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-[#36656B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6B8083] dark:text-[#8E9CA8] mt-1.5">
                <span>₹50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT GRID & CONTROLS */}
          <div className="lg:col-span-9 space-y-8">
            {/* Top Toolbar: Showing Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm">
              <div className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                Showing <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">{filteredProducts.length}</span> collector pieces
                {selectedCategory !== 'all' && (
                  <span className="ml-1 text-[#36656B] dark:text-[#BCA575]">
                    in {shopCategories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-luxury text-[#6B8083] dark:text-[#8E9CA8] hidden sm:inline">
                  Sort:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-[#F4F7F6] dark:bg-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] text-xs font-sans text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:border-[#36656B] cursor-pointer"
                  >
                    <option value="featured">Curated First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#36656B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* PRODUCT GRID (3-Col Desktop, 2-Col Tablet, 1-Col Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] p-8">
                <Search className="w-10 h-10 text-[#36656B] dark:text-[#BCA575] mx-auto mb-3 opacity-60" />
                <h3 className="font-bold tracking-tight text-2xl sm:text-3xl text-[#131E20] dark:text-[#F5F1E8]">
                  No Pieces Match Your Search
                </h3>
                <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] mt-2 mb-6 max-w-md mx-auto font-light leading-relaxed">
                  Try clearing your search keyword, adjusting your price ceiling, or switching to another category.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-white dark:text-[#07121C] text-xs uppercase tracking-luxury font-medium cursor-pointer shadow-md hover:bg-[#36656B] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* =========================================================================
                SECTION 8: PAGINATION
                ========================================================================= */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-[#D1DCDE] dark:border-[#1E3447] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                  Page <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">{currentPage}</span> of{' '}
                  <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">{totalPages}</span> ({filteredProducts.length} total pieces)
                </p>

                {/* Page Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Prev Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#0D1C29] text-[#131E20] dark:text-[#F5F1E8] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#36656B] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Numbered Page Buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-sm ring-1 ring-[#36656B]'
                          : 'bg-white dark:bg-[#0D1C29] text-[#4F6467] dark:text-[#AEB7BE] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#0D1C29] text-[#131E20] dark:text-[#F5F1E8] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#36656B] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE FILTER DRAWER */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={shopCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          handleCategorySelect(slug);
          setDrawerOpen(false);
        }}
        sortBy={sortBy}
        onSelectSort={(sort) => {
          setSortBy(sort);
          setDrawerOpen(false);
        }}
        maxPrice={500000}
        currentPrice={priceRange}
        onPriceChange={(val) => {
          setPriceRange(val);
          setCurrentPage(1);
        }}
        stockFilter={stockFilter}
        onSelectStockFilter={(st) => {
          setStockFilter(st);
          setCurrentPage(1);
        }}
        onReset={handleReset}
      />

      {/* DESKTOP QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;
