/**
 * Razorpay Checkout: the payment window where the shopper pays by UPI, card, net banking or wallet.
 * Card and UPI details are typed into Razorpay's window, never into our page.
 */
const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
let loading = null;

const loadScript = () => {
  if (window.Razorpay) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_URL;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null;
        reject(new Error('Could not load the payment window. Check your connection and try again.'));
      };
      document.body.appendChild(s);
    });
  }
  return loading;
};

/**
 * Opens the payment window for an order the API created.
 * Resolves with Razorpay's response ({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
 * or with null if the shopper closed the window without paying.
 */
export const payWithRazorpay = async ({ payment, orderNumber, customer, method }) => {
  await loadScript();
  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: payment.keyId,
      order_id: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      name: 'Symmetry Interiors',
      description: `Order ${orderNumber}`,
      prefill: { name: customer.fullName, email: customer.email, contact: customer.phone, method },
      notes: { orderNumber },
      theme: { color: '#29666E' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => resolve(null), confirm_close: true },
    });
    rzp.open();
  });
};
