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
          <p className="text-xs text-adm-fg/50">{categories.length} store categories</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="adm-card p-5 relative overflow-hidden group">
              <div className="h-36 rounded-xl overflow-hidden mb-4 relative bg-adm-surface2">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-adm-fg/30"><Grid className="w-8 h-8" /></div>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(cat)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md text-adm-fg shadow-sm hover:bg-adm-accent hover:text-adm-on-accent">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-adm-fg text-sm">{cat.name}</h3>
              <p className="text-[10px] font-mono text-adm-accent mt-0.5">/{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}</p>
              <p className="text-xs text-adm-fg/50 line-clamp-2 mt-2">{cat.description || 'Curated category selection.'}</p>
            </div>
          ))}
        </div>

        {isModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-sm font-semibold text-adm-fg">
                  {editingCategory.id ? 'Edit Category' : 'New Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-fg/40 hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Slug (URL path)</label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    placeholder="e.g. travertine-tables"
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingCategory.image}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent rounded-xl text-adm-on-accent font-medium">Save Category</button>
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
