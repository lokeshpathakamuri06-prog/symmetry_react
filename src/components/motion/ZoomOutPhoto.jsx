import React, { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { reveal, useScrollRange } from '../../lib/motion';

/**
 * Apple-style "zoom out" moment: a full-screen photo stays pinned while you scroll and
 * shrinks into a rounded card, and the headline fades in over it.
 * Desktop only (md and up); phones and reduced motion get a still rounded photo with the same text.
 *
 *   <ZoomOutPhoto image={heroImage('/images/…jpeg')} alt="…" eyebrow="Why Symmetry" title="…" subtitle="…" />
 */
export const ZoomOutPhoto = ({ image, alt = '', eyebrow, title, subtitle }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // 0 → 0.6: the frame closes in to a card; the photo inside settles from a slight zoom
  const insetX = useScrollRange(scrollYProgress, [0, 0.6], [0, 7]);
  const insetY = useScrollRange(scrollYProgress, [0, 0.6], [0, 9]);
  const radius = useScrollRange(scrollYProgress, [0, 0.6], [0, 32]);
  const clipPath = useTransform([insetY, insetX, radius], ([y, x, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`);
  const photoScale = useScrollRange(scrollYProgress, [0, 0.6], [1.12, 1]);
  // 0.3 → 0.65: the words arrive once the card has mostly formed
  const textOpacity = useScrollRange(scrollYProgress, [0.3, 0.6], [0, 1]);
  const textY = useScrollRange(scrollYProgress, [0.3, 0.65], [40, 0]);

  const copy = (
    <>
      {eyebrow && <p className="eyebrow !text-[#D9C59A] mb-3">{eyebrow}</p>}
      <h2 className="text-display-lg text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.3)]">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-[17px] sm:text-[21px] leading-[1.5] text-white/85 max-w-2xl mx-auto [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]">
          {subtitle}
        </p>
      )}
    </>
  );

  const still = (
    <div className={reduce ? '' : 'md:hidden'}>
      <m.div {...reveal({ variant: 'scaleIn' })} className="site-container">
        <div className="relative overflow-hidden rounded-[22px] sm:rounded-panel aspect-[4/5] sm:aspect-[16/9] bg-black">
          <img {...image} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-center">{copy}</div>
        </div>
      </m.div>
    </div>
  );

  if (reduce) return still;

  return (
    <>
      {still}
      <section ref={ref} className="hidden md:block relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <m.div style={{ clipPath }} className="absolute inset-0 bg-black will-change-[clip-path]">
            <m.img
              {...image}
              alt={alt}
              loading="lazy"
              decoding="async"
              style={{ scale: photoScale }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          </m.div>
          <m.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-x-0 bottom-[14vh] px-6 text-center max-w-4xl mx-auto"
          >
            {copy}
          </m.div>
        </div>
      </section>
    </>
  );
};

export default ZoomOutPhoto;
