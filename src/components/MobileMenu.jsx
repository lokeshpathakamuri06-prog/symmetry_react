import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowUpRight, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import ThemeToggle from './ThemeToggle';
import Button from './Button';
import { services } from '../data/services';

export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);

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
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-50 bg-[#F4F7F6] dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#D1DCDE] dark:border-[#1E3447]">
            <Link to="/" onClick={onClose} className="flex flex-col items-center">
              <img
                src={logoImg}
                alt="Symmetry"
                className="h-8 w-auto object-contain dark:hidden"
              />
              <img
                src={logoDarkImg}
                alt="Symmetry"
                className="h-8 w-auto object-contain hidden dark:block"
              />
              <span className="text-[10px] font-bold tracking-[0.24em] text-[#4B666E] dark:text-[#F5F1E8] uppercase mt-0.5 font-sans transition-colors">
                SYMMETRY
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2.5 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <motion.ul
            variants={linkContainerVariants}
            className="my-8 space-y-3 sm:space-y-4"
          >
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;

              if (item.label === 'SERVICES') {
                return (
                  <motion.li key={item.to} variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between py-2 text-2xl sm:text-4xl font-serif tracking-tight">
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className={`transition-colors ${
                          isActive
                            ? 'text-[#36656B] dark:text-[#BCA575]'
                            : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575]'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesOpen(!servicesOpen)}
                        className="p-2 text-[#36656B] dark:text-[#BCA575] focus:outline-none"
                        aria-label="Toggle services list"
                      >
                        <ChevronDown
                          className={`w-6 h-6 transition-transform duration-300 ${
                            servicesOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-4 border-l-2 border-[#36656B]/40 space-y-2.5 overflow-hidden"
                        >
                          {services.map((svc) => (
                            <Link
                              key={svc.id}
                              to={`/services#${svc.id}`}
                              onClick={onClose}
                              className="block text-sm text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors py-1"
                            >
                              <span className="font-mono text-xs text-[#36656B] dark:text-[#BCA575] mr-2">
                                {svc.number}.
                              </span>
                              <span>{svc.title}</span>
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
                    className={`group flex items-center justify-between py-2 text-2xl sm:text-4xl font-serif tracking-tight transition-colors ${
                      isActive
                        ? 'text-[#36656B] dark:text-[#BCA575]'
                        : 'text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#36656B]" />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Footer of Menu */}
          <div className="pt-6 border-t border-[#D1DCDE] dark:border-[#1E3447] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#36656B]" />
                <span>Road No. 36, Jubilee Hills, Hyderabad</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1.5 hover:text-[#36656B]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#36656B]" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:concierge@symmetryinteriors.com"
                  className="flex items-center gap-1.5 hover:text-[#36656B]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#36656B]" />
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
              className="w-full"
            >
              Enquire Now
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
