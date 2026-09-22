import React, { useState, useEffect } from 'react';
import { Quote, Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyTest = {
    id: '',
    author: '',
    role: 'Homeowner',
    project: '',
    location: 'Jubilee Hills, Hyderabad',
    quote: '',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };

  const loadTestimonials = async () => {
    const data = await adminDataService.getTestimonials();
    setTestimonials(data || []);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial({ ...emptyTest });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTestimonial({ ...t });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this client testimonial?')) {
      const updated = await adminDataService.deleteTestimonial(id);
      setTestimonials(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingTestimonial.quote || !editingTestimonial.author) return;
    await adminDataService.saveTestimonial(editingTestimonial);
    await loadTestimonials();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Testimonials Manager" subtitle="Manage client reviews, quotes, ratings, and avatars">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{testimonials.length} client testimonials</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 relative flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(t)} className="p-1 text-white/40 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1 text-white/40 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <p className="text-xs text-white/80 italic leading-relaxed">"{t.quote}"</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1B2E3D] flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-[#1B2E3D]" />
                <div>
                  <h4 className="text-xs font-semibold text-white">{t.author}</h4>
                  <p className="text-[10px] text-white/50">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingTestimonial && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.author}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={editingTestimonial.role}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingTestimonial.location}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={editingTestimonial.avatar}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Quote</label>
                  <textarea
                    rows={3}
                    required
                    value={editingTestimonial.quote}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Save Review</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
