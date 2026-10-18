import React from 'react';
import { formatINR } from '../../lib/shop';
import { useCart } from '../../context/CartContext';

const Row = ({ label, children, className = '' }) => (
  <div className={`flex justify-between items-baseline gap-4 ${className}`}>
    <dt>{label}</dt>
    <dd className="font-medium text-fg tabular-nums">{children}</dd>
  </div>
);

/**
 * Price details as on Flipkart: price at M.R.P., discount, GST, delivery, total and what the
 * shopper saves. Same rules as the API (18% GST; free delivery above ₹1,50,000).
 */
export const PriceDetails = ({ className = '' }) => {
  const { cartItems, mrpTotal, savings, tax, shipping, totalAmount } = useCart();
  const count = cartItems.reduce((n, i) => n + i.quantity, 0);
  return (
    <div className={className}>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted pb-3 border-b border-line">Price details</h2>
      <dl className="py-4 space-y-3 text-[15px] text-muted border-b border-dashed border-line">
        <Row label={`Price (${count} ${count === 1 ? 'item' : 'items'})`}>{formatINR(mrpTotal)}</Row>
        {savings > 0 && (
          <Row label="Discount">
            <span className="text-emerald-600 dark:text-emerald-400">− {formatINR(savings)}</span>
          </Row>
        )}
        <Row label="GST (18%)">{formatINR(tax)}</Row>
        <Row label="Delivery & installation">
          {shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400">Free</span> : formatINR(shipping)}
        </Row>
      </dl>
      <div className="flex justify-between items-baseline py-4 border-b border-dashed border-line">
        <span className="text-[17px] font-semibold text-fg">Total amount</span>
        <span className="text-[22px] font-semibold tracking-tight text-fg tabular-nums">{formatINR(totalAmount)}</span>
      </div>
      {savings > 0 && (
        <p className="pt-3 text-[14px] font-medium text-emerald-600 dark:text-emerald-400">
          You will save {formatINR(savings)} on this order
        </p>
      )}
      {shipping > 0 && (
        <p className="pt-2 text-[13px] text-muted">Free delivery on orders above {formatINR(150000)} (before GST).</p>
      )}
    </div>
  );
};

export default PriceDetails;
