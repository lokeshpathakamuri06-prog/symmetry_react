// Design images in public/images ship with WebP copies at 828, 1280 and 2048 px
// (made by scripts/optimize-images.mjs). Spread the result onto an <img>/<motion.img>:
//   <img {...heroImage('/images/hero/hero-shop.jpeg')} alt="…" />
// Browsers pick the smallest WebP that fits; the JPEG stays as a fallback.
export { designImage as heroImage } from './images';
