import React from 'react';
import ResourceManager from '../../components/admin/ResourceManager';

const DEPARTMENTS = ['Architecture & Design', 'Sourcing & Materials', 'Fabrication & Engineering'];

const config = {
  resource: 'team',
  title: 'Team Profiles',
  subtitle: 'People shown on the About page',
  singular: 'Team member',
  plural: 'Team members',
  sortable: true,
  newRecord: () => ({ status: 'draft', specialties: [] }),
  row: { thumb: (m) => m.image, primary: (m) => m.name, secondary: (m) => `${m.role}${m.department ? ` · ${m.department}` : ''}` },
  sections: [
    { title: 'Profile', fields: [
      { key: 'status', label: 'Visibility', type: 'status' },
      { key: 'name', label: 'Name', type: 'text', required: true, span: 'half' },
      { key: 'role', label: 'Role', type: 'text', required: true, span: 'half' },
      { key: 'department', label: 'Department', type: 'select', span: 'half', options: DEPARTMENTS.map((d) => ({ value: d, label: d })) },
      { key: 'experience', label: 'Experience', type: 'text', span: 'half', placeholder: '15+ Years Experience' },
      { key: 'credentials', label: 'Credentials', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea', rows: 4 },
      { key: 'specialties', label: 'Specialties', type: 'list', rows: 3 },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'image', label: 'Photo', type: 'image' },
    ] },
  ],
};

export const AdminTeam = () => <ResourceManager config={config} />;
export default AdminTeam;
