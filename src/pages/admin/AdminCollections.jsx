import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyCol = {
    id: '',
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    image: '',
    featured: true
  };

  const loadCollections = async () => {
    const data = await adminDataService.getCollections();
    setCollections(data || []);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenAdd = () => {
    setEditingCollection({ ...emptyCol });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection({ ...col });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this collection?')) {
      const updated = await adminDataService.deleteCollection(id);
      setCollections(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCollection.title) return;
    const slug = editingCollection.slug || editingCollection.title.toLowerCase().replace(/\s+/g, '-');
    await adminDataService.saveCollection({ ...editingCollection, slug });
    await loadCollections();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Collections Manager" subtitle="Curate seasonal showcases and featured design series">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{collections.length} featured collections</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> New Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="h-44 relative bg-black/40">
                <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(col)} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#36656B]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(col.id)} className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#36656B] font-mono">
                  <span>/{col.slug}</span>
                  {col.featured && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-sans font-bold">Featured</span>}
                </div>
                <h3 className="font-serif text-base font-semibold text-white">{col.title}</h3>
                <p className="text-xs text-white/60">{col.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingCollection && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingCollection.id ? 'Edit Collection' : 'New Collection'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Collection Title</label>
                  <input
                    type="text"
                    required
                    value={editingCollection.title}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingCollection.subtitle}
                    onChange={(e) => setEditingCollection({ ...editingCollection, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingCollection.image}
                    onChange={(e) => setEditingCollection({ ...editingCollection, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Save Collection</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
