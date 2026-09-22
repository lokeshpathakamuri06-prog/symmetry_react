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
          <p className="text-xs text-white/50">{media.length} media assets stored</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Upload className="w-4 h-4" /> Add Asset / Image URL
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((asset) => (
            <div key={asset.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="h-36 relative bg-black/40">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.url)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-[#36656B] text-white backdrop-blur-md"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500 text-red-400 hover:text-white backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-[10px]">
                <p className="font-semibold text-white truncate">{asset.name}</p>
                <p className="text-white/40 truncate mt-0.5">{asset.url}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">Add Media Asset</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="living_room_hero.jpg"
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Add Media</button>
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
