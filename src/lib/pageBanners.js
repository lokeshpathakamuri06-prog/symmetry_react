import { cloudinaryUrl, isCloudinary, srcSet } from './images';
import { heroImage } from './staticImages';

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

const HERO_WIDTHS = [800, 1280, 1600, 2048, 2560];

// <img> props for a banner photo: Cloudinary gets a srcset, local /images paths their WebP copies
export const bannerImage = (src, sizes = '100vw') => {
  if (!src) return null;
  if (isCloudinary(src)) return { src: cloudinaryUrl(src, { width: 1600 }), srcSet: srcSet(src, HERO_WIDTHS), sizes };
  if (src.startsWith('/images/') && /\.jpe?g$/i.test(src)) return heroImage(src, sizes);
  return { src };
};
