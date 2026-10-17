import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const ProjectCard = ({ project, index = 0, className = '' }) => {
  if (!project) return null;

  // Derive category if typology is used
  const category = project.category || project.typology || 'Residential';

  return (
    <m.div {...reveal({ order: index % 6 })} layout className={`h-full ${className}`}>
      <AppleCardWrapper className="flex flex-col h-full">
        <Link
          to={`/projects/${project.id}`}
          aria-label={`View ${project.title} details`}
          className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-sunken block"
        >
          <SmartImage
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={project.heroImage}
            alt={project.title}
            loading="lazy"
            className="tile-media w-full h-full object-cover"
          />
        </Link>

        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <p className="text-[13px] sm:text-[14px] font-semibold text-accent">
            {category}
            <span className="text-subtle font-normal"> · {project.completionYear}</span>
          </p>
          <Link to={`/projects/${project.id}`} className="block mt-1">
            <h3 className="text-[21px] sm:text-[24px] font-semibold tracking-tight text-fg leading-snug hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
          </Link>
          <p className="mt-1 text-[14px] sm:text-[15px] text-muted">
            {project.location}
            {project.areaSqFt && <span className="text-subtle"> · {project.areaSqFt}</span>}
          </p>

          {project.materialsPalette && project.materialsPalette.length > 0 && (
            <p className="mt-3 text-[13px] text-subtle line-clamp-1">
              {project.materialsPalette.slice(0, 3).join(' · ')}
              {project.materialsPalette.length > 3 && ` · +${project.materialsPalette.length - 3}`}
            </p>
          )}

          <Link to={`/projects/${project.id}`} className="link-apple mt-auto pt-5 !text-[15px]" tabIndex={-1}>
            View project <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default ProjectCard;
