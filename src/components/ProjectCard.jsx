import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import AppleCardWrapper from './AppleCardWrapper';

export const ProjectCard = ({ project, index = 0, className = '' }) => {
  if (!project) return null;

  // Derive category if typology is used
  const category = project.category || project.typology || 'Residential';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`h-full ${className}`}
    >
      <AppleCardWrapper className="group relative flex flex-col h-full bg-white dark:bg-[#0D1C29] rounded-3xl overflow-hidden">
      {/* Clickable Image Container with Zoom, Reflection Sweep, and Overlays */}
      <Link
        to={`/projects/${project.id}`}
        aria-label={`View ${project.title} details`}
        className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] block cursor-pointer"
      >
        <img
          src={project.heroImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131E20]/90 via-[#131E20]/30 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-500" />

        {/* Subtle Light Reflection Sweep on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/90 text-[#F4F4F6] backdrop-blur-md shadow-sm transition-colors">
            <Layers className="w-3 h-3 text-[#36656B] dark:text-[#BCA575]" />
            {category}
          </span>
        </div>

        {/* Year Pill Tag */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono bg-white/85 dark:bg-[#0D1C29]/85 text-[#131E20] dark:text-[#F5F1E8] backdrop-blur-md shadow-sm">
            <Calendar className="w-3 h-3 text-[#36656B] dark:text-[#BCA575]" />
            {project.completionYear}
          </span>
        </div>

        {/* Hover Arrow Action Icon */}
        <div className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
          <ArrowUpRight className="w-5 h-5 text-[#36656B] dark:text-[#BCA575] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Hover Text Reveal: Summary Snippet */}
        <div className="absolute bottom-4 left-4 right-18 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs text-white/90 font-light line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </Link>

      {/* Card Body Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Footprint Meta */}
          <div className="flex items-center justify-between text-xs text-[#4F6467] dark:text-[#AEB7BE] uppercase tracking-luxury font-medium mb-2">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575] shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            {project.areaSqFt && (
              <span className="text-[11px] font-mono text-[#6B8083] dark:text-[#8E9CA8] shrink-0 bg-[#E5ECEC]/50 dark:bg-[#132838] px-2 py-0.5 rounded-full">
                {project.areaSqFt}
              </span>
            )}
          </div>

          {/* Project Name */}
          <Link
            to={`/projects/${project.id}`}
            className="block group/link"
          >
            <h3 className="text-xl sm:text-2xl font-medium text-[#131E20] dark:text-[#F5F1E8] leading-snug group-hover/link:text-[#36656B] dark:group-hover/link:text-[#BCA575] transition-colors duration-300">
              {project.title}
            </h3>
          </Link>
        </div>

        {/* Materials Chips or Scope Footer */}
        {project.materialsPalette && project.materialsPalette.length > 0 && (
          <div className="pt-4 mt-4 flex flex-wrap gap-1.5">
            {project.materialsPalette.slice(0, 3).map((mat, mIdx) => (
              <span
                key={mIdx}
                className="px-2 py-0.5 rounded-md text-[10px] font-sans bg-[#F4F7F6] dark:bg-[#07121C] text-[#4F6467] dark:text-[#AEB7BE] hover:bg-[#36656B]/15 hover:text-[#36656B] dark:hover:text-[#BCA575] hover:scale-105 transition-all cursor-default"
              >
                {mat}
              </span>
            ))}
            {project.materialsPalette.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#6B8083] dark:text-[#8E9CA8] bg-[#E5ECEC]/50 dark:bg-[#132838] rounded-md">
                +{project.materialsPalette.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      </AppleCardWrapper>
    </motion.div>
  );
};

export default ProjectCard;
