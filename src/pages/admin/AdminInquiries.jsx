import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, Mail, Phone, Tag, Edit3, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadInquiries = async () => {
    const data = await adminDataService.getInquiries();
    setInquiries(data || []);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const updated = await adminDataService.updateInquiryStatus(id, status, adminNotes);
    setInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status, notes: adminNotes }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this contact enquiry?')) {
      const updated = await adminDataService.deleteInquiry(id);
      setInquiries(updated);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

  return (
    <AdminLayout title="Contact Form Enquiries" subtitle="Manage customer contact requests, consultation leads, and inquiries">
      <div className="space-y-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-adm-border">
          {['all', 'unread', 'read', 'replied'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === st
                  ? 'bg-adm-accent text-adm-on-accent font-semibold'
                  : 'bg-adm-surface text-adm-fg/60 hover:text-adm-fg border border-adm-border'
              }`}
            >
              {st} ({inquiries.filter(i => st === 'all' || i.status === st).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => {
                  setSelectedInquiry(inq);
                  setAdminNotes(inq.notes || '');
                }}
                className={`p-5 bg-adm-surface border rounded-2xl cursor-pointer transition-all ${
                  selectedInquiry?.id === inq.id
                    ? 'border-adm-accent ring-1 ring-adm-accent'
                    : 'border-adm-border hover:border-adm-fg/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-adm-fg text-sm">{inq.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-adm-accent/20 text-adm-accent font-mono">
                      {inq.service || 'General'}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium capitalize ${
                    inq.status === 'unread' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                    inq.status === 'replied' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                    'bg-adm-fg/10 text-adm-fg/60'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <p className="text-xs text-adm-fg/70 line-clamp-2">{inq.message}</p>

                <div className="mt-3 pt-3 border-t border-adm-border flex items-center justify-between text-[11px] text-adm-fg/40">
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-adm-fg/30" /> {inq.email}</span>
                  <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {filteredInquiries.length === 0 && (
              <div className="adm-card p-12 text-center text-adm-fg/40 text-xs">
                No inquiries matching active filter.
              </div>
            )}
          </div>

          {/* Inquiry Detail Inspector (1 col) */}
          <div className="adm-card p-6 h-fit sticky top-24">
            {selectedInquiry ? (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                  <h3 className="font-semibold text-adm-fg text-base">Enquiry Detail</h3>
                  <button onClick={() => handleDelete(selectedInquiry.id)} className="p-1 text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-adm-fg">{selectedInquiry.name}</p>
                  <p className="text-adm-fg/60 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-adm-accent" /> {selectedInquiry.email}</p>
                  {selectedInquiry.phone && (
                    <p className="text-adm-fg/60 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-adm-accent" /> {selectedInquiry.phone}</p>
                  )}
                  <p className="text-[11px] text-adm-fg/40">Service: {selectedInquiry.service || 'N/A'}</p>
                </div>

                <div className="p-4 bg-adm-surface2 border border-adm-border rounded-xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-adm-accent tracking-wider">Message Content</p>
                  <p className="text-adm-fg/90 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>

                {/* Status Action Buttons */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] uppercase font-bold text-adm-fg/50 tracking-wider">Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'unread')}
                      className="py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl"
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'read')}
                      className="py-2 bg-adm-fg/5 hover:bg-adm-fg/10 text-adm-fg border border-adm-fg/10 rounded-xl"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'replied')}
                      className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-medium"
                    >
                      Replied
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-adm-fg/70">Administrator Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private internal follow-up notes..."
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status)}
                    className="w-full py-2 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl font-medium"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-adm-fg/40 text-xs">
                Select an inquiry from the list to inspect details and respond.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
