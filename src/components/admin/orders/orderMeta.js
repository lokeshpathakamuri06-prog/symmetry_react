// Order statuses in delivery order (orders.status), with the label and colour admins see
export const ORDER_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
export const ORDER_STATUSES = [...ORDER_FLOW, 'cancelled'];

export const STATUS = {
  pending: { label: 'New', style: 'bg-amber-500/12 text-amber-700 dark:text-amber-300' },
  confirmed: { label: 'Confirmed', style: 'bg-sky-500/12 text-sky-700 dark:text-sky-300' },
  processing: { label: 'Packing', style: 'bg-violet-500/12 text-violet-700 dark:text-violet-300' },
  shipped: { label: 'Shipped', style: 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-300' },
  out_for_delivery: { label: 'Out for delivery', style: 'bg-cyan-500/12 text-cyan-700 dark:text-cyan-300' },
  delivered: { label: 'Delivered', style: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300' },
  cancelled: { label: 'Cancelled', style: 'bg-adm-fg/5 text-adm-muted' },
};

// What the next step's button says
export const NEXT_ACTION = {
  pending: 'Confirm order',
  confirmed: 'Start packing',
  processing: 'Mark shipped',
  shipped: 'Out for delivery',
  out_for_delivery: 'Mark delivered',
};
export const nextStatus = (s) => ORDER_FLOW[ORDER_FLOW.indexOf(s) + 1];

export const PAYMENT = {
  paid: { label: 'Paid', style: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300' },
  pending: { label: 'Awaiting payment', style: 'bg-amber-500/12 text-amber-700 dark:text-amber-300' },
  unpaid: { label: 'Not paid', style: 'bg-orange-500/12 text-orange-700 dark:text-orange-300' },
  cod: { label: 'Cash on delivery', style: 'bg-sky-500/12 text-sky-700 dark:text-sky-300' },
  failed: { label: 'Payment failed', style: 'bg-red-500/12 text-red-700 dark:text-red-300' },
  refunded: { label: 'Refunded', style: 'bg-adm-fg/5 text-adm-muted' },
};
export const PAYMENT_STATUSES = Object.keys(PAYMENT);

// A cancelled order that was paid online still needs its money back (refund in Razorpay, then set "Refunded")
export const REFUND_DUE = { label: 'Refund due', style: 'bg-red-500/12 text-red-700 dark:text-red-300' };
export const refundDue = (o) => o.status === 'cancelled' && o.paymentStatus === 'paid';

export const inr = (n) => (n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`);

export const shortDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const dateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export const itemCount = (o) => (o.items || []).reduce((n, i) => n + (i.quantity || 0), 0);
