import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Check, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { refreshSiteContent } = useSiteContent();

  const emptyBanner = {
    id: '',
    title: '',
    subtitle: '',
    image: '',
    badge: 'New Highlight',
    cta_text: 'Explore Collection',
    cta_link: '/shop',
    display_order: 1,
    active: true
  };

  const fetchBanners = async () => {
    setLoading(true);
    const data = await adminDataService.getBanners();
    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner({ ...emptyBanner, display_order: banners.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingBanner.title || !editingBanner.image) return;

    await adminDataService.saveBanner(editingBanner);
    await fetchBanners();
    await refreshSiteContent();
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero banner?')) {
      await adminDataService.deleteBanner(id);
      await fetchBanners();
      await refreshSiteContent();
    }
  };

  return (
    <AdminLayout title="Homepage Banners Manager" subtitle="Create and organize hero slider banners and promotional highlights">
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{banners.length} active hero banners</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Add Hero Banner
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden group">
              <div className="h-48 relative overflow-hidden bg-black/40">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] via-transparent to-black/40" />
                {banner.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#36656B] text-white text-[10px] uppercase font-bold tracking-wider">
                    {banner.badge}
                  </span>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-xl bg-black/60 text-white hover:bg-[#36656B] transition-colors backdrop-blur-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-xl bg-black/60 text-red-400 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span>Order: #{banner.display_order}</span>
                  <span className={banner.active ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                    {banner.active ? '● Active' : '○ Hidden'}
                  </span>
                </div>
                <h3 className="text-base font-serif font-semibold text-white">{banner.title}</h3>
                <p className="text-xs text-white/60 line-clamp-2">{banner.subtitle}</p>
                <div className="pt-3 flex items-center justify-between border-t border-[#1B2E3D] text-xs">
                  <span className="text-[#36656B] font-medium">{banner.cta_text} →</span>
                  <span className="text-white/40 font-mono text-[10px]">{banner.cta_link}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Editor */}
        {isModalOpen && editingBanner && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-lg p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingBanner.id ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Banner Title</label>
                  <input
                    type="text"
                    required
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={editingBanner.subtitle}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingBanner.image}
                    onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editingBanner.badge}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingBanner.display_order}
                      onChange={(e) => setEditingBanner({ ...editingBanner, display_order: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={editingBanner.cta_text}
                      onChange={(e) => setEditingBanner({ ...editingBanner, cta_text: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">CTA Link Path</label>
                    <input
                      type="text"
                      value={editingBanner.cta_link}
                      onChange={(e) => setEditingBanner({ ...editingBanner, cta_link: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#36656B] hover:bg-[#2b5257] rounded-xl text-white font-medium shadow-lg shadow-[#36656B]/30"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
