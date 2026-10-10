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
          <p className="text-xs text-adm-fg/50">{blogs.length} published journal articles</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Publish Article
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="adm-card overflow-hidden group flex flex-col justify-between">
              <div className="h-44 relative bg-adm-surface2">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleOpenEdit(blog)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md text-adm-fg shadow-sm hover:bg-adm-accent hover:text-adm-on-accent">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-1.5 rounded-lg bg-white/85 dark:bg-black/50 backdrop-blur-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-adm-fg/40">
                  <span className="text-adm-accent font-semibold">{blog.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.read_time}</span>
                </div>
                <h3 className="text-base font-semibold text-adm-fg line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-adm-fg/60 line-clamp-2">{blog.excerpt}</p>
                <div className="pt-3 border-t border-adm-border flex items-center justify-between text-[11px] text-adm-fg/40">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && editingBlog && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-sm font-semibold text-adm-fg">
                  {editingBlog.id ? 'Edit Journal Article' : 'New Journal Article'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-fg/40 hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-adm-fg/70 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={editingBlog.read_time}
                      onChange={(e) => setEditingBlog({ ...editingBlog, read_time: e.target.value })}
                      className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingBlog.image}
                    onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Short Excerpt</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Full Article Body</label>
                  <textarea
                    rows={5}
                    required
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent rounded-xl text-adm-on-accent font-medium">Publish Article</button>
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
