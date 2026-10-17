import { useTransform } from 'framer-motion';

/**
 * Motion tokens for the public website: one place for every speed, curve and distance,
 * so all pages move the same way. CSS has matching variables (--ease-*, --dur-*) and
 * Tailwind names (ease-out-expo, ease-apple, duration-fast/base/slow).
 *
 *   <m.div {...reveal()}>              fade up once when it scrolls into view
 *   <m.div {...reveal({ order: i })}>  …in sequence with its siblings
 *   <m.img {...reveal({ variant: 'image' })}>  photo settles from a slight zoom
 *
 * Reduced motion is handled globally (<MotionConfig reducedMotion="user"> in App):
 * movement is dropped and only the fades remain.
 */

export const ease = {
  /** Entering: fast start, long soft landing (reveals, page changes, modals) */
  out: [0.16, 1, 0.3, 1],
  /** Apple's UI curve, for things already on screen that move or resize (menus, accordions) */
  apple: [0.28, 0.11, 0.32, 1],
};

export const dur = {
  fast: 0.2, // hover, press, small toggles
  base: 0.5, // reveals, modals, menus
  slow: 0.9, // hero and large photos
};

/** Delay between items that appear one after another */
export const STAGGER = 0.06;
/** Never wait longer than this for a staggered item, however long the list */
const MAX_ORDER = 6;
/** How far things travel when they appear */
export const DISTANCE = 24;

/** Start a little before the element is fully on screen; animate once only */
export const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' };

export const variants = {
  fadeUp: { hidden: { opacity: 0, y: DISTANCE }, show: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } },
  image: { hidden: { opacity: 0, scale: 1.04 }, show: { opacity: 1, scale: 1 } },
};

export const transition = (speed = 'base', delay = 0) => ({ duration: dur[speed], ease: ease.out, delay });

/** Delay for the n-th item of a group (capped, so long lists don't lag behind the scroll) */
export const staggerDelay = (order = 0) => Math.min(Math.max(order, 0), MAX_ORDER) * STAGGER;

/**
 * Props for an element that appears once when scrolled into view.
 * `order` puts it in sequence with siblings (0, 1, 2…); `speed` is fast | base | slow.
 */
export const reveal = ({ variant = 'fadeUp', order = 0, speed } = {}) => ({
  initial: 'hidden',
  whileInView: 'show',
  viewport: VIEWPORT,
  variants: variants[variant],
  transition: transition(speed || (variant === 'image' ? 'slow' : 'base'), staggerDelay(order)),
});

/** Same as reveal(), but plays as soon as the element mounts (above the fold) */
export const enter = ({ variant = 'fadeUp', order = 0, speed } = {}) => ({
  initial: 'hidden',
  animate: 'show',
  variants: variants[variant],
  transition: transition(speed || 'base', staggerDelay(order)),
});

/**
 * Scroll-linked value: maps scroll progress (0–1) to output values, like useTransform,
 * but always covers the full 0–1 range. Framer Motion hands simple ranges such as opacity
 * to the browser's native scroll timeline, and there a range that stops short of 0 or 1
 * drifts back to the element's base value outside it (a fade-in fading out again at the end).
 *
 *   const opacity = useScrollRange(scrollYProgress, [0.3, 0.6], [0, 1]);
 */
export const useScrollRange = (progress, input, output) => {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) {
    i.unshift(0);
    o.unshift(o[0]);
  }
  if (i[i.length - 1] < 1) {
    i.push(1);
    o.push(o[o.length - 1]);
  }
  return useTransform(progress, i, o);
};
