import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Trash2, CheckCircle, Clock, Truck, PackageCheck, AlertCircle, X, Printer } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    const data = await adminDataService.getOrders();
    setOrders(data || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const updated = await adminDataService.updateOrderStatus(id, status);
    setOrders(updated);
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => ({ ...prev, status }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this order record?')) {
      const updated = await adminDataService.deleteOrder(id);
      setOrders(updated);
      if (selectedOrder?.id === id) setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout title="Customer Store Orders" subtitle="Manage order processing workflows, shipping updates, and invoices">
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1B2E3D]">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === st
                  ? 'bg-[#36656B] text-white shadow-lg shadow-[#36656B]/20 font-semibold'
                  : 'bg-[#0A1622] text-white/60 hover:text-white border border-[#1B2E3D]'
              }`}
            >
              {st} ({orders.filter(o => st === 'all' || o.status === st).length})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2E3D] bg-[#07121C] text-white/40 uppercase tracking-wider">
                  <th className="p-4 font-medium">Order No.</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E3D]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-semibold text-white">
                      {order.order_number}
                      <p className="text-[10px] text-white/40 font-sans font-normal">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{order.customer_name}</p>
                      <p className="text-[10px] text-white/40">{order.customer_email}</p>
                    </td>
                    <td className="p-4 text-white/80">
                      {order.items?.length || 1} item(s)
                    </td>
                    <td className="p-4 font-medium text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize ${
                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        order.status === 'shipped' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-white/10 text-white/70'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#36656B] text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">
                      No orders found under selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Inspector Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl w-full max-w-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                <div>
                  <h3 className="text-sm font-serif font-semibold text-white flex items-center gap-2">
                    Order Invoice #{selectedOrder.order_number}
                  </h3>
                  <p className="text-[10px] text-white/40">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#36656B] mb-1">Customer Info</p>
                  <p className="font-semibold text-white">{selectedOrder.customer_name}</p>
                  <p className="text-white/60">{selectedOrder.customer_email}</p>
                  <p className="text-white/60">{selectedOrder.customer_phone}</p>
                </div>
                <div className="p-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#36656B] mb-1">Shipping Address</p>
                  <p className="text-white/80">{selectedOrder.shipping_address?.address || 'N/A'}</p>
                  <p className="text-white/60">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zip}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-[10px] uppercase font-bold text-white/50 mb-2">Purchased Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-white/40">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="font-semibold text-white">{formatPrice(item.price * (item.quantity || 1))}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1B2E3D] flex items-center justify-between text-sm font-semibold">
                <span className="text-white/70">Total Order Amount</span>
                <span className="text-[#36656B] font-serif text-lg">{formatPrice(selectedOrder.total)}</span>
              </div>

              {/* Status Updater */}
              <div className="space-y-2 pt-2 border-t border-[#1B2E3D]">
                <p className="text-[10px] uppercase font-bold text-white/50">Change Processing Status</p>
                <div className="grid grid-cols-5 gap-1.5 text-[10px]">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 rounded-xl capitalize font-medium transition-all ${
                        selectedOrder.status === st
                          ? 'bg-[#36656B] text-white shadow'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
