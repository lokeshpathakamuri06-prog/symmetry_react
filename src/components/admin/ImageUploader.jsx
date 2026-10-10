import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, RotateCcw, UploadCloud, XCircle } from 'lucide-react';
import { uploadImage } from '../../lib/uploadImage';

const FOLDERS = [
  ['products', 'Products'],
  ['projects', 'Projects'],
  ['banners', 'Banners'],
  ['journal', 'Journal'],
  ['team', 'Team'],
  ['categories', 'Categories'],
  ['misc', 'Other'],
];
const PARALLEL = 3;
const STAGE_LABEL = { queued: 'Waiting…', preparing: 'Preparing…', uploading: 'Uploading', saving: 'Saving…' };

let nextId = 0;

// Drop zone + upload queue. onUploaded(record) is called for each finished image.
export const ImageUploader = ({ onUploaded, defaultFolder = 'products', compact = false }) => {
  const [folder, setFolder] = useState(defaultFolder);
  const [queue, setQueue] = useState([]); // {id, file, status, progress, error, resized}
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const running = useRef(0);
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const update = (id, changes) => setQueue((q) => q.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const startNext = useCallback(() => {
    while (running.current < PARALLEL) {
      const item = queueRef.current.find((i) => i.status === 'queued');
      if (!item) return;
      running.current += 1;
      queueRef.current = queueRef.current.map((i) => (i.id === item.id ? { ...i, status: 'preparing' } : i));
      update(item.id, { status: 'preparing', error: null });
      uploadImage(item.file, {
        folder: item.folder,
        onStage: (stage) => update(item.id, { status: stage }),
        onProgress: (p) => update(item.id, { progress: p }),
      })
        .then(({ record, resized }) => {
          update(item.id, { status: 'done', progress: 1, resized });
          onUploaded?.(record);
        })
        .catch((err) => update(item.id, { status: 'error', error: err.message || 'Upload failed' }))
        .finally(() => {
          running.current -= 1;
          setTimeout(startNext, 0);
        });
    }
  }, [onUploaded]);

  useEffect(() => {
    startNext();
  }, [queue.length, startNext]);

  const addFiles = (files) => {
    const items = Array.from(files || []).map((file) => ({
      id: ++nextId, file, folder, status: 'queued', progress: 0, error: null, resized: false,
    }));
    if (items.length) setQueue((q) => [...q, ...items]);
  };

  const retry = (id) => {
    update(id, { status: 'queued', progress: 0, error: null });
    setTimeout(startNext, 0);
  };

  const active = queue.filter((i) => i.status !== 'done' && i.status !== 'error').length;
  const done = queue.filter((i) => i.status === 'done').length;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed transition-colors text-center ${compact ? 'p-5' : 'p-8'} ${dragging ? 'border-adm-accent bg-adm-accent/5' : 'border-adm-border'}`}
      >
        <UploadCloud className="w-8 h-8 mx-auto text-adm-accent mb-2" />
        <p className="text-[13px] text-adm-fg font-medium">Drag photos here, or</p>
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <button type="button" onClick={() => inputRef.current?.click()} className="px-4 py-2 rounded-xl bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent text-[13px] font-medium">
            Choose photos
          </button>
          <label className="text-[12px] text-adm-muted flex items-center gap-1.5">
            into
            <select value={folder} onChange={(e) => setFolder(e.target.value)} className="px-2 py-1.5 rounded-lg adm-input text-[12px]">
              {FOLDERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <p className="mt-3 text-[11px] text-adm-muted">JPG, PNG, WebP, AVIF or HEIC. Large photos are resized to 3000 px automatically.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif"
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {queue.length > 0 && (
        <div className="adm-card p-3 space-y-2">
          <p className="text-[12px] text-adm-muted px-1">
            {active > 0 ? `Uploading ${active} photo(s)… ` : ''}{done} of {queue.length} done
            {done > 0 && active === 0 && <button type="button" onClick={() => setQueue((q) => q.filter((i) => i.status !== 'done'))} className="ml-2 text-adm-accent hover:underline">Clear finished</button>}
          </p>
          <ul className="space-y-1.5 max-h-64 overflow-y-auto" data-lenis-prevent>
            {queue.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-[12px] px-1">
                <span className="w-4 shrink-0">
                  {item.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {item.status === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
                  {!['done', 'error'].includes(item.status) && <Loader2 className="w-4 h-4 animate-spin text-adm-accent" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-adm-fg">{item.file.name}</span>
                  {item.status === 'error' ? (
                    <span className="block text-red-600 dark:text-red-400">{item.error}</span>
                  ) : item.status === 'done' ? (
                    <span className="block text-adm-muted">Uploaded{item.resized ? ' (resized to 3000 px)' : ''}</span>
                  ) : (
                    <span className="block h-1.5 mt-1 rounded-full bg-adm-fg/10 overflow-hidden">
                      <span className="block h-full bg-adm-accent transition-all" style={{ width: `${Math.round((item.progress || 0) * 100)}%` }} />
                    </span>
                  )}
                </span>
                <span className="text-adm-muted shrink-0 w-16 text-right">
                  {item.status === 'uploading' ? `${Math.round((item.progress || 0) * 100)}%` : STAGE_LABEL[item.status] || ''}
                </span>
                {item.status === 'error' && (
                  <button type="button" title="Retry" onClick={() => retry(item.id)} className="p-1 rounded text-adm-muted hover:text-adm-fg">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
