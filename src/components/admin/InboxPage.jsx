import React, { useCallback, useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { inbox } from '../../services/adminApi';

// List + detail inspector shared by Enquiries, Applications and Orders.
// config: kind, title, subtitle, statusStyles, row(item) -> {title, subtitle, meta}, Detail({item}), emptyText

export const formatWhen = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const InboxPage = ({ config, headerExtra }) => {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [data, setData] = useState({ items: null, counts: {}, statuses: [] });
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const api = inbox(config.kind);

  const load = useCallback(() => {
    inbox(config.kind).list({ status: filter, q })
      .then((r) => {
        setData(r);
        setSelected((current) => (current ? r.items.find((i) => i.id === current.id) || null : null));
      })
      .catch((err) => setError(err.message));
  }, [config.kind, filter, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const select = (item) => {
    setSelected(item);
    setNotes(item.notes || '');
  };

  const update = async (changes) => {
    try {
      const saved = await api.update(selected.id, changes);
      setSelected(saved);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete permanently? This cannot be undone.')) return;
    try {
      await api.remove(selected.id);
      setSelected(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const total = Object.values(data.counts || {}).reduce((a, b) => a + b, 0);
  const Detail = config.Detail;

  return (
    <AdminLayout title={config.title} subtitle={config.subtitle}>
      <div className="space-y-5">
        {headerExtra}
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
            {['all', ...(data.statuses || [])].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium capitalize whitespace-nowrap transition-all ${filter === st ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'}`}
              >
                {st} <span className="text-adm-muted">({st === 'all' ? total : data.counts?.[st] || 0})</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-64" />
          </div>
        </div>

        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-400 text-[13px]">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 adm-card overflow-hidden h-fit">
            {data.items === null ? (
              <p className="p-12 text-center text-adm-muted text-[13px]">Loading…</p>
            ) : data.items.length === 0 ? (
              <p className="p-12 text-center text-adm-muted text-[13px]">{config.emptyText}</p>
            ) : (
              <ul className="divide-y divide-adm-border">
                {data.items.map((item) => {
                  const row = config.row(item);
                  return (
                    <li
                      key={item.id}
                      onClick={() => select(item)}
                      className={`p-4 cursor-pointer flex items-center gap-4 transition-colors ${selected?.id === item.id ? 'bg-adm-accent/[0.07]' : 'hover:bg-adm-fg/[0.03]'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-adm-fg truncate">{row.title}</p>
                        <p className="text-[12px] text-adm-muted truncate">{row.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${config.statusStyles[item.status] || 'bg-adm-fg/5 text-adm-muted'}`}>
                          {item.status}
                        </span>
                        <p className="text-[11px] text-adm-muted">{row.meta || formatWhen(item.createdAt)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 adm-card p-6 h-fit lg:sticky lg:top-24">
            {selected ? (
              <div className="space-y-5 text-[13px]">
                <div className="flex items-start justify-between gap-3">
                  <Detail item={selected} />
                  <button onClick={remove} title="Delete permanently" className="p-1.5 rounded-lg text-adm-muted hover:text-red-600 hover:bg-red-500/10 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-adm-muted">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {data.statuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => update({ status: st })}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium capitalize transition-all ${selected.status === st ? 'bg-adm-accent text-adm-on-accent' : 'bg-adm-fg/5 text-adm-fg/70 hover:bg-adm-fg/10'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-adm-muted">Internal notes</label>
                  <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-xl adm-input" placeholder="Follow-up notes (only visible to admins)" />
                  <button onClick={() => update({ notes })} className="w-full py-2 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl font-medium">Save notes</button>
                </div>
              </div>
            ) : (
              <p className="py-12 text-center text-adm-muted text-[13px]">Select an item to see the details.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InboxPage;
