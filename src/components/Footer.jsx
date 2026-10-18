import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, FileText, MessageCircle } from 'lucide-react';
import logoDarkImg from '../assets/logo-dark.png';
import Newsletter from './Newsletter';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, telHref, whatsappHref } from '../lib/contact';

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

const linkClass = 'text-[14px] sm:text-[15px] text-muted hover:text-fg transition-colors';

const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
);

const PinterestIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.2-5.08s-.3-.61-.3-1.5c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.43 0 .87-.55 2.17-.84 3.38-.24 1.01.51 1.83 1.5 1.83 1.8 0 3.18-1.9 3.18-4.63 0-2.42-1.74-4.12-4.23-4.12-2.88 0-4.57 2.16-4.57 4.39 0 .87.33 1.8.75 2.31.08.1.09.19.07.29l-.28 1.14c-.04.18-.15.22-.34.13-1.27-.59-2.06-2.45-2.06-3.94 0-3.21 2.33-6.16 6.73-6.16 3.53 0 6.28 2.52 6.28 5.88 0 3.51-2.21 6.33-5.28 6.33-1.03 0-2-.54-2.33-1.17l-.63 2.42c-.23.89-.85 2-1.27 2.68A10 10 0 1 0 12 2z" />
  </svg>
);

/**
 * Site footer on a black band, under the white newsletter band:
 *   1. brand, tagline and description, social links, and the two main actions;
 *   2. link columns (Services, Collections, Company) and the studio's contact details;
 *   3. copyright and legal line.
 * Company details come from Page Content → Company & Contact; texts from Page Content → Footer.
 */
export const Footer = () => {
  const company = useSiteText('company');
  const footer = useSiteText('footer');
  const socials = [
    { label: 'Instagram', icon: InstagramIcon, href: company.instagram },
    { label: 'LinkedIn', icon: LinkedInIcon, href: company.linkedin },
    { label: 'Pinterest', icon: PinterestIcon, href: company.pinterest },
    { label: 'WhatsApp', icon: MessageCircle, href: whatsappHref(company.whatsappNumber) },
  ].filter((x) => x.href);

  return (
    <footer>
      {/* Newsletter: a calm white band above the footer proper */}
      <div className="band-white section">
        <div className="site-container">
          <Newsletter />
        </div>
      </div>

      <div className="band-dark">
        <div className="site-container pt-14 sm:pt-20 pb-8">
          {/* 1. Brand and actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 sm:pb-16 border-b border-line">
            <div className="lg:col-span-7 space-y-5">
              <Link to="/" className="inline-flex items-center gap-3" aria-label="Symmetry Interiors Home">
                <img src={logoDarkImg} alt="Symmetry Logo" className="h-10 w-auto object-contain" />
                <span className="wordmark text-[15px] text-fg leading-none">SYMMETRY INTERIORS</span>
              </Link>
              <div>
                <p className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.08] text-fg">
                  {footer.tagline}
                </p>
                <p className="mt-2 text-[13px] sm:text-[14px] text-accent">{footer.subTagline}</p>
              </div>
              <p className="text-[15px] sm:text-[17px] text-muted leading-relaxed max-w-xl">{footer.description}</p>
            </div>

            <div className="lg:col-span-5 lg:pt-16 space-y-6">
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">Book a consultation</Link>
                <Link to="/projects" className="btn-secondary">Explore our work</Link>
              </div>
              {socials.length > 0 && (
                <div>
                  <p className="text-[13px] text-subtle mb-3">Follow Symmetry</p>
                  <div className="flex items-center gap-2.5">
                    {socials.map(({ label, icon: Icon, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="w-11 h-11 rounded-full border border-line text-fg/85 hover:text-on-accent hover:bg-accent hover:border-accent flex items-center justify-center transition-colors"
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Links and contact details */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10 py-12 sm:py-14 border-b border-line">
            {LINK_GROUPS.map((group) => (
              <div key={group.title} className="lg:col-span-2">
                <h4 className="text-[13px] font-semibold text-accent mb-4">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a
                          href={l.href}
                          download={l.download ? 'Symmetry-Interiors-Catalog.pdf' : undefined}
                          className={`${linkClass} inline-flex items-center gap-1.5 !text-fg`}
                        >
                          <FileText className="w-4 h-4 text-accent" />
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

            <div className="col-span-2 lg:col-span-6 lg:pl-8">
              <h4 className="text-[13px] font-semibold text-accent mb-4">Visit the studio</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[14px] sm:text-[15px] text-muted leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-fg">{company.companyName}</span>
                    <span className="block">{company.officeAddress}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-subtle shrink-0 mt-1" />
                  <div>
                    <span className="block font-semibold text-fg">Registered Office</span>
                    <span className="block">{company.registeredOffice}</span>
                  </div>
                </div>
                <a href={telHref(company.phonePrimary)} className="flex items-start gap-3 hover:text-fg transition-colors">
                  <Phone className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <span>
                    {[company.phonePrimary, company.phoneSecondary].filter(Boolean).map((ph) => (
                      <span key={ph} className="block tabular-nums">{ph}</span>
                    ))}
                  </span>
                </a>
                <div className="space-y-1.5">
                  <a href={mailHref(company.email)} className="flex items-start gap-3 hover:text-fg transition-colors">
                    <Mail className="w-4 h-4 text-accent shrink-0 mt-1" />
                    {/* A long address may wrap before the @, never mid-word */}
                    <span>
                      {company.email?.split('@')[0]}
                      <wbr />
                      {company.email?.includes('@') && `@${company.email.split('@')[1]}`}
                    </span>
                  </a>
                  {company.instagram && (
                    <a
                      href={company.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-fg transition-colors"
                    >
                      <InstagramIcon className="w-4 h-4 text-accent shrink-0" />
                      <span>{instagramHandle(company.instagram)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Legal row */}
          <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[13px] text-subtle">
            <p>
              Copyright &copy; {new Date().getFullYear()} {company.shortName} All rights reserved.
              {company.cin && <span className="block sm:inline sm:ml-2 tabular-nums">CIN: {company.cin}</span>}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-0 gap-y-1">
              {['Discretion & Privacy', 'Terms of Engagement', 'Certifications'].map((label, i) => (
                <span key={label} className={`text-muted ${i > 0 ? 'sm:border-l sm:border-line sm:pl-3 sm:ml-3' : ''}`}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
