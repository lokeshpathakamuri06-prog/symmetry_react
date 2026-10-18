import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Loader2, LogOut, Package, Truck } from 'lucide-react';
import SeoMeta from '../../components/SeoMeta';
import SmartImage from '../../components/SmartImage';
import { useCustomer } from '../../context/CustomerContext';
import { formatINR } from '../../lib/shop';
import { field } from './AccountLogin';

// Signed-in customer area: /account (orders + details), /account/orders/:number (one order)

const STEPS = [
  ['pending', 'Placed'],
  ['confirmed', 'Confirmed'],
  ['processing', 'Packing'],
  ['shipped', 'Shipped'],
  ['out_for_delivery', 'Out for delivery'],
  ['delivered', 'Delivered'],
];
const STATUS_LABEL = { ...Object.fromEntries(STEPS), cancelled: 'Cancelled' };
const STATUS_STYLE = {
  delivered: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  cancelled: 'bg-fg/5 text-muted',
};
const PAYMENT_LABEL = {
  paid: 'Paid', cod: 'Cash on delivery', unpaid: 'Payment link to follow', pending: 'Awaiting payment',
  failed: 'Payment failed', refunded: 'Refunded',
};

const date = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

const StatusPill = ({ status }) => (
  <span className={`text-[12px] px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[status] || 'bg-accent/12 text-accent'}`}>
    {STATUS_LABEL[status] || status}
  </span>
);

const Shell = ({ title, children }) => (
  <div className="pt-[calc(var(--gnav-h)+40px)] pb-24 min-h-[80vh]">
    <SeoMeta title={title} noindex />
    <div className="site-container max-w-4xl">{children}</div>
  </div>
);

const useSignedIn = () => {
  const ctx = useCustomer();
  const { pathname } = useLocation();
  const redirect = ctx.status === 'guest' ? <Navigate to={`/account/login?next=${encodeURIComponent(pathname)}`} replace /> : null;
  return { ...ctx, redirect, waiting: ctx.status === 'checking' };
};

const Waiting = () => (
  <p className="pt-10 text-muted inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>
);

// --- /account --------------------------------------------------------------------------------------

const Details = () => {
  const { customer, updateProfile, changePassword } = useCustomer();
  const a = customer.address || {};
  const [form, setForm] = useState({
    fullName: customer.fullName || '', phone: customer.phone || '', address: a.address || '', city: a.city || '',
    state: a.state || '', pincode: a.pincode || '', country: a.country || 'India',
  });
  const [msg, setMsg] = useState(null);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [busy, setBusy] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = async (e) => {
    e.preventDefault();
    setBusy('profile');
    setMsg(null);
    try {
      const { fullName, phone, ...address } = form;
      await updateProfile({ fullName: fullName || undefined, phone, address });
      setMsg({ ok: true, text: 'Saved. Checkout will fill these in for you.' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy('');
    }
  };
  const savePassword = async (e) => {
    e.preventDefault();
    setBusy('password');
    setPwMsg(null);
    try {
      await changePassword({ currentPassword: pw.currentPassword || undefined, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '' });
      setPwMsg({ ok: true, text: 'Password saved. Other devices have been signed out.' });
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    } finally {
      setBusy('');
    }
  };
  const note = (m) => m && <p role={m.ok ? 'status' : 'alert'} className={`text-[13px] ${m.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>{m.text}</p>;
  const lbl = 'block text-[13px] font-medium text-fg/80 mb-1.5';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-3 rounded-tile bg-surface ring-1 ring-line/60 p-5 sm:p-6 space-y-4">
        <h2 className="text-[18px] font-semibold text-fg">Your details</h2>
        <p className="text-[13px] text-muted -mt-2">{customer.email}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label htmlFor="p-name" className={lbl}>Full name</label><input id="p-name" autoComplete="name" value={form.fullName} onChange={set('fullName')} className={field} /></div>
          <div><label htmlFor="p-phone" className={lbl}>Mobile</label><input id="p-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={field} /></div>
        </div>
        <div><label htmlFor="p-addr" className={lbl}>Delivery address</label><input id="p-addr" autoComplete="street-address" value={form.address} onChange={set('address')} className={field} placeholder="Flat, building, street" /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><label htmlFor="p-city" className={lbl}>City</label><input id="p-city" autoComplete="address-level2" value={form.city} onChange={set('city')} className={field} /></div>
          <div><label htmlFor="p-state" className={lbl}>State</label><input id="p-state" autoComplete="address-level1" value={form.state} onChange={set('state')} className={field} /></div>
          <div className="col-span-2 sm:col-span-1"><label htmlFor="p-pin" className={lbl}>PIN code</label><input id="p-pin" inputMode="numeric" autoComplete="postal-code" value={form.pincode} onChange={set('pincode')} className={field} /></div>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy === 'profile'} className="rounded-full bg-accent text-on-accent hover:bg-accent-hover px-5 py-2.5 text-[14px] font-medium disabled:opacity-60 inline-flex items-center gap-2">
            {busy === 'profile' && <Loader2 className="w-4 h-4 animate-spin" />} Save details
          </button>
          {note(msg)}
        </div>
      </form>

      <form onSubmit={savePassword} className="lg:col-span-2 rounded-tile bg-surface ring-1 ring-line/60 p-5 sm:p-6 space-y-4 self-start">
        <h2 className="text-[18px] font-semibold text-fg">{customer.hasPassword ? 'Change password' : 'Add a password'}</h2>
        <p className="text-[13px] text-muted -mt-2">Optional: you can always sign in with an email code.</p>
        {customer.hasPassword && (
          <div><label htmlFor="pw-cur" className={lbl}>Current password</label><input id="pw-cur" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} className={field} />
            <p className="mt-1 text-[12px] text-muted">Forgotten? Not needed for 30 minutes after signing in with an email code.</p></div>
        )}
        <div><label htmlFor="pw-new" className={lbl}>New password</label><input id="pw-new" type="password" autoComplete="new-password" minLength={8} required value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} className={field} /></div>
        <button type="submit" disabled={busy === 'password'} className="rounded-full border border-accent text-accent hover:bg-accent hover:text-on-accent px-5 py-2.5 text-[14px] font-medium disabled:opacity-60 inline-flex items-center gap-2">
          {busy === 'password' && <Loader2 className="w-4 h-4 animate-spin" />} Save password
        </button>
        {note(pwMsg)}
      </form>
    </div>
  );
};

export const Account = () => {
  const { customer, redirect, waiting, orders, logout } = useSignedIn();
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customer) return;
    orders().then((r) => setList(r.items)).catch((err) => setError(err.message));
  }, [customer?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) return redirect;
  if (waiting || !customer) return <Shell title="My account"><Waiting /></Shell>;

  return (
    <Shell title="My account">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 text-[32px] sm:text-[40px] font-semibold tracking-tight text-fg leading-tight">
            Hello{customer.fullName ? `, ${customer.fullName.split(' ')[0]}` : ''}
          </h1>
        </div>
        <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-fg">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      <section className="mt-10" aria-labelledby="orders-title">
        <h2 id="orders-title" className="text-[20px] font-semibold text-fg">My orders</h2>
        {error && <p role="alert" className="mt-4 text-red-700 dark:text-red-400 text-[14px]">{error}</p>}
        {list === null && !error ? (
          <Waiting />
        ) : list?.length === 0 ? (
          <div className="mt-4 rounded-tile bg-surface ring-1 ring-line/60 p-8 text-center">
            <Package className="w-8 h-8 mx-auto text-subtle" strokeWidth={1.5} />
            <p className="mt-3 text-muted">No orders yet.</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-full bg-accent text-on-accent px-5 py-2.5 text-[14px]">Browse the shop</Link>
          </div>
        ) : (
          <ul className="mt-4 rounded-tile bg-surface ring-1 ring-line/60 divide-y divide-line">
            {list?.map((o) => (
              <li key={o.orderNumber}>
                <Link to={`/account/orders/${o.orderNumber}`} className="flex items-center gap-4 p-4 sm:p-5 hover:bg-fg/[0.03] transition-colors">
                  <div className="flex -space-x-3 shrink-0">
                    {o.items.slice(0, 2).map((i) => (
                      <div key={i.id} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-sunken ring-2 ring-surface">
                        {i.image && <SmartImage src={i.image} alt={i.name} sizes="56px" className="w-full h-full object-cover" />}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[13px] font-semibold text-fg">{o.orderNumber}</p>
                    <p className="text-[13px] text-muted truncate">{date(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? '' : 's'} · {o.items.map((i) => i.name).join(', ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-semibold text-fg">{formatINR(o.total)}</p>
                    <div className="mt-1"><StatusPill status={o.status} /></div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-subtle shrink-0 hidden sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <Details />
      </section>
    </Shell>
  );
};

// --- /account/orders/:number --------------------------------------------------------------------------

export const AccountOrder = () => {
  const { number } = useParams();
  const { customer, redirect, waiting, order } = useSignedIn();
  const [o, setO] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customer) return;
    order(number).then(setO).catch((err) => setError(err.status === 404 ? 'We couldn\'t find this order in your account.' : err.message));
  }, [customer?.email, number]); // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) return redirect;
  if (waiting || !customer || (!o && !error)) return <Shell title="Order"><Waiting /></Shell>;

  const back = <Link to="/account" className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-fg"><ArrowLeft className="w-4 h-4" /> My orders</Link>;
  if (error) return <Shell title="Order">{back}<p role="alert" className="mt-6 text-fg">{error}</p></Shell>;

  const reached = STEPS.findIndex(([s]) => s === o.status);
  const c = o.customer || {};

  return (
    <Shell title={`Order ${o.orderNumber}`}>
      {back}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-fg font-mono">{o.orderNumber}</h1>
        <StatusPill status={o.status} />
      </div>
      <p className="mt-1 text-[14px] text-muted">Placed {date(o.createdAt)} · {PAYMENT_LABEL[o.paymentStatus] || o.paymentStatus}</p>

      {o.status === 'cancelled' ? (
        <p className="mt-8 rounded-tile bg-surface ring-1 ring-line/60 p-5 text-[15px] text-fg">
          This order was cancelled.{o.paymentStatus === 'paid' || o.paymentStatus === 'refunded' ? ' Any amount paid is refunded to the original payment method.' : ''}
        </p>
      ) : (
        <ol aria-label="Order progress" className="mt-8 grid grid-cols-6 gap-1.5">
          {STEPS.map(([s, text], i) => (
            <li key={s} className="text-center">
              <div className={`h-1.5 rounded-full ${i <= reached ? 'bg-accent' : 'bg-line'}`} />
              <p className={`mt-2 text-[11px] sm:text-[12px] leading-tight ${i <= reached ? 'text-fg font-medium' : 'text-subtle'}`}>
                {i <= reached && <Check className="hidden sm:inline w-3 h-3 mr-0.5 -mt-0.5" />}{text}
              </p>
            </li>
          ))}
        </ol>
      )}

      {(o.courier || o.trackingNumber || o.expectedDelivery) && o.status !== 'cancelled' && (
        <div className="mt-6 rounded-tile bg-surface ring-1 ring-line/60 p-5 flex gap-4">
          <Truck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-[14px] text-fg space-y-1">
            {o.courier && <p>Delivered by <b>{o.courier}</b></p>}
            {o.trackingNumber && <p>Tracking number: <span className="font-mono">{o.trackingNumber}</span></p>}
            {o.expectedDelivery && o.status !== 'delivered' && <p>Expected by {date(o.expectedDelivery)}</p>}
            {o.trackingUrl && <a href={o.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Track the delivery</a>}
          </div>
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <ul className="lg:col-span-3 rounded-tile bg-surface ring-1 ring-line/60 divide-y divide-line">
          {o.items.map((i) => (
            <li key={`${i.id}-${i.selectedFinish}`} className="p-4 flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-sunken shrink-0">
                {i.image && <SmartImage src={i.image} alt={i.name} sizes="64px" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-fg">{i.name}</p>
                <p className="text-[13px] text-muted">{[i.selectedFinish, i.selectedFabric].filter(Boolean).join(' · ')}{i.selectedFinish || i.selectedFabric ? ' · ' : ''}Qty {i.quantity}</p>
              </div>
              <p className="text-[15px] font-medium text-fg">{formatINR(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-2 space-y-6">
          <dl className="rounded-tile bg-surface ring-1 ring-line/60 p-5 text-[14px] space-y-2">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(o.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">GST</dt><dd>{formatINR(o.tax)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{o.shipping ? formatINR(o.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between pt-2 border-t border-line text-[16px] font-semibold"><dt>Total</dt><dd>{formatINR(o.total)}</dd></div>
          </dl>
          <div className="rounded-tile bg-surface ring-1 ring-line/60 p-5 text-[14px] text-fg leading-relaxed">
            <p className="text-[12px] uppercase tracking-wider text-muted mb-1">Delivery address</p>
            <p className="font-medium">{c.fullName}</p>
            <p>{c.address}</p>
            <p>{[c.city, c.state, c.pincode].filter(Boolean).join(', ')}</p>
            <p className="text-muted">{c.phone}</p>
          </div>
          <p className="text-[13px] text-muted">Questions about this order? <Link to="/contact" className="text-accent hover:underline">Contact us</Link> and mention {o.orderNumber}.</p>
        </div>
      </div>
    </Shell>
  );
};

export default Account;
