import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Search, Zap } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { inventory } from '../../services/adminApi';
import { AVAILABILITY_OPTIONS } from './contentOptions';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in_stock', label: 'In stock' },
  { id: 'low', label: 'Low (≤ 3)' },
  { id: 'out_of_stock', label: 'Out of stock' },
  { id: 'made_to_order', label: 'Made to order' },
];

const BADGE = {
  in_stock: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  made_to_order: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  out_of_stock: 'bg-red-500/12 text-red-700 dark:text-red-300',
};

const num = (v) => (v === '' || v == null ? null : Number(v));

/** One product row: edits save on change (selects) or when leaving the field (numbers) */
const Row = ({ item, selected, onSelect, onSaved, onError }) => {
  const [draft, setDraft] = useState({ stockQuantity: item.stockQuantity ?? '', price: item.price, originalPrice: item.originalPrice ?? '' });
  const [state, setState] = useState(''); // '' | saving | saved

  const save = async (changes) => {
    setState('saving');
    try {
      onSaved(await inventory.update(item.id, changes));
      setState('saved');
      setTimeout(() => setState(''), 1500);
    } catch (err) {
      setState('');
      onError(`${item.name}: ${err.message}`);
    }
  };

  const commit = (key) => {
    const value = num(draft[key]);
    const current = item[key] ?? null;
    if (value === current) return;
    if (key === 'price' && (value == null || value < 0)) {
      setDraft((d) => ({ ...d, price: item.price }));
      return;
    }
    save({ [key]: value });
  };

  const input = 'w-full px-2.5 py-1.5 rounded-lg adm-input text-[13px] text-right tabular-nums';

  return (
    <tr className={selected ? 'bg-adm-accent/[0.06]' : ''}>
      <td className="pl-4 pr-2 py-2.5">
        <input type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked)} aria-label={`Select ${item.name}`} className="w-4 h-4 accent-[rgb(var(--adm-accent))]" />
      </td>
      <td className="px-2 py-2.5 min-w-[220px]">
        <Link to="/admin/products" className="font-medium text-adm-fg hover:text-adm-accent">{item.name}</Link>
        <p className="text-[11px] text-adm-muted">
          {item.id}
          {item.status !== 'published' && <span className="ml-1.5 px-1.5 rounded bg-adm-fg/5">{item.status}</span>}
        </p>
      </td>
      <td className="px-2 py-2.5">
        <select
          value={item.availability}
          onChange={(e) => save({ availability: e.target.value })}
          className="px-2.5 py-1.5 rounded-lg adm-input text-[13px]"
          aria-label="Availability"
        >
          {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </td>
      <td className="px-2 py-2.5 w-28">
        <input type="number" min={0} step={1} value={draft.stockQuantity} placeholder="—" onChange={(e) => setDraft({ ...draft, stockQuantity: e.target.value })} onBlur={() => commit('stockQuantity')} className={input} aria-label="Pieces in stock" />
      </td>
      <td className="px-2 py-2.5 w-36">
        <input type="number" min={0} step={1} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} onBlur={() => commit('price')} className={input} aria-label="Price" />
      </td>
      <td className="px-2 py-2.5 w-36">
        <input type="number" min={0} step={1} value={draft.originalPrice} placeholder="—" onChange={(e) => setDraft({ ...draft, originalPrice: e.target.value })} onBlur={() => commit('originalPrice')} className={input} aria-label="M.R.P." />
      </td>
      <td className="px-4 py-2.5 w-36">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${BADGE[item.effective]}`}>
          {AVAILABILITY_OPTIONS.find((o) => o.value === item.effective)?.label}
        </span>
        <span className="ml-2 text-[11px] text-adm-muted inline-flex items-center gap-1 w-14">
          {state === 'saving' && 'Saving…'}
          {state === 'saved' && <><Check className="w-3 h-3 text-emerald-600" /> Saved</>}
        </span>
      </td>
    </tr>
  );
};

/** Inventory: stock counts, availability and prices for every product, edited in place */
export const AdminInventory = () => {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState('');

  const load = () => inventory.list().then((r) => setItems(r.items)).catch((err) => setError(err.message));
  useEffect(() => {
    load();
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (items || []).filter((i) => {
      if (s && !`${i.name} ${i.id}`.toLowerCase().includes(s)) return false;
      if (filter === 'low') return i.stockQuantity != null && i.stockQuantity <= 3;
      return filter === 'all' || i.effective === filter;
    });
  }, [items, filter, q]);

  const counts = useMemo(() => {
    const c = { all: items?.length || 0, low: 0 };
    (items || []).forEach((i) => {
      c[i.effective] = (c[i.effective] || 0) + 1;
      if (i.stockQuantity != null && i.stockQuantity <= 3) c.low += 1;
    });
    return c;
  }, [items]);

  const onSaved = (u) => setItems((list) => list.map((i) => (i.id === u.id ? { ...i, ...u } : i)));

  const bulk = async (availability) => {
    try {
      await inventory.bulk([...selected], availability);
      setSelected(new Set());
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const allShownSelected = shown.length > 0 && shown.every((i) => selected.has(i.id));

  return (
    <AdminLayout title="Inventory" subtitle="Stock, availability and prices for every product">
      <div className="space-y-5">
        <p className="adm-card px-4 py-3 text-[13px] text-adm-fg/80 flex items-start gap-2">
          <Zap className="w-4 h-4 text-adm-accent shrink-0 mt-0.5" />
          Changes here reach the shop immediately, without publishing. Leave “Pieces” empty if you don’t count stock; at 0 an in-stock product shows as out of stock. Orders take pieces from the count and cancelling an order puts them back.
        </p>

        <div className="adm-card p-3 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap ${filter === f.id ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'}`}
              >
                {f.label} <span className="text-adm-muted">{counts[f.id] || 0}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-64" />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="adm-card px-4 py-3 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="font-semibold text-adm-fg">{selected.size} selected</span>
            <span className="text-adm-muted">Mark as</span>
            {AVAILABILITY_OPTIONS.map((o) => (
              <button key={o.value} onClick={() => bulk(o.value)} className="px-3 py-1.5 rounded-lg bg-adm-fg/5 hover:bg-adm-accent hover:text-adm-on-accent font-medium">
                {o.label}
              </button>
            ))}
            <button onClick={() => setSelected(new Set())} className="ml-auto text-adm-muted hover:text-adm-fg">Clear</button>
          </div>
        )}

        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</div>}

        <div className="adm-card overflow-x-auto">
          {items === null ? (
            <p className="p-12 text-center text-adm-muted text-[13px]">Loading…</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-adm-muted border-b border-adm-border">
                  <th className="pl-4 pr-2 py-3">
                    <input
                      type="checkbox"
                      checked={allShownSelected}
                      onChange={(e) => setSelected(e.target.checked ? new Set(shown.map((i) => i.id)) : new Set())}
                      aria-label="Select all shown"
                      className="w-4 h-4 accent-[rgb(var(--adm-accent))]"
                    />
                  </th>
                  <th className="px-2 py-3 font-semibold">Product</th>
                  <th className="px-2 py-3 font-semibold">Availability</th>
                  <th className="px-2 py-3 font-semibold text-right">Pieces</th>
                  <th className="px-2 py-3 font-semibold text-right">Price (₹)</th>
                  <th className="px-2 py-3 font-semibold text-right">M.R.P. (₹)</th>
                  <th className="px-4 py-3 font-semibold">On the shop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {shown.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onSelect={(on) => setSelected((s) => {
                      const next = new Set(s);
                      if (on) next.add(item.id);
                      else next.delete(item.id);
                      return next;
                    })}
                    onSaved={onSaved}
                    onError={setError}
                  />
                ))}
              </tbody>
            </table>
          )}
          {items && shown.length === 0 && <p className="p-10 text-center text-adm-muted text-[13px]">No products match.</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
