import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { ease } from '../../lib/motion';

// "25+", "1,200", "98%", "₹4.5L": number in the middle, anything else kept as is
const PARTS = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/;

/**
 * A stat that counts up from zero the first time it scrolls into view.
 * Text without a number ("Pan-India") is shown unchanged. The final value is
 * rendered until counting starts, so nothing reads "0" with reduced motion.
 */
export const CountUp = ({ value, duration = 1.4 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const match = String(value ?? '').match(PARTS);
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (!match || !inView || reduce) return undefined;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    const grouped = num.includes(',');
    const format = (v) => {
      const n = v.toFixed(decimals);
      return prefix + (grouped ? Number(n).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : n) + suffix;
    };
    const controls = animate(0, target, { duration, ease: ease.out, onUpdate: (v) => setShown(format(v)) });
    return () => controls.stop();
    // value is the only real input; match is derived from it
  }, [inView, reduce, value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className="tabular-nums">
      {shown ?? value}
    </span>
  );
};

export default CountUp;
