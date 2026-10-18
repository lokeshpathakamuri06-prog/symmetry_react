import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Building2, Compass, ShoppingBag, LayoutGrid, Globe2, BookOpen, Briefcase, Phone, ChevronRight } from 'lucide-react';
import { reveal } from '../lib/motion';
import SectionHeading from './SectionHeading';
import { services } from '../data/services';
import { sourcingCountries } from '../data/sourcing';
import { useJobs, useSiteText } from '../context/PublicContentContext';

// Distinct, non-empty values of one field, in first-seen order
const distinct = (items, key) => [...new Set(items.map((i) => i[key]).filter(Boolean))];

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Home, under the hero: one small card per page with what that page holds,
 * so a first-time visitor sees the whole site without opening each page.
 */
const SiteOverview = ({ products, projects, blogs }) => {
  const { items: jobs, status: jobsStatus } = useJobs();
  const company = useSiteText('company');

  const cards = [
    {
      to: '/about',
      icon: Building2,
      title: 'About',
      summary: 'Our story, our 25,000 sq.ft. workshop and the team behind it.',
      items: ['25+ years', 'Own CNC workshop', '10-year warranty'],
    },
    {
      to: '/services',
      icon: Compass,
      title: 'Services',
      meta: plural(services.length, 'service'),
      summary: 'Design, turnkey work, bespoke furniture and styling.',
      items: services.slice(0, 4).map((s) => s.title),
    },
    {
      to: '/shop',
      icon: ShoppingBag,
      title: 'Shop',
      meta: plural(products.length, 'piece'),
      summary: 'Handcrafted furniture, lighting and decor to buy online.',
      items: distinct(products, 'categoryName').slice(0, 4),
    },
    {
      to: '/projects',
      icon: LayoutGrid,
      title: 'Projects',
      meta: plural(projects.length, 'project'),
      summary: 'Homes, offices, hotels and hospitals we have delivered.',
      items: distinct(projects, 'typology').slice(0, 4),
    },
    {
      to: '/sourcing',
      icon: Globe2,
      title: 'Sourcing',
      meta: plural(sourcingCountries.length, 'country'),
      summary: 'Marble, timber, cane and stone direct from the source.',
      items: sourcingCountries.map((c) => c.name),
    },
    {
      to: '/journal',
      icon: BookOpen,
      title: 'Journal',
      meta: plural(blogs.length, 'article'),
      summary: 'Material guides, buying tips and project stories.',
      items: distinct(blogs, 'category').slice(0, 4),
    },
    {
      to: '/careers',
      icon: Briefcase,
      title: 'Careers',
      meta: jobsStatus === 'ready' && jobs.length > 0 ? plural(jobs.length, 'opening') : undefined,
      summary: 'Internships and roles for designers and architects.',
      items: jobsStatus === 'ready' && jobs.length > 0 ? jobs.slice(0, 3).map((j) => j.title) : ['Internships', 'Fresher roles'],
    },
    {
      to: '/contact',
      icon: Phone,
      title: 'Contact',
      summary: 'Book a consultation or visit our studio in Hyderabad.',
      items: [company.phonePrimary, company.hours, 'Studio visit'].filter(Boolean),
    },
  ];

  return (
    <section id="site-overview" className="section" aria-labelledby="site-overview-title">
      <div className="site-container">
        <div className="mb-8 sm:mb-12">
          <SectionHeading
            eyebrow="At a glance"
            title={<span id="site-overview-title">Everything at Symmetry, in one place.</span>}
            subtitle="A quick look at what each page holds. Open any card for the full details."
          />
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <m.li {...reveal({ order: i % 4 })} key={card.to} className="flex">
                <Link
                  to={card.to}
                  className="group card-apple card-apple-hover flex flex-col w-full p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-accent/10 text-accent inline-flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="text-[19px] font-semibold tracking-tight text-fg">{card.title}</h3>
                    {card.meta && <span className="ml-auto text-[13px] font-medium text-muted whitespace-nowrap">{card.meta}</span>}
                  </div>

                  <p className="mt-3 text-[15px] leading-snug text-muted">{card.summary}</p>

                  {card.items.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {card.items.map((item) => (
                        <li key={item} className="px-2.5 py-1 rounded-full bg-sunken/70 dark:bg-sunken text-[12.5px] text-fg/80 leading-tight">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="mt-auto pt-5 inline-flex items-center gap-1 text-[14px] font-medium text-accent">
                    Open {card.title}
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </m.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default SiteOverview;
