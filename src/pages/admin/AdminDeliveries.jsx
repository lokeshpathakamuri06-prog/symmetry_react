import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, MapPin, Truck, ExternalLink, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { inbox, orders as ordersApi } from '../../services/adminApi';
import { NEXT_ACTION, nextStatus, inr, shortDate } from '../../components/admin/orders/orderMeta';
import { PaymentPill } from '../../components/admin/orders/OrderPills';

// Board columns: each groups one or more order statuses
const COLUMNS = [
  { title: 'To pack', statuses: ['confirmed', 'processing'], hint: 'Confirmed orders to prepare' },
  { title: 'Shipped', statuses: ['shipped'], hint: 'On the way' },
  { title: 'Out for delivery', statuses: ['out_for_delivery'], hint: 'Arriving today' },
  { title: 'Delivered', statuses: ['delivered'], hint: 'Last 14 days' },
];

const today = () => new Date().toISOString().slice(0, 10);

const Card = ({ order, onAdvance, busy }) => {
  const late = order.expectedDelivery && order.expectedDelivery < today() && order.status !== 'delivered';
  const next = nextStatus(order.status);
  return (
    <li className="adm-card p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/admin/orders?open=${order.id}`} className="font-mono font-semibold text-adm-fg hover:text-adm-accent text-[12px] whitespace-nowrap">
          {order.orderNumber}
        </Link>
        <span className="text-[13px] font-semibold text-adm-fg tabular-nums">{inr(order.total)}</span>
      </div>
      <div className="text-[12px] text-adm-fg/80">
        <p className="font-medium">{order.customerName}</p>
        <p className="flex items-center gap-1.5 text-adm-muted">
          <MapPin className="w-3.5 h-3.5" /> {[order.customer?.city, order.customer?.pincode].filter(Boolean).join(' ')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <PaymentPill status={order.paymentStatus} />
        {order.status === 'processing' && <span className="px-2 py-0.5 rounded-full bg-violet-500/12 text-violet-700 dark:text-violet-300 font-semibold">Packing</span>}
      </div>
      {(order.courier || order.trackingNumber) && (
        <p className="text-[12px] text-adm-muted flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> {[order.courier, order.trackingNumber].filter(Boolean).join(' · ')}
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-adm-accent" aria-label="Open tracking">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </p>
      )}
      {order.status === 'delivered' ? (
        <p className="text-[12px] text-emerald-700 dark:text-emerald-300">Delivered {shortDate(order.deliveredAt)}</p>
      ) : (
        <p className={`text-[12px] flex items-center gap-1.5 ${late ? 'text-red-600 dark:text-red-300 font-semibold' : 'text-adm-muted'}`}>
          {late ? <AlertTriangle className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
          {order.expectedDelivery ? `${late ? 'Late · was due' : 'Due'} ${shortDate(order.expectedDelivery)}` : 'No delivery date set'}
        </p>
      )}
      {next && (
        <button
          onClick={() => onAdvance(order, next)}
          disabled={busy}
          className="w-full py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-accent hover:text-adm-on-accent text-adm-fg text-[12px] font-semibold transition-colors disabled:opacity-50"
        >
          {NEXT_ACTION[order.status]}
        </button>
      )}
    </li>
  );
};

/** Deliveries board: orders from packing to delivered, moved along with one click */
export const AdminDeliveries = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Delivered column shows the last 14 days (measured when the list loads)
  const [since, setSince] = useState(0);
  const load = useCallback(() => {
    inbox('orders')
      .list({})
      .then((r) => {
        setSince(Date.now() - 14 * 86400000);
        setItems(r.items);
      })
      .catch((err) => setError(err.message));
  }, []);
  useEffect(load, [load]);

  const advance = async (order, status) => {
    if (status === 'shipped' && !order.courier && !window.confirm('No courier or tracking number yet. Mark as shipped anyway? You can add them from the order.')) return;
    setBusy(true);
    setError('');
    try {
      await ordersApi.update(order.id, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const inColumn = (col) =>
    (items || [])
      .filter((o) => col.statuses.includes(o.status))
      .filter((o) => o.status !== 'delivered' || new Date(o.deliveredAt || o.createdAt).getTime() > since)
      .sort((a, b) => (a.expectedDelivery || '9999').localeCompare(b.expectedDelivery || '9999'));

  return (
    <AdminLayout title="Deliveries" subtitle="Pack, ship and deliver confirmed orders">
      {error && <div role="alert" className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</div>}
      {items === null ? (
        <p className="p-12 text-center text-adm-muted text-[13px]">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {COLUMNS.map((col) => {
            const list = inColumn(col);
            return (
              <section key={col.title} className="rounded-2xl bg-adm-fg/[0.03] border border-adm-border p-3">
                <header className="px-1 pb-3 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-[14px] font-semibold text-adm-fg">{col.title}</h2>
                    <p className="text-[11px] text-adm-muted">{col.hint}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-adm-muted tabular-nums">{list.length}</span>
                </header>
                {list.length === 0 ? (
                  <p className="py-8 text-center text-[12px] text-adm-muted">Nothing here</p>
                ) : (
                  <ul className="space-y-3">
                    {list.map((o) => (
                      <Card key={o.id} order={o} onAdvance={advance} busy={busy} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDeliveries;
