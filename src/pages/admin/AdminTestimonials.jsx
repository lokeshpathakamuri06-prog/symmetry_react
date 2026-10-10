import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';
import { projectOptions } from './contentOptions';

const config = {
  resource: 'testimonials',
  title: 'Testimonials',
  subtitle: 'Client quotes shown on the website',
  singular: 'Testimonial',
  plural: 'Testimonials',
  sortable: true,
  optionSources: { projectId: projectOptions },
  newRecord: () => ({ status: 'draft', rating: 5 }),
  row: { thumb: (t) => t.avatar, primary: (t) => t.author, secondary: (t) => `${'★'.repeat(t.rating || 0)} ${t.project || ''}` },
  sections: [
    { title: 'Testimonial', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'quote', label: 'Quote', type: 'textarea', rows: 4, required: true },
      { key: 'author', label: 'Name', type: 'text', required: true, span: 'half' },
      { key: 'role', label: 'Role', type: 'text', span: 'half', placeholder: 'Homeowners' },
      { key: 'location', label: 'Location', type: 'text', span: 'half' },
      { key: 'rating', label: 'Rating (1–5)', type: 'number', span: 'half', min: 1, max: 5, step: 1 },
      { key: 'projectId', label: 'Linked project', type: 'select', span: 'half' },
      { key: 'project', label: 'Project text', type: 'text', span: 'half', help: 'shown under the quote' },
      { key: 'avatar', label: 'Photo', type: 'image' },
    ] },
  ],
};

export const AdminTestimonials = () => <ResourceManager config={config} />;
export default AdminTestimonials;
