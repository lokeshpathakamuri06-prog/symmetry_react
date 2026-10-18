import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FileText, Mail, MapPin, Phone, Trash2, Truck, X, ExternalLink } from 'lucide-react';
import { orders as ordersApi, inbox } from '../../../services/adminApi';
import { ORDER_FLOW, STATUS, NEXT_ACTION, nextStatus, PAYMENT, PAYMENT_STATUSES, inr, dateTime, shortDate } from './orderMeta';
import { StatusPill, PaymentPill } from './OrderPills';

const Label = ({ children }) => <p className="text-[11px] font-semibold uppercase tracking-wider text-adm-muted mb-2">{children}</p>;

const Box = ({ children, className = '' }) => <div className={`rounded-xl border border-adm-border p-4 ${className}`}>{children}</div>;

/** Progress through New → Delivered, as a row of steps */
const Progress = ({ status }) => {
  const at = ORDER_FLOW.indexOf(status);
  return (
    <ol className="flex items-center gap-1" aria-label="Order progress">
      {ORDER_FLOW.map((s, i) => (
        <li key={s} className="flex-1 min-w-0" title={STATUS[s].label}>
          <div className={`h-1.5 rounded-full ${status === 'cancelled' ? 'bg-adm-fg/10' : i <= at ? 'bg-adm-accent' : 'bg-adm-fg/10'}`} />
          <p className={`mt-1.5 text-[10px] truncate ${i === at ? 'text-adm-fg font-semibold' : 'text-adm-muted'}`}>{STATUS[s].label}</p>
        </li>
      ))}
    </ol>
  );
};

/**
 * Everything about one order: progress and next step, payment, delivery details, items,
 * invoice and notes. onChanged(order) after every save; onDeleted() after delete.
 */
export const OrderPanel = ({ order, onChanged, onDeleted, onClose }) => {
  // Form fields start from the order; the parent remounts this panel (key) when another order opens
  const [delivery, setDelivery] = useState(() => ({
    courier: order.courier || '',
    trackingNumber: order.trackingNumber || '',
    trackingUrl: order.trackingUrl || '',
    expectedDelivery: order.expectedDelivery || '',
  }));
  const [notes, setNotes] = useState(order.notes || '');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const save = async (changes, what) => {
    setBusy(what);
    setError('');
    try {
      const updated = await ordersApi.update(order.id, changes);
      onChanged(updated);
      setSaved(what);
      setTimeout(() => setSaved(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const invoice = async () => {
    setBusy('invoice');
    try {
      const updated = await ordersApi.invoice(order.id);
      onChanged(updated);
      window.open(`${import.meta.env.BASE_URL}admin/orders/${order.id}/invoice`, '_blank', 'noopener');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete order ${order.orderNumber} permanently? This cannot be undone.`)) return;
    try {
      await inbox('orders').remove(order.id);
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  };

  const c = order.customer || {};
  const next = nextStatus(order.status);
  const deliveryChanged =
    delivery.courier !== (order.courier || '') ||
    delivery.trackingNumber !== (order.trackingNumber || '') ||
    delivery.trackingUrl !== (order.trackingUrl || '') ||
    delivery.expectedDelivery !== (order.expectedDelivery || '');

  return (
    <div className="space-y-5 text-[13px]">
      {/* Heading */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-adm-muted">{dateTime(order.createdAt)}</p>
          <h2 className="text-[20px] font-semibold tracking-tight text-adm-fg font-mono">{order.orderNumber}</h2>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <StatusPill status={order.status} />
            <PaymentPill status={order.paymentStatus} />
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-adm-fg/5 text-adm-muted">{order.paymentMethod}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={remove} title="Delete permanently" className="p-2 rounded-lg text-adm-muted hover:text-red-600 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button onClick={onClose} title="Close" className="p-2 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && <p role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300">{error}</p>}

      {/* Progress + next step */}
      <Box>
        <Progress status={order.status} />
        <div className="mt-4 flex flex-wrap gap-2">
          {next && order.status !== 'cancelled' && (
            <button
              onClick={() => save({ status: next }, 'status')}
              disabled={!!busy}
              className="px-4 py-2 rounded-xl bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent font-semibold disabled:opacity-60"
            >
              {busy === 'status' ? 'Saving…' : NEXT_ACTION[order.status]}
            </button>
          )}
          <select
            value={order.status}
            onChange={(e) => {
              const s = e.target.value;
              if (s === 'cancelled' && !window.confirm('Cancel this order? Its pieces go back into stock.')) return;
              save({ status: s }, 'status');
            }}
            className="px-3 py-2 rounded-xl adm-input"
            aria-label="Order status"
          >
            {Object.entries(STATUS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
          {saved === 'status' && <span className="self-center text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </Box>

      {/* Payment */}
      <Box>
        <Label>Payment</Label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={order.paymentStatus || 'unpaid'}
            onChange={(e) => save({ paymentStatus: e.target.value }, 'payment')}
            className="px-3 py-2 rounded-xl adm-input"
            aria-label="Payment status"
          >
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p}>
                {PAYMENT[p].label}
              </option>
            ))}
          </select>
          <span className="text-adm-muted">
            {order.paidAt ? `Paid ${dateTime(order.paidAt)}` : order.paymentStatus === 'unpaid' ? 'Send the customer a payment link' : ''}
          </span>
        </div>
        {order.razorpayPaymentId && <p className="mt-2 text-[12px] text-adm-muted font-mono">Razorpay payment {order.razorpayPaymentId}</p>}
      </Box>

      {/* Delivery */}
      <Box>
        <Label>Delivery</Label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-[12px] text-adm-muted mb-1">Courier / transporter</span>
            <input value={delivery.courier} onChange={(e) => setDelivery({ ...delivery, courier: e.target.value })} placeholder="Own team, Blue Dart…" className="w-full px-3 py-2 rounded-xl adm-input" />
          </label>
          <label className="block">
            <span className="block text-[12px] text-adm-muted mb-1">Tracking number</span>
            <input value={delivery.trackingNumber} onChange={(e) => setDelivery({ ...delivery, trackingNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl adm-input" />
          </label>
          <label className="block col-span-2">
            <span className="block text-[12px] text-adm-muted mb-1">Tracking link</span>
            <input value={delivery.trackingUrl} onChange={(e) => setDelivery({ ...delivery, trackingUrl: e.target.value })} placeholder="https://" className="w-full px-3 py-2 rounded-xl adm-input" />
          </label>
          <label className="block">
            <span className="block text-[12px] text-adm-muted mb-1">Expected delivery</span>
            <input type="date" value={delivery.expectedDelivery} onChange={(e) => setDelivery({ ...delivery, expectedDelivery: e.target.value })} className="w-full px-3 py-2 rounded-xl adm-input" />
          </label>
          <div className="text-[12px] text-adm-muted self-end pb-2 space-y-0.5">
            {order.shippedAt && <p>Shipped {shortDate(order.shippedAt)}</p>}
            {order.deliveredAt && <p>Delivered {shortDate(order.deliveredAt)}</p>}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => save({ ...delivery, expectedDelivery: delivery.expectedDelivery || null }, 'delivery')}
            disabled={!deliveryChanged || !!busy}
            className="px-4 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-adm-fg font-semibold disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> {busy === 'delivery' ? 'Saving…' : 'Save delivery details'}
          </button>
          {saved === 'delivery' && <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-adm-accent inline-flex items-center gap-1">
              Track <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </Box>

      {/* Customer */}
      <Box className="space-y-1.5">
        <Label>Customer</Label>
        <p className="font-semibold text-adm-fg">{order.customerName}</p>
        <a href={`mailto:${order.customerEmail}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Mail className="w-4 h-4 text-adm-accent" /> {order.customerEmail}</a>
        {order.customerPhone && <a href={`tel:${order.customerPhone}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Phone className="w-4 h-4 text-adm-accent" /> {order.customerPhone}</a>}
        <p className="text-adm-fg/80 flex items-start gap-2"><MapPin className="w-4 h-4 text-adm-accent mt-0.5 shrink-0" /> {[c.address, c.city, c.state, c.pincode].filter(Boolean).join(', ')}</p>
        {c.accessNotes && <p className="text-[12px] text-adm-muted">Delivery notes: {c.accessNotes}</p>}
      </Box>

      {/* Items */}
      <Box>
        <Label>Items</Label>
        <ul className="divide-y divide-adm-border">
          {(order.items || []).map((line, i) => (
            <li key={i} className="py-2 flex items-center gap-3">
              {line.image ? <img src={line.image} alt="" className="w-11 h-11 rounded-lg object-cover" /> : <div className="w-11 h-11 rounded-lg bg-adm-fg/5" />}
              <div className="flex-1 min-w-0">
                <p className="text-adm-fg font-medium truncate">{line.name}</p>
                <p className="text-[11px] text-adm-muted">{line.id} · ×{line.quantity}{line.selectedFinish ? ` · ${line.selectedFinish}` : ''}</p>
              </div>
              <span className="text-adm-fg tabular-nums">{inr(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-adm-border space-y-1 text-[12px]">
          <p className="flex justify-between text-adm-muted"><span>Items</span><span>{inr(order.subtotal)}</span></p>
          <p className="flex justify-between text-adm-muted"><span>GST (18%)</span><span>{inr(order.tax)}</span></p>
          <p className="flex justify-between text-adm-muted"><span>Delivery</span><span>{order.shipping ? inr(order.shipping) : 'Free'}</span></p>
          <p className="flex justify-between font-semibold text-adm-fg text-[15px] pt-1"><span>Total</span><span>{inr(order.total)}</span></p>
        </div>
      </Box>

      {/* Invoice */}
      <Box className="flex items-center justify-between gap-3">
        <div>
          <Label>Tax invoice</Label>
          <p className="text-adm-fg">{order.invoiceNumber ? <span className="font-mono">{order.invoiceNumber}</span> : 'Not generated yet'}</p>
          {order.invoiceDate && <p className="text-[12px] text-adm-muted">{shortDate(order.invoiceDate)}</p>}
        </div>
        {order.status !== 'cancelled' && (
          <button onClick={invoice} disabled={!!busy} className="px-4 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-adm-fg font-semibold inline-flex items-center gap-2 disabled:opacity-60">
            <FileText className="w-4 h-4" /> {order.invoiceNumber ? 'Open invoice' : busy === 'invoice' ? 'Generating…' : 'Generate invoice'}
          </button>
        )}
      </Box>

      {/* Notes */}
      <div>
        <Label>Internal notes</Label>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-xl adm-input" placeholder="Only visible to admins" />
        <div className="mt-2 flex items-center gap-3">
          <button onClick={() => save({ notes }, 'notes')} disabled={notes === (order.notes || '') || !!busy} className="px-4 py-2 rounded-xl bg-adm-fg/5 hover:bg-adm-fg/10 text-adm-fg font-semibold disabled:opacity-50">
            Save notes
          </button>
          {saved === 'notes' && <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </div>

      <Link to="/admin/deliveries" className="block text-center text-[12px] text-adm-accent hover:underline">
        Open the deliveries board
      </Link>
    </div>
  );
};

export default OrderPanel;
