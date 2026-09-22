import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, X, Save, Clock, User, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyBlog = {
    id: '',
    title: '',
    slug: '',
    category: 'Interior Architecture',
    author: 'Symmetry Editorial',
    read_time: '5 min read',
    image: '',
    excerpt: '',
    content: '',
    published: true
  };

  const loadBlogs = async () => {
    const data = await adminDataService.getBlogs();
    setBlogs(data || []);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog({ ...emptyBlog });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog({ ...blog });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this journal article?')) {
      const updated = await adminDataService.deleteBlog(id);
      setBlogs(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingBlog.title) return;
    const slug = editingBlog.slug || editingBlog.title.toLowerCase().replace(/\s+/g, '-');
    await adminDataService.saveBlog({ ...editingBlog, slug });
    await loadBlogs();
    await refreshSiteContent();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Journal & Blog Manager" subtitle="Publish articles, material design guides, and architectural stories">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">{blogs.length} published journal articles</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-[#36656B]/30"
          >
            <Plus className="w-4 h-4" /> Publish Article
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="h-44 relative bg-black/40">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(blog)} className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#36656B]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span className="text-[#36656B] font-semibold">{blog.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.read_time}</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-white line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-white/60 line-clamp-2">{blog.excerpt}</p>
                <div className="pt-3 border-t border-[#1B2E3D] flex items-center justify-between text-[11px] text-white/40">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingBlog && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingBlog.id ? 'Edit Journal Article' : 'New Journal Article'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={editingBlog.read_time}
                      onChange={(e) => setEditingBlog({ ...editingBlog, read_time: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingBlog.image}
                    onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Short Excerpt</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Full Article Body</label>
                  <textarea
                    rows={5}
                    required
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1B2E3D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 rounded-xl text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#36656B] rounded-xl text-white font-medium">Publish Article</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
