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
          <p className="text-xs text-adm-fg/50">{collections.length} featured collections</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> New Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="adm-card overflow-hidden group flex flex-col justify-between">
              <div className="h-44 relative bg-adm-surface2">
                <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(col)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md text-adm-fg shadow-sm hover:bg-adm-accent hover:text-adm-on-accent">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(col.id)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-adm-accent font-mono">
                  <span>/{col.slug}</span>
                  {col.featured && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-sans font-bold">Featured</span>}
                </div>
                <h3 className="text-base font-semibold text-adm-fg">{col.title}</h3>
                <p className="text-xs text-adm-fg/60">{col.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingCollection && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-sm font-semibold text-adm-fg">
                  {editingCollection.id ? 'Edit Collection' : 'New Collection'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-fg/40 hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Collection Title</label>
                  <input
                    type="text"
                    required
                    value={editingCollection.title}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingCollection.subtitle}
                    onChange={(e) => setEditingCollection({ ...editingCollection, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingCollection.image}
                    onChange={(e) => setEditingCollection({ ...editingCollection, image: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent rounded-xl text-adm-on-accent font-medium">Save Collection</button>
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
