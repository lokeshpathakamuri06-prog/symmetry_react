import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'banners',
  title: 'Hero Banners',
  subtitle: 'Large banners with a call to action',
  singular: 'Banner',
  plural: 'Banners',
  sortable: true,
  newRecord: () => ({ status: 'draft', active: true, cta_text: 'Explore Collection', cta_link: '/shop' }),
  row: { thumb: (b) => b.image, primary: (b) => b.title, secondary: (b) => `${b.cta_text || ''} → ${b.cta_link || ''}${b.active ? '' : ' · Hidden'}` },
  sections: [
    { title: 'Banner', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { key: 'badge', label: 'Badge', type: 'text', span: 'half' },
      { key: 'active', label: 'Active', type: 'checkbox', span: 'half', checkboxLabel: 'Show this banner' },
      { key: 'cta_text', label: 'Button text', type: 'text', span: 'half' },
      { key: 'cta_link', label: 'Button link', type: 'text', span: 'half', placeholder: '/shop' },
      { key: 'image', label: 'Image', type: 'image' },
    ] },
  ],
};

export const AdminBanners = () => <ResourceManager config={config} />;
export default AdminBanners;
