import React from 'react';
import { STATUS, PAYMENT, REFUND_DUE } from './orderMeta';

const Pill = ({ meta, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${meta.style} ${className}`}>
    {meta.label}
  </span>
);

export const StatusPill = ({ status, className }) => <Pill meta={STATUS[status] || { label: status, style: 'bg-adm-fg/5 text-adm-muted' }} className={className} />;
// orderStatus (optional): a paid order that is cancelled shows "Refund due"
export const PaymentPill = ({ status, orderStatus, className }) => (
  <Pill meta={orderStatus === 'cancelled' && status === 'paid' ? REFUND_DUE : PAYMENT[status] || PAYMENT.unpaid} className={className} />
);
