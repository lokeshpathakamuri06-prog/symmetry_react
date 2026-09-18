import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowUpRight, Phone, Mail, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import ThemeToggle from './ThemeToggle';
import Button from './Button';
import { services } from '../data/services';

export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const backdropVariants = {
    closed: { opacity: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, transition: { duration: 0.3 } },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: '-100%',
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const linkContainerVariants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.15 },
    },
    closed: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex flex-col justify-between">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 bg-[#07121C]/60 backdrop-blur-md z-0"
          />

          {/* Drawer Menu Body */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="relative z-10 w-full h-full bg-[#F4F7F6] dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] flex flex-col justify-between p-5 sm:p-8 md:p-10 overflow-y-auto shadow-2xl"
          >
            {/* Top Bar Header inside Mobile Menu */}
            <div className="flex items-center justify-between pb-5 border-b border-[#D1DCDE] dark:border-[#1E3447]">
              <Link to="/" onClick={onClose} className="flex flex-col items-start group">
                <img
                  src={logoImg}
                  alt="Symmetry Interiors"
                  className="h-8 sm:h-9 w-auto object-contain dark:hidden"
                />
                <img
                  src={logoDarkImg}
                  alt="Symmetry Interiors"
                  className="h-8 sm:h-9 w-auto object-contain hidden dark:block"
                />
                <span className="text-[10px] font-bold tracking-[0.24em] text-[#36656B] dark:text-[#BCA575] uppercase mt-0.5 font-sans">
                  SYMMETRY INTERIORS
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full bg-white dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] dark:hover:border-[#BCA575] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <motion.ul
              variants={linkContainerVariants}
              className="my-6 space-y-2 sm:space-y-3"
            >
              {navLinks.map((item) => {
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to);

                if (item.label === 'SERVICES') {
                  return (
                    <motion.li key={item.to} variants={itemVariants} className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-[#D1DCDE]/40 dark:border-[#1E3447]/40">
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className={`text-xl sm:text-3xl font-serif tracking-tight transition-colors flex items-center gap-2 ${
                            isActive
                              ? 'text-[#36656B] dark:text-[#BCA575] font-semibold'
                              : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575]'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#36656B] dark:bg-[#BCA575]" />
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setServicesOpen(!servicesOpen)}
                          className="p-2 rounded-lg bg-white/60 dark:bg-[#132838]/60 text-[#36656B] dark:text-[#BCA575] hover:bg-[#36656B]/10 focus:outline-none cursor-pointer transition-colors"
                          aria-label="Toggle services list"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              servicesOpen ? 'rotate-180 text-[#36656B] dark:text-[#BCA575]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Services Sub-Accordion */}
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                            className="pl-3 sm:pl-4 border-l-2 border-[#36656B]/60 dark:border-[#BCA575]/60 my-2 space-y-2"
                          >
                            <div className="py-1 px-2 mb-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#36656B] dark:text-[#BCA575]">
                              <Sparkles className="w-3 h-3" />
                              <span>Architectural Spectrum &bull; 09 Services</span>
                            </div>
                            {services.map((svc) => (
                              <Link
                                key={svc.id}
                                to={`/services#${svc.id}`}
                                onClick={onClose}
                                className="block p-2 rounded-lg text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#36656B] dark:hover:text-[#BCA575] hover:bg-white/80 dark:hover:bg-[#132838] transition-all"
                              >
                                <span className="font-mono text-xs text-[#36656B] dark:text-[#BCA575] font-semibold mr-2">
                                  {svc.number}.
                                </span>
                                <span className="font-medium">{svc.title}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                }

                return (
                  <motion.li key={item.to} variants={itemVariants}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={`group flex items-center justify-between py-2 border-b border-[#D1DCDE]/40 dark:border-[#1E3447]/40 text-xl sm:text-3xl font-serif tracking-tight transition-all ${
                        isActive
                          ? 'text-[#36656B] dark:text-[#BCA575] font-semibold pl-1'
                          : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#36656B] dark:bg-[#BCA575]" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-[#36656B] dark:text-[#BCA575]" />
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Footer Information */}
            <div className="pt-5 border-t border-[#D1DCDE] dark:border-[#1E3447] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#36656B] dark:text-[#BCA575] shrink-0" />
                  <span>Road No. 36, Jubilee Hills, Hyderabad</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="tel:+919963499635"
                    className="flex items-center gap-1.5 hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
                    +91 99634 99635
                  </a>
                  <a
                    href="mailto:concierge@symmetryinteriors.com"
                    className="flex items-center gap-1.5 hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
                    concierge@symmetryinteriors.com
                  </a>
                </div>
              </div>

              <Button
                to="/contact"
                onClick={onClose}
                variant="primary"
                size="md"
                showArrow
                className="w-full text-center justify-center py-3"
              >
                Schedule Private Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

