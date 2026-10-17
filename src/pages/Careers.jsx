import React, { useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { reveal } from '../lib/motion';
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle2,
  Send,
  Award,
  Globe2,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Honeypot from '../components/Honeypot';
import { submitApplication, formErrorMessage } from '../services/publicApi';
import { careerPerks } from '../data/careers';
import { useJobs } from '../context/PublicContentContext';
import ContentState from '../components/ContentState';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';

const perkIcons = [Award, Globe2, Hammer, TrendingUp];

const GENERAL_APPLICATION = 'general';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  jobId: GENERAL_APPLICATION,
  experienceYears: '',
  portfolioUrl: '',
  resumeUrl: '',
  message: '',
};

const fieldClass = (hasError) =>
  `w-full text-xs px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border ${
    hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-line'
  } text-fg placeholder-muted/60 dark:placeholder-muted/50 focus:outline-none focus:border-accent transition`;

const labelClass = 'block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium';

export const Careers = () => {
  const { items: jobs, status: jobsStatus, retry: retryJobs } = useJobs();
  const [department, setDepartment] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [website, setWebsite] = useState('');
  const formRef = useRef(null);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)))],
    [jobs]
  );

  const visibleJobs = jobs.filter((j) => department === 'All' || j.department === department);

  const handleApply = (jobId) => {
    setFormData((prev) => ({ ...prev, jobId }));
    setSubmitted(false);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (formData.name.trim().length < 2) errs.name = 'Please provide your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Please enter a valid email address.';
    if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    if (formData.resumeUrl && !/^https?:\/\//.test(formData.resumeUrl.trim())) errs.resumeUrl = 'Link should start with http:// or https://';
    if (formData.portfolioUrl && !/^https?:\/\//.test(formData.portfolioUrl.trim())) errs.portfolioUrl = 'Link should start with http:// or https://';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError('');
    try {
      await submitApplication({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        jobId: formData.jobId,
        experienceYears: formData.experienceYears.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        message: formData.message.trim(),
        website,
      });
      setSubmitted(true);
    } catch (err) {
      if (err.status === 422 && err.field) {
        setErrors({ [err.field]: err.message });
        if (err.field === 'jobId') setFormError(err.message);
      } else {
        setFormError(formErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setErrors({});
    setSubmitted(false);
  };

  const selectedJobTitle = jobs.find((j) => j.id === formData.jobId)?.title || 'General Application';

  return (
    <div className="pb-20 sm:pb-28 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="Careers"
        description="Join Symmetry Interiors & Building Solutions in Hyderabad. Explore open roles in interior design, site execution, 3D visualisation and client relations."
      />

      <PageHero
        page="careers"
        breadcrumb={[{ label: 'Careers' }]}
        eyebrow="Careers at Symmetry"
        title="Build Spaces That"
        highlight="Endure"
        subtitle="Join a team of designers, engineers and craftspeople creating homes, offices and hospitality spaces from concept to completion."
        image={heroImage('/images/hero/hero-haj-banner-2.jpeg')}
        imageAlt="Symmetry Interiors studio"
        actions={<a href="#openings" className="btn-primary">View Open Roles</a>}
      />

      {/* Why Symmetry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-luxury text-accent font-semibold">Why Symmetry</span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-fg mt-2">
            Grow With a Legacy Studio
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {careerPerks.map((perk, i) => {
            const Icon = perkIcons[i % perkIcons.length];
            return (
              <m.div
                {...reveal({ order: i })}
                key={perk.title}
                className="p-6 rounded-3xl bg-surface border border-line shadow-apple dark:shadow-apple-dark"
              >
                <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-fg">{perk.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{perk.description}</p>
              </m.div>
            );
          })}
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxury text-accent font-semibold">Open Positions</span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-fg mt-2">
              Current Openings
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDepartment(d)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                  department === d
                    ? 'bg-accent text-on-accent dark:text-canvas'
                    : 'bg-surface border border-line text-muted hover:border-accent'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {jobsStatus !== 'ready' && <ContentState status={jobsStatus} retry={retryJobs} variant="inline" />}

          {jobsStatus === 'ready' && visibleJobs.length === 0 && (
            <div className="p-10 rounded-3xl text-center bg-surface border border-line text-sm text-muted">
              No open roles right now — we still welcome general applications below.
            </div>
          )}

          {visibleJobs.map((job) => {
            const isOpen = expandedId === job.id;
            return (
              <div
                key={job.id}
                className="rounded-3xl bg-surface border border-line shadow-apple dark:shadow-apple-dark overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : job.id)}
                  className="w-full p-6 sm:p-7 flex items-start sm:items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] uppercase tracking-luxury font-semibold text-accent">
                      {job.department}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-fg">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                      {job.experience && <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 sm:px-7 pb-7 space-y-6 border-t border-line pt-6">
                        {job.summary && (
                          <p className="text-sm text-muted leading-relaxed">{job.summary}</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[['Responsibilities', job.responsibilities], ['Requirements', job.requirements]].map(([heading, items]) =>
                            items?.length ? (
                              <div key={heading}>
                                <h4 className="text-xs uppercase tracking-luxury font-semibold text-fg mb-3">{heading}</h4>
                                <ul className="space-y-2">
                                  {items.map((item) => (
                                    <li key={item} className="flex gap-2 text-xs text-muted leading-relaxed">
                                      <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null
                          )}
                        </div>
                        <button
                          onClick={() => handleApply(job.id)}
                          className="px-6 py-3 rounded-full bg-fg text-canvas text-[14px] tracking-[-0.01em] font-medium hover:bg-accent transition"
                        >
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
      </section>

      {/* Application form */}
      <section ref={formRef} id="apply" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line shadow-luxury">
          <AnimatePresence mode="wait">
            {submitted ? (
              <m.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">Application Received</h3>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-fg dark:text-white font-medium">{formData.name}</strong>. Our team will review your application for <em className="text-accent not-italic font-medium">{selectedJobTitle}</em> and get back to you if there is a match.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full border border-line text-[14px] tracking-[-0.01em] text-fg hover:border-accent transition"
                >
                  Submit Another Application
                </button>
              </m.div>
            ) : (
              <m.form key="form" onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">Apply Now</span>
                  <h2 className="text-2xl font-bold tracking-tight text-fg mt-0.5">Join Our Team</h2>
                  <p className="text-xs text-muted mt-1">
                    Share your details and a link to your resume. Fields marked * are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Position *</label>
                    <select name="jobId" value={formData.jobId} onChange={handleChange} className={fieldClass(false)}>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                      ))}
                      <option value={GENERAL_APPLICATION}>General Application</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} className={fieldClass(errors.name)} placeholder="Your full name" />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass(errors.email)} placeholder="you@example.com" />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClass(errors.phone)} placeholder="+91 98765 43210" />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <input name="experienceYears" value={formData.experienceYears} onChange={handleChange} className={fieldClass(false)} placeholder="e.g. 4 years" />
                  </div>
                  <div>
                    <label className={labelClass}>Resume Link</label>
                    <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} className={fieldClass(errors.resumeUrl)} placeholder="Google Drive / Dropbox link" />
                    {errors.resumeUrl && <p className="text-[11px] text-red-500 mt-1">{errors.resumeUrl}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Portfolio or LinkedIn</label>
                    <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className={fieldClass(errors.portfolioUrl)} placeholder="https://" />
                    {errors.portfolioUrl && <p className="text-[11px] text-red-500 mt-1">{errors.portfolioUrl}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Cover Note</label>
                    <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className={fieldClass(false)} placeholder="Tell us a little about yourself and the work you're proud of." />
                  </div>
                </div>

                <Honeypot value={website} onChange={setWebsite} />
                {formError && <p role="alert" className="text-xs text-red-500">{formError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent text-on-accent dark:text-canvas text-[14px] tracking-[-0.01em] font-medium hover:bg-accent-hover transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Careers;
