import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteText } from '../context/PublicContentContext';

// The server writes each page's head on first load (symmetry_backend app/seo.py: title, description,
// canonical, link previews, schema). This keeps the same tags right while visitors move between pages.
//   page: key in Page Content → SEO (home, about, shop, …); its title/description override the defaults
//   noindex: pages search engines should not list (cart, checkout)

const BRAND = 'Symmetry Interiors';
const DEFAULT_TITLE = 'Symmetry Interiors & Building Solutions | Bespoke Architecture & Luxury Furniture';

const fullTitle = (title) => {
  if (!title) return DEFAULT_TITLE;
  const clean = title.replace(/\s+/g, ' ').trim();
  return /symmetry/i.test(clean) ? clean : `${clean} | ${BRAND}`;
};

const clip = (text, limit = 160) => {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,.;:\-–— ]+$/, '')}…`;
};

const setTag = (selector, create, value) => {
  let el = document.head.querySelector(selector);
  if (value == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', value);
};
const metaTag = (attr, name, value) =>
  setTag(`meta[${attr}="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute(attr, name);
    return el;
  }, value);

// Path the server wrote the head for; its schema and photo preload only describe that page
const FIRST_PATH = typeof window !== 'undefined' ? window.location.pathname : '/';

export const SeoMeta = ({ title, description, page, noindex = false }) => {
  const seo = useSiteText('seo');
  const { pathname } = useLocation();
  const finalTitle = fullTitle((page && seo[`${page}Title`]) || title);
  const finalDescription = clip((page && seo[`${page}Description`]) || description);

  useEffect(() => {
    document.title = finalTitle;
    const url = `${window.location.origin}${pathname}`;
    const tag = metaTag;
    if (finalDescription) {
      tag('name', 'description', finalDescription);
      tag('property', 'og:description', finalDescription);
      tag('name', 'twitter:description', finalDescription);
    }
    tag('property', 'og:title', finalTitle);
    tag('name', 'twitter:title', finalTitle);
    tag('property', 'og:url', url);
    tag('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), noindex ? null : url);
    if (pathname !== FIRST_PATH) {
      document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
    }
  }, [finalTitle, finalDescription, pathname, noindex]);

  return null;
};

export default SeoMeta;
