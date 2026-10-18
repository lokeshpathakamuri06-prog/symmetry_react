// Dropdown option loaders shared by the admin content screens
import { content } from '../../services/adminApi';

const load = (resource, toOption) => () =>
  content(resource).list({ status: 'all' }).then((r) => r.items.filter((i) => i.status !== 'archived').map(toOption));

export const categoryOptions = load('categories', (c) => ({ value: c.slug, label: c.name }));
export const collectionOptions = load('collections', (c) => ({ value: c.title, label: c.title }));
export const projectOptions = load('projects', (p) => ({ value: p.id, label: p.title }));

export const inr = (n) => (n == null ? '' : `₹${Number(n).toLocaleString('en-IN')}`);

// Product availability (products.availability); with a stock count of 0, "in stock" shows as out of stock
export const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'made_to_order', label: 'Made to order' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

export const effectiveAvailability = (p) =>
  p.availability === 'in_stock' && p.stockQuantity === 0 ? 'out_of_stock' : p.availability || (p.inStock === false ? 'made_to_order' : 'in_stock');
