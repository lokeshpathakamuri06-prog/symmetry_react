import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'projects',
  title: 'Interior Projects',
  subtitle: 'Portfolio shown on the Projects pages',
  singular: 'Project',
  plural: 'Projects',
  sortable: true,
  newRecord: () => ({ status: 'draft', featured: false, galleryImages: [], materialsPalette: [], stats: [] }),
  row: { thumb: (p) => p.heroImage, primary: (p) => p.title, secondary: (p) => [p.typology, p.location, p.completionYear].filter(Boolean).join(' · ') },
  sections: [
    { title: 'Project', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'typology', label: 'Typology', type: 'select', span: 'half', options: ['Residential', 'Commercial', 'Hospitality', 'Healthcare'].map((v) => ({ value: v, label: v })) },
      { key: 'location', label: 'Location', type: 'text', span: 'half' },
      { key: 'completionYear', label: 'Completion year', type: 'text', span: 'half' },
      { key: 'areaSqFt', label: 'Area', type: 'text', span: 'half', placeholder: '9,500 sq.ft.' },
      { key: 'duration', label: 'Duration', type: 'text', span: 'half', placeholder: '14 Months' },
      { key: 'client', label: 'Client', type: 'text', span: 'half' },
      { key: 'featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Feature on the Projects page' },
    ] },
    { title: 'Images', fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image' },
      { key: 'galleryImages', label: 'Gallery', type: 'images' },
    ] },
    { title: 'Story', fields: [
      { key: 'scope', label: 'Scope', type: 'textarea', rows: 2 },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { key: 'concept', label: 'Concept', type: 'textarea', rows: 4 },
      { key: 'challenge', label: 'Challenge', type: 'textarea', rows: 3 },
      { key: 'solution', label: 'Solution', type: 'textarea', rows: 3 },
      { key: 'materialsPalette', label: 'Materials palette', type: 'list' },
      { key: 'stats', label: 'Key figures', type: 'stats' },
    ] },
    { title: 'Search engines', fields: [
      { key: 'seoTitle', label: 'SEO title', type: 'text', help: 'optional' },
      { key: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2, help: 'optional' },
    ] },
  ],
};

export const AdminProjects = () => <ResourceManager config={config} />;
export default AdminProjects;
