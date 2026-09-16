import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const BlogCard = ({ blog, index = 0 }) => {
  if (!blog) return null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col h-full bg-white dark:bg-[#0D1C29] rounded-3xl border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#36656B]/60 dark:hover:border-[#BCA575]/60 hover:shadow-[0_20px_50px_rgba(54,101,107,0.12)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500"
    >
      {/* Clickable Image Frame with Zoom, Reflection Sweep, and Overlays */}
      <Link
        to={`/journal/${blog.id}`}
        aria-label={`Read ${blog.title}`}
        className="relative aspect-[16/10] overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] block cursor-pointer"
      >
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131E20]/85 via-[#131E20]/25 to-transparent opacity-50 group-hover:opacity-85 transition-opacity duration-500" />

        {/* Dynamic Light Sweep Shimmer on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/90 text-[#F4F7F6] backdrop-blur-md border border-white/15 shadow-sm group-hover:border-[#BCA575]/50 transition-colors">
            <BookOpen className="w-3 h-3 text-[#36656B] dark:text-[#BCA575]" />
            {blog.category}
          </span>
        </div>

        {/* Read Time Tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono bg-white/85 dark:bg-[#0D1C29]/85 text-[#131E20] dark:text-[#F5F1E8] backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
            <Clock className="w-3 h-3 text-[#36656B] dark:text-[#BCA575]" />
            {blog.readTime}
          </span>
        </div>

        {/* Corner Floating Action Icon */}
        <div className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/20">
          <ArrowUpRight className="w-5 h-5 text-[#36656B] dark:text-[#BCA575] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>

      {/* Card Body Details */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata Row: Date & Author */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-[#6B8083] dark:text-[#8E9CA8] font-medium">
            <span>{blog.date}</span>
            <span className="text-[#36656B] dark:text-[#BCA575]">&bull;</span>
            <span className="truncate">By {blog.author}</span>
          </div>

          {/* Title */}
          <Link
            to={`/journal/${blog.id}`}
            className="block group/link"
          >
            <h3 className="text-xl sm:text-2xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-snug group-hover/link:text-[#36656B] dark:group-hover/link:text-[#BCA575] transition-colors duration-300">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] line-clamp-2 font-light leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#E5ECEC] dark:border-[#1E3447]/60 flex items-center justify-between">
          <Link
            to={`/journal/${blog.id}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury font-medium text-[#36656B] dark:text-[#BCA575] group-hover:translate-x-1 transition-transform"
          >
            <span>Read Monograph</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-[10px] font-mono text-[#6B8083] dark:text-[#8E9CA8] uppercase">
            Atelier Dispatch
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
