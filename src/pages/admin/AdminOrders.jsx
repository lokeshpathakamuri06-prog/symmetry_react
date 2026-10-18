import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Search, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderPanel from '../../components/admin/orders/OrderPanel';
import { ORDER_STATUSES, STATUS, inr, dateTime, itemCount } from '../../components/admin/orders/orderMeta';
import { StatusPill, PaymentPill } from '../../components/admin/orders/OrderPills';
import { inbox, orders as ordersApi } from '../../services/adminApi';

const Stat = ({ label, value, hint }) => (
  <div className="adm-card px-5 py-4">
    <p className="text-[12px] text-adm-muted font-medium">{label}</p>
    <p className="mt-1 text-[24px] font-semibold tracking-tight text-adm-fg tabular-nums">{value}</p>
    {hint && <p className="text-[11px] text-adm-muted">{hint}</p>}
  </div>
);

export const AdminOrders = () => {
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({ items: null, counts: {} });
  const [opened, setOpened] = useState(null); // fetched when the open order isn't in the list
  const [error, setError] = useState('');
  const selectedId = params.get('open');

  const load = useCallback(() => {
    inbox('orders')
      .list({ status: filter, q })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [filter, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  // Date range applies to the list on screen and to the export
  const items = useMemo(() => {
    if (!data.items) return null;
    return data.items.filter((o) => {
      const day = o.createdAt.slice(0, 10);
      return (!from || day >= from) && (!to || day <= to);
    });
  }, [data.items, from, to]);

  // The open order is kept in the URL (?open=id), so it survives reloads and can be linked to
  const inList = selectedId ? data.items?.find((o) => o.id === selectedId) : null;
  useEffect(() => {
    if (selectedId && data.items && !inList) {
      ordersApi.get(selectedId).then(setOpened).catch(() => setOpened(null));
    }
  }, [selectedId, data.items, inList]);
  const selected = selectedId ? inList || (opened?.id === selectedId ? opened : null) : null;

  const open = (id) => setParams(id ? { open: id } : {}, { replace: true });

  const total = Object.values(data.counts || {}).reduce((a, b) => a + b, 0);
  const all = data.items || [];
  const unpaid = all.filter((o) => o.status !== 'cancelled' && ['unpaid', 'pending'].includes(o.paymentStatus)).length;
  const toShip = (data.counts?.confirmed || 0) + (data.counts?.processing || 0);
  const value = (items || []).filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <AdminLayout title="Orders" subtitle="View, update, invoice, deliver and export shop orders">
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="New orders" value={data.counts?.pending || 0} hint="waiting to be confirmed" />
          <Stat label="To pack and ship" value={toShip} hint="confirmed or packing" />
          <Stat label="Awaiting payment" value={unpaid} hint="in the current list" />
          <Stat label="Order value" value={inr(value)} hint="current list, excluding cancelled" />
        </div>

        {/* Filters */}
        <div className="adm-card p-3 flex flex-col gap-3">
          <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
            {['all', ...ORDER_STATUSES].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
                  filter === st ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'
                }`}
              >
                {st === 'all' ? 'All' : STATUS[st].label} <span className="text-adm-muted">{st === 'all' ? total : data.counts?.[st] || 0}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-adm-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order no., name, email" className="pl-9 pr-3 py-2 rounded-xl adm-input text-[13px] w-56" />
            </div>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="px-3 py-2 rounded-xl adm-input text-[13px]" />
            <span className="text-adm-muted text-[12px]">to</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="px-3 py-2 rounded-xl adm-input text-[13px]" />
            <a
              href={ordersApi.exportUrl({ status: filter, q, from, to })}
              className="px-4 py-2 rounded-xl bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent text-[13px] font-semibold inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </a>
          </div>
        </div>

        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* List */}
          <div className={`adm-card overflow-hidden ${selected ? 'xl:col-span-7' : 'xl:col-span-12'}`}>
            {items === null ? (
              <p className="p-12 text-center text-adm-muted text-[13px]">Loading…</p>
            ) : items.length === 0 ? (
              <div className="p-14 text-center">
                <ShoppingBag className="w-8 h-8 mx-auto text-adm-muted" strokeWidth={1.5} />
                <p className="mt-3 text-adm-muted text-[13px]">No orders here yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-adm-muted border-b border-adm-border">
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold text-right">Total</th>
                      <th className="px-4 py-3 font-semibold">Payment</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-adm-border">
                    {items.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => open(o.id)}
                        className={`cursor-pointer transition-colors ${selected?.id === o.id ? 'bg-adm-accent/[0.08]' : 'hover:bg-adm-fg/[0.03]'}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono font-semibold text-adm-fg whitespace-nowrap">{o.orderNumber}</p>
                          <p className="text-[11px] text-adm-muted whitespace-nowrap">{dateTime(o.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3 min-w-[160px]">
                          <p className="text-adm-fg font-medium">{o.customerName}</p>
                          <p className="text-[11px] text-adm-muted">
                            {o.customer?.city || '—'} · {itemCount(o)} {itemCount(o) === 1 ? 'item' : 'items'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-adm-fg tabular-nums">{inr(o.total)}</td>
                        <td className="px-4 py-3"><PaymentPill status={o.paymentStatus} /></td>
                        <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail */}
          {selected && (
            <div className="xl:col-span-5 adm-card p-5 xl:sticky xl:top-24 xl:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
              <OrderPanel
                key={selected.id}
                order={selected}
                onChanged={(o) => {
                  setOpened(o);
                  load();
                }}
                onDeleted={() => {
                  open(null);
                  load();
                }}
                onClose={() => open(null)}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
