// Dropdown option loaders shared by the admin content screens
import { content } from '../../services/adminApi';

const load = (resource, toOption) => () =>
  content(resource).list({ status: 'all' }).then((r) => r.items.filter((i) => i.status !== 'archived').map(toOption));

export const categoryOptions = load('categories', (c) => ({ value: c.slug, label: c.name }));
export const collectionOptions = load('collections', (c) => ({ value: c.title, label: c.title }));
export const projectOptions = load('projects', (p) => ({ value: p.id, label: p.title }));

export const inr = (n) => (n == null ? '' : `₹${Number(n).toLocaleString('en-IN')}`);
