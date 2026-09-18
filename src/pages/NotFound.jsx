import React from 'react';
import { Compass } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Button from '../components/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 text-center">
      <SeoMeta
        title="404 — Spatial Absence"
        description="The architectural page or reference you are looking for is not located in this directory."
      />

      <div className="max-w-xl space-y-6">
        <span className="font-bold text-7xl sm:text-9xl text-[#36656B] dark:text-[#BCA575] block">
          404
        </span>

        <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
          Spatial Absence
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8]">
          The Room You Are Looking For Does Not Exist.
        </h1>

        <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light">
          The link may have expired or been relocated within our archival catalog. Allow us to guide you back to our curated spaces.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button to="/" variant="primary" size="md" showArrow>
            Return to Gallery
          </Button>
          <Button to="/projects" variant="secondary" size="md">
            View All Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
