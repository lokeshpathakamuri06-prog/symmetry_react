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
          <p className="text-xs text-white/50">{projects.length} portfolio projects</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="h-48 relative bg-black/40">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(proj)} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#36656B]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(proj.id)} className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span className="text-[#36656B] font-semibold uppercase">{proj.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/30" /> {proj.location}</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-white">{proj.title}</h3>
                <p className="text-xs text-white/60 line-clamp-2">{proj.description}</p>
                <div className="pt-3 border-t border-[#1B2E3D] flex items-center justify-between text-[11px] text-white/40 font-mono">
                  <span>{proj.surface}</span>
                  <span>{proj.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingProject.id ? 'Edit Portfolio Project' : 'New Portfolio Project'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Surface Area</label>
                    <input
                      type="text"
                      value={editingProject.surface}
                      onChange={(e) => setEditingProject({ ...editingProject, surface: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Save Project</button>
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
