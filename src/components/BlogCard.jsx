import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const BlogCard = ({ blog, index = 0 }) => {
  if (!blog) return null;

  return (
    <m.article {...reveal({ order: index % 6 })} layout className="h-full">
      <AppleCardWrapper className="flex flex-col h-full">
        <Link
          to={`/journal/${blog.id}`}
          aria-label={`Read ${blog.title}`}
          className="relative aspect-[16/10] overflow-hidden bg-sunken block"
          tabIndex={-1}
        >
          <SmartImage
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="tile-media w-full h-full object-cover"
          />
        </Link>

        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <p className="text-[13px] sm:text-[14px] font-semibold text-accent">
            {blog.category}
            <span className="text-subtle font-normal"> · {blog.readTime}</span>
          </p>
          <Link to={`/journal/${blog.id}`} className="block mt-1">
            <h3 className="text-[21px] sm:text-[24px] font-semibold tracking-tight text-fg leading-snug hover:text-accent transition-colors duration-300">
              {blog.title}
            </h3>
          </Link>
          <p className="mt-2 text-[15px] text-muted line-clamp-2 leading-relaxed">{blog.excerpt}</p>
          <p className="mt-3 text-[13px] text-subtle truncate">
            {blog.date} · By {blog.author}
          </p>

          <Link to={`/journal/${blog.id}`} className="link-apple mt-auto pt-4 !text-[15px] whitespace-nowrap">
            Read Article <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </AppleCardWrapper>
    </m.article>
  );
};

export default BlogCard;
