import React from 'react';
import { Link } from 'react-router-dom';
import { scrollToTarget } from '../lib/scroll';

/**
 * Page bar, as on Apple product pages: the page name on the left and one action on the right.
 * It sticks under the global bar and moves up into its place when that bar tucks away
 * (--gnav-offset). Must be a direct child of the page's root element, which must not use
 * overflow-hidden (use overflow-x-clip), or it cannot stick.
 *
 *   <LocalNav title="About" cta={{ label: 'Book a consultation', to: '/contact' }} />
 *   <LocalNav title="Careers" cta={{ label: 'Apply now', href: '#apply' }} />
 */
export const LocalNav = ({ title, cta = { label: 'Book a consultation', to: '/contact' } }) => {
  const ctaClass = 'btn-primary btn-sm !py-[5px] !px-3.5 !text-[12.5px]';
  return (
    <div data-local-nav className="sticky z-[900] top-[var(--gnav-offset)] mt-[var(--gnav-h)] transition-[top] duration-500 ease-apple">
      <div className="glass border-b border-line/60 dark:border-line/70">
        <div className="site-container h-[52px] flex items-center justify-between gap-4">
          <p className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-fg truncate">{title}</p>
          {cta &&
            (cta.to ? (
              <Link to={cta.to} className={ctaClass}>{cta.label}</Link>
            ) : (
              <a
                href={cta.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(cta.href);
                }}
                className={ctaClass}
              >
                {cta.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LocalNav;
