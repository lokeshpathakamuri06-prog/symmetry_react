import React, { useState, useEffect } from 'react';
import { UserCheck, Trash2, Mail, Phone, Link2, FileText, Briefcase } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';

const STATUSES = ['new', 'shortlisted', 'interview', 'hired', 'rejected'];

const statusStyles = {
  new: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  shortlisted: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  interview: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  hired: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-adm-fg/5 text-adm-muted'
};

export const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadApplications = async () => {
    const data = await adminDataService.getApplications();
    setApplications(data || []);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const updated = await adminDataService.updateApplicationStatus(id, status, adminNotes);
    setApplications(updated);
    if (selected?.id === id) {
      setSelected((prev) => ({ ...prev, status, notes: adminNotes }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this application?')) {
      const updated = await adminDataService.deleteApplication(id);
      setApplications(updated);
      if (selected?.id === id) setSelected(null);
    }
  };

  const filtered = applications.filter((a) => filter === 'all' || a.status === filter);

  return (
    <AdminLayout title="Job Applications" subtitle="Candidates who applied through the Careers page">
      <div className="space-y-6">
        {/* Segmented filter */}
        <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
          {['all', ...STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium capitalize whitespace-nowrap transition-all ${
                filter === st
                  ? 'bg-adm-surface text-adm-fg shadow-sm'
                  : 'text-adm-muted hover:text-adm-fg'
              }`}
            >
              {st} <span className="text-adm-muted">({applications.filter((a) => st === 'all' || a.status === st).length})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 adm-card overflow-hidden h-fit">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-adm-muted text-[13px]">
                <UserCheck className="w-8 h-8 mx-auto mb-3 opacity-40" />
                No applications{filter !== 'all' ? ` with status "${filter}"` : ' yet'}.
              </div>
            ) : (
              <ul className="divide-y divide-adm-border">
                {filtered.map((app) => (
                  <li
                    key={app.id}
                    onClick={() => {
                      setSelected(app);
                      setAdminNotes(app.notes || '');
                    }}
                    className={`p-4 cursor-pointer transition-colors flex items-center gap-4 ${
                      selected?.id === app.id ? 'bg-adm-accent/[0.07]' : 'hover:bg-adm-fg/[0.03]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-adm-accent/10 text-adm-accent flex items-center justify-center text-sm font-semibold shrink-0">
                      {app.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-adm-fg truncate">{app.name}</p>
                      <p className="text-[12px] text-adm-muted truncate">{app.job_title || 'General Application'}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[app.status] || statusStyles.new}`}>
                        {app.status}
                      </span>
                      <p className="text-[11px] text-adm-muted">{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail inspector */}
          <div className="adm-card p-6 h-fit lg:sticky lg:top-24">
            {selected ? (
              <div className="space-y-5 text-[13px]">
                <div className="flex items-start justify-between pb-3 border-b border-adm-border">
                  <div>
                    <h3 className="font-semibold text-adm-fg text-base">{selected.name}</h3>
                    <p className="text-adm-muted flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" /> {selected.job_title || 'General Application'}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-lg text-adm-muted hover:text-red-600 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <a href={`mailto:${selected.email}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2">
                    <Mail className="w-4 h-4 text-adm-accent" /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2">
                      <Phone className="w-4 h-4 text-adm-accent" /> {selected.phone}
                    </a>
                  )}
                  {selected.experience_years && (
                    <p className="text-adm-muted">Experience: {selected.experience_years}</p>
                  )}
                  {selected.resume_url && (
                    <a href={selected.resume_url} target="_blank" rel="noreferrer" className="text-adm-accent hover:underline flex items-center gap-2">
                      <FileText className="w-4 h-4" /> View Resume ↗
                    </a>
                  )}
                  {selected.portfolio_url && (
                    <a href={selected.portfolio_url} target="_blank" rel="noreferrer" className="text-adm-accent hover:underline flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Portfolio / LinkedIn ↗
                    </a>
                  )}
                </div>

                {selected.message && (
                  <div className="p-4 bg-adm-surface2 rounded-xl space-y-1">
                    <p className="text-[11px] font-semibold text-adm-muted">Cover Note</p>
                    <p className="text-adm-fg/90 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-adm-muted">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selected.id, st)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium capitalize transition-all ${
                          selected.status === st
                            ? 'bg-adm-accent text-adm-on-accent'
                            : 'bg-adm-fg/5 text-adm-fg/70 hover:bg-adm-fg/10'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-adm-muted">Internal Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Interview feedback, salary expectations..."
                    className="w-full px-3 py-2 rounded-xl adm-input"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selected.id, selected.status)}
                    className="w-full py-2 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl font-medium"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-adm-muted text-[13px]">
                Select a candidate to view their application.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
