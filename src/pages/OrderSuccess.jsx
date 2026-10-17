import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import SmartImage from '../components/SmartImage';

export const OrderSuccess = () => {
  const { lastOrder } = useCart();

  // Fallback demo order if visited directly
  const order = lastOrder || {
    orderId: 'SYM-894102',
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    customer: {
      fullName: 'Private Client',
      email: 'client@domain.com',
      phone: '+91 98765 43210',
      address: 'Villa 14, Boulder Enclave, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    items: [
      {
        id: 'sym-001',
        name: 'Aurelia Curved Bouclé Sofa',
        collection: 'Milanese Monolith',
        selectedFinish: 'Warm Ivory Bouclé',
        quantity: 1,
        price: 345000,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'],
      },
    ],
    subtotal: 345000,
    tax: 62100,
    shipping: 0,
    totalAmount: 407100,
    status: 'Order Confirmed - Production Queued',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-24 space-y-12">
      <SeoMeta
        title="Order Confirmation"
        description="Your order with Symmetry Interiors & Building Solutions Pvt. Ltd. is confirmed."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Order Confirmation' }]} />

        {/* Success Header Banner */}
        <div className="mt-8 p-8 sm:p-12 rounded-tile bg-surface text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs text-accent font-semibold block mb-1">
            Order Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Order Successfully Confirmed
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto mt-2">
            Thank you, {order.customer?.fullName}. Your order reference is <strong className="font-mono text-fg">{order.orderId}</strong>. A formal signed proforma has been transmitted to {order.customer?.email}.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-full border border-line text-[14px] tracking-[-0.01em] text-fg hover:border-accent flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-accent" />
              <span>Print</span>
            </button>
            <Button to="/shop" variant="primary" size="sm" showArrow>
              Continue Exploring
            </Button>
          </div>
        </div>

        {/* Timeline / Production Status */}
        <div className="mt-8 p-6 sm:p-8 rounded-tile bg-sunken/40 dark:bg-surface space-y-6">
          <h3 className="text-lg font-semibold text-fg">
            What Happens Next
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface dark:bg-canvas">
              <span className="text-accent font-semibold block mb-1">Step 01 &bull; Complete</span>
              <p className="font-medium text-fg">Order Confirmed</p>
              <p className="text-[10px] text-muted mt-0.5">Materials reserved</p>
            </div>

            <div className="p-4 rounded-xl bg-surface dark:bg-canvas">
              <span className="text-muted font-semibold block mb-1">Step 02 &bull; Queued</span>
              <p className="font-medium text-fg">Making Your Piece</p>
              <p className="text-[10px] text-muted mt-0.5">Machined and hand-finished</p>
            </div>

            <div className="p-4 rounded-xl bg-surface dark:bg-canvas">
              <span className="text-muted font-semibold block mb-1">Step 03</span>
              <p className="font-medium text-fg">Quality Inspection</p>
              <p className="text-[10px] text-muted mt-0.5">Strength and finish checks</p>
            </div>

            <div className="p-4 rounded-xl bg-surface dark:bg-canvas">
              <span className="text-muted font-semibold block mb-1">Step 04</span>
              <p className="font-medium text-fg">White Glove Delivery</p>
              <p className="text-[10px] text-muted mt-0.5">On-site assembly in Hyderabad</p>
            </div>
          </div>
        </div>

        {/* Itemized Breakdown */}
        <div className="mt-8 p-6 sm:p-8 rounded-tile bg-surface space-y-6">
          <h3 className="text-lg font-semibold text-fg pb-3 border-b border-line/50 dark:border-line">
            Order Details
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 text-xs pb-3 border-b border-line/30 dark:border-line">
                <div className="flex items-center gap-3">
                  <SmartImage sizes="96px"
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#E5ECEC]"
                  />
                  <div>
                    <h4 className="font-medium text-fg text-sm">
                      {item.name}
                    </h4>
                    <p className="text-muted">
                      Finish: {item.selectedFinish} &bull; Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-fg text-sm">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-muted pt-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-fg">
                ₹{order.subtotal?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>18% GST</span>
              <span className="font-medium text-fg">
                ₹{order.tax?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>White-Glove Delivery</span>
              <span className="font-medium text-fg">
                {order.shipping === 0 ? 'Complimentary' : `₹${order.shipping}`}
              </span>
            </div>
            <div className="pt-3 border-t border-line/70 dark:border-line flex justify-between items-baseline">
              <span className="text-sm font-semibold text-fg">
                Total Amount
              </span>
              <span className="text-2xl font-medium text-fg">
                ₹{order.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Site Details Card */}
        <div className="mt-8 p-6 rounded-tile bg-surface grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-muted">
          <div>
            <h4 className="text-fg font-semibold mb-1">
              Delivery Address
            </h4>
            <p className="leading-relaxed">
              {order.customer?.address}<br />
              {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
            </p>
          </div>
          <div>
            <h4 className="text-fg font-semibold mb-1">
              Your Contact Details
            </h4>
            <p className="leading-relaxed">
              {order.customer?.fullName}<br />
              {order.customer?.phone} &bull; {order.customer?.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
