import { heroImageProps } from './images';

// Pages whose opening banner can be set in Admin → Page Banners.
// The page key is stored in the banner's `badge` field (Home slideshow banners leave it empty).
export const BANNER_PAGES = [
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'projects', label: 'Projects' },
  { value: 'sourcing', label: 'Global Sourcing' },
  { value: 'shop', label: 'Shop' },
  { value: 'journal', label: 'Journal' },
  { value: 'contact', label: 'Contact' },
  { value: 'careers', label: 'Careers' },
];

export const bannerPageLabel = (key) => BANNER_PAGES.find((p) => p.value === key)?.label || key;

// <img> props for a banner photo: CDN photos get a srcset, local /images paths their WebP copies
export const bannerImage = heroImageProps;
