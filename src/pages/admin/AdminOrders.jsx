import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import InboxPage, { formatWhen } from '../../components/admin/InboxPage';
import { inr } from './contentOptions';

const Detail = ({ item }) => {
  const c = item.customer || {};
  return (
    <div className="space-y-3 min-w-0 flex-1">
      <div>
        <h3 className="font-semibold text-adm-fg text-base font-mono">{item.orderNumber}</h3>
        <p className="text-[11px] text-adm-muted">{formatWhen(item.createdAt)} · {item.paymentMethod}</p>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-adm-fg">{item.customerName}</p>
        <a href={`mailto:${item.customerEmail}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Mail className="w-4 h-4 text-adm-accent" /> {item.customerEmail}</a>
        {item.customerPhone && <a href={`tel:${item.customerPhone}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Phone className="w-4 h-4 text-adm-accent" /> {item.customerPhone}</a>}
        <p className="text-adm-fg/80 flex items-start gap-2"><MapPin className="w-4 h-4 text-adm-accent mt-0.5 shrink-0" /> {[c.address, c.city, c.state, c.pincode, c.country].filter(Boolean).join(', ')}</p>
        {c.accessNotes && <p className="text-[12px] text-adm-muted">Notes: {c.accessNotes}</p>}
      </div>
      <ul className="divide-y divide-adm-border border-y border-adm-border">
        {(item.items || []).map((line, i) => (
          <li key={i} className="py-2 flex items-center gap-3">
            {line.image && <img src={line.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="text-adm-fg truncate">{line.name}</p>
              <p className="text-[11px] text-adm-muted">{line.id} · ×{line.quantity}{line.selectedFinish ? ` · ${line.selectedFinish}` : ''}</p>
            </div>
            <span className="text-adm-fg/90">{inr(line.price * line.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-1 text-[12px]">
        <p className="flex justify-between text-adm-muted"><span>Subtotal</span><span>{inr(item.subtotal)}</span></p>
        <p className="flex justify-between text-adm-muted"><span>GST (18%)</span><span>{inr(item.tax)}</span></p>
        <p className="flex justify-between text-adm-muted"><span>Shipping</span><span>{item.shipping ? inr(item.shipping) : 'Free'}</span></p>
        <p className="flex justify-between font-semibold text-adm-fg text-[14px]"><span>Total</span><span>{inr(item.total)}</span></p>
      </div>
    </div>
  );
};

const config = {
  kind: 'orders',
  title: 'Customer Orders',
  subtitle: 'Order requests from the shop (no online payment yet)',
  emptyText: 'No orders yet.',
  statusStyles: {
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    confirmed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    processing: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    delivered: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    cancelled: 'bg-adm-fg/5 text-adm-muted',
  },
  row: (o) => ({ title: `${o.orderNumber} · ${o.customerName}`, subtitle: `${(o.items || []).length} item(s)`, meta: inr(o.total) }),
  Detail,
};

export const AdminOrders = () => <InboxPage config={config} />;
export default AdminOrders;
