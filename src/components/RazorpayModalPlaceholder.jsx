import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react';

/**
 * Future Razorpay Integration Placeholder Modal
 * Simulates checkout gateway without executing real transactions.
 */
export default function RazorpayModalPlaceholder({
  isOpen,
  onClose,
  product,
  quantity = 1,
  selectedFinish = '',
  selectedColor = ''
}) {
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [selectedMethod, setSelectedMethod] = useState('upi');

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;
  const gst = Math.round(subtotal * 0.18);
  const testOrderId = `order_SYM_${(product?.id || 'LUX').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_77X`;

  const handleSimulatePayment = () => {
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('success');
    }, 1200);
  };

  const handleResetAndClose = () => {
    setPaymentState('idle');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        >
          {/* Razorpay Brand Header */}
          <div className="bg-[#0c2340] text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-400/30">
                <CreditCard className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold tracking-wide text-sm">RAZORPAY</span>
                  <span className="text-[10px] uppercase font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Integration Placeholder
                  </span>
                </div>
                <p className="text-xs text-stone-300">Symmetry Luxury Living Checkout</p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Test Mode Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/50 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Sandbox Preview:</strong> Live merchant credentials are staged for deployment. No funds will be charged.
            </span>
          </div>

          <div className="p-6">
            {paymentState === 'success' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-1">
                  Test Authorization Simulated!
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
                  Razorpay webhook simulated for reference <strong>{testOrderId}</strong>. In production, this completes instant validation.
                </p>

                <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-4 text-left text-xs space-y-2 border border-stone-200 dark:border-stone-700/60 mb-6">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Item:</span>
                    <span className="font-medium text-stone-900 dark:text-white">{product.name} (Qty: {quantity})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Amount:</span>
                    <span className="font-semibold text-stone-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Simulated Captured</span>
                  </div>
                </div>

                <button
                  onClick={handleResetAndClose}
                  className="w-full py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium hover:bg-stone-800 transition"
                >
                  Return to Product
                </button>
              </div>
            ) : (
              <div>
                {/* Order Breakdown */}
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-4 border border-stone-200 dark:border-stone-700/60 mb-6">
                  <div className="flex items-start justify-between pb-3 border-b border-stone-200 dark:border-stone-700/60">
                    <div>
                      <h4 className="font-serif font-semibold text-stone-900 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        Qty: {quantity} {selectedFinish ? `• Finish: ${selectedFinish}` : ''} {selectedColor ? `• Tone: ${selectedColor}` : ''}
                      </p>
                    </div>
                    <span className="font-serif font-semibold text-stone-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-3 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                    <div className="flex justify-between">
                      <span>Standard GST (18%)</span>
                      <span>₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>White-Glove Architectural Delivery</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-700/60 text-sm font-semibold text-stone-900 dark:text-white">
                      <span>Total Payable</span>
                      <span className="text-amber-600 dark:text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Methods */}
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Select Simulated Gateway Method
                </label>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { id: 'upi', label: 'UPI / QR Code', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', icon: '🏛️' },
                    { id: 'wire', label: 'NEFT / RTGS Wire', icon: '📑' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-3 rounded-lg border text-left text-xs font-medium flex items-center space-x-2 transition ${
                        selectedMethod === m.id
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <button
                  onClick={handleSimulatePayment}
                  disabled={paymentState === 'processing'}
                  className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-sm transition shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2 disabled:opacity-75"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentState === 'processing'
                      ? 'Simulating Razorpay Handshake...'
                      : `Pay ₹${total.toLocaleString('en-IN')} (Simulate Test)`}
                  </span>
                </button>

                <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL Encrypted • PCI-DSS Level 1 Ready</span>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
                  <p className="text-xs text-stone-500 flex items-center justify-center space-x-1">
                    <PhoneCall className="w-3 h-3" />
                    <span>Prefer assisted wire transfer? Contact our concierge at <strong>+91 (080) 4567 8900</strong></span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
