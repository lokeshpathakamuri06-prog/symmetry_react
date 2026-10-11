import { useEffect } from 'react';

export const SeoMeta = ({ title, description }) => {
  useEffect(() => {
    // Many pages already name the brand in their title; only add it when missing
    const fullTitle = !title
      ? 'Symmetry Interiors & Building Solutions | Bespoke Architecture & Luxury Furniture'
      : /symmetry/i.test(title)
        ? title
        : `${title} | Symmetry Interiors`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SeoMeta;
