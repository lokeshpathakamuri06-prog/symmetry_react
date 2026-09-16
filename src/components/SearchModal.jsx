import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Layers, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { products } from '../data/products';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';

export const SearchModal = () => {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const cleanQuery = query.toLowerCase().trim();

  const filteredProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.materials.some((m) => m.toLowerCase().includes(cleanQuery)) ||
          p.collection.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredProjects = cleanQuery
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.location.toLowerCase().includes(cleanQuery) ||
          p.typology.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredBlogs = cleanQuery
    ? blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(cleanQuery) ||
          b.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const handleSelect = (url) => {
    closeSearch();
    navigate(url);
  };

  const totalResults =
    filteredProducts.length + filteredProjects.length + filteredBlogs.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-[#07121C]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0D1C29] rounded-2xl shadow-2xl border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
              <Search className="w-5 h-5 text-[#36656B] dark:text-[#BCA575] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture, architecture, materials, journals..."
                className="w-full text-base sm:text-lg bg-transparent text-[#131E20] dark:text-[#F5F1E8] placeholder-[#4F6467]/60 dark:placeholder-[#AEB7BE]/50 focus:outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 mr-2 text-xs uppercase tracking-wider text-[#4F6467] hover:text-[#131E20] dark:hover:text-white"
                >
                  Clear
                </button>
              )}
              <button
                onClick={closeSearch}
                className="p-1 rounded-lg text-[#4F6467] hover:text-[#131E20] dark:hover:text-white"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
              {!cleanQuery ? (
                <div className="py-8 text-center text-[#4F6467] dark:text-[#AEB7BE]">
                  <p className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] mb-2 font-medium">
                    Quick Discoveries
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-md mx-auto">
                    {['Travertine', 'Bouclé Sofa', 'Jubilee Hills', 'Murano Chandelier', 'Turnkey Execution'].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="text-xs px-3 py-1.5 rounded-full bg-[#F4F7F6] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-xs text-[#4F6467]/70 dark:text-[#AEB7BE]/70 mt-6">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[#E5ECEC] dark:bg-[#132838] text-[10px]">ESC</kbd> to close
                  </p>
                </div>
              ) : totalResults === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-xl text-[#131E20] dark:text-[#F5F1E8]">No matches found</p>
                  <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] mt-1">
                    No results for &ldquo;{query}&rdquo;. Try searching for &lsquo;sofa&rsquo;, &lsquo;penthouse&rsquo;, or &lsquo;lighting&rsquo;.
                  </p>
                </div>
              ) : (
                <>
                  {/* Products Section */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Furniture Pieces ({filteredProducts.length})
                      </div>
                      <div className="space-y-2">
                        {filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelect(`/shop/${p.id}`)}
                            className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#F4F7F6] dark:hover:bg-[#132838] cursor-pointer transition-colors group"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-14 h-14 rounded-lg object-cover border border-[#D1DCDE] dark:border-[#1E3447]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#131E20] dark:text-[#F5F1E8] truncate group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors">
                                {p.name}
                              </h4>
                              <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                                {p.collection} &bull; &#8379;{p.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#4F6467] group-hover:text-[#36656B] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {filteredProjects.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                        <Layers className="w-3.5 h-3.5" />
                        Architectural Projects ({filteredProjects.length})
                      </div>
                      <div className="space-y-2">
                        {filteredProjects.map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => handleSelect(`/projects/${proj.id}`)}
                            className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#F4F7F6] dark:hover:bg-[#132838] cursor-pointer transition-colors group"
                          >
                            <img
                              src={proj.heroImage}
                              alt={proj.title}
                              className="w-14 h-14 rounded-lg object-cover border border-[#D1DCDE] dark:border-[#1E3447]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#131E20] dark:text-[#F5F1E8] truncate group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors">
                                {proj.title}
                              </h4>
                              <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                                {proj.typology} &bull; {proj.location}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#4F6467] group-hover:text-[#36656B] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs Section */}
                  {filteredBlogs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-3">
                        <BookOpen className="w-3.5 h-3.5" />
                        Design Journal ({filteredBlogs.length})
                      </div>
                      <div className="space-y-2">
                        {filteredBlogs.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => handleSelect(`/journal/${b.id}`)}
                            className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#F4F7F6] dark:hover:bg-[#132838] cursor-pointer transition-colors group"
                          >
                            <img
                              src={b.coverImage}
                              alt={b.title}
                              className="w-14 h-14 rounded-lg object-cover border border-[#D1DCDE] dark:border-[#1E3447]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#131E20] dark:text-[#F5F1E8] truncate group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors">
                                {b.title}
                              </h4>
                              <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                                {b.category} &bull; {b.readTime}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#4F6467] group-hover:text-[#36656B] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
