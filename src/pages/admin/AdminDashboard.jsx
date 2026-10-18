import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, BookOpen, Boxes, Briefcase, CircleDollarSign, FolderKanban, Image as ImageIcon, MessageSquare,
  Package, PackageCheck, Plus, ShoppingBag, Sliders, Truck,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboard, inboxCounts } from '../../services/adminApi';
import { inr } from '../../components/admin/orders/orderMeta';
import { StatusPill, PaymentPill } from '../../components/admin/orders/OrderPills';

const Kpi = ({ icon: Icon, label, value, hint, to, tone = 'accent' }) => (
  <Link to={to} className="adm-card p-5 group hover:-translate-y-0.5 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between">
      <p className="text-[12px] font-medium text-adm-muted">{label}</p>
      <span className={`w-9 h-9 rounded-xl inline-flex items-center justify-center ${tone === 'warn' ? 'bg-amber-500/12 text-amber-600 dark:text-amber-300' : 'bg-adm-accent/10 text-adm-accent'}`}>
        <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
      </span>
    </div>
    <p className="mt-2 text-[28px] font-semibold tracking-tight text-adm-fg tabular-nums leading-none">{value ?? '—'}</p>
    {hint && <p className="mt-1.5 text-[11.5px] text-adm-muted">{hint}</p>}
  </Link>
);

const Card = ({ title, action, children, className = '' }) => (
  <section className={`adm-card p-5 ${className}`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[14px] font-semibold text-adm-fg">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const ACTIONS = [
  { to: '/admin/products', label: 'Add a product', icon: Plus },
  { to: '/admin/inventory', label: 'Update stock', icon: Boxes },
  { to: '/admin/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/admin/banners', label: 'Home banners', icon: Sliders },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/blogs', label: 'Journal', icon: BookOpen },
];

const TYPE_PATHS = { Product: 'products', Project: 'projects', Journal: 'blogs', Job: 'careers' };

const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(m, 0)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const greeting = (hour) => (hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState('');
  const [hour] = useState(() => new Date().getHours());

  useEffect(() => {
    dashboard().then(setData).catch((err) => setError(err.message));
    inboxCounts().then(setCounts).catch(() => {});
  }, []);

  const s = data?.sales || {};
  const month = new Date().toLocaleDateString('en-IN', { month: 'long' });

  return (
    <AdminLayout title="Dashboard" subtitle={`${greeting(hour)}. Here is what needs your attention today.`}>
      <div className="space-y-6">
        {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[13px]">{error}</div>}

        {/* Sales */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Kpi icon={CircleDollarSign} label={`Received in ${month}`} value={inr(s.revenueMonth ?? 0)} hint={`${inr(s.revenuePaid ?? 0)} all time`} to="/admin/orders" />
          <Kpi icon={ShoppingBag} label={`Orders in ${month}`} value={s.ordersMonth ?? 0} hint={`${s.ordersTotal ?? 0} all time`} to="/admin/orders" />
          <Kpi icon={PackageCheck} label="To confirm" value={s.toConfirm ?? 0} hint="new orders" to="/admin/orders" tone={s.toConfirm ? 'warn' : 'accent'} />
          <Kpi icon={Truck} label="To ship" value={s.toShip ?? 0} hint={`${s.inTransit ?? 0} on the way`} to="/admin/deliveries" tone={s.toShip ? 'warn' : 'accent'} />
          <Kpi icon={AlertTriangle} label="Out of stock" value={s.outOfStock ?? 0} hint="published products" to="/admin/inventory" tone={s.outOfStock ? 'warn' : 'accent'} />
          <Kpi icon={MessageSquare} label="New enquiries" value={counts.unreadInquiries ?? 0} hint={`${s.awaitingPayment ?? 0} orders awaiting payment`} to="/admin/inquiries" tone={counts.unreadInquiries ? 'warn' : 'accent'} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent orders */}
          <Card
            title="Recent orders"
            className="xl:col-span-2"
            action={<Link to="/admin/orders" className="text-[12px] font-medium text-adm-accent hover:underline">All orders</Link>}
          >
            {!data ? (
              <p className="py-8 text-center text-[13px] text-adm-muted">Loading…</p>
            ) : s.recentOrders?.length ? (
              <ul className="divide-y divide-adm-border">
                {s.recentOrders.map((o) => (
                  <li key={o.id}>
                    <Link to={`/admin/orders?open=${o.id}`} className="py-3 flex items-center gap-4 hover:bg-adm-fg/[0.02] -mx-2 px-2 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-adm-fg font-mono whitespace-nowrap">{o.orderNumber}</p>
                        <p className="text-[12px] text-adm-muted truncate">{o.customerName} · {ago(o.createdAt)}</p>
                      </div>
                      <PaymentPill status={o.paymentStatus} className="hidden sm:inline-flex" />
                      <StatusPill status={o.status} />
                      <span className="w-24 text-right text-[13px] font-semibold text-adm-fg tabular-nums">{inr(o.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-[13px] text-adm-muted">No orders yet. They appear here as soon as customers check out.</p>
            )}
          </Card>

          {/* Low stock */}
          <Card title="Low stock" action={<Link to="/admin/inventory" className="text-[12px] font-medium text-adm-accent hover:underline">Inventory</Link>}>
            {s.lowStock?.length ? (
              <ul className="space-y-2.5">
                {s.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-adm-fg truncate">{p.name}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${p.stockQuantity === 0 ? 'bg-red-500/12 text-red-700 dark:text-red-300' : 'bg-amber-500/12 text-amber-700 dark:text-amber-300'}`}>
                      {p.stockQuantity === 0 ? 'Sold out' : `${p.stockQuantity} left`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-adm-muted">Nothing running low. Set stock counts in Inventory to get alerts here.</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Content */}
          <Card title="Website content">
            <ul className="grid grid-cols-2 gap-3">
              {[
                { to: '/admin/products', icon: Package, label: 'Products', value: data?.products?.published, draft: data?.products?.draft },
                { to: '/admin/projects', icon: FolderKanban, label: 'Projects', value: data?.projects?.published, draft: data?.projects?.draft },
                { to: '/admin/blogs', icon: BookOpen, label: 'Articles', value: data?.blogs?.published, draft: data?.blogs?.draft },
                { to: '/admin/careers', icon: Briefcase, label: 'Open jobs', value: data?.openJobs },
                { to: '/admin/media', icon: ImageIcon, label: 'Images', value: data?.media },
              ].map(({ to, icon: Icon, label, value, draft }) => (
                <li key={to}>
                  <Link to={to} className="block p-3 rounded-xl bg-adm-fg/[0.03] hover:bg-adm-fg/[0.06]">
                    <Icon className="w-4 h-4 text-adm-accent" />
                    <p className="mt-2 text-[20px] font-semibold text-adm-fg tabular-nums leading-none">{value ?? '—'}</p>
                    <p className="mt-1 text-[11.5px] text-adm-muted">{label}{draft ? ` · ${draft} draft` : ''}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Quick actions */}
          <Card title="Quick actions">
            <div className="grid grid-cols-2 gap-2">
              {ACTIONS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="flex items-center gap-2.5 p-3 rounded-xl bg-adm-fg/[0.03] hover:bg-adm-accent hover:text-adm-on-accent text-adm-fg text-[13px] font-medium transition-colors">
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent edits */}
          <Card title="Recent edits">
            {!data ? (
              <p className="py-6 text-center text-[13px] text-adm-muted">Loading…</p>
            ) : (
              <ul className="divide-y divide-adm-border">
                {data.recentEdits.slice(0, 6).map((e) => (
                  <li key={`${e.type}-${e.id}`} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/admin/${TYPE_PATHS[e.type]}`} className="text-[13px] font-medium text-adm-fg hover:text-adm-accent truncate block">{e.name}</Link>
                      <p className="text-[11px] text-adm-muted">{e.type}</p>
                    </div>
                    <span className="text-[11px] text-adm-muted shrink-0">{ago(e.updatedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
