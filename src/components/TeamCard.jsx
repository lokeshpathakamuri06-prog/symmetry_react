import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';
import { Mail, Award } from 'lucide-react';

const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
);

import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const TeamCard = ({ member, index = 0, className = '' }) => {
  if (!member) return null;

  return (
    <m.div
      {...reveal({ order: index })}
      className={`h-full ${className}`}
    >
      <AppleCardWrapper className="group flex flex-col h-full bg-surface rounded-3xl overflow-hidden">
        {/* Portrait Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-sunken">
          <SmartImage sizes="(min-width: 1024px) 33vw, 100vw"
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-center filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />

          {/* Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Experience Pill Overlay on Top */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury font-medium bg-canvas/90 text-fg backdrop-blur-md shadow-sm">
              <Award className="w-3 h-3 text-accent" />
              {member.experience || member.department}
            </span>
          </div>

          {/* Quick Social Links on Image Hover */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn Profile`}
                className="w-9 h-9 rounded-full bg-surface/95 text-fg hover:text-accent flex items-center justify-center shadow-md transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            )}
            <a
              href="mailto:contact@symmetryinteriors.com"
              aria-label={`Inquire with ${member.name}`}
              className="w-9 h-9 rounded-full bg-surface/95 text-fg hover:text-accent flex items-center justify-center shadow-md transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
          <div>
            {/* Department & Credentials */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-luxury font-medium text-accent">
                {member.department}
              </span>
              {member.credentials && (
                <span className="text-[10px] uppercase font-sans tracking-wider text-subtle truncate max-w-[140px]">
                  {member.credentials}
                </span>
              )}
            </div>

            {/* Member Name */}
            <h3 className="text-2xl sm:text-[26px] font-medium text-fg leading-tight group-hover:text-accent transition-colors duration-300">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-xs sm:text-[13px] font-sans font-medium text-muted mt-1 mb-3">
              {member.role}
            </p>

            {/* Bio Snippet */}
            <p className="text-xs sm:text-[13px] text-muted font-light leading-relaxed mb-5">
              {member.bio}
            </p>
          </div>

          {/* Specialty Tags */}
          {member.specialties && member.specialties.length > 0 && (
            <div className="pt-4 flex flex-wrap gap-1.5">
              {member.specialties.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[10px] font-sans uppercase tracking-wider bg-canvas text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default TeamCard;
