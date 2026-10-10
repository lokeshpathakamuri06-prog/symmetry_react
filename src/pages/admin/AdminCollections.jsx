import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'collections',
  title: 'Collections',
  subtitle: 'Named groups of products',
  singular: 'Collection',
  plural: 'Collections',
  sortable: true,
  newRecord: () => ({ status: 'draft', featured: false, productIds: [] }),
  row: { thumb: (c) => c.image, primary: (c) => c.title, secondary: (c) => `${c.productIds?.length || 0} product(s)${c.featured ? ' · Featured' : ''}` },
  sections: [
    { title: 'Collection', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Featured collection' },
      { key: 'image', label: 'Cover image', type: 'image' },
      { key: 'productIds', label: 'Products', type: 'list', help: 'one product ID per line, e.g. sym-001, in display order' },
    ] },
  ],
};

export const AdminCollections = () => <ResourceManager config={config} />;
export default AdminCollections;
