import { useEffect } from 'react';

export const SeoMeta = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Symmetry Interiors & Building Solutions`
      : 'Symmetry Interiors & Building Solutions | Bespoke Architecture & Luxury Furniture';
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
