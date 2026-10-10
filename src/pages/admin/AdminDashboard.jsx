import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, FileText, FolderKanban, Image as ImageIcon, Package, Plus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboard } from '../../services/adminApi';

const Tile = ({ icon: Icon, label, value, detail, to }) => (
  <Link to={to} className="adm-card p-5 flex items-start justify-between hover:ring-2 hover:ring-adm-accent/20 transition">
    <div>
      <p className="text-[12px] text-adm-muted font-medium">{label}</p>
      <p className="text-3xl font-semibold text-adm-fg mt-1">{value ?? '—'}</p>
      {detail && <p className="text-[11px] text-adm-muted mt-1">{detail}</p>}
    </div>
    <div className="w-10 h-10 rounded-xl bg-adm-accent/10 text-adm-accent flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
  </Link>
);

const ACTIONS = [
  { to: '/admin/products', label: 'Products', hint: 'Prices, photos, stock', icon: Package },
  { to: '/admin/projects', label: 'Projects', hint: 'Portfolio & galleries', icon: FolderKanban },
  { to: '/admin/blogs', label: 'Journal', hint: 'Articles', icon: BookOpen },
  { to: '/admin/content', label: 'Page text', hint: 'Headlines & contact details', icon: FileText },
];

const TYPE_PATHS = { Product: 'products', Project: 'projects', Journal: 'blogs', Job: 'careers' };

const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(m, 0)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return new Date(iso).toLocaleDateString();
};

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  const drafts = (counts) => (counts?.draft ? `${counts.draft} draft` : 'No drafts');

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your website content">
      <div className="space-y-6">
        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-400 text-[13px]">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Tile icon={Package} label="Live products" value={data?.products?.published ?? 0} detail={drafts(data?.products)} to="/admin/products" />
          <Tile icon={FolderKanban} label="Live projects" value={data?.projects?.published ?? 0} detail={drafts(data?.projects)} to="/admin/projects" />
          <Tile icon={BookOpen} label="Live articles" value={data?.blogs?.published ?? 0} detail={drafts(data?.blogs)} to="/admin/blogs" />
          <Tile icon={Briefcase} label="Open jobs" value={data?.openJobs} to="/admin/careers" />
          <Tile icon={ImageIcon} label="Images" value={data?.media} to="/admin/media" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="adm-card p-5 lg:col-span-1">
            <h3 className="text-[13px] font-semibold text-adm-fg mb-3">Quick actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {ACTIONS.map(({ to, label, hint, icon: Icon }) => (
                <Link key={to} to={to} className="p-3 rounded-xl bg-adm-fg/[0.03] hover:bg-adm-fg/[0.06] transition">
                  <Icon className="w-4 h-4 text-adm-accent mb-2" />
                  <p className="text-[13px] font-medium text-adm-fg">{label}</p>
                  <p className="text-[11px] text-adm-muted">{hint}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="adm-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-adm-fg">Recent edits</h3>
              <Link to="/admin/products" className="text-[12px] text-adm-accent inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> New product</Link>
            </div>
            {!data ? (
              <p className="text-[13px] text-adm-muted py-6 text-center">Loading…</p>
            ) : (
              <ul className="divide-y divide-adm-border">
                {data.recentEdits.map((e) => (
                  <li key={`${e.type}-${e.id}`} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/admin/${TYPE_PATHS[e.type]}`} className="text-[13px] font-medium text-adm-fg hover:text-adm-accent truncate block">{e.name}</Link>
                      <p className="text-[11px] text-adm-muted">{e.type}</p>
                    </div>
                    <span className="text-[11px] text-adm-muted shrink-0">{ago(e.updatedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
