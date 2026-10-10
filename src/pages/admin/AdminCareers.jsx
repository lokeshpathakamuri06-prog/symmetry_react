import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';
import { jobDepartments, jobTypes } from '../../data/careers';

const config = {
  resource: 'jobs',
  title: 'Job Openings',
  subtitle: 'Roles listed on the Careers page',
  singular: 'Job opening',
  plural: 'Job openings',
  sortable: true,
  newRecord: () => ({ status: 'draft', active: true, type: 'Full-time', location: 'Ameerpet, Hyderabad', responsibilities: [], requirements: [] }),
  row: { primary: (j) => j.title, secondary: (j) => [j.department, j.location, j.type, j.active ? null : 'Closed'].filter(Boolean).join(' · ') },
  sections: [
    { title: 'Role', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'title', label: 'Job title', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'select', span: 'half', options: jobDepartments.map((d) => ({ value: d, label: d })) },
      { key: 'type', label: 'Type', type: 'select', span: 'half', required: true, options: jobTypes.map((t) => ({ value: t, label: t })) },
      { key: 'location', label: 'Location', type: 'text', span: 'half' },
      { key: 'experience', label: 'Experience', type: 'text', span: 'half', placeholder: '3–5 years' },
      { key: 'active', label: 'Open', type: 'checkbox', checkboxLabel: 'Accepting applications' },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { key: 'responsibilities', label: 'Responsibilities', type: 'list', span: 'half', rows: 6 },
      { key: 'requirements', label: 'Requirements', type: 'list', span: 'half', rows: 6 },
    ] },
  ],
};

export const AdminCareers = () => <ResourceManager config={config} />;
export default AdminCareers;
