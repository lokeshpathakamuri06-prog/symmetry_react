import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';
import { categoryOptions, collectionOptions, inr } from './contentOptions';

const config = {
  resource: 'products',
  title: 'Products',
  subtitle: 'Catalogue items shown in the shop',
  singular: 'Product',
  plural: 'Products',
  sortable: true,
  optionSources: { category: categoryOptions, collection: collectionOptions },
  newRecord: () => ({ status: 'draft', inStock: true, featured: false, images: [], colors: [], materials: [], finishes: [], fabrics: [], details: [], careInstructions: [], reviewCount: 0 }),
  row: {
    thumb: (p) => p.images?.[0],
    primary: (p) => p.name,
    secondary: (p) => `${p.id} · ${p.categoryName || 'No category'}${p.collection ? ` · ${p.collection}` : ''}`,
    meta: (p) => (
      <div>
        <p className="font-semibold">{inr(p.price)}</p>
        <p className={`text-[11px] ${p.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{p.stockStatus || (p.inStock ? 'In stock' : 'Made to order')}</p>
      </div>
    ),
  },
  sections: [
    { title: 'Basics', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'select', required: true, span: 'half' },
      { key: 'collection', label: 'Collection', type: 'select', span: 'half' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
    ] },
    { title: 'Images', fields: [
      { key: 'images', label: 'Product photos', type: 'images', required: true, help: 'first photo is the main one' },
    ] },
    { title: 'Price & stock', fields: [
      { key: 'price', label: 'Price (₹)', type: 'money', required: true, span: 'half' },
      { key: 'originalPrice', label: 'Original price (₹)', type: 'money', span: 'half', help: 'shown struck through' },
      { key: 'badge', label: 'Badge', type: 'text', span: 'half', placeholder: 'Bestseller' },
      { key: 'leadTime', label: 'Lead time', type: 'text', span: 'half', placeholder: '3 to 4 Weeks' },
      { key: 'stockStatus', label: 'Stock label', type: 'text', span: 'half', placeholder: 'In Stock' },
      { key: 'inStock', label: 'In stock', type: 'checkbox', span: 'half', checkboxLabel: 'In stock (otherwise made to order)' },
      { key: 'featured', label: 'Featured', type: 'checkbox', span: 'half', checkboxLabel: 'Feature on the shop' },
      { key: 'rating', label: 'Rating', type: 'number', span: 'half', min: 0, max: 5, step: 0.1 },
      { key: 'reviewCount', label: 'Review count', type: 'number', span: 'half', step: 1 },
    ] },
    { title: 'Specification', fields: [
      { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: '280cm W x 110cm D x 74cm H' },
      { key: 'materials', label: 'Materials', type: 'list', span: 'half' },
      { key: 'finishes', label: 'Finishes', type: 'list', span: 'half' },
      { key: 'defaultFinish', label: 'Default finish', type: 'text', span: 'half' },
      { key: 'defaultFabric', label: 'Default fabric', type: 'text', span: 'half' },
      { key: 'fabrics', label: 'Fabrics', type: 'list' },
      { key: 'colors', label: 'Colours', type: 'colors' },
      { key: 'details', label: 'Details', type: 'list', rows: 5 },
      { key: 'careInstructions', label: 'Care instructions', type: 'list', rows: 4 },
    ] },
    { title: 'Search engines', fields: [
      { key: 'seoTitle', label: 'SEO title', type: 'text', help: 'optional' },
      { key: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2, help: 'optional' },
    ] },
  ],
};

export const AdminProducts = () => <ResourceManager config={config} />;
export default AdminProducts;
