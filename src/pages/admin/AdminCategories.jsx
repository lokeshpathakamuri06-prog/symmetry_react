import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'categories',
  title: 'Categories',
  subtitle: 'Shop categories and their cover images',
  singular: 'Category',
  plural: 'Categories',
  sortable: true,
  newRecord: () => ({ status: 'draft' }),
  row: { thumb: (c) => c.image, primary: (c) => c.name, secondary: (c) => `${c.slug} · ${c.productCount ?? 0} live product(s)` },
  sections: [
    { title: 'Category', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
      { key: 'image', label: 'Cover image', type: 'image' },
    ] },
  ],
};

export const AdminCategories = () => <ResourceManager config={config} />;
export default AdminCategories;
