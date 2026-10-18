// Image URLs sized for the screen. Three kinds of image can be resized on request:
//   Cloudinary  https://res.cloudinary.com/<cloud>/image/upload/<transformations>/v<version>/<public_id>
//   Unsplash    https://images.unsplash.com/photo-…?auto=format&w=…   (placeholder photos until the client's own)
//   Our design photos /images/…/name.jpeg, which ship with WebP copies (scripts/optimize-images.mjs)
// Both CDNs send AVIF/WebP to browsers that support it. Any other URL passes through untouched.
//
// The API builds the same URLs to preload each page's main photo (symmetry_backend app/seo_images.py):
// change both together, or the browser downloads the photo twice.

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:([^/]*_[^/]*)\/)?(v\d+\/.+)$/;
const UNSPLASH = /^https:\/\/images\.unsplash\.com\//;
const ROOT = import.meta.env.BASE_URL.replace(/\/$/, '');

export const isCloudinary = (url) => typeof url === 'string' && CLOUDINARY.test(url);
export const isUnsplash = (url) => typeof url === 'string' && UNSPLASH.test(url);
const isResizable = (url) => isCloudinary(url) || isUnsplash(url);

export const cloudinaryUrl = (url, { width, quality = 'auto', blur = false } = {}) => {
  const match = isCloudinary(url) && url.match(CLOUDINARY);
  if (!match) return url;
  const parts = ['f_auto', `q_${quality}`, 'c_limit'];
  if (width) parts.push(`w_${width}`);
  if (blur) parts.push('e_blur:1000');
  return `${match[1]}${parts.join(',')}/${match[3]}`;
};

// Unsplash (imgix): keep the photo's crop settings, set format, width and quality; drop a fixed
// height so a wider version keeps its proportions
const unsplashUrl = (url, { width, quality = 70, blur = false } = {}) => {
  const u = new URL(url);
  u.searchParams.set('auto', 'format');
  u.searchParams.delete('h');
  if (width) u.searchParams.set('w', String(width));
  u.searchParams.set('q', String(quality));
  if (blur) u.searchParams.set('blur', '200');
  return u.toString();
};

// One URL at a given width, whichever CDN the image is on
export const sizedUrl = (url, options = {}) => {
  if (isCloudinary(url)) return cloudinaryUrl(url, options);
  if (isUnsplash(url)) return unsplashUrl(url, { ...options, quality: options.quality === 1 ? 10 : undefined });
  return url;
};

export const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 2400];
export const HERO_WIDTHS = [800, 1280, 1600, 2048, 2560];
const DESIGN_WIDTHS = [828, 1280, 2048];

export const srcSet = (url, widths = DEFAULT_WIDTHS) =>
  isResizable(url) ? widths.map((w) => `${sizedUrl(url, { width: w })} ${w}w`).join(', ') : undefined;

// ~300-byte blurred preview shown while the real image loads
export const placeholderUrl = (url) => (isResizable(url) ? sizedUrl(url, { width: 32, quality: 1, blur: true }) : undefined);

// Our design photos: the JPEG stays as fallback, browsers pick the smallest WebP copy that fits
export const designImage = (jpegPath, sizes = '100vw') => {
  const base = ROOT + jpegPath.replace(/\.jpe?g$/i, '');
  return {
    src: ROOT + jpegPath,
    srcSet: DESIGN_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    sizes,
  };
};

// <img> props for a full-width photo (slideshow, page banner) from any source
export const heroImageProps = (src, sizes = '100vw') => {
  if (!src) return null;
  if (isResizable(src)) return { src: sizedUrl(src, { width: 1600 }), srcSet: srcSet(src, HERO_WIDTHS), sizes };
  if (src.startsWith('/images/') && /\.jpe?g$/i.test(src)) return designImage(src, sizes);
  return { src };
};
