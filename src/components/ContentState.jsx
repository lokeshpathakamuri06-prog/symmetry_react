import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

// Loading skeleton and friendly error for pages that render published content.
// variant: 'grid' (listing pages), 'detail' (single item pages) or 'inline' (sections inside a page)

const Block = ({ className = '' }) => (
  <div className={`rounded-2xl bg-sunken/70 dark:bg-sunken animate-pulse ${className}`} />
);

const Skeleton = ({ variant }) => {
  if (variant === 'detail') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10" aria-hidden="true">
        <Block className="aspect-[4/5]" />
        <div className="space-y-4 pt-4">
          <Block className="h-4 w-32" />
          <Block className="h-10 w-3/4" />
          <Block className="h-4 w-full" />
          <Block className="h-4 w-5/6" />
          <Block className="h-12 w-48 mt-8" />
        </div>
      </div>
    );
  }
  const count = variant === 'inline' ? 3 : 6;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3">
          <Block className="aspect-[4/3]" />
          <Block className="h-4 w-2/3" />
          <Block className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
};

export const ContentState = ({ status, retry, variant = 'grid', className = '' }) => {
  const wrapper =
    variant === 'inline' ? `py-6 ${className}` : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 min-h-[70vh] ${className}`;

  if (status === 'error') {
    return (
      <div className={wrapper}>
        <div role="alert" className="max-w-md mx-auto text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <WifiOff className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-fg">We couldn&apos;t load this page</h2>
          <p className="text-sm text-muted">Please check your connection and try again.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-on-accent dark:text-canvas text-[14px] tracking-[-0.01em] font-medium hover:bg-accent-hover transition"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapper} aria-busy="true" aria-label="Loading content">
      <Skeleton variant={variant} />
    </div>
  );
};

export default ContentState;
