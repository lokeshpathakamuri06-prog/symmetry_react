import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, FileText } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import Newsletter from './Newsletter';

const InstagramIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-[#E5ECEC]/40 dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] pt-8 sm:pt-10 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section Integrated in Footer */}
        <div className="mb-16">
          <Newsletter />
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-[#D1DCDE]/70 dark:border-[#1E3447]">
          {/* Col 1: Brand & Philosophy (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex flex-col items-start group" aria-label="Symmetry Interiors Home">
              <img
                src={logoImg}
                alt="Symmetry Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 dark:hidden"
              />
              <img
                src={logoDarkImg}
                alt="Symmetry Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 hidden dark:block"
              />
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#4B666E] dark:text-[#F5F1E8] uppercase mt-1 leading-none font-sans transition-colors">
                SYMMETRY
              </span>
            </Link>

            <p className="text-base text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed max-w-sm font-normal">
              Symmetry Interiors &amp; Building Solutions Pvt. Ltd. delivers bespoke turnkey interior architecture, high-precision millwork, and direct European furniture sourcing for discerning private clients.
            </p>

            <div className="pt-2 text-sm text-[#4F6467] dark:text-[#AEB7BE] space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#36656B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] block text-xs uppercase tracking-wider">Registered Office:</span>
                    <span>Plot No. 65, Seva Mandal Shantiniketan Colony, M. Hills, Secunderabad, Hyderabad, Telangana – 500026, India</span>
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold text-[#131E20] dark:text-[#F5F1E8] block text-xs uppercase tracking-wider">Design Pavilion &amp; Studio:</span>
                    <span>Level 4, Symmetry Pavilion, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#36656B] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#36656B] transition-colors">
                  +91 98765 43210 / +91 40 2355 8899
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#36656B] shrink-0" />
                <a href="mailto:concierge@symmetryinteriors.com" className="hover:text-[#36656B] transition-colors">
                  concierge@symmetryinteriors.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-5 h-5 text-[#36656B] shrink-0" />
                <a
                  href="https://www.instagram.com/symmetryinteriors.ltd/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#36656B] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>@symmetryinteriors.ltd</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Architecture & Services */}
          <div>
            <h4 className="text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-5">
              Services
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px] text-[#4F6467] dark:text-[#AEB7BE]">
              <li>
                <Link to="/services" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Turnkey Execution
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Space Planning
                </Link>
              </li>
              <li>
                <Link to="/sourcing" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Global Sourcing
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Bespoke Millwork
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Acoustic &amp; Lighting
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-5">
              Collections
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px] text-[#4F6467] dark:text-[#AEB7BE]">
              <li>
                <Link to="/shop?category=living" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Living Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dining" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Dining Tables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bedroom" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Sanctuary &amp; Beds
                </Link>
              </li>
              <li>
                <Link to="/shop?category=lighting" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Murano Lighting
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accents" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Travertine Objects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Press */}
          <div>
            <h4 className="text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px] text-[#4F6467] dark:text-[#AEB7BE]">
              <li>
                <Link to="/about" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  About Symmetry
                </Link>
              </li>
              <li>
                <a
                  href="/Symmetry-Interiors-Catalog.pdf"
                  download="Symmetry-Interiors-Catalog.pdf"
                  className="hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors font-medium flex items-center gap-1.5 text-[#36656B] dark:text-[#BCA575]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Catalog PDF</span>
                </a>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Selected Works
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Design Journal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Showroom Appointments
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#131E20] dark:hover:text-white transition-colors">
                  Client Bag
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#4F6467] dark:text-[#AEB7BE] font-normal">
          <p>
            &copy; {new Date().getFullYear()} Symmetry Interiors &amp; Building Solutions Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#36656B] cursor-pointer">Discretion &amp; Privacy</span>
            <span className="hover:text-[#36656B] cursor-pointer">Terms of Engagement</span>
            <span className="hover:text-[#36656B] cursor-pointer">Architectural Accreditation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
