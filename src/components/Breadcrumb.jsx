import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-2 text-xs tracking-wider uppercase font-sans">
        <li>
          <Link
            to="/"
            className="text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#36656B]/60" />
              {isLast || !item.to ? (
                <span className="text-[#131E20] dark:text-[#F5F1E8] font-medium truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
