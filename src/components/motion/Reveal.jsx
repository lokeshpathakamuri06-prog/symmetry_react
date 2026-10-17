import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../../lib/motion';

/**
 * Wrapper that fades its content up once when it scrolls into view.
 * For an existing motion element, spread reveal() instead: <m.li {...reveal({ order: i })}>.
 *
 *   <Reveal>…</Reveal>
 *   <Reveal as="section" variant="fadeIn" order={2} className="…">…</Reveal>
 */
export const Reveal = ({ as = 'div', variant, order, speed, children, ...rest }) => {
  const Tag = m[as];
  return (
    <Tag {...reveal({ variant, order, speed })} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
