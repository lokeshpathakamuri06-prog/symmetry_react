import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { scrollToTarget } from '../lib/scroll';
import { reveal } from '../lib/motion';
import { ArrowUpRight, Search, X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, MapPin } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import BlogCard from '../components/BlogCard';
import ContentState from '../components/ContentState';
import { usePublicContent } from '../context/PublicContentContext';
import SmartImage from '../components/SmartImage';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';

const CATEGORIES = [
  'All',
  'Interior Design',
  'Furniture Trends',
  'Buying Guides',
  'Material Guides',
  'Project Highlights'
];

const ITEMS_PER_PAGE = 6;

// Loads published content, then renders the page exactly as before
export const Journal = () => {
  const { content, status, retry } = usePublicContent();
  if (status !== 'ready') return <ContentState status={status} retry={retry} variant="grid" />;
  return <JournalView blogs={content.blogs} />;
};

const JournalView = ({ blogs }) => {
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
      scrollToTarget(document.getElementById('journal-grid-section'));
    }
  };

  return (
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="The Symmetry Journal | Interiors, Furniture & Materials"
        description="Essays, material guides, buying guides, and project spotlights exploring quiet luxury, Italian craftsmanship, and bespoke living."
      />

      <PageHero
        page="journal"
        breadcrumb={[{ label: 'The Symmetry Journal' }]}
        eyebrow="Journal"
        title="The Symmetry"
        highlight="Journal"
        subtitle="Ideas, material guides and buying advice from our designers, craftspeople and sourcing team."
        image={heroImage('/images/hero/hero-journal.jpeg')}
        imageAlt="The Symmetry Journal"
        stats={[
          { value: '06', label: 'Editorial Disciplines', sub: 'Design & Procurement' },
          { value: '100%', label: 'Studio Essays', sub: 'Written by Our Team' },
          { value: '14', label: 'Global Material Guides', sub: 'Stone, Timber & Textiles' },
          { value: '15k+', label: 'Readers', sub: 'Around the World' },
        ]}
      />

      {/* =========================================================================
          FEATURED MONOGRAPH SECTION & BLOG GRID
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Article Hero Card */}
        {featuredBlog && selectedCategory === 'All' && !searchQuery && (
          <div id="featured-monograph" className="pt-4 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Article
              </span>
              <span className="text-xs font-mono text-subtle">
                Editor's Pick
              </span>
            </div>

            <m.div
              {...reveal()}
              className="rounded-3xl overflow-hidden bg-surface border border-line shadow-luxury grid grid-cols-1 lg:grid-cols-12 group transition-all duration-500 hover:border-accent/60 hover:shadow-2xl relative"
            >
              {/* Shimmer Light Reflection Sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent pointer-events-none z-20" />

              <Link
                to={`/journal/${featuredBlog.id}`}
                className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-sunken block relative"
              >
                <SmartImage sizes="(min-width: 1024px) 60vw, 100vw" priority
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-fg/85 dark:bg-canvas/85 backdrop-blur-md text-[#F4F7F6] border border-white/10 shadow-sm">
                    Featured Article
                  </span>
                </div>
              </Link>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-luxury text-accent font-semibold">
                    <span>{featuredBlog.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{featuredBlog.readTime}</span>
                    </span>
                    <span>&bull;</span>
                    <span>{featuredBlog.date}</span>
                  </div>

                  <Link to={`/journal/${featuredBlog.id}`} className="block hover:text-accent transition-colors">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-fg leading-snug">
                      {featuredBlog.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-line/60 dark:border-line flex items-center justify-between">
                  <span className="text-xs text-muted">
                    By {featuredBlog.author}
                  </span>

                  <Link
                    to={`/journal/${featuredBlog.id}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury font-medium text-accent hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </m.div>
          </div>
        )}

        {/* Filter & Search Bar Section */}
        <m.div
          {...reveal()}
          id="journal-grid-section"
          className="mt-16 pt-8 border-t border-line/70 dark:border-line scroll-mt-24"
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
                        ? 'bg-fg text-canvas shadow-sm'
                        : 'border border-line text-muted hover:border-accent hover:text-[#1D1D1F] dark:hover:text-white'
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
                className="w-full pl-10 pr-9 py-2 rounded-full text-[15px] border border-line bg-surface text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent"
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
          <div className="mt-4 flex items-center justify-between text-xs text-muted">
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
                className="text-xs uppercase tracking-luxury text-accent hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </m.div>

        {/* Article Grid with Full-Page Animated Entrance */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {paginatedBlogs.length > 0 ? (
              <m.div
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
              </m.div>
            ) : (
              /* Empty Search / Filter State */
              <m.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="py-20 px-6 rounded-3xl bg-surface border border-line text-center max-w-xl mx-auto my-8 shadow-sm"
              >
                <BookOpen className="w-10 h-10 text-accent mx-auto mb-3 stroke-[1.2]" />
                <h3 className="text-xl font-bold tracking-tight text-fg">
                  No Essays Found
                </h3>
                <p className="text-xs text-muted mt-2 mb-6 font-light">
                  We couldn’t find any articles matching your search. Try searching for "Travertine", "Lighting", or "Bouclé".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-on-accent text-[14px] tracking-[-0.01em] font-medium cursor-pointer hover:bg-accent transition-colors"
                >
                  Clear All Filters
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <m.div
            {...reveal({ variant: 'fadeIn' })}
            className="mt-16 pt-8 border-t border-line/60 dark:border-line flex items-center justify-between"
          >
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-[14px] tracking-[-0.01em] font-medium text-fg hover:border-accent disabled:opacity-40 disabled:hover:border-[#D1DCDE] transition cursor-pointer"
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
                      ? 'bg-fg text-on-accent shadow-sm'
                      : 'border border-line text-muted hover:border-accent'
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-[14px] tracking-[-0.01em] font-medium text-fg hover:border-accent disabled:opacity-40 disabled:hover:border-[#D1DCDE] transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </m.div>
        )}
      </section>
    </div>
  );
};

export default Journal;
