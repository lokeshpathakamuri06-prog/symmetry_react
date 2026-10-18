import { useEffect } from 'react';

/** Marks the page as having a bottom buy bar on phones, so floating buttons move above it (index.css) */
export const useBuyBar = (active = true) => {
  useEffect(() => {
    if (!active) return undefined;
    document.documentElement.setAttribute('data-buy-bar', '');
    return () => document.documentElement.removeAttribute('data-buy-bar');
  }, [active]);
};

export default useBuyBar;
