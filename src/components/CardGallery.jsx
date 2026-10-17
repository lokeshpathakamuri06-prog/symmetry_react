import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal card gallery, as on apple.com ("Get to know…"): cards line up with the page
 * container, run off the right edge, snap into place, and scroll with touch, trackpad,
 * the round buttons or the keyboard. Each child is one card; give it a width
 * (for example `w-[78vw] sm:w-[360px]`).
 *
 *   <CardGallery label="Featured collections">{items.map((i) => <Card key={i.id} … />)}</CardGallery>
 */
export const CardGallery = ({ label, children, className = '' }) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // Sideways trackpad swipes belong to the gallery: keep them away from the page's smooth scroll
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation();
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      el.removeEventListener('wheel', onWheel);
    };
  }, [update]);

  const page = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    // Move by as many whole cards as fit in most of the visible width (at least one)
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const cards = Math.max(1, Math.floor((el.clientWidth * 0.85) / step));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * cards * step, behavior: reduce ? 'auto' : 'smooth' });
  };

  const button =
    'w-9 h-9 rounded-full bg-sunken/80 dark:bg-surface text-fg/80 flex items-center justify-center transition-[opacity,background-color] duration-200 hover:bg-sunken dark:hover:bg-sunken disabled:opacity-35 disabled:cursor-default cursor-pointer';

  return (
    <div className={className}>
      <div ref={trackRef} className="gallery-track py-2" role="list" aria-label={label} tabIndex={0}>
        {React.Children.map(children, (child) => child && <div role="listitem">{child}</div>)}
      </div>
      <div className="site-container mt-5 flex justify-end gap-3.5">
        <button type="button" onClick={() => page(-1)} disabled={atStart} className={button} aria-label="Previous">
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>
        <button type="button" onClick={() => page(1)} disabled={atEnd} className={button} aria-label="Next">
          <ChevronRight className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default CardGallery;
