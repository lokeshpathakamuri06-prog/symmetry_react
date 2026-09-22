import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminTeam = () => {
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyMember = {
    id: '',
    name: '',
    role: 'Principal Architect',
    department: 'Architecture & Design',
    experience: '15 Years Experience',
    bio: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com'
  };

  const loadTeam = async () => {
    const data = await adminDataService.getTeam();
    setTeam(data || []);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember({ ...emptyMember });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember({ ...m });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete team member profile?')) {
      const updated = await adminDataService.deleteTeamMember(id);
      setTeam(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingMember.name) return;
    await adminDataService.saveTeamMember(editingMember);
    await loadTeam();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Team Profiles Manager" subtitle="Manage executive directors, principal architects, and master craftsmen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{team.length} team members</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-5 space-y-4 group">
              <div className="flex items-center gap-4">
                <img src={m.image} alt={m.name} className="w-16 h-16 rounded-2xl object-cover border border-[#1B2E3D]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-semibold text-white text-sm truncate">{m.name}</h4>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(m)} className="p-1 text-white/40 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1 text-white/40 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-[#36656B] font-medium truncate">{m.role}</p>
                  <p className="text-[10px] text-white/40">{m.department}</p>
                </div>
              </div>

              <p className="text-xs text-white/60 line-clamp-3">{m.bio}</p>
            </div>
          ))}
        </div>

        {isModalOpen && editingMember && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingMember.id ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Department</label>
                    <input
                      type="text"
                      value={editingMember.department}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Photo URL</label>
                  <input
                    type="url"
                    required
                    value={editingMember.image}
                    onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={editingMember.bio}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Save Profile</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
