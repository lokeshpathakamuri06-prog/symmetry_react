// Content used to live in browser storage before the database; remove those copies once.
// Cart, wishlist, theme and the last order confirmation still use localStorage on purpose.
const OLD_KEYS = [
  'symmetry_products', 'symmetry_categories', 'symmetry_blogs', 'symmetry_projects', 'symmetry_testimonials',
  'symmetry_team', 'symmetry_banners', 'symmetry_collections', 'symmetry_orders', 'symmetry_inquiries',
  'symmetry_media', 'symmetry_jobs', 'symmetry_applications', 'symmetry_site_content',
  'symmetry_admin_authed', 'symmetry_admin_user',
];

export const clearLegacyStorage = () => {
  try {
    OLD_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // storage unavailable (private mode); nothing to clean
  }
};
