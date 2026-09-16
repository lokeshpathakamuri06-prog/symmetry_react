import React from 'react';
import { motion } from 'framer-motion';
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

export const TeamCard = ({ member, index = 0, className = '' }) => {
  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`group flex flex-col h-full bg-white dark:bg-[#0D1C29] rounded-2xl sm:rounded-3xl border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 ${className}`}
    >
      {/* Portrait Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E5ECEC] dark:bg-[#132838]">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-center filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131E20]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Experience Pill Overlay on Top */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury font-medium bg-[#F4F7F6]/90 dark:bg-[#07121C]/90 text-[#131E20] dark:text-[#F5F1E8] backdrop-blur-md border border-[#D1DCDE]/60 dark:border-[#1E3447]/60 shadow-sm">
            <Award className="w-3 h-3 text-[#36656B] dark:text-[#BCA575]" />
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
              className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#0D1C29]/95 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] flex items-center justify-center shadow-md transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          )}
          <a
            href="mailto:contact@symmetryinteriors.com"
            aria-label={`Inquire with ${member.name}`}
            className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#0D1C29]/95 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] flex items-center justify-center shadow-md transition-colors"
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
            <span className="text-[11px] uppercase tracking-luxury font-medium text-[#36656B] dark:text-[#BCA575]">
              {member.department}
            </span>
            {member.credentials && (
              <span className="text-[10px] uppercase font-sans tracking-wider text-[#6B8083] dark:text-[#8E9CA8] truncate max-w-[140px]">
                {member.credentials}
              </span>
            )}
          </div>

          {/* Member Name */}
          <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-[#131E20] dark:text-[#F5F1E8] leading-tight group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors duration-300">
            {member.name}
          </h3>

          {/* Role */}
          <p className="text-xs sm:text-[13px] font-sans font-medium text-[#4F6467] dark:text-[#AEB7BE] mt-1 mb-3">
            {member.role}
          </p>

          {/* Bio Snippet */}
          <p className="text-xs sm:text-[13px] text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed mb-5">
            {member.bio}
          </p>
        </div>

        {/* Specialty Tags */}
        {member.specialties && member.specialties.length > 0 && (
          <div className="pt-4 border-t border-[#E5ECEC] dark:border-[#1E3447]/60 flex flex-wrap gap-1.5">
            {member.specialties.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[10px] font-sans uppercase tracking-wider bg-[#F4F7F6] dark:bg-[#07121C] text-[#4F6467] dark:text-[#AEB7BE] border border-[#D1DCDE]/50 dark:border-[#1E3447]/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamCard;
