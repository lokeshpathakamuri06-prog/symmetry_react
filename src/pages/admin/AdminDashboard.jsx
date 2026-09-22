import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Plus, 
  FileText, 
  Layers, 
  FolderKanban, 
  ChevronRight,
  Sparkles,
  Database
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    unreadInquiries: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isSupabaseConfigured } = useAdminAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [orders, products, inquiries] = await Promise.all([
          adminDataService.getOrders(),
          adminDataService.getProducts(),
          adminDataService.getInquiries()
        ]);

        const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
        const unreadCount = inquiries.filter(i => i.status === 'unread').length;

        setStats({
          totalSales: totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          unreadInquiries: unreadCount
        });

        setRecentOrders(orders.slice(0, 5));
        setRecentInquiries(inquiries.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout title="Dashboard Overview" subtitle="Welcome back to Symmetry Executive Control Panel">
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 relative overflow-hidden group hover:border-[#36656B]/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wider text-white/50">Total Revenue</p>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mt-3">
              {formatPrice(stats.totalSales)}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
            </p>
          </div>

          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 relative overflow-hidden group hover:border-[#36656B]/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wider text-white/50">Total Orders</p>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mt-3">
              {stats.totalOrders}
            </h3>
            <p className="text-[11px] text-white/40 mt-2">Completed & active orders</p>
          </div>

          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 relative overflow-hidden group hover:border-[#36656B]/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wider text-white/50">Active Products</p>
              <div className="w-10 h-10 rounded-xl bg-[#36656B]/20 border border-[#36656B]/30 flex items-center justify-center text-[#36656B]">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mt-3">
              {stats.totalProducts}
            </h3>
            <p className="text-[11px] text-white/40 mt-2">Live store inventory</p>
          </div>

          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 relative overflow-hidden group hover:border-[#36656B]/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-medium tracking-wider text-white/50">Pending Enquiries</p>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mt-3">
              {stats.unreadInquiries}
            </h3>
            <p className="text-[11px] text-amber-400 mt-2">Requires administrator attention</p>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#36656B]" /> Quick Executive Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/content"
              className="p-4 rounded-xl bg-[#07121C] border border-[#1B2E3D] hover:border-[#36656B] text-left transition-all group flex flex-col justify-between"
            >
              <FileText className="w-5 h-5 text-[#36656B] mb-3 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-semibold text-white">Edit Page CMS</p>
                <p className="text-[10px] text-white/40 mt-0.5">Modify headings & text</p>
              </div>
            </Link>

            <Link
              to="/admin/products"
              className="p-4 rounded-xl bg-[#07121C] border border-[#1B2E3D] hover:border-[#36656B] text-left transition-all group flex flex-col justify-between"
            >
              <Plus className="w-5 h-5 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-semibold text-white">Add New Product</p>
                <p className="text-[10px] text-white/40 mt-0.5">Upload stone & furniture</p>
              </div>
            </Link>

            <Link
              to="/admin/projects"
              className="p-4 rounded-xl bg-[#07121C] border border-[#1B2E3D] hover:border-[#36656B] text-left transition-all group flex flex-col justify-between"
            >
              <FolderKanban className="w-5 h-5 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-semibold text-white">New Portfolio Project</p>
                <p className="text-[10px] text-white/40 mt-0.5">Add interior showcase</p>
              </div>
            </Link>

            <Link
              to="/admin/inquiries"
              className="p-4 rounded-xl bg-[#07121C] border border-[#1B2E3D] hover:border-[#36656B] text-left transition-all group flex flex-col justify-between"
            >
              <MessageSquare className="w-5 h-5 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-semibold text-white">Review Enquiries</p>
                <p className="text-[10px] text-white/40 mt-0.5">Inbox & customer leads</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Grid: Recent Orders & Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders (2 cols) */}
          <div className="lg:col-span-2 bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-white">Recent Customer Orders</h2>
              <Link to="/admin/orders" className="text-xs text-[#36656B] hover:text-white flex items-center gap-1">
                View All Orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1B2E3D] text-white/40 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2E3D]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-mono font-medium text-white">{order.order_number}</td>
                      <td className="py-3">
                        <p className="font-medium text-white">{order.customer_name}</p>
                        <p className="text-[10px] text-white/40">{order.customer_email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize ${
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          order.status === 'shipped' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-white/10 text-white/70'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-white">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-white/40">No orders recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Inquiries Drawer (1 col) */}
          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm uppercase tracking-wider font-semibold text-white">Contact Submissions</h2>
                <Link to="/admin/inquiries" className="text-xs text-[#36656B] hover:text-white flex items-center gap-1">
                  Inbox ↗
                </Link>
              </div>

              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="p-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-white">{inq.name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${inq.status === 'unread' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'bg-white/10 text-white/50'}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#36656B] font-medium">{inq.service}</p>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1">{inq.message}</p>
                  </div>
                ))}
                {recentInquiries.length === 0 && (
                  <p className="text-xs text-white/40 text-center py-6">No contact inquiries found</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1B2E3D]">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#36656B]" /> System Environment
                </span>
                <span className="text-white font-mono">{isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
