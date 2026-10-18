import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { orders as ordersApi } from '../../services/adminApi';
import { useSiteText } from '../../context/PublicContentContext';
import logoImg from '../../assets/logo.png';

const GST_RATE = 0.18;

const money = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Rupees in words, Indian style (lakh, crore): 1,21,500 -> "One Lakh Twenty-One Thousand Five Hundred"
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const twoDigits = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ''}`);
const threeDigits = (n) => [n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred` : '', twoDigits(n % 100)].filter(Boolean).join(' ');
const inWords = (amount) => {
  let n = Math.round(amount);
  if (n === 0) return 'Zero';
  const parts = [];
  [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']].forEach(([size, name]) => {
    if (n >= size) {
      parts.push(`${n >= size * 100 ? threeDigits(Math.floor(n / size)) : twoDigits(Math.floor(n / size))} ${name}`);
      n %= size;
    }
  });
  if (n) parts.push(threeDigits(n));
  return parts.join(' ');
};

/** Printable GST tax invoice for one order (Admin → Orders → Generate invoice) */
export const AdminInvoice = () => {
  const { id } = useParams();
  const company = useSiteText('company');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersApi.get(id).then(setOrder).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-10 text-red-600">{error}</p>;
  if (!order) return <p className="p-10 text-stone-500">Loading…</p>;

  const c = order.customer || {};
  const sellerState = (company.gstState || 'Telangana').trim().toLowerCase();
  const sameState = (c.state || '').trim().toLowerCase() === sellerState;
  const tax = order.tax || 0;
  const lines = order.items || [];

  return (
    <div className="min-h-screen bg-stone-200 print:bg-white py-8 print:py-0 text-stone-900">
      <div className="max-w-[820px] mx-auto px-4 print:px-0 mb-4 flex items-center justify-between print:hidden">
        <Link to={`/admin/orders?open=${order.id}`} className="inline-flex items-center gap-2 text-[14px] text-stone-700 hover:text-stone-950">
          <ArrowLeft className="w-4 h-4" /> Back to order
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-[14px] font-medium">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {!order.invoiceNumber && (
        <p className="max-w-[820px] mx-auto mb-4 p-3 rounded-lg bg-amber-100 text-amber-900 text-[13px] print:hidden">
          This order has no invoice number yet. Use “Generate invoice” on the order first.
        </p>
      )}

      <article className="max-w-[820px] mx-auto bg-white shadow-xl print:shadow-none p-10 print:p-6 text-[12.5px] leading-relaxed">
        {/* Seller + title */}
        <header className="flex items-start justify-between gap-6 pb-6 border-b-2 border-stone-900">
          <div className="flex items-start gap-4">
            <img src={logoImg} alt="" className="w-14 h-14 object-contain" />
            <div>
              <p className="text-[16px] font-bold">{company.companyName || 'Symmetry Interiors & Building Solutions Pvt. Ltd.'}</p>
              <p className="text-stone-600 max-w-xs whitespace-pre-line">{company.officeAddress}</p>
              <p className="text-stone-600">{[company.phonePrimary, company.email].filter(Boolean).join(' · ')}</p>
              <p className="mt-1">
                <strong>GSTIN:</strong> {company.gstin || <span className="text-red-600">add in Page Content → Company</span>}
                {company.cin && <> · <strong>CIN:</strong> {company.cin}</>}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[20px] font-bold tracking-wide">TAX INVOICE</p>
            <p className="mt-2"><strong>Invoice no.</strong> {order.invoiceNumber || '—'}</p>
            <p><strong>Invoice date</strong> {order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString('en-IN') : '—'}</p>
            <p><strong>Order no.</strong> {order.orderNumber}</p>
            <p><strong>Order date</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </header>

        {/* Buyer */}
        <section className="grid grid-cols-2 gap-6 py-5 border-b border-stone-300">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Bill to / Ship to</p>
            <p className="font-semibold">{order.customerName}</p>
            <p>{c.address}</p>
            <p>{[c.city, c.state, c.pincode].filter(Boolean).join(', ')}</p>
            <p>{[order.customerPhone, order.customerEmail].filter(Boolean).join(' · ')}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Place of supply</p>
            <p>{c.state || '—'}</p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Payment</p>
            <p>
              {order.paymentMethod} · {order.paymentStatus === 'paid' ? `Paid${order.paidAt ? ` on ${new Date(order.paidAt).toLocaleDateString('en-IN')}` : ''}` : order.paymentStatus === 'cod' ? 'Cash on delivery' : 'Payment due'}
            </p>
            {order.razorpayPaymentId && <p className="text-stone-600">Ref. {order.razorpayPaymentId}</p>}
          </div>
        </section>

        {/* Items */}
        <table className="w-full mt-5 border-collapse">
          <thead>
            <tr className="bg-stone-100 text-left text-[11px] uppercase tracking-wider">
              <th className="p-2 border border-stone-300 w-8">#</th>
              <th className="p-2 border border-stone-300">Description</th>
              <th className="p-2 border border-stone-300 text-right">Qty</th>
              <th className="p-2 border border-stone-300 text-right">Rate (₹)</th>
              <th className="p-2 border border-stone-300 text-right">Taxable value (₹)</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td className="p-2 border border-stone-300 align-top">{i + 1}</td>
                <td className="p-2 border border-stone-300">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-stone-500 text-[11px]">{[l.id, l.selectedFinish, l.selectedFabric].filter(Boolean).join(' · ')}</p>
                </td>
                <td className="p-2 border border-stone-300 text-right">{l.quantity}</td>
                <td className="p-2 border border-stone-300 text-right">{money(l.price)}</td>
                <td className="p-2 border border-stone-300 text-right">{money(l.price * l.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <section className="mt-4 flex justify-end">
          <dl className="w-80 space-y-1">
            <div className="flex justify-between"><dt>Taxable value</dt><dd>₹{money(order.subtotal)}</dd></div>
            {sameState ? (
              <>
                <div className="flex justify-between"><dt>CGST @ {(GST_RATE * 50).toFixed(0)}%</dt><dd>₹{money(tax / 2)}</dd></div>
                <div className="flex justify-between"><dt>SGST @ {(GST_RATE * 50).toFixed(0)}%</dt><dd>₹{money(tax / 2)}</dd></div>
              </>
            ) : (
              <div className="flex justify-between"><dt>IGST @ {(GST_RATE * 100).toFixed(0)}%</dt><dd>₹{money(tax)}</dd></div>
            )}
            <div className="flex justify-between"><dt>Delivery & installation</dt><dd>₹{money(order.shipping)}</dd></div>
            <div className="flex justify-between pt-2 mt-2 border-t-2 border-stone-900 text-[15px] font-bold"><dt>Total</dt><dd>₹{money(order.total)}</dd></div>
          </dl>
        </section>
        <p className="mt-3"><strong>Amount in words:</strong> Rupees {inWords(order.total)} Only</p>

        <footer className="mt-10 pt-4 border-t border-stone-300 flex items-end justify-between gap-6 text-[11px] text-stone-600">
          <p className="max-w-sm">
            Goods once delivered and installed are covered by our warranty terms. This is a computer-generated invoice.
            {company.registeredOffice && <><br />Registered office: {company.registeredOffice}</>}
          </p>
          <div className="text-center">
            <div className="h-12" />
            <p className="pt-1 border-t border-stone-400 px-6">Authorised signatory</p>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default AdminInvoice;
