import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import ContentState from '../ContentState';
import { DISTANCE, dur, ease } from '../../lib/motion';

/**
 * Each new page fades in and rises slightly; the header stays where it is.
 * Enter only (no exit): the old page is replaced at once, so scroll restore and
 * Back/Forward stay instant. The page the visit started on is not animated, so the
 * browser can paint it immediately. Keyed by path: a query change (Shop filters) does not replay it.
 */
export const PageTransition = ({ children }) => {
  const { pathname, key } = useLocation();
  // The history entry the visit started on is shown without animation
  const [firstKey] = useState(key);
  const animateIn = key !== firstKey;

  return (
    <m.div
      key={pathname}
      initial={animateIn ? { opacity: 0, y: DISTANCE / 2 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base * 0.7, ease: ease.out }}
    >
      {children}
    </m.div>
  );
};

/** Suspense fallback while a page's code downloads: blank canvas first, a spinner only if it is slow */
export const RouteFallback = () => {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 500);
    return () => clearTimeout(timer);
  }, []);
  return slow ? <ContentState status="loading" /> : <div className="min-h-[70vh]" aria-busy="true" />;
};

export default PageTransition;
