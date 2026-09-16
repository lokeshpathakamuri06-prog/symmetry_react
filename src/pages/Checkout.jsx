import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Landmark,
  Wallet,
  Banknote,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const { cartItems, subtotal, tax, shipping, totalAmount, recordOrder } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '',
    accessNotes: '',
    paymentMethod: 'upi', // 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
    upiId: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    selectedBank: 'hdfc',
    selectedWallet: 'paytm'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If cart is empty, redirect safely
  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Street address / Villa is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State / Region is required.';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required.';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Postal PIN Code is required.';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit PIN code.';
    }

    if (formData.paymentMethod === 'upi' && formData.upiId && !formData.upiId.includes('@')) {
      newErrors.upiId = 'Enter a valid UPI ID (e.g. yourname@okhdfcbank).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const orderId = `SYM-${Date.now().toString().slice(-6)}`;
      const orderRecord = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: [...cartItems],
        subtotal,
        tax,
        shipping,
        totalAmount,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          accessNotes: formData.accessNotes
        },
        paymentMethod: formData.paymentMethod.toUpperCase(),
        gateway: 'Razorpay (Simulated Sandbox)',
        status: 'Order Confirmed - Production Queued',
      };

      recordOrder(orderRecord);
      setLoading(false);
      navigate('/order-success');
    }, 1400);
  };

  return (
    <div className="pt-28 pb-24 space-y-12 min-h-[80vh]">
      <SeoMeta
        title="Secure Checkout | Symmetry Luxury Interiors"
        description="Finalize your bespoke interior commission with verified white-glove site delivery coordination and secure payment authorization."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: 'Shopping Bag', to: '/cart' },
            { label: 'Secure Checkout' },
          ]}
        />

        {/* Page Title */}
        <div className="mt-8 mb-10 border-b border-[#D1DCDE]/60 dark:border-[#1E3447] pb-6">
          <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Acquisition Step 02</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight mt-1">
            Delivery Address &amp; Payment
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] mt-2 font-light">
            All commissions include comprehensive architectural insurance, transit tracking, and complimentary inside placement.
          </p>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT 8 COLS: Customer Information, Shipping Address & Payment UI */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Customer Information */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <h2 className="text-xl font-serif text-[#131E20] dark:text-[#F5F1E8] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#36656B]/20 text-[#36656B] font-mono text-xs flex items-center justify-center font-bold">1</span>
                  <span>Customer Information</span>
                </h2>
                <span className="text-[11px] text-stone-500">* Required for dispatch communication</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rajiv Menon or Ar. Shalini Rao"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.fullName
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Email Address (For Invoices &amp; Tracking) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@luxuryestate.in"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.email
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Phone Number (Site Delivery WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.phone
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <h2 className="text-xl font-serif text-[#131E20] dark:text-[#F5F1E8] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#36656B]/20 text-[#36656B] font-mono text-xs flex items-center justify-center font-bold">2</span>
                  <span>Shipping &amp; Site Address</span>
                </h2>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  <span>White-Glove Delivery</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Street Address, Villa, or Penthouse Unit *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Villa 24, Road No. 36, Jubilee Hills"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.address
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.city
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Telangana, Karnataka, Maharashtra"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.state
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.state}</span>
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.country
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.country && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.country}</span>
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    PIN Code (Postal Code) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="500033"
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-2xl text-xs border ${
                      errors.pincode
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1DCDE] dark:border-[#1E3447]'
                    } bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]`}
                  />
                  {errors.pincode && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.pincode}</span>
                    </p>
                  )}
                </div>

                {/* Access Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium">
                    Site Access Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="accessNotes"
                    value={formData.accessNotes}
                    onChange={handleChange}
                    placeholder="e.g. Service lift available, floor 12, gate security code required"
                    className="w-full px-4 py-3 rounded-2xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-[#F4F7F6]/50 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-2 focus:ring-[#36656B]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method UI */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <h2 className="text-xl font-serif text-[#131E20] dark:text-[#F5F1E8] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#36656B]/20 text-[#36656B] font-mono text-xs flex items-center justify-center font-bold">3</span>
                  <span>Payment Authorization</span>
                </h2>

                {/* Razorpay Integration Placeholder Staging Banner */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c2340] text-white text-[11px] font-medium border border-sky-400/30">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  <span>Razorpay Sandbox Active</span>
                  <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded text-[9px] uppercase font-bold">
                    Test Mode
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, QR' },
                  { id: 'card', label: 'Cards', icon: CreditCard, desc: 'Visa, Master, Amex' },
                  { id: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'Top Indian Banks' },
                  { id: 'wallet', label: 'Wallets', icon: Wallet, desc: 'Paytm, Amazon Pay' },
                  { id: 'cod', label: 'Concierge COD', icon: Banknote, desc: 'Pay on Arrival' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = formData.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#36656B] bg-[#36656B]/10 ring-1 ring-[#36656B] text-[#131E20] dark:text-white'
                          : 'border-[#D1DCDE] dark:border-[#1E3447] text-stone-600 dark:text-stone-400 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#36656B]' : 'text-stone-400'}`} />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#36656B]" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{m.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Tab Sub-views */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-[#D1DCDE]/60 dark:border-[#1E3447]">
                {/* 1. UPI */}
                {formData.paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                      <span>Instant UPI Authorization (Zero Gateway Surcharge)</span>
                      <span className="text-[#36656B] font-semibold">Simulated Gateway</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Enter UPI ID or Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                        className="w-full px-4 py-2.5 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] focus:outline-none focus:ring-1 focus:ring-[#36656B]"
                      />
                      {errors.upiId && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.upiId}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Popular Handles:</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">@okhdfcbank</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">@okaxis</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">@ybl</span>
                    </div>
                  </div>
                )}

                {/* 2. Credit / Debit Card */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-stone-700 dark:text-stone-300 font-medium">
                      <span>Credit or Debit Card Details</span>
                      <span className="text-[11px] text-stone-400">256-Bit SSL Encrypted</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Name On Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="e.g. RAJIV MENON"
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="4532 •••• •••• 8892"
                        maxLength={19}
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#D1DCDE] dark:border-[#1E3447] bg-white dark:bg-[#07121C] font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking */}
                {formData.paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      Select Primary Banking Institution
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'hdfc', name: 'HDFC Bank' },
                        { id: 'icici', name: 'ICICI Bank' },
                        { id: 'sbi', name: 'State Bank of India' },
                        { id: 'axis', name: 'Axis Bank' },
                        { id: 'kotak', name: 'Kotak Mahindra' },
                        { id: 'other', name: 'Other Bank' },
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedBank: bank.id })}
                          className={`p-2.5 rounded-xl border text-xs text-left transition ${
                            formData.selectedBank === bank.id
                              ? 'border-[#36656B] bg-[#36656B]/15 font-semibold text-[#131E20] dark:text-white'
                              : 'border-[#D1DCDE] dark:border-[#1E3447] text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Digital Wallets */}
                {formData.paymentMethod === 'wallet' && (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      Select Digital Wallet
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'paytm', name: 'Paytm Wallet' },
                        { id: 'phonepe', name: 'PhonePe Wallet' },
                        { id: 'amazonpay', name: 'Amazon Pay' },
                      ].map((wallet) => (
                        <button
                          key={wallet.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedWallet: wallet.id })}
                          className={`p-2.5 rounded-xl border text-xs text-center transition ${
                            formData.selectedWallet === wallet.id
                              ? 'border-[#36656B] bg-[#36656B]/15 font-semibold text-[#131E20] dark:text-white'
                              : 'border-[#D1DCDE] dark:border-[#1E3447] text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {wallet.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Cash on Delivery / Concierge Pay */}
                {formData.paymentMethod === 'cod' && (
                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-[#36656B]" />
                      <span>White-Glove Concierge Pay On Delivery</span>
                    </div>
                    <p className="leading-relaxed">
                      For orders above ₹1,00,000, our delivery officer will carry a wireless card POS terminal and official receipt book. You may inspect the unboxed piece inside your premises prior to final approval.
                    </p>
                  </div>
                )}
              </div>

              {/* Sandbox Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Developer Notice:</strong> Razorpay integration is currently staged in sandbox mode. Clicking <em>Complete Purchase</em> will simulate an authorized gateway token and immediately generate an official commission proforma without charging your real card.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: Order Summary (Sticky) & Complete Purchase CTA */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-6 shadow-sm sticky top-28">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
                Review &amp; Authorize
              </span>
              <h3 className="text-2xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-medium mt-0.5">
                Order Summary
              </h3>
            </div>

            {/* Selected Items Micro-List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-medium text-[#131E20] dark:text-[#F5F1E8] truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-[#4F6467] dark:text-[#AEB7BE]">
                      Qty: {item.quantity} {item.selectedFinish ? `• ${item.selectedFinish}` : ''}
                    </div>
                  </div>
                  <div className="font-mono font-medium text-[#131E20] dark:text-[#F5F1E8] text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Financials Breakdown */}
            <div className="space-y-3 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
              <div className="flex justify-between items-center">
                <span>Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] font-mono">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Standard GST (18%)</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] font-mono">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>White-Glove Architectural Transit</span>
                <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    `₹${shipping.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-[#D1DCDE]/80 dark:border-[#1E3447] flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] block">
                    Total Payable
                  </span>
                  <span className="text-[10px] text-[#4F6467] dark:text-[#AEB7BE]">
                    (Inclusive of all taxes &amp; logistics)
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTA BUTTON: "Complete Purchase" */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-all duration-300 text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 shadow-luxury cursor-pointer disabled:opacity-70"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Authorizing Commission...' : 'Complete Purchase'}</span>
                {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
              </button>

              <Link
                to="/cart"
                className="w-full py-3 px-6 rounded-full border border-stone-300 dark:border-stone-700 hover:border-[#36656B] dark:hover:border-[#BCA575] text-[#131E20] dark:text-[#F5F1E8] text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 transition"
              >
                <span>Return to Shopping Bag</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-[#D1DCDE]/60 dark:border-[#1E3447] text-[11px] text-[#4F6467] dark:text-[#AEB7BE] space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#36656B]" />
                <span>256-bit encrypted checkout via Razorpay Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#36656B]" />
                <span>Complimentary white-glove inside placement across India</span>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Checkout;
