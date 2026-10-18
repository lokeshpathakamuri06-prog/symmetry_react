import React from 'react';
import { STATUS, PAYMENT } from './orderMeta';

const Pill = ({ meta, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${meta.style} ${className}`}>
    {meta.label}
  </span>
);

export const StatusPill = ({ status, className }) => <Pill meta={STATUS[status] || { label: status, style: 'bg-adm-fg/5 text-adm-muted' }} className={className} />;
export const PaymentPill = ({ status, className }) => <Pill meta={PAYMENT[status] || PAYMENT.unpaid} className={className} />;
