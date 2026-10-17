import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { services } from '../data/services';
import { ease, dur } from '../lib/motion';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', menu: true },
  { label: 'Shop', to: '/shop' },
  { label: 'Projects', to: '/projects' },
  { label: 'Sourcing', to: '/sourcing' },
  { label: 'Journal', to: '/journal' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const iconButton =
  'relative w-9 h-9 inline-flex items-center justify-center rounded-full text-fg/80 hover:text-fg transition-colors shrink-0';

/** Past this many pixels, scrolling down tucks the bar away and scrolling up brings it back */
const HIDE_AFTER = 160;

/**
 * Global navigation, as on apple.com: a thin frosted bar with small centred links.
 * It slides away while you read down the page and returns as soon as you scroll up.
 * While hidden, <html data-gnav-hidden> sets --gnav-offset to 0, so page bars
 * (LocalNav) move up into its place.
 */
export const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef(null);

  const { cartCount } = useCart();
  const { openSearch } = useSearch();
  const location = useLocation();

  const openServices = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  };

  // Lenis scrolls the real window, so the native event covers smooth scrolling too
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > HIDE_AFTER && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A new page always starts with the bar visible
  useEffect(() => {
    setHidden(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const tucked = hidden && !servicesOpen && !mobileMenuOpen;
  useEffect(() => {
    document.documentElement.toggleAttribute('data-gnav-hidden', tucked);
  }, [tucked]);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header
        data-site-header
        className={`fixed top-0 inset-x-0 z-[1000] transition-transform duration-500 ease-apple ${tucked ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className={`glass border-b border-line/60 dark:border-line/70 ${servicesOpen ? '!bg-canvas' : ''}`}>
          <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Symmetry Interiors Home">
              <img src={logoImg} alt="Symmetry Logo" className="h-6 w-auto object-contain dark:hidden" />
              <img src={logoDarkImg} alt="Symmetry Logo" className="h-6 w-auto object-contain hidden dark:block" />
              <span className="wordmark text-[12px] leading-none text-fg">SYMMETRY</span>
            </Link>

            {/* Desktop links */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                const linkClass = `px-2.5 xl:px-3 py-1 text-[12.5px] whitespace-nowrap transition-colors duration-200 ${
                  active ? 'text-fg' : 'text-fg/70 hover:text-fg'
                }`;
                if (!link.menu) {
                  return (
                    <Link key={link.to} to={link.to} className={linkClass} aria-current={active ? 'page' : undefined}>
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <div key={link.to} className="flex" onMouseEnter={openServices} onMouseLeave={closeServices}>
                    <Link
                      to={link.to}
                      onClick={() => setServicesOpen(false)}
                      onFocus={openServices}
                      className={linkClass}
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={openSearch} className={iconButton} aria-label="Search" title="Search (Ctrl + K)">
                <Search className="w-[17px] h-[17px]" strokeWidth={1.7} />
              </button>
              <Link to="/shop" className={`${iconButton} hidden sm:inline-flex`} aria-label="Wishlist" title="Wishlist">
                <Heart className="w-[17px] h-[17px]" strokeWidth={1.7} />
              </Link>
              <Link to="/cart" className={iconButton} aria-label={`Cart with ${cartCount} items`} title="Cart">
                <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={1.7} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <m.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="absolute top-0.5 right-0 min-w-[15px] h-[15px] px-1 bg-accent text-on-accent text-[9.5px] font-semibold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </m.span>
                  )}
                </AnimatePresence>
              </Link>
              <ThemeToggle />
              {/* Apple-style two-line "hamburger" */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`${iconButton} lg:hidden`}
                aria-label="Open mobile menu"
              >
                <span className="relative block w-[17px] h-[9px]" aria-hidden="true">
                  <span className="absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-current" />
                  <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          {/* Services flyout (desktop): full width, links arrive one after another */}
          <AnimatePresence>
            {servicesOpen && (
              <m.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0, transition: { duration: dur.fast, ease: ease.apple } }}
                transition={{ duration: 0.4, ease: ease.apple }}
                className="hidden lg:block overflow-hidden"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <m.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.025, delayChildren: 0.08 } } }}
                  className="w-full max-w-[1100px] mx-auto px-10 pt-8 pb-12 grid grid-cols-12 gap-10"
                >
                  <m.div variants={flyItem} className="col-span-4">
                    <p className="text-[12px] text-subtle mb-3">Explore Services</p>
                    <Link
                      to="/services"
                      onClick={() => setServicesOpen(false)}
                      className="block text-[24px] font-semibold tracking-tight text-fg leading-snug hover:text-accent transition-colors"
                    >
                      From first sketch to final styling, under one roof.
                    </Link>
                    <Link to="/services" onClick={() => setServicesOpen(false)} className="link-apple mt-4 !text-[14px]">
                      Explore all services <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </m.div>
                  <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-0.5">
                    {services.map((svc) => (
                      <m.div variants={flyItem} key={svc.id}>
                        <Link
                          to={`/services#${svc.id}`}
                          onClick={() => setServicesOpen(false)}
                          className="block py-1.5 text-[17px] font-semibold tracking-tight text-fg/90 hover:text-accent transition-colors truncate"
                        >
                          {svc.title}
                        </Link>
                      </m.div>
                    ))}
                  </div>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Apple blurs the page behind an open flyout */}
      <AnimatePresence>
        {servicesOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.fast }}
            className="hidden lg:block fixed inset-0 z-[999] bg-canvas/30 backdrop-blur-md"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

const flyItem = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out } },
};

export default Header;
