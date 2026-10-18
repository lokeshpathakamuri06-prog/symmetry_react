import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useScrollLock } from '../../lib/scroll';
import { ease } from '../../lib/motion';

/** Phone sheet that slides up from the bottom (Sort, Filters). Esc or the backdrop closes it. */
export const BottomSheet = ({ open, onClose, title, children, footer }) => {
  useScrollLock(open);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-end" data-lenis-prevent role="dialog" aria-modal="true" aria-label={title}>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: ease.out }}
            className="relative w-full max-h-[85svh] bg-surface rounded-t-[24px] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line/60 dark:border-line">
              <h2 className="text-[19px] font-semibold tracking-tight text-fg">{title}</h2>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-sunken/70 flex items-center justify-center text-fg" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
            {footer && <div className="px-5 py-3 border-t border-line/60 dark:border-line">{footer}</div>}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
