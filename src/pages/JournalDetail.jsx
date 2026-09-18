import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Copy,
  Check,
  MessageCircle,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import BlogCard from '../components/BlogCard';
import { blogs } from '../data/blogs';

const XIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6" />
  </svg>
);

export const JournalDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const blogIndex = blogs.findIndex((b) => b.id === id);

  if (blogIndex === -1) {
    return <Navigate to="/journal" replace />;
  }

  const blog = blogs[blogIndex];
  const prevBlog = blogIndex > 0 ? blogs[blogIndex - 1] : blogs[blogs.length - 1];
  const nextBlog = blogIndex < blogs.length - 1 ? blogs[blogIndex + 1] : blogs[0];
  const relatedBlogs = blogs
    .filter((b) => b.id !== blog.id && (b.category === blog.category || blogs.indexOf(b) < 3))
    .slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${blog.title} | Symmetry Journal`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${currentUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-28 pb-28 space-y-16 sm:space-y-24">
      <SeoMeta
        title={`${blog.title} | The Symmetry Journal`}
        description={blog.excerpt}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'The Symmetry Journal', to: '/journal' },
            { label: blog.category, to: `/journal` },
            { label: blog.title },
          ]}
        />

        {/* Header Metadata & Title */}
        <header className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
            <span className="px-3 py-1 rounded-full bg-[#36656B]/10 border border-[#36656B]/20">
              {blog.category}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{blog.readTime}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{blog.date}</span>
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] leading-[1.12]">
            {blog.title}
          </h1>

          {/* Author Byline & Social Sharing Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-[#D1DCDE]/60 dark:border-[#1E3447] text-xs text-[#4F6467] dark:text-[#AEB7BE]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center text-[#36656B] font-serif font-bold text-sm">
                {blog.author.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] block text-sm">
                  {blog.author}
                </span>
                <span className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
                  {blog.authorRole || 'Architectural Contributor'}
                </span>
              </div>
            </div>

            {/* Social Sharing Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-luxury font-medium mr-1 hidden sm:inline">
                Share:
              </span>
              <button
                type="button"
                onClick={shareToTwitter}
                className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] hover:text-[#36656B] transition"
                title="Share on X / Twitter"
                aria-label="Share on Twitter"
              >
                <XIcon />
              </button>
              <button
                type="button"
                onClick={shareToLinkedIn}
                className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] hover:text-[#36656B] transition"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <LinkedinIcon />
              </button>
              <button
                type="button"
                onClick={shareToWhatsApp}
                className="p-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] hover:text-[#36656B] transition"
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] hover:text-[#36656B] transition relative"
                title="Copy Article Link"
                aria-label="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Copy Link Toast Notification */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Article citation link copied to clipboard.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Cover Image */}
        <div className="my-10 aspect-[16/9] sm:aspect-[21/10] rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-luxury border border-[#D1DCDE] dark:border-[#1E3447]">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lead Pull-Quote Excerpt */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#E5ECEC]/40 dark:bg-[#0D1C29] border-l-4 border-[#36656B] my-10 font-serif text-lg sm:text-2xl italic text-[#131E20] dark:text-[#F5F1E8] leading-relaxed shadow-sm">
          &ldquo;{blog.excerpt}&rdquo;
        </div>

        {/* Editorial Prose Content */}
        <div className="space-y-8 text-base sm:text-lg text-[#131E20]/90 dark:text-[#F5F1E8]/90 font-light leading-relaxed tracking-wide">
          {blog.content?.map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#36656B] first-letter:leading-none' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Architectural Images / Gallery */}
        {blog.relatedImages && blog.relatedImages.length > 0 && (
          <div className="my-14 space-y-6 pt-10 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              <Camera className="w-4 h-4" />
              <span>Architectural Plates &amp; Material Documentation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {blog.relatedImages.map((img, idx) => (
                <figure key={idx} className="group space-y-2.5">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447]">
                    <img
                      src={img.url}
                      alt={img.caption || `Plate ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="text-xs text-[#4F6467] dark:text-[#AEB7BE] italic font-serif leading-snug">
                      Fig. {idx + 1} &mdash; {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && (
          <div className="pt-8 mt-12 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mr-2 font-medium">
              Indexed Under:
            </span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Previous / Next Article Navigation */}
        <nav aria-label="Previous and Next Articles" className="pt-10 mt-14 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Previous Article Card */}
          <Link
            to={`/journal/${prevBlog.id}`}
            className="p-5 rounded-2xl border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#0D1C29] hover:border-[#36656B] transition group flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Previous Monograph</span>
            </div>
            <div className="font-serif text-base text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] transition line-clamp-2">
              {prevBlog.title}
            </div>
            <div className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
              {prevBlog.category} &bull; {prevBlog.readTime}
            </div>
          </Link>

          {/* Next Article Card */}
          <Link
            to={`/journal/${nextBlog.id}`}
            className="p-5 rounded-2xl border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#0D1C29] hover:border-[#36656B] transition group flex flex-col justify-between space-y-2 sm:text-right"
          >
            <div className="flex items-center gap-1.5 sm:justify-end text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              <span>Next Monograph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-serif text-base text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] transition line-clamp-2">
              {nextBlog.title}
            </div>
            <div className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
              {nextBlog.category} &bull; {nextBlog.readTime}
            </div>
          </Link>
        </nav>
      </article>

      {/* Related Articles Section */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                Curated Reading
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] mt-1">
                Related Monographic Studies
              </h2>
            </div>
            <Link
              to="/journal"
              className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] flex items-center gap-1.5 hover:underline font-semibold"
            >
              <span>View All Essays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JournalDetail;
