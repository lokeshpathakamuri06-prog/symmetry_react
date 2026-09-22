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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1B2E3D]">
          {['all', 'unread', 'read', 'replied'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === st
                  ? 'bg-[#36656B] text-white shadow-lg shadow-[#36656B]/20 font-semibold'
                  : 'bg-[#0A1622] text-white/60 hover:text-white border border-[#1B2E3D]'
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
                className={`p-5 bg-[#0A1622] border rounded-2xl cursor-pointer transition-all ${
                  selectedInquiry?.id === inq.id
                    ? 'border-[#36656B] ring-1 ring-[#36656B]'
                    : 'border-[#1B2E3D] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-semibold text-white text-sm">{inq.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#36656B]/20 text-[#36656B] font-mono">
                      {inq.service || 'General'}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium capitalize ${
                    inq.status === 'unread' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    inq.status === 'replied' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <p className="text-xs text-white/70 line-clamp-2">{inq.message}</p>

                <div className="mt-3 pt-3 border-t border-[#1B2E3D] flex items-center justify-between text-[11px] text-white/40">
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-white/30" /> {inq.email}</span>
                  <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {filteredInquiries.length === 0 && (
              <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-12 text-center text-white/40 text-xs">
                No inquiries matching active filter.
              </div>
            )}
          </div>

          {/* Inquiry Detail Inspector (1 col) */}
          <div className="bg-[#0A1622] border border-[#1B2E3D] rounded-2xl p-6 h-fit sticky top-24">
            {selectedInquiry ? (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#1B2E3D]">
                  <h3 className="font-serif font-semibold text-white text-base">Enquiry Detail</h3>
                  <button onClick={() => handleDelete(selectedInquiry.id)} className="p-1 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white">{selectedInquiry.name}</p>
                  <p className="text-white/60 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#36656B]" /> {selectedInquiry.email}</p>
                  {selectedInquiry.phone && (
                    <p className="text-white/60 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#36656B]" /> {selectedInquiry.phone}</p>
                  )}
                  <p className="text-[11px] text-white/40">Service: {selectedInquiry.service || 'N/A'}</p>
                </div>

                <div className="p-4 bg-[#07121C] border border-[#1B2E3D] rounded-xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[#36656B] tracking-wider">Message Content</p>
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>

                {/* Status Action Buttons */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'unread')}
                      className="py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl"
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'read')}
                      className="py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'replied')}
                      className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-medium"
                    >
                      Replied
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-white/70">Administrator Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private internal follow-up notes..."
                    className="w-full px-3 py-2 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-white focus:border-[#36656B]"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status)}
                    className="w-full py-2 bg-[#36656B] hover:bg-[#2b5257] text-white rounded-xl font-medium"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-white/40 text-xs">
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
