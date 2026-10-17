import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'banners',
  title: 'Hero Banners',
  subtitle: 'Photos for the Home page slideshow. The headline and buttons are in Page Content → Home. Banners for the other pages are in Page Banners.',
  singular: 'Banner',
  plural: 'Banners',
  sortable: true,
  // Banners with a page set in "badge" belong to Page Banners
  listFilter: (b) => !b.badge,
  newRecord: () => ({ status: 'draft', active: true, badge: null }),
  row: { thumb: (b) => b.image, primary: (b) => b.title, secondary: (b) => (b.active ? 'In slideshow' : 'Hidden') },
  sections: [
    { title: 'Slide', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Photo description', type: 'text', required: true, help: 'Read out by screen readers, e.g. "Living room with marble wall"' },
      { key: 'active', label: 'Active', type: 'checkbox', checkboxLabel: 'Show in the slideshow' },
      { key: 'image', label: 'Photo', type: 'image', help: 'Landscape, at least 2400 px wide. Slides change every 5 seconds, in the order of this list.' },
    ] },
  ],
};

export const AdminBanners = () => <ResourceManager config={config} />;
export default AdminBanners;
