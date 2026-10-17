import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';
import { BANNER_PAGES, bannerPageLabel } from '../../lib/pageBanners';

// Same "banners" records as Hero Banners; the page is kept in the banner's badge field
const config = {
  resource: 'banners',
  title: 'Page Banners',
  subtitle: 'The photo and headline at the top of each page. A page without a published banner keeps its standard design.',
  singular: 'Page Banner',
  plural: 'Page Banners',
  sortable: false,
  listFilter: (b) => !!b.badge,
  newRecord: () => ({ status: 'draft', active: true, badge: null }),
  row: {
    thumb: (b) => b.image,
    primary: (b) => bannerPageLabel(b.badge),
    secondary: (b) => [b.title, b.cta_text].filter(Boolean).join(' ') + (b.active ? '' : ' · Hidden'),
  },
  sections: [
    { title: 'Page', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'badge', label: 'Page', type: 'select', required: true, options: BANNER_PAGES, help: 'One banner per page. If a page has two, the first in the list is used.' },
      { key: 'active', label: 'Active', type: 'checkbox', checkboxLabel: 'Show this banner on the page' },
    ] },
    { title: 'Headline', fields: [
      { key: 'title', label: 'Headline', type: 'text', required: true, help: 'e.g. "Built on Legacy." Short is best: 2 to 6 words.' },
      { key: 'cta_text', label: 'Highlighted words', type: 'text', help: 'Optional. Shown after the headline in the accent colour, e.g. "Designed for Modern Living."' },
      { key: 'subtitle', label: 'Text under the headline', type: 'textarea', help: 'Optional. One or two sentences. Leave empty to keep the standard text.' },
    ] },
    { title: 'Photo', fields: [
      { key: 'image', label: 'Photo', type: 'image', help: 'Landscape, at least 2400 px wide. Shown wide with rounded corners under the headline; leave empty to keep the standard photo.' },
    ] },
  ],
};

export const AdminPageBanners = () => <ResourceManager config={config} />;
export default AdminPageBanners;
