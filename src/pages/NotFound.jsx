import React from 'react';
import { Compass } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Button from '../components/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 text-center">
      <SeoMeta
        title="404 — Page Not Found"
        description="The page you are looking for does not exist."
      />

      <div className="max-w-xl space-y-6">
        <span className="font-bold text-7xl sm:text-9xl text-accent block">
          404
        </span>

        <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
          Page Not Found
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
          We Couldn’t Find That Page.
        </h1>

        <p className="text-sm text-muted leading-relaxed font-light">
          The link may be old or the page may have moved. Try one of these instead.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button to="/" variant="primary" size="md" showArrow>
            Go to Home Page
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
