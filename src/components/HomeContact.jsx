import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { reveal } from '../lib/motion';
import SectionHeading from './SectionHeading';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, mapsHref, telHref, whatsappHref } from '../lib/contact';

/**
 * Home's last section: the studio's contact details as four tiles (from Page Content → Company & Contact).
 * On phones the address and email tiles take the full width so long lines never break mid-word.
 */
export const HomeContact = () => {
  const company = useSiteText('company');
  const phones = [company.phonePrimary, company.phoneSecondary].filter(Boolean);

  const tiles = [
    {
      icon: MapPin,
      label: 'Visit the studio',
      wide: true,
      lines: [company.officeAddress],
      action: { href: mapsHref(company.officeAddress), text: 'Get directions', external: true },
    },
    {
      icon: Phone,
      label: 'Call us',
      lines: phones,
      action: { href: telHref(company.phonePrimary), text: 'Call now' },
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      lines: [company.whatsappNumber],
      action: {
        href: whatsappHref(company.whatsappNumber, 'Hello, I would like to schedule a design consultation with Symmetry Interiors.'),
        text: 'Start a chat',
        external: true,
      },
    },
    {
      icon: Mail,
      label: 'Email',
      wide: true,
      lines: [company.email, company.emailProjects].filter(Boolean),
      action: { href: mailHref(company.email), text: 'Write to us' },
    },
  ].filter((t) => t.lines.some(Boolean));

  return (
    <section id="contact-section" className="section">
      <div className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <SectionHeading
            eyebrow="Contact Information"
            title="Visit, call or write."
            subtitle="Our design team in Hyderabad is ready to talk about your space."
          />
          <m.div {...reveal({ order: 2 })} className="shrink-0">
            <Link to="/contact" className="link-apple">
              Book a consultation <ChevronRight className="w-4 h-4" />
            </Link>
          </m.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <m.div {...reveal({ order: idx })} key={tile.label} className={`card-apple p-4 sm:p-8 flex flex-col ${tile.wide ? 'col-span-2 lg:col-span-1' : ''}`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" strokeWidth={1.6} />
                <h3 className="mt-3 sm:mt-5 text-[16px] sm:text-[19px] font-semibold tracking-tight text-fg">{tile.label}</h3>
                <div className="mt-1.5 sm:mt-2 text-[13px] sm:text-[15px] text-muted leading-relaxed flex-1 break-words">
                  {/* Long email addresses may wrap before the @, never mid-word */}
                  {tile.lines.filter(Boolean).map((line) => {
                    const at = line.indexOf('@');
                    return (
                      <p key={line}>
                        {at > 0 ? <>{line.slice(0, at)}<wbr />{line.slice(at)}</> : line}
                      </p>
                    );
                  })}
                </div>
                {tile.action.href && (
                  <a
                    href={tile.action.href}
                    {...(tile.action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="link-apple mt-3 sm:mt-5 !text-[13px] sm:!text-[15px]"
                  >
                    {tile.action.text} <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </m.div>
            );
          })}
        </div>

        {company.hours && (
          <m.p {...reveal({ order: 4 })} className="mt-8 flex items-center justify-center gap-2 text-[14px] text-muted text-center">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span>
              Visiting hours: {company.hours} · Sunday by appointment
            </span>
          </m.p>
        )}
      </div>
    </section>
  );
};

export default HomeContact;
