import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

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
      <AppleCardWrapper className="group relative flex flex-col h-full bg-surface overflow-hidden">
      {/* Clickable Image Container with Zoom, Reflection Sweep, and Overlays */}
      <Link
        to={`/projects/${project.id}`}
        aria-label={`View ${project.title} details`}
        className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-sunken block cursor-pointer"
      >
        <SmartImage sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={project.heroImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.05]"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="glass inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-fg">
            <Layers className="w-3 h-3 text-accent" />
            {category}
          </span>
        </div>

        {/* Year Pill Tag */}
        <div className="absolute top-4 right-4 z-10">
          <span className="glass inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-fg">
            <Calendar className="w-3 h-3 text-accent" />
            {project.completionYear}
          </span>
        </div>

        {/* Hover Arrow Action Icon */}
        <div className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-[#1D1D1F] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-apple">
          <ArrowUpRight className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Hover Text Reveal: Summary Snippet */}
        <div className="absolute bottom-4 left-4 right-18 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-[13px] text-white/90 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </Link>

      {/* Card Body Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Footprint Meta */}
          <div className="flex items-center justify-between text-[13px] text-muted mb-1.5">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            {project.areaSqFt && (
              <span className="text-[11px] font-mono text-subtle shrink-0 bg-sunken/50 dark:bg-sunken px-2 py-0.5 rounded-full">
                {project.areaSqFt}
              </span>
            )}
          </div>

          {/* Project Name */}
          <Link
            to={`/projects/${project.id}`}
            className="block group/link"
          >
            <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-fg leading-snug group-hover/link:text-accent transition-colors duration-300">
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
                className="px-2.5 py-1 rounded-full text-[11.5px] bg-sunken text-muted cursor-default"
              >
                {mat}
              </span>
            ))}
            {project.materialsPalette.length > 3 && (
              <span className="px-2.5 py-1 text-[11.5px] font-mono text-subtle bg-sunken rounded-full">
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
