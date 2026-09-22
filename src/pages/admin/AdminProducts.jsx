import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Search, Filter, Check, X, Tag, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { refreshSiteContent } = useSiteContent();

  const emptyProduct = {
    id: '',
    name: '',
    category: 'Furniture',
    price: 50000,
    sale_price: '',
    badge: 'New Arrival',
    description: '',
    details: ['100% Solid Natural Stone', 'Bespoke Craftsmanship'],
    image: '',
    in_stock: true
  };

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      adminDataService.getProducts(),
      adminDataService.getCategories()
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStock = async (id) => {
    const updated = await adminDataService.toggleProductStock(id);
    setProducts(updated);
    await refreshSiteContent();
  };

  const handleOpenAdd = () => {
    setEditingProduct({ ...emptyProduct });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = await adminDataService.deleteProduct(id);
      setProducts(updated);
      await refreshSiteContent();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) return;

    await adminDataService.saveProduct(editingProduct);
    await loadData();
    await refreshSiteContent();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout title="Product Catalog Manager" subtitle="Manage store inventory, prices, badges, and stock availability">
      <div className="space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A1622] p-4 rounded-2xl border border-[#1B2E3D]">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#36656B]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#36656B]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#36656B]/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2E3D] bg-[#07121C] text-white/40 uppercase tracking-wider">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Badge</th>
                  <th className="p-4 font-medium">Stock Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E3D]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#1B2E3D]"
                        />
                        <div>
                          <p className="font-semibold text-white">{product.name}</p>
                          <p className="text-[10px] text-white/40 font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px]">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      <p className="text-white">{formatPrice(product.price)}</p>
                      {product.sale_price && (
                        <p className="text-[10px] text-emerald-400">Sale: {formatPrice(product.sale_price)}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {product.badge ? (
                        <span className="px-2 py-0.5 rounded bg-[#36656B]/20 border border-[#36656B]/30 text-[#36656B] text-[10px] font-semibold uppercase">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-white/30 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStock(product.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          product.in_stock
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {product.in_stock ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#36656B] text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">
                      No products found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <h3 className="text-sm font-serif font-semibold text-white">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editingProduct.badge}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Sale Price (Optional)</label>
                    <input
                      type="number"
                      value={editingProduct.sale_price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? Number(e.target.value) : '' })}
                      className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
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
                    Save Product
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

export default AdminProducts;
