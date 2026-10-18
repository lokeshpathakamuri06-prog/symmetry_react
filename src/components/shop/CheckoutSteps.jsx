import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Bag', 'Address', 'Payment', 'Done'];

/** Where the shopper is in the purchase: Bag → Address → Payment → Done (as on Flipkart / Amazon) */
export const CheckoutSteps = ({ current }) => (
  <ol className="flex items-center w-full max-w-xl" aria-label="Checkout progress">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`} aria-current={active ? 'step' : undefined}>
          <span className="flex items-center gap-2 shrink-0">
            <span
              className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[12px] font-semibold transition-colors ${
                done ? 'bg-accent text-on-accent' : active ? 'bg-fg text-canvas' : 'bg-sunken text-muted'
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={`text-[13px] sm:text-[14px] ${active ? 'font-semibold text-fg' : 'text-muted'}`}>{label}</span>
          </span>
          {i < STEPS.length - 1 && <span className={`mx-2 sm:mx-3 h-px flex-1 ${done ? 'bg-accent' : 'bg-line'}`} />}
        </li>
      );
    })}
  </ol>
);

export default CheckoutSteps;
