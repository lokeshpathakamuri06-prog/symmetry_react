import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, Trash2, Plus, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';

export const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const loadMedia = async () => {
    const data = await adminDataService.getMedia();
    setMedia(data || []);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete media asset?')) {
      const updated = await adminDataService.deleteMedia(id);
      setMedia(updated);
    }
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    const updated = await adminDataService.addMediaAsset(newUrl, newName || 'uploaded_image.jpg');
    setMedia(updated);
    setNewUrl('');
    setNewName('');
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Media Library Manager" subtitle="Upload, preview, copy URLs, and organize central image assets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-adm-fg/50">{media.length} media assets stored</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" /> Add Asset / Image URL
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((asset) => (
            <div key={asset.id} className="adm-card overflow-hidden group flex flex-col justify-between">
              <div className="h-36 relative bg-adm-surface2">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.url)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-adm-accent hover:text-adm-on-accent text-[#1D1D1F] backdrop-blur-md shadow-sm"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#1D1D1F] backdrop-blur-md shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-red-500 text-red-600 hover:text-white backdrop-blur-md shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-[10px]">
                <p className="font-semibold text-adm-fg truncate">{asset.name}</p>
                <p className="text-adm-fg/40 truncate mt-0.5">{asset.url}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-sm font-semibold text-adm-fg">Add Media Asset</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-fg/40 hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="living_room_hero.jpg"
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent rounded-xl text-adm-on-accent font-medium">Add Media</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
