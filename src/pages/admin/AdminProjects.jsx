import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Edit2, Trash2, X, Save, MapPin, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyProject = {
    id: '',
    title: '',
    category: 'Residential',
    client: 'Private Estate',
    year: '2026',
    location: 'Hyderabad',
    surface: '8,500 Sq.Ft.',
    duration: '8 Months',
    image: '',
    description: '',
    challenge: '',
    solution: ''
  };

  const loadProjects = async () => {
    const data = await adminDataService.getProjects();
    setProjects(data || []);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({ ...emptyProject });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject({ ...proj });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this interior design project?')) {
      const updated = await adminDataService.deleteProject(id);
      setProjects(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProject.title) return;
    await adminDataService.saveProject(editingProject);
    await loadProjects();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Interior Portfolio Projects" subtitle="Manage architectural projects, client case studies, and specs">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-adm-fg/50">{projects.length} portfolio projects</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="adm-card overflow-hidden group flex flex-col justify-between">
              <div className="h-48 relative bg-adm-surface2">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(proj)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md text-adm-fg shadow-sm hover:bg-adm-accent hover:text-adm-on-accent">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(proj.id)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-adm-fg/40">
                  <span className="text-adm-accent font-semibold uppercase">{proj.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-adm-fg/30" /> {proj.location}</span>
                </div>
                <h3 className="text-base font-semibold text-adm-fg">{proj.title}</h3>
                <p className="text-xs text-adm-fg/60 line-clamp-2">{proj.description}</p>
                <div className="pt-3 border-t border-adm-border flex items-center justify-between text-[11px] text-adm-fg/40 font-mono">
                  <span>{proj.surface}</span>
                  <span>{proj.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-sm font-semibold text-adm-fg">
                  {editingProject.id ? 'Edit Portfolio Project' : 'New Portfolio Project'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-fg/40 hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Surface Area</label>
                    <input
                      type="text"
                      value={editingProject.surface}
                      onChange={(e) => setEditingProject({ ...editingProject, surface: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent rounded-xl text-adm-on-accent font-medium">Save Project</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
