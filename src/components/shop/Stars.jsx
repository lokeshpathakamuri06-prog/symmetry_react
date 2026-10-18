import React from 'react';
import { Star } from 'lucide-react';

/** Five stars filled to the rating (half stars shown as a partial fill), with an optional count */
export const Stars = ({ rating = 0, count, size = 'sm', showValue = true, className = '' }) => {
  const px = size === 'lg' ? 'w-[18px] h-[18px]' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative inline-flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        <span className="flex text-line dark:text-sunken" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${px} fill-current`} strokeWidth={0} />)}
        </span>
        <span className="absolute inset-0 flex overflow-hidden text-[#F5A623]" style={{ width: `${(value / 5) * 100}%` }} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${px} fill-current shrink-0`} strokeWidth={0} />)}
        </span>
      </span>
      {showValue && <span className="text-fg font-medium tabular-nums">{value.toFixed(1)}</span>}
      {count != null && <span className="text-muted tabular-nums">({count})</span>}
    </span>
  );
};

export default Stars;
