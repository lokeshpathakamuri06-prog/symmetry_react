import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy, ImagePlus, Search, Trash2, UploadCloud } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { media } from '../../services/adminApi';

export const AdminMedia = () => {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null); // {kind, text}
  const [copiedId, setCopiedId] = useState(null);

  const load = useCallback(() => {
    media.list({ q, unused: unusedOnly }).then((r) => setItems(r.items)).catch((err) => setMessage({ kind: 'error', text: err.message }));
  }, [q, unusedOnly]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const say = (kind, text) => {
    setMessage({ kind, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const addByUrl = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      await media.addByUrl(url.trim());
      setUrl('');
      say('ok', 'Image added to the library.');
      load();
    } catch (err) {
      say('error', err.message);
    }
  };

  const saveAlt = async (asset, altText) => {
    if ((asset.altText || '') === altText) return;
    try {
      await media.update(asset.id, { altText });
      say('ok', 'Alt text saved.');
    } catch (err) {
      say('error', err.message);
    }
  };

  const remove = async (asset) => {
    if (!window.confirm('Delete this image from the library?')) return;
    try {
      await media.remove(asset.id);
      say('ok', 'Image deleted.');
      load();
    } catch (err) {
      say('error', err.message);
    }
  };

  const copy = (asset) => {
    navigator.clipboard?.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AdminLayout title="Media Library" subtitle="Every image used on the website">
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search file name, alt text, tag…" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-64" />
            </div>
            <label className="inline-flex items-center gap-2 text-[12px] text-adm-fg/80 cursor-pointer">
              <input type="checkbox" checked={unusedOnly} onChange={(e) => setUnusedOnly(e.target.checked)} className="accent-[rgb(var(--adm-accent))]" />
              Unused only
            </label>
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={addByUrl} className="flex items-center gap-2">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Add image by URL (https://…)" className="px-3 py-2 rounded-xl adm-input text-[13px] w-72" />
              <button type="submit" className="px-3 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-[13px] inline-flex items-center gap-1.5"><ImagePlus className="w-4 h-4" /> Add</button>
            </form>
            <button type="button" disabled title="Direct uploads arrive with the Cloudinary integration" className="px-3 py-2 rounded-xl bg-adm-accent text-adm-on-accent text-[13px] inline-flex items-center gap-1.5 opacity-40 cursor-not-allowed">
              <UploadCloud className="w-4 h-4" /> Upload (coming soon)
            </button>
          </div>
        </div>

        {message && (
          <div role={message.kind === 'error' ? 'alert' : 'status'} className={`p-3 rounded-xl text-[13px] ${message.kind === 'error' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
            {message.text}
          </div>
        )}

        {items === null ? (
          <p className="text-center text-adm-muted text-[13px] py-12">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-adm-muted text-[13px] py-12">No images found.</p>
        ) : (
          <>
            <p className="text-[12px] text-adm-muted">{items.length} image(s)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {items.map((asset) => (
                <div key={asset.id} className="adm-card overflow-hidden flex flex-col">
                  <div className="aspect-square bg-adm-surface2">
                    <img src={asset.url} alt={asset.altText || ''} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 space-y-1.5 text-[11px]">
                    <p className="font-medium text-adm-fg truncate" title={asset.filename}>{asset.filename || 'image'}</p>
                    <input
                      defaultValue={asset.altText || ''}
                      placeholder="Alt text"
                      onBlur={(e) => saveAlt(asset, e.target.value.trim())}
                      className="w-full px-2 py-1 rounded-lg adm-input text-[11px]"
                    />
                    <div className="flex items-center justify-between">
                      <span className={asset.usedIn ? 'text-adm-muted' : 'text-amber-600 dark:text-amber-400'}>
                        {asset.usedIn ? `Used in ${asset.usedIn}` : 'Unused'}
                      </span>
                      <div className="flex items-center">
                        <button title="Copy URL" onClick={() => copy(asset)} className="p-1 rounded text-adm-muted hover:text-adm-fg">
                          {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          title={asset.usedIn ? 'In use: remove it from content first' : 'Delete'}
                          disabled={asset.usedIn > 0}
                          onClick={() => remove(asset)}
                          className="p-1 rounded text-adm-muted hover:text-red-600 disabled:opacity-30 disabled:hover:text-adm-muted"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
