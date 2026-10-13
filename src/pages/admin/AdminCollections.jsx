import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'collections',
  title: 'Collections',
  subtitle: 'Named groups of products. Featured collections with a cover image appear in the Home page carousel.',
  singular: 'Collection',
  plural: 'Collections',
  sortable: true,
  newRecord: () => ({ status: 'draft', featured: false, productIds: [] }),
  row: { thumb: (c) => c.image, primary: (c) => c.title, secondary: (c) => `${c.productIds?.length || 0} product(s)${c.featured ? ' · On Home page' : ''}` },
  sections: [
    { title: 'Collection', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', help: 'One line under the title on the Home carousel card' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Show in the Home page carousel (needs a cover image)' },
      { key: 'label', label: 'Carousel label', type: 'text', span: 'half', placeholder: 'Living', help: 'Small word above the title' },
      { key: 'link', label: 'Card link', type: 'text', span: 'half', placeholder: '/shop?category=luxury-sofas', help: 'Where "View Product" goes' },
      { key: 'image', label: 'Cover image', type: 'image', help: 'Portrait works best (the card is tall)' },
      { key: 'productIds', label: 'Products', type: 'list', help: 'one product ID per line, e.g. sym-001, in display order' },
    ] },
  ],
};

export const AdminCollections = () => <ResourceManager config={config} />;
export default AdminCollections;
