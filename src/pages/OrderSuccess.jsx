import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Printer, Banknote, ShoppingBag } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import { useCustomer } from '../context/CustomerContext';
import SmartImage from '../components/SmartImage';
import CheckoutSteps from '../components/shop/CheckoutSteps';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/shop';

/** What the payment status means for the shopper */
const PAYMENT = {
  paid: { icon: CheckCircle2, tone: 'text-emerald-600 dark:text-emerald-400', title: 'Payment received', text: 'Your payment was successful and your order is confirmed.' },
  cod: { icon: Banknote, tone: 'text-accent', title: 'Cash on Delivery', text: 'Pay by cash, card or UPI when your order arrives. Our team will call to confirm before dispatch.' },
  verifying: { icon: Clock, tone: 'text-amber-600 dark:text-amber-400', title: 'Confirming your payment', text: 'We are confirming your payment with the bank. You do not need to pay again; we will update you shortly.' },
  pending: { icon: Clock, tone: 'text-amber-600 dark:text-amber-400', title: 'Confirming your payment', text: 'We are confirming your payment with the bank. You do not need to pay again; we will update you shortly.' },
  unpaid: { icon: Clock, tone: 'text-accent', title: 'Payment link on its way', text: 'Our team will confirm your order and send you a secure payment link by email and WhatsApp.' },
};

const Money = ({ label, value, strong }) => (
  <div className={`flex justify-between ${strong ? 'pt-3 border-t border-line text-[17px] font-semibold text-fg' : ''}`}>
    <span>{label}</span>
    <span className="tabular-nums text-fg">{value}</span>
  </div>
);

export const OrderSuccess = () => {
  const { signedIn } = useCustomer();
  const { lastOrder: order } = useCart();

  if (!order) {
    return (
      <div className="pt-[calc(var(--gnav-h)+64px)] pb-24 site-container text-center min-h-[60vh]">
        <ShoppingBag className="w-10 h-10 mx-auto text-accent" strokeWidth={1.25} />
        <h1 className="mt-4 text-[28px] font-semibold tracking-tight text-fg">No recent order</h1>
        <p className="mt-2 text-muted">Orders you place on this device appear here.</p>
        <Link to="/shop" className="mt-6 inline-flex px-6 py-3 rounded-full bg-accent text-on-accent font-semibold">
          Go to the shop
        </Link>
      </div>
    );
  }

  const pay = PAYMENT[order.paymentStatus] || PAYMENT[order.paymentMethod === 'COD' ? 'cod' : 'unpaid'];
  const PayIcon = pay.icon;
  const c = order.customer || {};

  return (
    <div className="pt-[calc(var(--gnav-h)+32px)] pb-24">
      <SeoMeta title="Your order" noindex />

      <section className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
        <div className="print:hidden">
          <CheckoutSteps current={3} />
        </div>

        <div className="p-6 sm:p-10 rounded-tile bg-surface text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-fg">Thank you, your order is placed</h1>
          <p className="mt-2 text-[16px] text-muted">
            Order number <strong className="font-mono text-fg">{order.orderId}</strong>
            {order.date && <> · {order.date}</>}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            {order.customer?.email ? <>We've emailed a confirmation to <b className="text-fg">{order.customer.email}</b> and will email you at each step. </> : null}
            Keep this number for any questions about your order.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
            <button type="button" onClick={() => window.print()} className="px-5 py-2.5 rounded-full border border-line text-[14px] text-fg hover:border-accent inline-flex items-center gap-2">
              <Printer className="w-4 h-4 text-accent" /> Print
            </button>
            <Link to={signedIn ? `/account/orders/${order.orderId}` : '/account/login?next=/account'} className="px-5 py-2.5 rounded-full border border-line text-[14px] text-fg hover:border-accent">
              {signedIn ? 'Track this order' : 'Sign in to track your orders'}
            </Link>
            <Link to="/shop" className="px-5 py-2.5 rounded-full bg-accent text-on-accent text-[14px] font-semibold">
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Payment */}
        <div className="p-5 sm:p-6 rounded-tile bg-surface flex items-start gap-4">
          <PayIcon className={`w-6 h-6 shrink-0 mt-0.5 ${pay.tone}`} />
          <div>
            <h2 className="text-[17px] font-semibold text-fg">{pay.title}</h2>
            <p className="mt-1 text-[15px] text-muted">{pay.text}</p>
          </div>
        </div>

        {/* Items and amounts */}
        <div className="p-5 sm:p-8 rounded-tile bg-surface">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted pb-3 border-b border-line">Order details</h2>
          <ul className="divide-y divide-line">
            {(order.items || []).map((item, idx) => (
              <li key={`${item.id}-${idx}`} className="py-4 flex items-center gap-4">
                <SmartImage sizes="64px" src={item.image || item.images?.[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-sunken shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-fg">{item.name}</p>
                  <p className="text-[13px] text-muted">
                    {[item.selectedFinish, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="text-[15px] font-medium text-fg tabular-nums">{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-line space-y-2 text-[15px] text-muted">
            <Money label="Items" value={formatINR(order.subtotal)} />
            <Money label="GST (18%)" value={formatINR(order.tax)} />
            <Money label="Delivery & installation" value={order.shipping === 0 ? 'Free' : formatINR(order.shipping)} />
            <Money label="Total" value={formatINR(order.totalAmount)} strong />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-tile bg-surface grid grid-cols-1 sm:grid-cols-2 gap-6 text-[15px] text-muted">
          <div>
            <h3 className="text-fg font-semibold mb-1">Delivery address</h3>
            <p className="leading-relaxed">
              {c.fullName}
              <br />
              {c.address}
              <br />
              {c.city}, {c.state} {c.pincode}
            </p>
          </div>
          <div>
            <h3 className="text-fg font-semibold mb-1">Contact</h3>
            <p className="leading-relaxed">
              {c.phone}
              <br />
              {c.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
