import React, { useState, useEffect } from 'react';
import { Grid, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyCat = {
    id: '',
    name: '',
    slug: '',
    description: '',
    image: ''
  };

  const loadCategories = async () => {
    const data = await adminDataService.getCategories();
    setCategories(data || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory({ ...emptyCat });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updated = await adminDataService.deleteCategory(id);
      setCategories(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCategory.name) return;
    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-');
    await adminDataService.saveCategory({ ...editingCategory, slug });
    await loadCategories();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Categories Manager" subtitle="Organize storefront departments and navigation filters">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{categories.length} store categories</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-5 relative overflow-hidden group">
              <div className="h-36 rounded-xl overflow-hidden mb-4 relative bg-black/40">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30"><Grid className="w-8 h-8" /></div>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(cat)} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#36656B]">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-semibold text-white text-sm">{cat.name}</h3>
              <p className="text-[10px] font-mono text-[#36656B] mt-0.5">/{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}</p>
              <p className="text-xs text-white/50 line-clamp-2 mt-2">{cat.description || 'Curated category selection.'}</p>
            </div>
          ))}
        </div>

        {isModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingCategory.id ? 'Edit Category' : 'New Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Slug (URL path)</label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    placeholder="e.g. travertine-tables"
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingCategory.image}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
