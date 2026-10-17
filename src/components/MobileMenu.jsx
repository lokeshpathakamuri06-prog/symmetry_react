import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, Mail, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '../lib/scroll';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import ThemeToggle from './ThemeToggle';
import { services } from '../data/services';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, telHref } from '../lib/contact';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', menu: true },
  { label: 'Shop', to: '/shop' },
  { label: 'Projects', to: '/projects' },
  { label: 'Global Sourcing', to: '/sourcing' },
  { label: 'Journal', to: '/journal' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const ease = [0.28, 0.11, 0.32, 1];

export const MobileMenu = ({ isOpen, onClose }) => {
  const company = useSiteText('company');
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);

  useScrollLock(isOpen);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          data-lenis-prevent
          className="fixed inset-0 z-[1100] bg-canvas/95 dark:bg-canvas/95 backdrop-blur-2xl text-fg flex flex-col overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Top bar */}
          <div className="site-container h-16 flex items-center justify-between shrink-0">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <img src={logoImg} alt="Symmetry Interiors" className="h-8 w-auto object-contain dark:hidden" />
              <img src={logoDarkImg} alt="Symmetry Interiors" className="h-8 w-auto object-contain hidden dark:block" />
              <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">SYMMETRY</span>
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-fg/80 hover:text-fg hover:bg-fg/[0.06] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Links */}
          <m.ul
            initial="closed"
            animate="open"
            variants={{ open: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
            className="site-container flex-1 pt-4 pb-8"
          >
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <m.li
                  key={item.to}
                  variants={{ closed: { opacity: 0, y: -8 }, open: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                  className="border-b border-line/60 dark:border-line"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={`flex-1 py-3.5 text-[26px] sm:text-[30px] font-semibold tracking-tight transition-colors ${
                        active ? 'text-accent' : 'text-fg hover:text-accent'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.menu && (
                      <button
                        type="button"
                        onClick={() => setServicesOpen((v) => !v)}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-full text-muted hover:bg-fg/[0.06]"
                        aria-label="Toggle services list"
                        aria-expanded={servicesOpen}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {item.menu && (
                    <AnimatePresence initial={false}>
                      {servicesOpen && (
                        <m.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 grid sm:grid-cols-2 gap-x-4">
                            {services.map((svc) => (
                              <Link
                                key={svc.id}
                                to={`/services#${svc.id}`}
                                onClick={onClose}
                                className="flex items-center justify-between py-2 text-[15px] text-muted hover:text-fg transition-colors"
                              >
                                <span>
                                  <span className="text-accent tabular-nums text-[13px] mr-2">{svc.number}</span>
                                  {svc.title}
                                </span>
                                <ChevronRight className="w-4 h-4 opacity-40" />
                              </Link>
                            ))}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  )}
                </m.li>
              );
            })}
          </m.ul>

          {/* Contact strip */}
          <div className="site-container pb-8 space-y-5 shrink-0">
            <div className="space-y-2.5 text-[14px] text-muted">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{company.officeAddress}</span>
              </p>
              <a href={telHref(company.phonePrimary)} className="flex items-center gap-2.5 hover:text-fg">
                <Phone className="w-4 h-4 text-accent" />
                {company.phonePrimary}
              </a>
              <a href={mailHref(company.email)} className="flex items-center gap-2.5 hover:text-fg">
                <Mail className="w-4 h-4 text-accent" />
                {company.email}
              </a>
            </div>
            <Link to="/contact" onClick={onClose} className="btn-primary w-full">
              Book a consultation
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
