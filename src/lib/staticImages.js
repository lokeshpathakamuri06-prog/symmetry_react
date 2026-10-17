// Design images in public/images ship with WebP copies at 1280 px and 2048 px
// (made by scripts/optimize-images.mjs). Spread the result onto an <img>/<motion.img>:
//   <img {...heroImage('/images/hero/hero-shop.jpeg')} alt="…" />
// Browsers pick the smallest WebP that fits; the JPEG stays as a fallback.
// Paths are relative to the site root, so a build under a sub-path (the /preview/ build) still finds them.
const ROOT = import.meta.env.BASE_URL.replace(/\/$/, '');

export const heroImage = (jpegPath, sizes = '100vw') => {
  const base = ROOT + jpegPath.replace(/\.jpe?g$/i, '');
  return {
    src: ROOT + jpegPath,
    srcSet: `${base}-1280.webp 1280w, ${base}-2048.webp 2048w`,
    sizes,
  };
};
