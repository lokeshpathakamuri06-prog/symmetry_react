import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const config = {
  resource: 'blogs',
  title: 'Journal Articles',
  subtitle: 'Posts shown in the Journal',
  singular: 'Article',
  plural: 'Articles',
  sortable: true,
  newRecord: () => ({ status: 'draft', featured: false, content: [], tags: [], relatedImages: [] }),
  row: { thumb: (b) => b.coverImage, primary: (b) => b.title, secondary: (b) => [b.category, b.date, b.author].filter(Boolean).join(' · ') },
  sections: [
    { title: 'Article', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text', span: 'half' },
      { key: 'date', label: 'Date', type: 'text', span: 'half', placeholder: 'January 04, 2025' },
      { key: 'author', label: 'Author', type: 'text', span: 'half' },
      { key: 'authorRole', label: 'Author role', type: 'text', span: 'half' },
      { key: 'readTime', label: 'Read time', type: 'text', span: 'half', placeholder: '6 Min Read' },
      { key: 'featured', label: 'Featured', type: 'checkbox', span: 'half', checkboxLabel: 'Featured article' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
      { key: 'coverImage', label: 'Cover image', type: 'image' },
    ] },
    { title: 'Content', fields: [
      { key: 'content', label: 'Text', type: 'paragraphs', required: true, help: 'empty line between paragraphs' },
      { key: 'relatedImages', label: 'Images in the article', type: 'related' },
      { key: 'tags', label: 'Tags', type: 'list', rows: 3 },
    ] },
    { title: 'Search engines', fields: [
      { key: 'seoTitle', label: 'SEO title', type: 'text', help: 'optional' },
      { key: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2, help: 'optional' },
    ] },
  ],
};

export const AdminBlogs = () => <ResourceManager config={config} />;
export default AdminBlogs;
