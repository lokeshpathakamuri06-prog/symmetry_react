import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, MapPin } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import BlogCard from '../components/BlogCard';
import { blogs } from '../data/blogs';

const CATEGORIES = [
  'All',
  'Interior Design',
  'Furniture Trends',
  'Buying Guides',
  'Material Guides',
  'Project Highlights'
];

const ITEMS_PER_PAGE = 6;

export const Journal = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Featured article (first one flagged or first blog in collection)
  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0];
  }, []);

  // Filtered list based on category and search query
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBlogs, safeCurrentPage]);

  // Handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const gridElem = document.getElementById('journal-grid-section');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="THE SYMMETRY JOURNAL | Architecture, Furniture & Materials"
        description="Essays, material guides, buying guides, and project spotlights exploring quiet luxury, Italian craftsmanship, and bespoke living."
      />

      {/* =========================================================================
          SECTION 1: ARCHITECTURAL CINEMATIC HERO FOR JOURNAL
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[680px] sm:min-h-[760px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed background media with architectural library image & luxury film vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=2400&q=85"
            alt="Symmetry Architectural Journal & Monographs"
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
            <span className="text-[#BCA575] font-semibold">The Symmetry Journal</span>
          </motion.div>
        </div>

        {/* Center Viewport Title Block */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-8 space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white font-normal leading-[1.05] tracking-tight uppercase drop-shadow-md"
          >
            THE SYMMETRY <span className="italic font-light text-[#BCA575]">JOURNAL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
          >
            Critical reflections, architectural monographs, and practical buying guides curated by our studio directors, master artisans, and global procurement specialists.
          </motion.p>
        </div>
      </section>

      {/* =========================================================================
          METRICS STRIP DIRECTLY UNDER HERO
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { value: '06', label: 'Editorial Disciplines', sub: 'Design & Procurement' },
            { value: '100%', label: 'Studio Essays', sub: 'Original Atelier Research' },
            { value: '14', label: 'Global Material Guides', sub: 'Stone, Timber & Textiles' },
            { value: '15k+', label: 'Design Patrons', sub: 'Global Readership' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0D1C29]/95 backdrop-blur-md border border-[#D1DCDE] dark:border-[#1E3447] shadow-xl text-center flex flex-col justify-center transition-all duration-300 hover:border-[#36656B]/50 hover:shadow-2xl"
            >
              <span className="font-serif text-3xl sm:text-4xl text-[#36656B] dark:text-[#BCA575] font-normal leading-tight">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] mt-1.5">
                {stat.label}
              </span>
              <span className="text-[10px] text-[#4F6467] dark:text-[#AEB7BE] font-light mt-0.5 hidden sm:block">
                {stat.sub}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* =========================================================================
          FEATURED MONOGRAPH SECTION & BLOG GRID
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Article Hero Card */}
        {featuredBlog && selectedCategory === 'All' && !searchQuery && (
          <div id="featured-monograph" className="pt-4 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Architectural Monograph
              </span>
              <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                Curated Lead Edition
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-luxury grid grid-cols-1 lg:grid-cols-12 group transition-all duration-500 hover:border-[#36656B]/60 hover:shadow-2xl relative"
            >
              {/* Shimmer Light Reflection Sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent pointer-events-none z-20" />

              <Link
                to={`/journal/${featuredBlog.id}`}
                className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] block relative"
              >
                <img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/85 backdrop-blur-md text-[#F4F7F6] border border-white/10 shadow-sm">
                    Featured Monograph
                  </span>
                </div>
              </Link>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                    <span>{featuredBlog.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{featuredBlog.readTime}</span>
                    </span>
                    <span>&bull;</span>
                    <span>{featuredBlog.date}</span>
                  </div>

                  <Link to={`/journal/${featuredBlog.id}`} className="block hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-snug">
                      {featuredBlog.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] flex items-center justify-between">
                  <span className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                    By {featuredBlog.author}
                  </span>

                  <Link
                    to={`/journal/${featuredBlog.id}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury font-medium text-[#36656B] dark:text-[#BCA575] hover:translate-x-1 transition-transform"
                  >
                    <span>Read Monograph</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter & Search Bar Section */}
        <motion.div
          id="journal-grid-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-8 border-t border-[#D1DCDE]/70 dark:border-[#1E3447] scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full md:w-auto scrollbar-none">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-luxury shrink-0 transition-all cursor-pointer font-medium ${
                      isActive
                        ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-sm'
                        : 'border border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B] hover:text-[#131E20] dark:hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search essays & guides..."
                className="w-full pl-10 pr-9 py-2 rounded-full text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#0D1C29] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-1 focus:ring-[#36656B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Count indicator */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#4F6467] dark:text-[#AEB7BE]">
            <span>
              Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Essay' : 'Essays'}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>

            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Article Grid with Full-Page Animated Entrance */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {paginatedBlogs.length > 0 ? (
              <motion.div
                key={`grid-page-${currentPage}-${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              >
                {paginatedBlogs.map((blog, idx) => (
                  <BlogCard key={blog.id} blog={blog} index={idx} />
                ))}
              </motion.div>
            ) : (
              /* Empty Search / Filter State */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="py-20 px-6 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-center max-w-xl mx-auto my-8 shadow-sm"
              >
                <BookOpen className="w-10 h-10 text-[#36656B] mx-auto mb-3 stroke-[1.2]" />
                <h3 className="text-xl font-serif text-[#131E20] dark:text-[#F5F1E8]">
                  No Essays Found
                </h3>
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] mt-2 mb-6 font-light">
                  We couldn’t find any monographs matching your query. Try searching for "Travertine", "Lighting", or "Bouclé".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#131E20] dark:bg-white text-white dark:text-[#131E20] text-xs uppercase tracking-luxury font-medium cursor-pointer hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-8 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] flex items-center justify-between"
          >
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] disabled:opacity-40 disabled:hover:border-[#D1DCDE] transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                    safeCurrentPage === pageNum
                      ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-white dark:text-[#131E20] shadow-sm'
                      : 'border border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] disabled:opacity-40 disabled:hover:border-[#D1DCDE] transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Journal;
