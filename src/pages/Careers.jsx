import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Armchair,
  ArrowRight,
  Box,
  Briefcase,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Copy,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Quote,
  Ruler,
  Sofa,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import { SEO_DEFAULTS } from '../lib/seoDefaults';
import PageHero from '../components/PageHero';
import ContentState from '../components/ContentState';
import ApplicationForm from '../components/careers/ApplicationForm';
import { useJobs, useSiteText } from '../context/PublicContentContext';
import { heroImage } from '../lib/staticImages';
import { reveal, dur, ease } from '../lib/motion';
import { scrollToTarget } from '../lib/scroll';
import { mailHref, telHref } from '../lib/contact';
import {
  opportunityAreas,
  expectations,
  programmeStructure,
  hiringSteps,
  sampleTeamVoices,
} from '../data/careers';

const areaIcons = {
  'interior-designer': Sofa,
  'architecture-drafting': Ruler,
  '3d-visualization': Box,
  'furniture-materials': Armchair,
  'project-coordination': ClipboardCheck,
  'marketing-content': Megaphone,
};
const programmeIcons = [Clock, Briefcase, Wallet, GraduationCap];

const GENERAL_SUBJECT = 'General Application – [Your Name] – [Area of Interest]';

const Heading = ({ eyebrow, title, text, center = false, id, size = 'lg' }) => (
  <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <m.p {...reveal()} className="eyebrow mb-3">{eyebrow}</m.p>}
    <m.h2 {...reveal({ order: 1 })} id={id} className={`${size === 'md' ? 'text-display-md' : 'text-display-lg'} text-fg`}>
      {title}
    </m.h2>
    {text && (
      <m.p {...reveal({ order: 2 })} className="mt-4 text-[17px] sm:text-[19px] leading-[1.55] text-muted">
        {text}
      </m.p>
    )}
  </div>
);

export const Careers = () => {
  const { items: jobs, status: jobsStatus, retry: retryJobs } = useJobs();
  const company = useSiteText('company');
  const [position, setPosition] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(false);

  const applyFor = (value) => {
    setPosition(value);
    scrollToTarget('#apply');
  };

  const copySubject = async () => {
    try {
      await navigator.clipboard.writeText(GENERAL_SUBJECT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the subject line is on screen to copy by hand
    }
  };

  // Shown only once the client fills them in (Admin → Page Content → Company & Contact)
  const careersEmail = company.careersEmail?.trim();
  const hrPhone = company.hrPhone?.trim();

  return (
    <div className="pb-20 sm:pb-28 space-y-20 sm:space-y-28 overflow-x-clip">
      <SeoMeta page="careers" title={SEO_DEFAULTS.careers.title} description={SEO_DEFAULTS.careers.description} />

      {/* 1. Hero */}
      <PageHero
        page="careers"
        breadcrumb={[{ label: 'Careers' }]}
        eyebrow="Careers at Symmetry"
        title="Start Your Design Journey"
        highlight="With Symmetry"
        subtitle="Are you an architecture or interior design student ready to move beyond the classroom? Our internship and fresher opportunities offer exposure to the practical side of the interiors industry."
        image={heroImage('/images/hero/stock-careers.jpeg')}
        imageAlt="An architect drawing plans by hand"
        navCta={{ label: 'Apply now', href: '#apply' }}
        actions={
          <>
            <a href="#opportunities" className="btn-primary">Explore opportunities</a>
            <a href="#apply" className="btn-secondary">Apply now</a>
          </>
        }
      />

      {/* 2. Areas of opportunity */}
      <section id="opportunities" className="site-container scroll-mt-24" aria-labelledby="opportunities-title">
        <Heading
          id="opportunities-title"
          eyebrow="Areas of opportunity"
          title="Find where you fit."
          text="Internships and fresher roles across the teams that take a project from first sketch to finished space."
        />
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {opportunityAreas.map((area, i) => {
            const Icon = areaIcons[area.key];
            return (
              <m.article {...reveal({ order: i })} key={area.key} className="card-apple card-apple-hover p-6 sm:p-7 flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-[19px] font-semibold tracking-tight text-fg">{area.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted flex-1">{area.description}</p>
                <button
                  type="button"
                  onClick={() => applyFor(area.key)}
                  className="link-apple mt-5 self-start inline-flex items-center gap-1 text-[15px]"
                  aria-label={`Apply for ${area.title}`}
                >
                  Apply <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </m.article>
            );
          })}
        </div>
      </section>

      {/* 3. What you can expect */}
      <section className="bg-sunken/50 dark:bg-surface/40 py-16 sm:py-24" aria-labelledby="expect-title">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <Heading
              id="expect-title"
              eyebrow="What you can expect"
              title="Learn by doing, on real projects."
            />
          </div>
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expectations.map((item, i) => (
              <m.li {...reveal({ order: i })} key={item} className="flex gap-3 rounded-2xl bg-surface p-5">
                <CircleCheck className="w-5 h-5 shrink-0 text-accent mt-0.5" aria-hidden="true" />
                <span className="text-[16px] leading-relaxed text-fg">{item}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Programme structure */}
      <section className="site-container" aria-labelledby="programme-title">
        <Heading id="programme-title" eyebrow="Internship and fresher programme" title="Programme Structure" center />
        <dl className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {programmeStructure.map((row, i) => {
            const Icon = programmeIcons[i];
            return (
              <m.div {...reveal({ order: i })} key={row.label} className="card-apple p-6 sm:p-7 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-[15px] font-semibold text-fg">{row.label}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">{row.value}</dd>
                </div>
              </m.div>
            );
          })}
        </dl>
      </section>

      {/* 5. Hiring process: vertical timeline on phones, five columns on large screens */}
      <section className="site-container" aria-labelledby="process-title">
        <Heading id="process-title" eyebrow="Our hiring process" title="Five clear steps." center />
        <ol className="mt-10 sm:mt-14 relative grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-6">
          <span aria-hidden="true" className="absolute left-[19px] top-2 bottom-2 w-px bg-line lg:hidden" />
          <span aria-hidden="true" className="hidden lg:block absolute left-[10%] right-[10%] top-5 h-px bg-line" />
          {hiringSteps.map((step, i) => (
            <m.li {...reveal({ order: i })} key={step.title} className="relative flex lg:flex-col gap-5 lg:gap-4 pb-8 lg:pb-0 lg:text-center lg:items-center">
              <span className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-fg text-canvas text-[14px] font-semibold flex items-center justify-center tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[17px] font-semibold text-fg">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
              </div>
            </m.li>
          ))}
        </ol>
      </section>

      {/* 6. Apply: current openings (from Admin → Job Openings), then the form */}
      <section id="apply" className="site-container scroll-mt-24" aria-labelledby="apply-title">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4 space-y-8">
            <Heading
              id="apply-title"
              size="md"
              eyebrow="Apply to Symmetry"
              title="Send us your application."
              text="Share your resume, portfolio and the role you are interested in. You will see a summary of your application before it is sent."
            />

            {jobsStatus !== 'ready' && <ContentState status={jobsStatus} retry={retryJobs} variant="inline" />}
            {jobsStatus === 'ready' && jobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-fg">Current openings</h3>
                {jobs.map((job) => {
                  const isOpen = expandedId === job.id;
                  return (
                    <div key={job.id} className="rounded-2xl bg-surface overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isOpen ? null : job.id)}
                        aria-expanded={isOpen}
                        className="w-full p-4 flex items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                      >
                        <span>
                          <span className="block text-[12px] font-semibold text-accent">{job.department}</span>
                          <span className="block text-[16px] font-semibold text-fg mt-0.5">{job.title}</span>
                          <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-muted">
                            {job.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{job.location}</span>}
                            {job.type && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true" />{job.type}</span>}
                          </span>
                        </span>
                        <ChevronDown className={`w-5 h-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: dur.base * 0.6, ease: ease.apple }}
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-line/70 dark:border-line pt-3">
                              {job.summary && <p className="text-[14px] text-muted leading-relaxed">{job.summary}</p>}
                              {[['Responsibilities', job.responsibilities], ['Requirements', job.requirements]].map(([heading, items]) =>
                                items?.length ? (
                                  <div key={heading}>
                                    <h4 className="text-[13px] font-semibold text-fg mb-1.5">{heading}</h4>
                                    <ul className="space-y-1.5">
                                      {items.map((item) => (
                                        <li key={item} className="flex gap-2 text-[13.5px] text-muted leading-relaxed">
                                          <CircleCheck className="w-4 h-4 shrink-0 text-accent mt-0.5" aria-hidden="true" />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null
                              )}
                              <button type="button" onClick={() => applyFor(`job:${job.id}`)} className="btn-dark !py-2 !px-4 text-[14px]">
                                Apply for this role
                              </button>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <ApplicationForm jobs={jobsStatus === 'ready' ? jobs : []} position={position} onPositionChange={setPosition} />
          </div>
        </div>
      </section>

      {/* 7. General application */}
      <section className="site-container" aria-labelledby="general-title">
        <m.div {...reveal()} className="rounded-panel bg-[#1D1D1F] text-[#F5F5F7] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="eyebrow !text-[#D9C59A]">Don&rsquo;t see your role?</p>
            <h2 id="general-title" className="text-display-md">Your Talent Might Be Just What We&rsquo;re Looking For.</h2>
            <p className="text-[17px] leading-relaxed text-white/75">
              We are always interested in connecting with people who bring fresh perspectives, creative thinking, technical
              expertise, and a passion for exceptional spaces.
            </p>
            <p className="text-[17px] leading-relaxed text-white/75">
              Even if there isn&rsquo;t a current opening that matches your profile, we encourage you to share your resume and
              portfolio with us. We will consider your application for relevant future opportunities.
            </p>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <button type="button" onClick={() => applyFor('general')} className="btn-light w-full sm:w-auto">
              Send a general application
            </button>
            <div className="rounded-2xl bg-white/10 p-5 space-y-2">
              <p className="text-[13px] text-white/70">
                {careersEmail ? 'Prefer email? Use this subject line:' : 'If you email us, please use this subject line:'}
              </p>
              <div className="flex items-start gap-2">
                <p className="text-[15px] font-medium break-words flex-1">{GENERAL_SUBJECT}</p>
                <button
                  type="button"
                  onClick={copySubject}
                  className="p-2 -m-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Copy subject line"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-[12.5px] text-white/60" role="status">{copied ? 'Copied.' : ''}</p>
              {careersEmail && (
                <a
                  href={`${mailHref(careersEmail)}?subject=${encodeURIComponent(GENERAL_SUBJECT)}`}
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-[#D9C59A] hover:underline"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" /> {careersEmail}
                </a>
              )}
            </div>
          </div>
        </m.div>
      </section>

      {/* 8. Team voices: sample text until real quotes are approved (see data/careers.js) */}
      <section className="site-container" aria-labelledby="voices-title">
        <Heading id="voices-title" eyebrow="Team voices" title="Team Voices" center />
        <m.p {...reveal({ order: 2 })} className="mt-3 text-center text-[13px] text-subtle">
          Sample quotes for illustration. Statements from our team will appear here once approved.
        </m.p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {sampleTeamVoices.map((voice, i) => (
            <m.figure {...reveal({ order: i })} key={voice.role} className="card-apple p-7 flex flex-col">
              <Quote className="w-7 h-7 text-accent/60" aria-hidden="true" />
              <blockquote className="mt-4 text-[17px] leading-relaxed text-fg flex-1">&ldquo;{voice.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-[14px] text-muted">
                {voice.role} <span className="text-subtle">· sample</span>
              </figcaption>
            </m.figure>
          ))}
        </div>
      </section>

      {/* 9. Equal opportunity and HR contact */}
      <section className="site-container" aria-labelledby="equal-title">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <m.div {...reveal()} className="lg:col-span-7 space-y-4">
            <p className="eyebrow">Equal opportunity</p>
            <h2 id="equal-title" className="text-display-md text-fg">Equal Opportunity at Symmetry</h2>
            <p className="text-[17px] leading-relaxed text-muted">
              At Symmetry Interiors &amp; Building Solutions, we value talent, integrity, creativity, and a willingness to learn.
              We welcome applications from qualified candidates of diverse backgrounds and experiences. Hiring decisions are based
              on relevant skills, qualifications, professional conduct, and role requirements, without discrimination on legally
              protected grounds.
            </p>
            <p className="text-[17px] leading-relaxed text-muted">
              We are committed to maintaining a professional, respectful, and collaborative workplace where individuals can
              contribute, learn, and grow.
            </p>
          </m.div>
          <m.div {...reveal({ order: 1 })} className="lg:col-span-5 card-apple p-7 sm:p-8 space-y-4 self-start">
            <h3 className="text-[21px] font-semibold tracking-tight text-fg">Have Questions About Careers at Symmetry?</h3>
            <p className="text-[15px] leading-relaxed text-muted">
              For information about open positions, internships, or your application, please contact our HR team.
            </p>
            <ul className="space-y-3 text-[15px]">
              {careersEmail && (
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                  <a href={mailHref(careersEmail)} className="text-fg hover:text-accent break-all">{careersEmail}</a>
                </li>
              )}
              {hrPhone && (
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                  <a href={telHref(hrPhone)} className="text-fg hover:text-accent">{hrPhone}</a>
                </li>
              )}
              {company.officeAddress && (
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                  <span className="text-fg">{company.officeAddress}</span>
                </li>
              )}
            </ul>
            {!careersEmail && !hrPhone && (
              <p className="text-[14px] text-muted">
                Send your question through the <a href="#apply" className="link-apple">application form</a> or our{' '}
                <Link to="/contact" className="link-apple">contact page</Link>.
              </p>
            )}
          </m.div>
        </div>
      </section>

      {/* 10. Final call to action */}
      <section className="site-container">
        <m.div {...reveal({ variant: 'scaleIn' })} className="relative overflow-hidden rounded-panel bg-black dark:bg-[#070f1e] text-white">
          <img
            {...heroImage('/images/hero/stock-careers-cta.jpeg', '(min-width: 1280px) 1280px, 100vw')}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
          <div className="relative px-6 py-16 sm:py-24 text-center max-w-2xl mx-auto space-y-5">
            <h2 className="text-display-lg">Ready to Learn by Doing?</h2>
            <p className="text-[17px] sm:text-[19px] leading-relaxed text-white/85">
              Send us your resume, portfolio, and preferred department to take the next step in your design journey with Symmetry.
            </p>
            <a href="#apply" className="btn-light">Apply now</a>
          </div>
        </m.div>
      </section>
    </div>
  );
};

export default Careers;
