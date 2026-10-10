import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, ArchiveRestore, ArrowDown, ArrowUp, Edit2, Loader2, Plus, Search, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { FormField } from './form/fields';
import { content } from '../../services/adminApi';
import { cloudinaryUrl } from '../../lib/images';

// One list + editor for every content type. Screens pass a config:
//   resource, title, subtitle, sections: [{title, fields: [...]}], newRecord(), row: {thumb, primary, secondary, meta}
//   optionSources: {fieldKey: async () => [{value, label}]}, sortable

const FILTERS = [
  ['active', 'All'],
  ['published', 'Published'],
  ['draft', 'Draft'],
  ['archived', 'Archived'],
];

const StatusPill = ({ status }) => {
  const style = {
    published: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    archived: 'bg-adm-fg/5 text-adm-muted',
  }[status];
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${style}`}>{status}</span>;
};

const Editor = ({ config, record, isNew, options, onClose, onSaved }) => {
  const [draft, setDraft] = useState(record);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState(null); // {kind: 'error'|'conflict', message}

  const set = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setBanner(null);
    try {
      const api = content(config.resource);
      const saved = isNew ? await api.create(draft) : await api.update(record.id, draft);
      onSaved(saved, isNew);
    } catch (err) {
      if (err.status === 422 && err.field) {
        setFieldErrors({ [err.field]: err.message });
        document.querySelector(`[data-field="${err.field}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setBanner({ kind: err.status === 409 ? 'conflict' : 'error', message: err.message });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-4">
      <form onSubmit={save} className="adm-card w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-2xl" data-lenis-prevent>
        <div className="px-6 py-4 border-b border-adm-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-adm-fg">{isNew ? `New ${config.singular}` : `Edit ${config.singular}`}</h3>
            {!isNew && <p className="text-[11px] text-adm-muted font-mono">{record.id}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
          {banner && (
            <div role="alert" className={`p-3 rounded-xl text-[13px] ${banner.kind === 'conflict' ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
              {banner.message}
              {banner.kind === 'conflict' && (
                <button type="button" onClick={onClose} className="ml-2 underline font-medium">Close and reload</button>
              )}
            </div>
          )}
          {config.sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-adm-muted">{section.title}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {section.fields.map((field) => (
                  <FormField
                    key={field.key}
                    field={field}
                    value={draft[field.key]}
                    options={options[field.key]}
                    error={fieldErrors[field.key]}
                    onChange={(v) => set(field.key, v)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-adm-border flex items-center justify-between gap-3">
          <p className="text-[11px] text-adm-muted">Saved changes go live when you click <b>Publish</b>.</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-adm-fg/5 hover:bg-adm-fg/10 rounded-xl text-[13px] text-adm-fg">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-adm-accent hover:bg-adm-accent-hover rounded-xl text-[13px] text-adm-on-accent font-medium inline-flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ResourceManager = ({ config }) => {
  const [filter, setFilter] = useState('active');
  const [q, setQ] = useState('');
  const [data, setData] = useState({ items: null, counts: {} });
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // {record, isNew}
  const [options, setOptions] = useState({});
  const [notice, setNotice] = useState('');

  const api = useMemo(() => content(config.resource), [config.resource]);

  const load = useCallback(() => {
    setError('');
    api.list({ status: filter, q })
      .then((r) => setData({ items: r.items, counts: r.counts }))
      .catch((err) => setError(err.message));
  }, [api, filter, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  useEffect(() => {
    Object.entries(config.optionSources || {}).forEach(([key, fetcher]) => {
      fetcher().then((opts) => setOptions((o) => ({ ...o, [key]: opts }))).catch(() => {});
    });
  }, [config.optionSources]);

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  };

  const openEdit = async (record) => {
    // Re-read before editing so updatedAt is current
    try {
      setEditing({ record: await api.get(record.id), isNew: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const act = async (fn, message) => {
    try {
      await fn();
      flash(message);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const reorder = (index, delta) => {
    const ids = data.items.map((i) => i.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    act(() => api.reorder(ids), 'Order saved');
  };

  const counts = data.counts || {};
  const total = (counts.published || 0) + (counts.draft || 0);

  return (
    <AdminLayout title={config.title} subtitle={config.subtitle}>
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${filter === value ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'}`}
              >
                {label} <span className="text-adm-muted">({value === 'active' ? total : counts[value] || 0})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-56" />
            </div>
            <button
              onClick={() => setEditing({ record: config.newRecord(), isNew: true })}
              className="px-4 py-2 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-[13px] font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New {config.singular}
            </button>
          </div>
        </div>

        {notice && <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px]">{notice}</div>}
        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-400 text-[13px]">{error}</div>}

        <div className="adm-card overflow-hidden">
          {data.items === null ? (
            <div className="p-12 text-center text-adm-muted text-[13px]">Loading…</div>
          ) : data.items.length === 0 ? (
            <div className="p-12 text-center text-adm-muted text-[13px]">{q ? 'No matches.' : `No ${config.plural.toLowerCase()} here yet.`}</div>
          ) : (
            <ul className="divide-y divide-adm-border">
              {data.items.map((item, index) => (
                <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-adm-fg/[0.02]">
                  {config.row.thumb && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-adm-surface2 shrink-0">
                      {config.row.thumb(item) && <img src={cloudinaryUrl(config.row.thumb(item), { width: 120 })} alt="" loading="lazy" className="w-full h-full object-cover" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold text-adm-fg truncate">{config.row.primary(item)}</p>
                      <StatusPill status={item.status} />
                    </div>
                    {config.row.secondary && <p className="text-[12px] text-adm-muted truncate">{config.row.secondary(item)}</p>}
                  </div>
                  {config.row.meta && <div className="hidden md:block text-[13px] text-adm-fg/80 text-right shrink-0">{config.row.meta(item)}</div>}
                  <div className="flex items-center gap-1 shrink-0">
                    {config.sortable && filter === 'active' && !q && (
                      <>
                        <button title="Move up" onClick={() => reorder(index, -1)} className="p-2 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5"><ArrowUp className="w-4 h-4" /></button>
                        <button title="Move down" onClick={() => reorder(index, 1)} className="p-2 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5"><ArrowDown className="w-4 h-4" /></button>
                      </>
                    )}
                    {item.status === 'archived' ? (
                      <button title="Restore" onClick={() => act(() => api.restore(item.id), `${config.singular} restored as a draft`)} className="p-2 rounded-lg text-adm-muted hover:text-adm-accent hover:bg-adm-fg/5">
                        <ArchiveRestore className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button title="Edit" onClick={() => openEdit(item)} className="p-2 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5"><Edit2 className="w-4 h-4" /></button>
                        <button
                          title="Archive"
                          onClick={() => window.confirm(`Archive this ${config.singular.toLowerCase()}? It will be hidden from the website after you publish. You can restore it later.`) && act(() => api.archive(item.id), `${config.singular} archived`)}
                          className="p-2 rounded-lg text-adm-muted hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {editing && (
        <Editor
          key={editing.record.id || 'new'}
          config={config}
          record={editing.record}
          isNew={editing.isNew}
          options={options}
          onClose={() => { setEditing(null); load(); }}
          onSaved={(saved, isNew) => {
            setEditing(null);
            flash(`${config.singular} ${isNew ? 'created' : 'saved'}. Click Publish to update the website.`);
            load();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ResourceManager;
