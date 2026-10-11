import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  `w-full text-xs px-4 py-3.5 rounded-2xl bg-[#F4F7F6]/50 dark:bg-[#07121C] border ${
    hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D1DCDE] dark:border-[#1E3447]'
  } text-[#131E20] dark:text-[#F5F1E8] placeholder-[#4F6467]/60 dark:placeholder-[#AEB7BE]/50 focus:outline-none focus:border-[#36656B] dark:focus:border-[#BCA575] transition`;

const labelClass = 'block text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mb-1.5 font-medium';

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
    <div className="pt-28 pb-20 sm:pb-28 space-y-16 sm:space-y-20 overflow-hidden">
      <SeoMeta
        title="Careers"
        description="Join Symmetry Interiors & Building Solutions in Hyderabad. Explore open roles in interior design, site execution, 3D visualisation and client relations."
      />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[360px] flex items-center justify-center text-center shadow-xl border border-[#D1DCDE] dark:border-[#1E3447] group">
          <img
            {...heroImage('/images/hero/hero-haj-banner-2.jpeg')}
            alt="Symmetry Interiors studio"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55" />
          <div className="relative z-10 max-w-3xl px-6 py-8 space-y-3 sm:space-y-4">
            <span className="text-[11px] uppercase tracking-luxury text-white/80 font-semibold">Careers at Symmetry</span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight drop-shadow-md">
              Build Spaces That <span className="text-[#BCA575]">Endure</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto leading-relaxed drop-shadow-sm">
              Join a team of designers, engineers and craftspeople creating homes, offices and hospitality spaces from concept to completion.
            </p>
            <a
              href="#openings"
              className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-white text-[#131E20] text-xs uppercase tracking-luxury font-semibold hover:bg-[#BCA575] hover:text-white transition"
            >
              View Open Roles
            </a>
          </div>
        </div>
      </section>

      {/* Why Symmetry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">Why Symmetry</span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] mt-2">
            Grow With a Legacy Studio
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {careerPerks.map((perk, i) => {
            const Icon = perkIcons[i % perkIcons.length];
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-apple dark:shadow-apple-dark"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#36656B]/10 dark:bg-[#BCA575]/10 text-[#36656B] dark:text-[#BCA575] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#131E20] dark:text-[#F5F1E8]">{perk.title}</h3>
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] mt-2 leading-relaxed">{perk.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">Open Positions</span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] mt-2">
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
                    ? 'bg-[#36656B] dark:bg-[#BCA575] text-white dark:text-[#07121C]'
                    : 'bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE] hover:border-[#36656B] dark:hover:border-[#BCA575]'
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
            <div className="p-10 rounded-3xl text-center bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-sm text-[#4F6467] dark:text-[#AEB7BE]">
              No open roles right now — we still welcome general applications below.
            </div>
          )}

          {visibleJobs.map((job) => {
            const isOpen = expandedId === job.id;
            return (
              <div
                key={job.id}
                className="rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-apple dark:shadow-apple-dark overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : job.id)}
                  className="w-full p-6 sm:p-7 flex items-start sm:items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] uppercase tracking-luxury font-semibold text-[#36656B] dark:text-[#BCA575]">
                      {job.department}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#131E20] dark:text-[#F5F1E8]">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                      {job.experience && <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#4F6467] dark:text-[#AEB7BE] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 sm:px-7 pb-7 space-y-6 border-t border-[#D1DCDE] dark:border-[#1E3447] pt-6">
                        {job.summary && (
                          <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed">{job.summary}</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[['Responsibilities', job.responsibilities], ['Requirements', job.requirements]].map(([heading, items]) =>
                            items?.length ? (
                              <div key={heading}>
                                <h4 className="text-xs uppercase tracking-luxury font-semibold text-[#131E20] dark:text-[#F5F1E8] mb-3">{heading}</h4>
                                <ul className="space-y-2">
                                  {items.map((item) => (
                                    <li key={item} className="flex gap-2 text-xs text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed">
                                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#36656B] dark:text-[#BCA575]" />
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
                          className="px-6 py-3 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] text-xs uppercase tracking-luxury font-medium hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition"
                        >
                          Apply for this role
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application form */}
      <section ref={formRef} id="apply" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-luxury">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8]">Application Received</h3>
                <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#131E20] dark:text-white font-medium">{formData.name}</strong>. Our team will review your application for <em className="text-[#36656B] dark:text-[#BCA575] not-italic font-medium">{selectedJobTitle}</em> and get back to you if there is a match.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] transition"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">Apply Now</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] mt-0.5">Join Our Team</h2>
                  <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] mt-1">
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
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#36656B] dark:bg-[#BCA575] text-white dark:text-[#07121C] text-xs uppercase tracking-luxury font-semibold hover:bg-[#254B50] dark:hover:bg-[#A88C5B] transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Careers;
