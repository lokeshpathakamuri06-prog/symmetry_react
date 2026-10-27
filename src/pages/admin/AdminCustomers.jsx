import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Contact, Mail, MapPin, Phone, Search, ShoppingCart, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { inr, dateTime, shortDate } from '../../components/admin/orders/orderMeta';
import { StatusPill, PaymentPill } from '../../components/admin/orders/OrderPills';
import { customers as customersApi } from '../../services/adminApi';

const FILTERS = [
  ['all', 'All'],
  ['active', 'Active'],
  ['disabled', 'Switched off'],
];

const Label = ({ children }) => <p className="text-[11px] font-semibold uppercase tracking-wider text-adm-muted mb-2">{children}</p>;

const AccountPill = ({ c }) =>
  c.isActive ? (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Active</span>
  ) : (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-700 dark:text-red-400">Switched off</span>
  );

/** One customer: contact details, saved address, cart, orders, and switching the account off / on */
const CustomerPanel = ({ id, onChanged, onClose }) => {
  const [c, setC] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    customersApi.get(id).then((d) => live && setC(d)).catch((err) => live && setError(err.message));
    return () => { live = false; };
  }, [id]);

  const toggle = async () => {
    if (c.isActive && !window.confirm(`Switch off ${c.email}? They are signed out everywhere and can't sign in or buy until you switch the account back on.`)) return;
    setBusy(true);
    setError('');
    try {
      const updated = await customersApi.update(c.id, { isActive: !c.isActive });
      setC(updated);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!c) return <p className="text-[13px] text-adm-muted">{error || 'Loading…'}</p>;
  const a = c.address || {};
  const address = [a.address, a.city, a.state, a.pincode, a.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold text-adm-fg truncate">{c.fullName || c.email}</h2>
          <p className="text-[12px] text-adm-muted">Joined {shortDate(c.createdAt)} · last sign-in {c.lastLoginAt ? dateTime(c.lastLoginAt) : 'never'}</p>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && <p role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</p>}

      <div className="rounded-xl border border-adm-border p-4 space-y-1.5 text-[13px] text-adm-fg">
        <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-adm-muted" /> <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
          {!c.verified && <span className="text-[11px] text-amber-600 dark:text-amber-400">(email not confirmed)</span>}</p>
        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-adm-muted" /> {c.phone ? <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a> : '—'}</p>
        <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-adm-muted mt-0.5 shrink-0" /> {address || 'No saved address'}</p>
        <p className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-adm-muted" /> {c.cartItems ? `${c.cartItems} in cart now` : 'Cart empty'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-adm-border p-3">
          <p className="text-[11px] text-adm-muted">Orders</p>
          <p className="text-[20px] font-semibold text-adm-fg tabular-nums">{c.orderCount}</p>
        </div>
        <div className="rounded-xl border border-adm-border p-3">
          <p className="text-[11px] text-adm-muted">Spent (paid or COD, not cancelled)</p>
          <p className="text-[20px] font-semibold text-adm-fg tabular-nums">{inr(c.totalSpent)}</p>
        </div>
      </div>

      <div>
        <Label>Orders</Label>
        {c.orders.length === 0 ? (
          <p className="text-[13px] text-adm-muted">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-adm-border rounded-xl border border-adm-border">
            {c.orders.map((o) => (
              <li key={o.id}>
                <Link to={`/admin/orders?open=${o.id}`} className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-adm-fg/[0.03]">
                  <span className="min-w-0">
                    <span className="block font-mono text-[12.5px] font-semibold text-adm-fg">{o.orderNumber}</span>
                    <span className="block text-[11px] text-adm-muted">{dateTime(o.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[13px] font-semibold text-adm-fg tabular-nums">{inr(o.total)}</span>
                    <PaymentPill status={o.paymentStatus} orderStatus={o.status} className="hidden sm:inline-flex" />
                    <StatusPill status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-adm-border p-4">
        <Label>Account</Label>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12.5px] text-adm-muted">
            {c.isActive
              ? 'Switching the account off signs the customer out everywhere and stops them signing in or buying. Their orders are kept.'
              : 'This account is switched off: the customer can’t sign in or buy.'}
          </p>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold disabled:opacity-60 ${
              c.isActive ? 'bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/15' : 'bg-adm-accent text-adm-on-accent hover:bg-adm-accent-hover'
            }`}
          >
            {c.isActive ? 'Switch off' : 'Switch on'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminCustomers = () => {
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [data, setData] = useState({ items: null, counts: {} });
  const [error, setError] = useState('');
  const selectedId = params.get('open');

  const load = useCallback(() => {
    customersApi.list({ q, status: filter }).then(setData).catch((err) => setError(err.message));
  }, [q, filter]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const open = (id) => setParams(id ? { open: id } : {}, { replace: true });
  const items = data.items;

  return (
    <AdminLayout title="Customers" subtitle="People who signed up on the website, and their orders">
      <div className="space-y-5">
        <div className="adm-card p-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
            {FILTERS.map(([key, text]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
                  filter === key ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'
                }`}
              >
                {text} <span className="text-adm-muted">{data.counts?.[key] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone, city" aria-label="Search customers" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-full sm:w-64" />
          </div>
        </div>

        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className={`adm-card overflow-hidden ${selectedId ? 'xl:col-span-7' : 'xl:col-span-12'}`}>
            {items === null ? (
              <p className="p-12 text-center text-adm-muted text-[13px]">Loading…</p>
            ) : items.length === 0 ? (
              <div className="p-14 text-center">
                <Contact className="w-8 h-8 mx-auto text-adm-muted" strokeWidth={1.5} />
                <p className="mt-3 text-adm-muted text-[13px]">{q || filter !== 'all' ? 'No customers match.' : 'No sign-ups yet.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-adm-muted border-b border-adm-border">
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                      <th className="px-4 py-3 font-semibold text-right">Orders</th>
                      <th className="px-4 py-3 font-semibold text-right">Spent</th>
                      <th className="px-4 py-3 font-semibold">Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-adm-border">
                    {items.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => open(c.id)}
                        className={`cursor-pointer transition-colors ${selectedId === c.id ? 'bg-adm-accent/[0.08]' : 'hover:bg-adm-fg/[0.03]'}`}
                      >
                        <td className="px-4 py-3 min-w-[180px]">
                          <p className="text-adm-fg font-medium">{c.fullName || '—'}</p>
                          <p className="text-[11px] text-adm-muted">{c.email}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-adm-fg">{c.phone || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-adm-muted">{shortDate(c.createdAt)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-adm-fg">{c.orderCount}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold text-adm-fg">{inr(c.totalSpent)}</td>
                        <td className="px-4 py-3"><AccountPill c={c} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedId && (
            <div className="xl:col-span-5 adm-card p-5 xl:sticky xl:top-24 xl:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
              <CustomerPanel key={selectedId} id={selectedId} onChanged={load} onClose={() => open(null)} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
