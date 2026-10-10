import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Images, Plus, Search, Trash2, X } from 'lucide-react';
import { media } from '../../../services/adminApi';
import ImageUploader from '../ImageUploader';
import { cloudinaryUrl } from '../../../lib/images';

// Form inputs for the admin content editors. Every field gets {field, value, onChange, error}.

const inputClass = (error) =>
  `w-full px-3 py-2 rounded-xl adm-input text-[13px] ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}`;

const Label = ({ field }) => (
  <label className="block text-[12px] font-medium text-adm-fg/80 mb-1">
    {field.label}
    {field.required && <span className="text-red-500"> *</span>}
    {field.help && <span className="font-normal text-adm-muted"> · {field.help}</span>}
  </label>
);

const IconButton = ({ title, onClick, children, danger }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded-lg text-adm-muted hover:bg-adm-fg/5 ${danger ? 'hover:text-red-600' : 'hover:text-adm-fg'}`}
  >
    {children}
  </button>
);

const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// --- simple inputs ---------------------------------------------------------------------------

const TextInput = ({ field, value, onChange, error }) => (
  <input
    type="text"
    value={value ?? ''}
    placeholder={field.placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={inputClass(error)}
  />
);

const TextAreaInput = ({ field, value, onChange, error }) => (
  <textarea
    rows={field.rows || 3}
    value={value ?? ''}
    placeholder={field.placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={inputClass(error)}
  />
);

const NumberInput = ({ field, value, onChange, error }) => (
  <input
    type="number"
    step={field.step || (field.type === 'money' ? 1 : 'any')}
    min={field.min ?? 0}
    max={field.max}
    value={value ?? ''}
    placeholder={field.placeholder}
    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    className={inputClass(error)}
  />
);

const CheckboxInput = ({ field, value, onChange }) => (
  <label className="inline-flex items-center gap-2 text-[13px] text-adm-fg/90 cursor-pointer select-none py-2">
    <input
      type="checkbox"
      checked={Boolean(value)}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-[rgb(var(--adm-accent))]"
    />
    {field.checkboxLabel || field.label}
  </label>
);

const SelectInput = ({ field, value, onChange, error, options }) => (
  <select value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} className={inputClass(error)}>
    {!field.required && <option value="">{field.emptyLabel || '— None —'}</option>}
    {field.required && !value && <option value="">Choose…</option>}
    {(options || field.options || []).map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const StatusInput = ({ value, onChange }) => (
  <div className="inline-flex p-1 rounded-xl bg-adm-fg/5">
    {[['published', 'Published'], ['draft', 'Draft']].map(([v, label]) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v)}
        className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
          value === v ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

// One item per line, e.g. materials, details, tags (the editor remounts per record, so local text is safe)
const ListInput = ({ field, value, onChange, error }) => {
  const [textValue, setTextValue] = useState((value || []).join('\n'));
  return (
    <textarea
      rows={field.rows || 4}
      value={textValue}
      placeholder={field.placeholder || 'One per line'}
      onChange={(e) => {
        setTextValue(e.target.value);
        onChange(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean));
      }}
      className={inputClass(error)}
    />
  );
};

// Paragraphs separated by a blank line (journal content)
const ParagraphsInput = ({ field, value, onChange, error }) => {
  const [textValue, setTextValue] = useState((value || []).join('\n\n'));
  return (
    <textarea
      rows={field.rows || 12}
      value={textValue}
      placeholder="Write paragraphs separated by an empty line"
      onChange={(e) => {
        setTextValue(e.target.value);
        onChange(e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean));
      }}
      className={`${inputClass(error)} leading-relaxed`}
    />
  );
};

// --- structured lists ------------------------------------------------------------------------

const RowsInput = ({ value, onChange, columns, addLabel, error }) => {
  const rows = value || [];
  const update = (i, key, v) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  return (
    <div className={`space-y-2 ${error ? 'p-2 rounded-xl ring-2 ring-red-500/30' : ''}`}>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          {columns.map((c) =>
            c.type === 'color' ? (
              <input
                key={c.key}
                type="color"
                value={row[c.key] || '#000000'}
                onChange={(e) => update(i, c.key, e.target.value.toUpperCase())}
                title={c.label}
                className="w-9 h-9 rounded-lg border border-adm-border bg-transparent cursor-pointer shrink-0"
              />
            ) : (
              <input
                key={c.key}
                type="text"
                value={row[c.key] || ''}
                placeholder={c.label}
                onChange={(e) => update(i, c.key, e.target.value)}
                className={`${inputClass(false)} ${c.grow ? 'flex-[2]' : 'flex-1'}`}
              />
            )
          )}
          <IconButton title="Move up" onClick={() => i > 0 && onChange(move(rows, i, i - 1))}><ArrowUp className="w-3.5 h-3.5" /></IconButton>
          <IconButton title="Remove" danger onClick={() => onChange(rows.filter((_, j) => j !== i))}><Trash2 className="w-3.5 h-3.5" /></IconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, Object.fromEntries(columns.map((c) => [c.key, c.type === 'color' ? '#D1DCDE' : '']))])}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-adm-accent hover:underline"
      >
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  );
};

// --- images ------------------------------------------------------------------------------------

export const MediaPicker = ({ onPick, onClose }) => {
  const [q, setQ] = useState('');
  const [items, setItems] = useState(null);
  const [tab, setTab] = useState('library');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => media.list({ q }).then((r) => setItems(r.items)).catch(() => setItems([])), 200);
    return () => clearTimeout(t);
  }, [q, reload]);
  return (
    <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="adm-card w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <div className="p-4 border-b border-adm-border flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 shrink-0">
            {[['library', 'Library'], ['upload', 'Upload new']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setTab(v)} className={`px-3 py-1 rounded-lg text-[12px] font-medium ${tab === v ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted'}`}>{l}</button>
            ))}
          </div>
          {tab === 'library' && (
            <>
              <Search className="w-4 h-4 text-adm-muted" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by file name, alt text or tag…" className="flex-1 bg-transparent outline-none text-[13px]" />
            </>
          )}
          <span className="flex-1" />
          <IconButton title="Close" onClick={onClose}><X className="w-4 h-4" /></IconButton>
        </div>
        {tab === 'upload' && (
          <div className="p-4 overflow-y-auto">
            <ImageUploader compact onUploaded={() => setReload((n) => n + 1)} />
            <p className="mt-3 text-[12px] text-adm-muted">
              When the uploads finish, <button type="button" onClick={() => setTab('library')} className="text-adm-accent hover:underline">go back to the Library</button> and click a photo to use it. New photos appear first.
            </p>
          </div>
        )}
        <div className={`p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-5 gap-3 ${tab === 'upload' ? 'hidden' : ''}`}>
          {items === null && <p className="col-span-full text-center text-adm-muted text-[13px] py-10">Loading…</p>}
          {items?.length === 0 && <p className="col-span-full text-center text-adm-muted text-[13px] py-10">No images found.</p>}
          {items?.map((m) => (
            <button key={m.id} type="button" onClick={() => onPick(m.url)} className="group text-left">
              <div className="aspect-square rounded-xl overflow-hidden bg-adm-surface2 ring-adm-accent group-hover:ring-2">
                <img src={cloudinaryUrl(m.url, { width: 300 })} alt={m.altText || ''} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="mt-1 text-[10px] text-adm-muted truncate">{m.filename}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddImage = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [picking, setPicking] = useState(false);
  const add = () => {
    if (url.trim()) {
      onAdd(url.trim());
      setUrl('');
    }
  };
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={url}
        placeholder="Paste image URL (https://…)"
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        className={inputClass(false)}
      />
      <button type="button" onClick={add} className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-[12px]">
        <ImagePlus className="w-3.5 h-3.5" /> Add
      </button>
      <button type="button" onClick={() => setPicking(true)} className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-[12px]">
        <Images className="w-3.5 h-3.5" /> Library
      </button>
      {picking && <MediaPicker onClose={() => setPicking(false)} onPick={(u) => { onAdd(u); setPicking(false); }} />}
    </div>
  );
};

const Thumb = ({ url, children }) => (
  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-adm-surface2 border border-adm-border shrink-0">
    <img src={cloudinaryUrl(url, { width: 200 })} alt="" className="w-full h-full object-cover" />
    {children}
  </div>
);

const ImagesInput = ({ value, onChange, error }) => {
  const urls = value || [];
  return (
    <div className={`space-y-2 ${error ? 'p-2 rounded-xl ring-2 ring-red-500/30' : ''}`}>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <Thumb key={u + i} url={u}>
              {i === 0 && <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">Main</span>}
              <div className="absolute bottom-1 right-1 flex gap-0.5 bg-white/90 rounded-lg">
                <IconButton title="Move left" onClick={() => i > 0 && onChange(move(urls, i, i - 1))}><ArrowUp className="w-3 h-3 -rotate-90" /></IconButton>
                <IconButton title="Move right" onClick={() => i < urls.length - 1 && onChange(move(urls, i, i + 1))}><ArrowDown className="w-3 h-3 -rotate-90" /></IconButton>
                <IconButton title="Remove" danger onClick={() => onChange(urls.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3" /></IconButton>
              </div>
            </Thumb>
          ))}
        </div>
      )}
      <AddImage onAdd={(u) => !urls.includes(u) && onChange([...urls, u])} />
    </div>
  );
};

const ImageInput = ({ value, onChange, error }) => (
  <div className={`space-y-2 ${error ? 'p-2 rounded-xl ring-2 ring-red-500/30' : ''}`}>
    {value && (
      <Thumb url={value}>
        <div className="absolute bottom-1 right-1 bg-white/90 rounded-lg">
          <IconButton title="Remove" danger onClick={() => onChange(null)}><Trash2 className="w-3 h-3" /></IconButton>
        </div>
      </Thumb>
    )}
    <AddImage onAdd={onChange} />
  </div>
);

const RelatedImagesInput = ({ value, onChange, error }) => {
  const rows = value || [];
  return (
    <div className={`space-y-2 ${error ? 'p-2 rounded-xl ring-2 ring-red-500/30' : ''}`}>
      {rows.map((r, i) => (
        <div key={r.url + i} className="flex items-center gap-3">
          <Thumb url={r.url} />
          <input
            type="text"
            value={r.caption || ''}
            placeholder="Caption"
            onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
            className={inputClass(false)}
          />
          <IconButton title="Remove" danger onClick={() => onChange(rows.filter((_, j) => j !== i))}><Trash2 className="w-3.5 h-3.5" /></IconButton>
        </div>
      ))}
      <AddImage onAdd={(u) => onChange([...rows, { url: u, caption: '' }])} />
    </div>
  );
};

// --- dispatcher --------------------------------------------------------------------------------

const RENDERERS = {
  text: TextInput,
  textarea: TextAreaInput,
  number: NumberInput,
  money: NumberInput,
  checkbox: CheckboxInput,
  select: SelectInput,
  status: StatusInput,
  list: ListInput,
  paragraphs: ParagraphsInput,
  images: ImagesInput,
  image: ImageInput,
  related: RelatedImagesInput,
  colors: (props) => (
    <RowsInput {...props} addLabel="Add colour" columns={[{ key: 'name', label: 'Name', grow: true }, { key: 'hex', label: 'Colour', type: 'color' }, { key: 'border', label: 'Border', type: 'color' }]} />
  ),
  stats: (props) => (
    <RowsInput {...props} addLabel="Add stat" columns={[{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value', grow: true }]} />
  ),
};

export const FormField = ({ field, value, onChange, error, options }) => {
  const Renderer = RENDERERS[field.type] || TextInput;
  return (
    <div className={field.span === 'half' ? '' : 'sm:col-span-2'} data-field={field.key}>
      {field.type !== 'checkbox' && <Label field={field} />}
      <Renderer field={field} value={value} onChange={onChange} error={error} options={options} />
      {error && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
