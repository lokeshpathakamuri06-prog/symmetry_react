/**
 * Shop helpers shared by the Shop page, product cards and the product page:
 * prices, discounts, stock, sorting, filtering and "recently viewed".
 * Prices are stored without GST; the cart adds 18% GST at checkout (CartContext).
 */

// Readable product address (/shop/aurelia-curved-boucle-sofa); old /shop/<sku> links still work
export const productPath = (p) => `/shop/${p.slug || p.id}`;

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const discountOf = (p) =>
  p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

export const isInStock = (p) => p.inStock !== false && p.stockStatus !== 'Made to Order' && p.availability !== 'out_of_stock';

/** Out of stock: can't be added to the cart (made-to-order pieces still can) */
export const isSoldOut = (p) => p.availability === 'out_of_stock';

export const stockLabel = (p) =>
  isSoldOut(p) ? 'Out of Stock' : p.stockStatus || (p.inStock !== false ? 'In Stock' : 'Made to Order');

/** "Only 2 left" when the shop counts pieces and few remain */
export const fewLeft = (p) => (!isSoldOut(p) && p.stockQuantity != null && p.stockQuantity > 0 && p.stockQuantity <= 3 ? p.stockQuantity : 0);

/** Sort options in the order the shop shows them (Flipkart style) */
export const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popular', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Customer Rating' },
];

/** Popularity: rating weighted by how many people rated it */
const popularity = (p) => (p.rating || 0) * Math.log10(10 + (p.reviewCount || 0));
const addedTime = (p) => (p.addedAt ? Date.parse(p.addedAt) || 0 : 0);
const isNewArrival = (p) => /new/i.test(p.badge || '');

export const sortProducts = (list, sort) => {
  // Keep the admin order as the final tie-breaker (index in the published list)
  const indexed = list.map((p, i) => ({ p, i }));
  const by = {
    relevance: (a, b) => (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0) || a.i - b.i,
    popular: (a, b) => popularity(b.p) - popularity(a.p) || a.i - b.i,
    'price-asc': (a, b) => a.p.price - b.p.price || a.i - b.i,
    'price-desc': (a, b) => b.p.price - a.p.price || a.i - b.i,
    // Newest added first; products added together: "New Arrival" first, then the most recently listed
    newest: (a, b) => addedTime(b.p) - addedTime(a.p) || (isNewArrival(b.p) ? 1 : 0) - (isNewArrival(a.p) ? 1 : 0) || b.i - a.i,
    rating: (a, b) => (b.p.rating || 0) - (a.p.rating || 0) || (b.p.reviewCount || 0) - (a.p.reviewCount || 0) || a.i - b.i,
  };
  return indexed.sort(by[sort] || by.relevance).map((x) => x.p);
};

/** Price brackets shown in the filter (upper bound is exclusive; null = no limit) */
export const PRICE_BRACKETS = [
  { min: 0, max: 100000, label: 'Under ₹1,00,000' },
  { min: 100000, max: 200000, label: '₹1,00,000 – ₹2,00,000' },
  { min: 200000, max: 300000, label: '₹2,00,000 – ₹3,00,000' },
  { min: 300000, max: 500000, label: '₹3,00,000 – ₹5,00,000' },
  { min: 500000, max: null, label: 'Over ₹5,00,000' },
];

export const RATING_STEPS = [4, 3];
export const DISCOUNT_STEPS = [30, 20, 10];

export const matchesSearch = (p, q) => {
  const s = q.toLowerCase().trim();
  if (!s) return true;
  return s.split(/\s+/).every((word) =>
    [p.name, p.categoryName, p.collection, p.description, ...(p.materials || []), ...(p.finishes || [])]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(word))
  );
};

/** Everything the shop can filter by, read from / written to the address bar */
export const readFilters = (params) => {
  const list = (key) => (params.get(key) || '').split(',').filter(Boolean);
  const num = (key) => (params.get(key) ? Number(params.get(key)) : null);
  return {
    q: params.get('q') || '',
    categories: list('category'),
    min: num('min'),
    max: num('max'),
    rating: num('rating'),
    discount: num('discount'),
    stock: list('stock'), // 'in-stock' | 'made-to-order'
    sort: params.get('sort') || 'relevance',
    page: Math.max(1, num('page') || 1),
    perPage: [12, 24, 48].includes(num('show')) ? num('show') : 12,
  };
};

export const applyFilters = (products, f, { except } = {}) =>
  products.filter((p) => {
    if (except !== 'categories' && f.categories.length && !f.categories.includes(p.category)) return false;
    if (except !== 'price' && f.min != null && p.price < f.min) return false;
    if (except !== 'price' && f.max != null && p.price >= f.max) return false;
    if (except !== 'rating' && f.rating && (p.rating || 0) < f.rating) return false;
    if (except !== 'discount' && f.discount && discountOf(p) < f.discount) return false;
    if (except !== 'stock' && f.stock.length) {
      const key = isInStock(p) ? 'in-stock' : 'made-to-order';
      if (!f.stock.includes(key)) return false;
    }
    return matchesSearch(p, f.q);
  });

/* ---------- Recently viewed (this browser only) ---------- */
const RECENT_KEY = 'symmetry_recently_viewed';

export const readRecent = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
};

export const rememberViewed = (id) => {
  try {
    const ids = [id, ...readRecent().filter((x) => x !== id)].slice(0, 12);
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    // storage blocked: the strip simply stays empty
  }
};
