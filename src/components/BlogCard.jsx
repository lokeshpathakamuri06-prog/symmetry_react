import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const BlogCard = ({ blog, index = 0 }) => {
  if (!blog) return null;

  return (
    <m.article
      {...reveal({ order: index % 6 })}
      layout
      className="h-full"
    >
      <AppleCardWrapper className="group relative flex flex-col h-full bg-surface overflow-hidden">
      {/* Clickable Image Frame with Zoom, Reflection Sweep, and Overlays */}
      <Link
        to={`/journal/${blog.id}`}
        aria-label={`Read ${blog.title}`}
        className="relative aspect-[16/10] overflow-hidden bg-sunken block cursor-pointer"
      >
        <SmartImage sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.05]"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-20">
          <span className="glass inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-fg shadow-sm transition-colors">
            <BookOpen className="w-3 h-3 text-accent" />
            {blog.category}
          </span>
        </div>

        {/* Read Time Tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className="glass inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-fg">
            <Clock className="w-3 h-3 text-accent" />
            {blog.readTime}
          </span>
        </div>

        {/* Corner Floating Action Icon */}
        <div className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-[#1D1D1F] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
          <ArrowUpRight className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>

      {/* Card Body Details */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata Row: Date & Author */}
          <div className="flex items-center gap-2 text-[13px] text-subtle">
            <span>{blog.date}</span>
            <span className="text-accent">&bull;</span>
            <span className="truncate">By {blog.author}</span>
          </div>

          {/* Title */}
          <Link
            to={`/journal/${blog.id}`}
            className="block group/link"
          >
            <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-fg leading-snug group-hover/link:text-accent transition-colors duration-300">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-[14.5px] text-muted line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer Link */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            to={`/journal/${blog.id}`}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-accent group-hover:translate-x-0.5 transition-transform"
          >
            <span>Read Article</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <span className="text-[12px] font-mono text-subtle">
            Journal
          </span>
        </div>
      </div>
      </AppleCardWrapper>
    </m.article>
  );
};

export default BlogCard;
