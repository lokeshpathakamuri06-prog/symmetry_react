import React, { useEffect, useState } from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import InboxPage from '../../components/admin/InboxPage';
import AdminLayout from '../../components/admin/AdminLayout';
import { newsletter } from '../../services/adminApi';
import { formatWhen } from '../../components/admin/InboxPage';

const Detail = ({ item }) => (
  <div className="space-y-3 min-w-0">
    <div>
      <h3 className="font-semibold text-adm-fg text-base">{item.name}</h3>
      <p className="text-[11px] text-adm-muted font-mono">{item.reference} · {formatWhen(item.createdAt)}</p>
    </div>
    <a href={`mailto:${item.email}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Mail className="w-4 h-4 text-adm-accent" /> {item.email}</a>
    {item.phone && <a href={`tel:${item.phone}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Phone className="w-4 h-4 text-adm-accent" /> {item.phone}</a>}
    <p className="text-[12px] text-adm-muted">{[item.service, item.budget].filter(Boolean).join(' · ')}</p>
    <div className="p-3 bg-adm-surface2 rounded-xl text-adm-fg/90 whitespace-pre-wrap leading-relaxed">{item.message}</div>
    {item.sourcePage && <p className="text-[11px] text-adm-muted">Sent from {item.sourcePage}</p>}
  </div>
);

const config = {
  kind: 'inquiries',
  title: 'Contact Enquiries',
  subtitle: 'Messages from the Contact page',
  emptyText: 'No enquiries yet.',
  statusStyles: {
    unread: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    read: 'bg-adm-fg/5 text-adm-fg/70',
    replied: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    archived: 'bg-adm-fg/5 text-adm-muted',
  },
  row: (i) => ({ title: i.name, subtitle: i.service || i.message }),
  Detail,
};

const NewsletterList = ({ onBack }) => {
  const [items, setItems] = useState(null);
  useEffect(() => {
    newsletter.list().then((r) => setItems(r.items)).catch(() => setItems([]));
  }, []);
  const active = (items || []).filter((i) => !i.unsubscribedAt);
  return (
    <AdminLayout title="Newsletter Subscribers" subtitle="People who joined from the website">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[13px] text-adm-accent hover:underline">← Back to enquiries</button>
          <a href={newsletter.csvUrl} className="px-4 py-2 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-[13px] font-medium inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </a>
        </div>
        <div className="adm-card overflow-hidden">
          {items === null ? (
            <p className="p-10 text-center text-adm-muted text-[13px]">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-10 text-center text-adm-muted text-[13px]">No subscribers yet.</p>
          ) : (
            <ul className="divide-y divide-adm-border">
              <li className="px-4 py-2 text-[11px] text-adm-muted">{active.length} active subscriber(s)</li>
              {items.map((s) => (
                <li key={s.id} className="px-4 py-3 flex items-center justify-between text-[13px]">
                  <span className={s.unsubscribedAt ? 'text-adm-muted line-through' : 'text-adm-fg'}>{s.email}</span>
                  <span className="text-[11px] text-adm-muted">{formatWhen(s.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminInquiries = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  if (showNewsletter) return <NewsletterList onBack={() => setShowNewsletter(false)} />;
  return (
    <InboxPage
      config={config}
      headerExtra={
        <div className="flex justify-end">
          <button onClick={() => setShowNewsletter(true)} className="text-[13px] text-adm-accent hover:underline">View newsletter subscribers →</button>
        </div>
      }
    />
  );
};

export default AdminInquiries;
