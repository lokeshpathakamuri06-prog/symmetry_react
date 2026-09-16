import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const SmoothScroll = ({ children }) => {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll globally
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: true,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Global internal anchor link smooth scroll handler
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href*="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#!')) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const hash = href.slice(hashIndex);
      if (hash.length <= 1) return;

      const targetPath = href.slice(0, hashIndex);
      const currentPath = window.location.pathname;

      if (!targetPath || targetPath === currentPath) {
        try {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, {
              offset: -90,
              duration: 1.1,
            });
            window.history.pushState(null, '', hash);
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    // Handle window resize to keep Lenis dimensions synchronized
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      window.lenis = null;
      lenisRef.current = null;
    };
  }, []);

  // Handle route and hash changes seamlessly
  useEffect(() => {
    if (!lenisRef.current) return;

    if (location.hash) {
      const timer = setTimeout(() => {
        try {
          const target = document.querySelector(location.hash);
          if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target, {
              offset: -90,
              duration: 1.1,
            });
          }
        } catch {
          // Invalid selector
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Instant reset to top on route change
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.hash]);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.1, offset: -90, ...options });
    }
  };

  return <>{children}</>;
};

export default SmoothScroll;
