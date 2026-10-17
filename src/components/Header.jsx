import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, ChevronDown, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { services } from '../data/services';

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

const iconBase = 'relative w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors shrink-0';
const iconOnPage = 'text-fg/80 hover:text-fg hover:bg-fg/[0.06]';
const iconOnPhoto = 'text-white/90 hover:text-white hover:bg-white/15';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled((window.scrollY || document.documentElement.scrollTop || 0) > 8);
    handleScroll();
    // Lenis scrolls the real window, so the native event covers smooth scrolling too
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // At the top of Home the bar sits on the hero photo: transparent with white text
  const overHero = location.pathname === '/' && !scrolled && !servicesOpen;
  const iconButton = `${iconBase} ${overHero ? iconOnPhoto : iconOnPage}`;

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header
        data-site-header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-[background-color,border-color,box-shadow] duration-300 border-b ${overHero ? 'bg-transparent' : 'glass'} ${
          scrolled || servicesOpen
            ? 'border-line/80 dark:border-line shadow-[0_1px_0_rgba(0,0,0,0.02)]'
            : 'border-transparent'
        } ${servicesOpen ? '!bg-canvas' : ''}`}
      >
        <div className="site-container h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Symmetry Interiors Home">
            <img src={logoImg} alt="Symmetry Logo" className={`h-8 w-auto object-contain ${overHero ? 'hidden' : 'dark:hidden'}`} />
            <img src={logoDarkImg} alt="Symmetry Logo" className={`h-8 w-auto object-contain ${overHero ? 'block' : 'hidden dark:block'}`} />
            <span className={`text-[13px] font-semibold tracking-[0.2em] uppercase leading-none transition-colors ${overHero ? 'text-white' : 'text-fg'}`}>
              SYMMETRY
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const linkClass = `relative px-3 py-2 rounded-full text-[13.5px] whitespace-nowrap transition-colors duration-200 flex items-center gap-1 ${
                overHero
                  ? active ? 'text-white font-semibold' : 'text-white/80 hover:text-white font-normal'
                  : active ? 'text-fg font-semibold' : 'text-fg/70 hover:text-fg font-normal'
              }`;
              if (!link.menu) {
                return (
                  <Link key={link.to} to={link.to} className={linkClass} aria-current={active ? 'page' : undefined}>
                    {link.label}
                    {active && <span className={`absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full ${overHero ? 'bg-white' : 'bg-accent'}`} />}
                  </Link>
                );
              }
              return (
                <div key={link.to} onMouseEnter={openServices} onMouseLeave={closeServices}>
                  <Link
                    to={link.to}
                    onClick={() => setServicesOpen(false)}
                    className={linkClass}
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                    onFocus={openServices}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                    {active && <span className={`absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full ${overHero ? 'bg-white' : 'bg-accent'}`} />}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button onClick={openSearch} className={iconButton} aria-label="Search" title="Search (Ctrl + K)">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </button>
            <Link to="/shop" className={`${iconButton} hidden sm:inline-flex`} aria-label="Wishlist" title="Wishlist">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </Link>
            <Link to="/cart" className={iconButton} aria-label={`Cart with ${cartCount} items`} title="Cart">
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-accent text-on-accent text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <ThemeToggle onPhoto={overHero} />
            <Link
              to="/contact"
              className={`hidden md:inline-flex ml-1.5 items-center rounded-full px-4 py-[7px] text-[13px] font-medium transition-colors whitespace-nowrap ${
                overHero ? 'bg-white text-[#1D1D1F] hover:bg-white/90' : 'bg-accent text-on-accent hover:bg-accent-hover'
              }`}
            >
              Book a consultation
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`${iconButton} xl:hidden`}
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Services mega menu (desktop) */}
        <AnimatePresence>
          {servicesOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.28, 0.11, 0.32, 1] }}
              className="hidden xl:block overflow-hidden border-t border-line/60 dark:border-line"
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              <div className="site-container py-8 grid grid-cols-12 gap-10">
                <div className="col-span-3">
                  <p className="text-[12px] text-subtle mb-3">Services</p>
                  <p className="text-[22px] font-semibold tracking-tight text-fg leading-snug">
                    From first sketch to final styling, under one roof.
                  </p>
                  <Link to="/services" onClick={() => setServicesOpen(false)} className="link-apple mt-4 text-[14px]">
                    Explore all services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="col-span-9 grid grid-cols-3 gap-x-6 gap-y-1">
                  {services.map((svc) => (
                    <Link
                      key={svc.id}
                      to={`/services#${svc.id}`}
                      onClick={() => setServicesOpen(false)}
                      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-fg/[0.04] transition-colors"
                    >
                      <span className="text-[12px] font-medium text-accent tabular-nums mt-0.5 shrink-0">{svc.number}</span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-fg truncate">{svc.title}</span>
                        <span className="block text-[12.5px] text-muted truncate mt-0.5">{svc.subtitle}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Header;
