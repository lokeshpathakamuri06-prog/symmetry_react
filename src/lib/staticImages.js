// Design images in public/images ship with WebP copies at 1280 px and 2048 px
// (made by scripts/optimize-images.mjs). Spread the result onto an <img>/<motion.img>:
//   <img {...heroImage('/images/hero/hero-shop.jpeg')} alt="…" />
// Browsers pick the smallest WebP that fits; the JPEG stays as a fallback.
export const heroImage = (jpegPath, sizes = '100vw') => {
  const base = jpegPath.replace(/\.jpe?g$/i, '');
  return {
    src: jpegPath,
    srcSet: `${base}-1280.webp 1280w, ${base}-2048.webp 2048w`,
    sizes,
  };
};
