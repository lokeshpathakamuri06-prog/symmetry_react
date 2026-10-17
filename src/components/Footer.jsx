import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, FileText } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logoDarkImg from '../assets/logo-dark.png';
import Newsletter from './Newsletter';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, telHref } from '../lib/contact';

// "@symmetryinteriors.ltd" from an Instagram profile URL
const instagramHandle = (url) => {
  const handle = (url || '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').split(/[/?]/)[0];
  return handle ? `@${handle}` : '';
};

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

const LINK_GROUPS = [
  {
    title: 'Services',
    links: [
      { label: 'Turnkey Execution', to: '/services' },
      { label: 'Space Planning', to: '/services' },
      { label: 'Global Sourcing', to: '/sourcing' },
      { label: 'Bespoke Millwork', to: '/services' },
      { label: 'Acoustic & Lighting', to: '/services' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Luxury Sofas', to: '/shop?category=luxury-sofas' },
      { label: 'Dining Furniture', to: '/shop?category=dining-furniture' },
      { label: 'Bedroom Furniture', to: '/shop?category=bedroom-furniture' },
      { label: 'Lighting', to: '/shop?category=lighting' },
      { label: 'Decorative Accessories', to: '/shop?category=decorative-accessories' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Symmetry', to: '/about' },
      { label: 'Download Catalog PDF', href: '/Symmetry-Interiors-Catalog.pdf', download: true },
      { label: 'Selected Works', to: '/projects' },
      { label: 'Design Journal', to: '/journal' },
      { label: 'Careers', to: '/careers' },
      { label: 'Showroom Appointments', to: '/contact' },
      { label: 'Client Bag', to: '/cart' },
    ],
  },
];

const linkClass = 'text-[13.5px] text-muted hover:text-fg transition-colors';

export const Footer = () => {
  const company = useSiteText('company');
  const footer = useSiteText('footer');
  return (
    <footer className="bg-sunken/60 dark:bg-surface/40 text-fg border-t border-line/70 dark:border-line transition-colors duration-300">
      <div className="site-container pt-16 sm:pt-20 pb-10">
        <Newsletter className="mb-16 sm:mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 pb-12 border-b border-line/80 dark:border-line">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Symmetry Interiors Home">
              <img src={logoImg} alt="Symmetry Logo" className="h-10 w-auto object-contain dark:hidden" />
              <img src={logoDarkImg} alt="Symmetry Logo" className="h-10 w-auto object-contain hidden dark:block" />
              <span className="text-[13px] font-semibold tracking-[0.2em] text-fg uppercase leading-none">
                SYMMETRY INTERIORS
              </span>
            </Link>

            <div className="space-y-1.5">
              <h3 className="text-[17px] font-semibold text-fg">{company.companyName}</h3>
              <p className="text-[14px] font-medium text-accent">{footer.tagline}</p>
              <p className="text-[12.5px] text-subtle">{footer.subTagline}</p>
            </div>

            <p className="text-[14px] text-muted leading-relaxed max-w-md">{footer.description}</p>

            <div className="space-y-3 text-[13.5px] text-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-2.5">
                  <div>
                    <span className="block text-[12px] font-medium text-fg">Office Address</span>
                    <span className="block leading-relaxed">{company.officeAddress}</span>
                  </div>
                  <div>
                    <span className="block text-[12px] font-medium text-fg">Registered Office</span>
                    <span className="block leading-relaxed">{company.registeredOffice}</span>
                    {company.cin && <span className="block text-[12px] text-subtle mt-0.5 tabular-nums">CIN: {company.cin}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href={telHref(company.phonePrimary)} className="hover:text-fg transition-colors">
                  {[company.phonePrimary, company.phoneSecondary].filter(Boolean).join(' / ')}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href={mailHref(company.email)} className="hover:text-fg transition-colors">
                  {company.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg transition-colors inline-flex items-center gap-1"
                >
                  <span>{instagramHandle(company.instagram)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group, i) => (
            <div key={group.title} className={i === 0 ? 'lg:col-start-7 lg:col-span-2' : 'lg:col-span-2'}>
              <h4 className="text-[13px] font-semibold text-fg mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a href={l.href} download={l.download ? 'Symmetry-Interiors-Catalog.pdf' : undefined} className={`${linkClass} inline-flex items-center gap-1.5 !text-accent font-medium`}>
                        <FileText className="w-3.5 h-3.5" />
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to} className={linkClass}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-subtle">
          <p>&copy; {new Date().getFullYear()} {company.shortName} All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span className="hover:text-fg cursor-pointer transition-colors">Discretion &amp; Privacy</span>
            <span className="hover:text-fg cursor-pointer transition-colors">Terms of Engagement</span>
            <span className="hover:text-fg cursor-pointer transition-colors">Certifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
