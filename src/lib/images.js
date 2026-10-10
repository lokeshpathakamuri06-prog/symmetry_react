// Cloudinary delivery URLs: https://res.cloudinary.com/<cloud>/image/upload/<transformations>/v<version>/<public_id>
// The snapshot stores them with "f_auto,q_auto"; these helpers swap in a size. Other URLs pass through untouched.

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:([^/]*_[^/]*)\/)?(v\d+\/.+)$/;

export const isCloudinary = (url) => typeof url === 'string' && CLOUDINARY.test(url);

export const cloudinaryUrl = (url, { width, quality = 'auto', blur = false } = {}) => {
  const match = isCloudinary(url) && url.match(CLOUDINARY);
  if (!match) return url;
  const parts = ['f_auto', `q_${quality}`, 'c_limit'];
  if (width) parts.push(`w_${width}`);
  if (blur) parts.push('e_blur:1000');
  return `${match[1]}${parts.join(',')}/${match[3]}`;
};

export const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 2400];

export const srcSet = (url, widths = DEFAULT_WIDTHS) =>
  isCloudinary(url) ? widths.map((w) => `${cloudinaryUrl(url, { width: w })} ${w}w`).join(', ') : undefined;

// ~300-byte blurred preview shown while the real image loads
export const placeholderUrl = (url) => (isCloudinary(url) ? cloudinaryUrl(url, { width: 32, quality: 1, blur: true }) : undefined);
