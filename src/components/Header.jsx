import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, LogIn, Menu, ChevronDown, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { services } from '../data/services';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const { cartCount } = useCart();
  const { openSearch } = useSearch();
  const location = useLocation();

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lenisHandler = null;
    if (window.lenis) {
      lenisHandler = () => handleScroll();
      window.lenis.on('scroll', lenisHandler);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.lenis && lenisHandler) {
        window.lenis.off('scroll', lenisHandler);
      }
    };
  }, []);

  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'ABOUT US', to: '/about' },
    { label: 'SERVICES', to: '/services' },
    { label: 'SHOP LUXURY', to: '/shop' },
    { label: 'TURNKEY PROJECTS', to: '/projects' },
    { label: 'GLOBAL SOURCING', to: '/sourcing' },
    { label: 'JOURNAL', to: '/journal' },
    { label: 'CONTACT', to: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-[#F4F7F6]/98 dark:bg-[#07121C] backdrop-blur-2xl py-2 sm:py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.95)] border-b-2 border-[#36656B]/40 dark:border-[#BCA575]'
            : 'bg-[#F4F7F6]/95 dark:bg-[#07121C] backdrop-blur-md py-3 sm:py-3.5 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          {/* Logo with Theme-Adaptive light/dark support */}
          <Link
            to="/"
            className="flex flex-col items-center group shrink-0"
            aria-label="Symmetry Interiors Home"
          >
            {/* Light Mode Logo */}
            <img
              src={logoImg}
              alt="Symmetry Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 dark:hidden"
            />
            {/* Dark Mode Logo */}
            <img
              src={logoDarkImg}
              alt="Symmetry Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 hidden dark:block"
            />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-[#36656B] dark:text-[#BCA575] uppercase mt-0.5 leading-none font-sans transition-colors">
              SYMMETRY
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);

              if (link.label === 'SERVICES') {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setServicesDropdownOpen(false)}
                      className={`text-[11px] xl:text-[12px] uppercase font-sans tracking-luxury transition-colors duration-200 relative py-1.5 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? 'text-[#36656B] dark:text-[#BCA575] font-bold'
                          : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] font-semibold'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-[#36656B] dark:text-[#BCA575]' : 'text-current'
                        }`}
                      />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36656B] dark:bg-[#BCA575] rounded-full" />
                      )}
                    </Link>

                    {/* Dropdown Panel */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[580px] xl:w-[620px] rounded-2xl bg-white dark:bg-[#0D1C29] backdrop-blur-2xl border border-[#D1DCDE] dark:border-[#BCA575]/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-4 z-[110] overflow-hidden"
                        >
                          {/* Top Title Strip */}
                          <div className="flex items-center justify-between px-3 py-2 border-b border-[#D1DCDE]/60 dark:border-[#1E3447] mb-2">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#36656B] dark:text-[#BCA575]">
                              Architectural Spectrum &bull; 09 Practices
                            </span>
                            <Link
                              to="/services"
                              onClick={() => setServicesDropdownOpen(false)}
                              className="text-[11px] font-sans text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>All Services</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </div>

                          {/* 9 Services Grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {services.map((svc) => (
                              <Link
                                key={svc.id}
                                to={`/services#${svc.id}`}
                                onClick={() => setServicesDropdownOpen(false)}
                                className="group p-2.5 rounded-xl hover:bg-[#E5ECEC]/40 dark:hover:bg-[#132838] transition-all duration-200 flex items-start gap-2.5"
                              >
                                <span className="font-mono text-xs text-[#36656B] dark:text-[#BCA575] font-semibold mt-0.5 shrink-0">
                                  {svc.number}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-[13px] font-medium text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors truncate">
                                    {svc.title}
                                  </p>
                                  <p className="text-[11px] text-[#6B8083] dark:text-[#8E9CA8] font-light truncate mt-0.5">
                                    {svc.subtitle}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[11px] xl:text-[12px] uppercase font-sans tracking-luxury transition-colors duration-200 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#36656B] dark:text-[#BCA575] font-bold'
                      : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] font-semibold'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36656B] dark:bg-[#BCA575] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Sign In CTA */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-1.5 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors cursor-pointer"
              aria-label="Search"
              title="Search (Ctrl + K)"
            >
              <Search className="w-5 h-5 transition-transform hover:scale-110" />
            </button>

            {/* Wishlist / Saved Items Trigger */}
            <Link
              to="/shop"
              className="p-1.5 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 transition-transform hover:scale-110" />
            </Link>

            {/* Shopping Cart Trigger */}
            <Link
              to="/cart"
              className="relative p-1.5 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
              aria-label={`Cart with ${cartCount} items`}
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#36656B] dark:bg-[#BCA575] text-white dark:text-[#07121C] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Sign In Button */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#131E20] dark:bg-[#BCA575] text-white dark:text-[#07121C] text-[11px] font-semibold uppercase tracking-luxury hover:bg-[#36656B] dark:hover:bg-[#d4be8d] transition-colors shadow-sm whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
