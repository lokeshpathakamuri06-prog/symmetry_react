import React from 'react';
import { AVAILABILITY_OPTIONS, effectiveAvailability } from '../../pages/admin/contentOptions';

const AVAILABILITY_STYLE = {
  in_stock: 'text-emerald-600 dark:text-emerald-400',
  made_to_order: 'text-amber-600 dark:text-amber-400',
  out_of_stock: 'text-red-600 dark:text-red-400',
};

export const AvailabilityLabel = ({ product }) => {
  const state = effectiveAvailability(product);
  const label = AVAILABILITY_OPTIONS.find((o) => o.value === state)?.label;
  return (
    <p className={`text-[11px] ${AVAILABILITY_STYLE[state]}`}>
      {label}
      {product.stockQuantity != null && ` · ${product.stockQuantity} left`}
    </p>
  );
};

export default AvailabilityLabel;
