import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, AlertCircle, Smartphone, Landmark, Wallet, Banknote, Info, Check } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import { useCart } from '../context/CartContext';
import Honeypot from '../components/Honeypot';
import { submitOrder, getCheckoutConfig, confirmPayment, formErrorMessage } from '../services/publicApi';
import { payWithRazorpay } from '../lib/razorpay';
import SmartImage from '../components/SmartImage';
import CheckoutSteps from '../components/shop/CheckoutSteps';
import PriceDetails from '../components/shop/PriceDetails';
import { formatINR } from '../lib/shop';
import { scrollToTarget } from '../lib/scroll';
import useBuyBar from '../lib/useBuyBar';

const ADDRESS_KEY = 'symmetry_address';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm or any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay, American Express' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'All major Indian banks' },
  { id: 'wallet', label: 'Wallets', icon: Wallet, desc: 'Paytm, Amazon Pay, Mobikwik and more' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay by cash, card or UPI when your order arrives' },
];

const EMPTY = { fullName: '', email: '', phone: '', address: '', city: '', state: 'Telangana', pincode: '', accessNotes: '' };

const loadAddress = () => {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}') };
  } catch {
    return EMPTY;
  }
};

const inputClass = (error) =>
  `w-full px-4 py-3 rounded-xl text-[15px] border bg-canvas/60 dark:bg-canvas text-fg placeholder:text-subtle focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent ${
    error ? 'border-red-500' : 'border-line'
  }`;

const Field = ({ label, name, error, className = '', children, ...props }) => (
  <div className={className}>
    <label htmlFor={`co-${name}`} className="block text-[13px] text-muted mb-1.5 font-medium">
      {label}
    </label>
    {children || <input id={`co-${name}`} name={name} className={inputClass(error)} aria-invalid={!!error} {...props} />}
    {error && (
      <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

const Section = ({ n, title, aside, children }) => (
  <section className="p-5 sm:p-8 rounded-tile bg-surface">
    <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-line">
      <h2 className="text-[19px] font-semibold tracking-tight text-fg flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-accent text-on-accent text-[13px] font-semibold inline-flex items-center justify-center">{n}</span>
        {title}
      </h2>
      {aside}
    </div>
    {children}
  </section>
);

export const Checkout = () => {
  const { cartItems, totalAmount, recordOrder } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(loadAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [chosenMethod, setMethod] = useState('upi');
  const [config, setConfig] = useState({ online: false, cod: true, codMaxTotal: null });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [website, setWebsite] = useState('');
  // An order saved on the server and waiting for its online payment (the shopper closed the payment window)
  const [awaiting, setAwaiting] = useState(null);
  // Placing an order empties the cart; don't let the empty-cart redirect beat the success page
  const [orderPlaced, setOrderPlaced] = useState(false);
  useBuyBar();

  useEffect(() => {
    getCheckoutConfig()
      .then((c) => setConfig(c))
      .catch(() => {});
  }, []);

  const codBlocked = !config.cod || (config.codMaxTotal && totalAmount > config.codMaxTotal);
  const method = chosenMethod === 'cod' && codBlocked ? 'upi' : chosenMethod;

  if ((!cartItems || cartItems.length === 0) && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number.';
    if (form.address.trim().length < 5) e.address = 'Enter your house number, building and street.';
    if (form.city.trim().length < 2) e.city = 'Enter your city.';
    if (!form.state) e.state = 'Choose your state.';
    if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit PIN code.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const customer = () => ({
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state,
    country: 'India',
    pincode: form.pincode.trim(),
    accessNotes: form.accessNotes.trim(),
  });

  const finish = (order, paymentStatus) => {
    setOrderPlaced(true);
    recordOrder({
      orderId: order.orderNumber,
      date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: order.items || cartItems,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      totalAmount: order.totalAmount,
      customer: order.customer || customer(),
      paymentMethod: order.paymentMethod || method.toUpperCase(),
      paymentStatus,
    });
    navigate('/order-success');
  };

  // Opens Razorpay for a saved order; on success the API verifies the signature
  const pay = async (order) => {
    const response = await payWithRazorpay({
      payment: order.payment,
      orderNumber: order.orderNumber,
      customer: order.customer || customer(),
      method: order.paymentMethod?.toLowerCase(),
    });
    if (!response) {
      setAwaiting(order);
      setFormError(`Payment was not completed. Your order ${order.orderNumber} is saved: tap "Pay ${formatINR(order.totalAmount)}" to try again.`);
      return;
    }
    try {
      const result = await confirmPayment(order.orderNumber, response);
      finish(order, result.paymentStatus);
    } catch {
      // Money may have been taken; Razorpay's webhook still marks the order paid
      finish(order, 'verifying');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (awaiting) {
      setLoading(true);
      try {
        await pay(awaiting);
      } catch (err) {
        setFormError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!validate()) {
      scrollToTarget('#co-details', { offset: -120 });
      return;
    }
    try {
      if (saveAddress) {
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(form));
      } else {
        localStorage.removeItem(ADDRESS_KEY);
      }
    } catch {
      /* storage blocked: nothing to remember */
    }

    setLoading(true);
    try {
      // The server prices the order from the catalogue; no card or UPI details are ever sent
      const order = await submitOrder({
        customer: customer(),
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          selectedFinish: item.selectedFinish,
          selectedFabric: item.selectedFabric,
        })),
        paymentMethod: method,
        website,
      });
      if (order.payment) await pay(order);
      else finish(order, order.paymentStatus || (method === 'cod' ? 'cod' : 'unpaid'));
    } catch (err) {
      if (err.status === 422 && err.field && err.field in form) {
        setErrors({ [err.field]: err.message });
        scrollToTarget('#co-details', { offset: -120 });
      } else {
        setFormError(err.status ? formErrorMessage(err) : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const payLabel = awaiting
    ? `Pay ${formatINR(awaiting.totalAmount)}`
    : method === 'cod'
      ? 'Place order'
      : config.online
        ? `Pay ${formatINR(totalAmount)}`
        : 'Place order';

  return (
    <div className="pt-[calc(var(--gnav-h)+32px)] pb-32 lg:pb-24 min-h-[80vh]">
      <SeoMeta title="Checkout | Symmetry Interiors" description="Delivery address and payment for your Symmetry Interiors order." />

      <div className="site-container">
        <CheckoutSteps current={1} />
        <h1 className="mt-8 text-[32px] sm:text-[44px] font-semibold tracking-tight text-fg leading-tight">Checkout</h1>
        <p className="mt-1 text-[15px] text-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} · Secure payment · Free placement in your home
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-8 space-y-6" id="co-details">
            {/* 1. Contact */}
            <Section n={1} title="Contact details">
              <fieldset disabled={!!awaiting} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" className="sm:col-span-2" />
                <Field label="Email (order updates and invoice)" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" inputMode="email" />
                <Field label="Mobile number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="10-digit mobile number" />
              </fieldset>
            </Section>

            {/* 2. Address */}
            <Section n={2} title="Delivery address">
              <fieldset disabled={!!awaiting} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="House / flat no., building, street, area" name="address" value={form.address} onChange={handleChange} error={errors.address} autoComplete="street-address" className="sm:col-span-2" />
                <Field label="PIN code" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} autoComplete="postal-code" inputMode="numeric" maxLength={6} />
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} autoComplete="address-level2" />
                <Field label="State" name="state" error={errors.state}>
                  <select id="co-state" name="state" value={form.state} onChange={handleChange} autoComplete="address-level1" className={inputClass(errors.state)}>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Country" name="country" value="India" readOnly className="opacity-80" />
                <Field label="Delivery notes (optional)" name="accessNotes" value={form.accessNotes} onChange={handleChange} placeholder="e.g. service lift available, gate code, best time to call" className="sm:col-span-2" />
                <label className="sm:col-span-2 inline-flex items-center gap-2.5 text-[14px] text-fg cursor-pointer select-none">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="w-4 h-4 accent-[rgb(var(--c-accent))]" />
                  Save these details on this device for next time
                </label>
              </fieldset>
            </Section>

            {/* 3. Payment */}
            <Section
              n={3}
              title="Payment method"
              aside={
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-muted">
                  <Lock className="w-3.5 h-3.5 text-accent" /> Secured by Razorpay
                </span>
              }
            >
              <div role="radiogroup" aria-label="Payment method" className="divide-y divide-line rounded-xl border border-line overflow-hidden">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  const disabled = !!awaiting || (m.id === 'cod' && codBlocked);
                  const selected = method === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-4 p-4 sm:p-5 transition-colors ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-sunken/40'
                      } ${selected ? 'bg-accent/[0.07]' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={selected}
                        disabled={disabled}
                        onChange={() => setMethod(m.id)}
                        className="mt-1 w-4 h-4 accent-[rgb(var(--c-accent))]"
                      />
                      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${selected ? 'text-accent' : 'text-muted'}`} strokeWidth={1.8} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-semibold text-fg">{m.label}</span>
                        <span className="block text-[13px] text-muted mt-0.5">
                          {m.id === 'cod' && config.codMaxTotal && totalAmount > config.codMaxTotal
                            ? `Available for orders up to ${formatINR(config.codMaxTotal)}`
                            : m.id === 'cod' && !config.cod
                              ? 'Not available at the moment'
                              : m.desc}
                        </span>
                        {selected && m.id !== 'cod' && (
                          <span className="block text-[13px] text-fg/80 mt-2">
                            {config.online
                              ? 'You will enter your payment details in the secure Razorpay window. We never see or store them.'
                              : 'We will send you a secure payment link by email and WhatsApp after confirming your order.'}
                          </span>
                        )}
                        {selected && m.id === 'cod' && (
                          <span className="block text-[13px] text-fg/80 mt-2">Our team will call to confirm the order before dispatch.</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              {!config.online && (
                <p className="mt-4 flex items-start gap-2 text-[13px] text-muted">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                  Instant online payment is being set up. Until then, online orders are confirmed by our team, who send you a secure payment link.
                </p>
              )}
            </Section>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[calc(var(--gnav-offset)+24px)] space-y-4">
            <div className="p-5 sm:p-6 rounded-tile bg-surface">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted pb-3 border-b border-line">
                Your order
              </h2>
              <ul className="py-3 space-y-3 max-h-64 overflow-y-auto" data-lenis-prevent>
                {cartItems.map((item) => (
                  <li key={item.cartKey} className="flex items-center gap-3">
                    <SmartImage sizes="56px" src={item.images?.[0] || item.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-sunken shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-fg truncate">{item.name}</p>
                      <p className="text-[12px] text-muted">Qty {item.quantity}</p>
                    </div>
                    <span className="text-[14px] font-medium text-fg tabular-nums">{formatINR(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/cart" className="text-[13px] font-medium text-accent hover:underline">
                Change items
              </Link>
            </div>

            <div className="p-5 sm:p-6 rounded-tile bg-surface">
              <PriceDetails />
              <Honeypot value={website} onChange={setWebsite} />
              {formError && (
                <p role="alert" className="mt-4 text-[13px] text-red-500 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="hidden lg:flex mt-5 w-full py-4 rounded-full bg-accent hover:bg-accent-hover text-on-accent text-[16px] font-semibold items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Please wait…' : payLabel}
              </button>
              <ul className="mt-5 space-y-2 text-[13px] text-muted">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" /> 10-year structural warranty
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" /> Delivery includes placement in your home
                </li>
              </ul>
            </div>
          </aside>

          {/* Phones: total and the pay button stay at the bottom of the screen */}
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 glass border-t border-line px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-[18px] font-semibold text-fg tabular-nums leading-tight">{formatINR(awaiting?.totalAmount ?? totalAmount)}</p>
              <p className="text-[12px] text-muted">Incl. GST and delivery</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-accent text-on-accent text-[15px] font-semibold disabled:opacity-60"
            >
              {loading ? 'Please wait…' : payLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
