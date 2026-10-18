import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../lib/api';

// Published site content (products, projects, journal, team, jobs, ...) from GET /api/public/content.
// Records keep the same shape as the original src/data objects, so pages read the same fields.

const PublicContentContext = createContext();

const EMPTY = Object.freeze([]);
const REFRESH_AFTER_MS = 5 * 60 * 1000; // re-check on tab focus after 5 minutes

const withLiveCatalog = (data, live) => {
  if (!live?.products || !Array.isArray(data?.products)) return data;
  return { ...data, products: data.products.map((p) => (live.products[p.id] ? { ...p, ...live.products[p.id] } : p)) };
};

export const PublicContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const lastLoadedAt = useRef(0);
  const inFlight = useRef(null);

  const load = useCallback(async ({ background = false } = {}) => {
    if (inFlight.current) return inFlight.current;
    if (!background) setStatus((s) => (s === 'ready' ? s : 'loading'));
    // Prices and stock come live from the database (no publish needed); if that call fails the
    // published values are used as they are
    inFlight.current = Promise.all([api('/public/content'), api('/public/live-catalog').catch(() => null)])
      .then(([data, live]) => {
        setContent(withLiveCatalog(data, live));
        setStatus('ready');
        lastLoadedAt.current = Date.now();
      })
      .catch(() => {
        // Keep showing already-loaded content if a background refresh fails
        setStatus((s) => (s === 'ready' ? s : 'error'));
      })
      .finally(() => {
        inFlight.current = null;
      });
    return inFlight.current;
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastLoadedAt.current > REFRESH_AFTER_MS) {
        load({ background: true });
      }
    };
    document.addEventListener('visibilitychange', onFocus);
    return () => document.removeEventListener('visibilitychange', onFocus);
  }, [load]);

  return (
    <PublicContentContext.Provider value={{ content, status, retry: load }}>
      {children}
    </PublicContentContext.Provider>
  );
};

export const usePublicContent = () => {
  const context = useContext(PublicContentContext);
  if (!context) {
    throw new Error('usePublicContent must be used within a PublicContentProvider');
  }
  return context;
};

const useCollection = (key) => {
  const { content, status, retry } = usePublicContent();
  return { items: content?.[key] ?? EMPTY, status, retry };
};

export const useProducts = () => useCollection('products');
export const useCategories = () => useCollection('categories');
export const useProjects = () => useCollection('projects');
export const useBlogs = () => useCollection('blogs');
export const useTestimonials = () => useCollection('testimonials');
export const useTeam = () => useCollection('team');
export const useJobs = () => useCollection('jobs');
export const useBanners = () => useCollection('banners');
export const useCollections = () => useCollection('collections');

// Page text edited in admin Page Content: useSiteText('home'), useSiteText('company'), ...
const EMPTY_SECTION = Object.freeze({});
export const useSiteText = (page) => {
  const { content } = usePublicContent();
  return content?.siteSections?.[page] ?? EMPTY_SECTION;
};

// Alt text set in the Media Library, by image URL (images without one use the caller's alt)
export const useImageAlt = (src) => {
  const context = useContext(PublicContentContext);
  return (src && context?.content?.imageAlt?.[src]) || '';
};

export default PublicContentContext;
