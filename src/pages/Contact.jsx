import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeoMeta from '../components/SeoMeta';
import { useSiteText } from '../context/PublicContentContext';
import { mailHref, mapsEmbedSrc, mapsHref, telHref, whatsappHref } from '../lib/contact';
import Honeypot from '../components/Honeypot';
import { submitInquiry, formErrorMessage } from '../services/publicApi';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';

// Social links helper icons
const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z"/>
  </svg>
);

const PROJECT_TYPES = [
  'Turnkey Residential Villa',
  'High-Rise Penthouse Sanctuary',
  'Commercial & Corporate HQ',
  'Boutique Hospitality & Resort',
  'Custom Furniture',
  'Global Sourcing & Procurement'
];

const BUDGET_RANGES = [
  '₹25 Lakhs – ₹50 Lakhs',
  '₹50 Lakhs – ₹1 Crore',
  '₹1 Crore – ₹2.5 Crores',
  '₹2.5 Crores – ₹5 Crores',
  '₹5 Crores+'
];

export const Contact = () => {
  const company = useSiteText('company');
  const contactText = useSiteText('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: PROJECT_TYPES[0],
    budgetRange: BUDGET_RANGES[1],
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [website, setWebsite] = useState('');
  const [inquiryId, setInquiryId] = useState('');
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please provide your contact phone number.';
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.projectType) {
      errs.projectType = 'Please select a project type.';
    }

    if (!formData.budgetRange) {
      errs.budgetRange = 'Please select an estimated budget range.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please share a few details regarding your space or vision.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters describing your project.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Server field names -> this form's field names
  const SERVER_FIELDS = { service: 'projectType', budget: 'budgetRange' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const { reference } = await submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.projectType,
        budget: formData.budgetRange,
        message: formData.message.trim(),
        website,
      });
      setInquiryId(reference);
      setSubmitted(true);
    } catch (err) {
      if (err.status === 422 && err.field) {
        setErrors({ [SERVER_FIELDS[err.field] || err.field]: err.message });
      } else {
        setFormError(formErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: PROJECT_TYPES[0],
      budgetRange: BUDGET_RANGES[1],
      message: ''
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="pb-20 sm:pb-28 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="Let's Create Something Exceptional | Contact Symmetry Interiors"
        description="Talk to our interior designers and furniture team. Book a consultation at our studio in Hyderabad."
      />

      <PageHero
        page="contact"
        breadcrumb={[{ label: 'Contact' }]}
        eyebrow="Contact"
        title={contactText.heroTitle}
        highlight={contactText.heroTitleHighlight}
        subtitle={contactText.heroSubtitle}
        image={heroImage('/images/hero/hero-contact.jpeg')}
        imageAlt="Symmetry Consultation Atelier"
        actions={
          <>
            <a href="#inquiry-form" className="btn-primary">Schedule a Consultation</a>
            <a href="#studio-location" className="link-apple px-3">Visit the studio</a>
          </>
        }
      />

      {/* Main Grid: Contact Form + Direct Channels */}
      <section id="inquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT 7 COLS: Interactive Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-surface border border-line shadow-luxury">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* SUCCESS SUBMISSION MESSAGE */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10 space-y-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
                      Inquiry Logged &bull; Reference #{inquiryId}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg mt-1">
                      Thank You, We Have Your Request
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed font-light">
                    Thank you, <strong className="text-[#1D1D1F] dark:text-white font-medium">{formData.name}</strong>. Your request for <em className="text-accent">{formData.projectType}</em> has reached our design team. Someone will contact you within <strong>24 business hours</strong> with initial scheduling options.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-full border border-line text-[14px] tracking-[-0.01em] text-fg hover:border-accent transition"
                    >
                      Send Another Request
                    </button>
                    <a
                      href={whatsappHref(company.whatsappNumber, 'Hello, I just submitted a design inquiry on your website.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-fg text-canvas text-[14px] tracking-[-0.01em] font-medium hover:bg-accent transition flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Follow-up on WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* CONTACT FORM */
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
                      Tell Us About Your Project
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-fg mt-0.5">
                      Schedule a Consultation
                    </h2>
                    <p className="text-xs text-muted mt-1 font-light">
                      Share your details and what you have in mind. We reply within one working day.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Vikramaditya Rao or Ar. Ananya Roy"
                        className={`w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border ${
                          errors.name
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-line'
                        } text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@domain.com"
                        className={`w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border ${
                          errors.email
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-line'
                        } text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border ${
                          errors.phone
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-line'
                        } text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border border-line text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent"
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        Budget Range *
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border border-line text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent"
                      >
                        {BUDGET_RANGES.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-luxury text-muted mb-1.5 font-medium">
                        About Your Project *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Where is the property, what stage is it at (bare shell, under construction, renovation), when do you need it ready, and any styles or materials you like..."
                        className={`w-full text-[15px] px-4 py-3.5 rounded-2xl bg-canvas/50 dark:bg-canvas border ${
                          errors.message
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-line'
                        } text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <Honeypot value={website} onChange={setWebsite} />
                  {formError && (
                    <p role="alert" className="text-xs text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-full bg-fg text-canvas hover:bg-accent transition-all duration-300 text-[14px] tracking-[-0.01em] font-medium flex items-center justify-center gap-2 shadow-luxury cursor-pointer disabled:opacity-75"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Sending...' : 'Send Request'}</span>
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 dark:text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Your details are kept private and never shared.</span>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT 5 COLS: Phone, Email, Office Address, WhatsApp & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-8 rounded-3xl bg-surface border border-line shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
                  Our Office
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-fg mt-0.5">
                  {company.companyName}
                </h3>
                <p className="text-xs font-mono text-accent font-semibold mt-1">
                  {company.cin && `CIN: ${company.cin}`}
                </p>
              </div>

              <div className="space-y-4 text-xs text-muted">
                {/* Main Office Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-fg block mb-0.5 font-medium">
                      Main Office Address:
                    </strong>
                    <span className="leading-relaxed font-medium text-fg">
                      {company.officeAddress}
                    </span>
                  </div>
                </div>

                {/* Registered Office Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-fg block mb-0.5 font-medium">
                      Registered Office:
                    </strong>
                    <span className="leading-relaxed">
                      {company.registeredOffice}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-fg block mb-0.5 font-medium">
                      Phone:
                    </strong>
                    <p className="font-mono">
                      <a href={telHref(company.phonePrimary)} className="hover:text-accent transition">
                        {company.phonePrimary}
                      </a> (Appointments)
                    </p>
                    {company.phoneSecondary && (
                      <p className="font-mono">
                        <a href={telHref(company.phoneSecondary)} className="hover:text-accent transition">
                          {company.phoneSecondary}
                        </a> (Studio Reception)
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-fg block mb-0.5 font-medium">
                      Email:
                    </strong>
                    <p>
                      <a href={mailHref(company.email)} className="hover:text-accent transition">
                        {company.email}
                      </a>
                    </p>
                    {company.emailProjects && (
                      <p>
                        <a href={mailHref(company.emailProjects)} className="hover:text-accent transition">
                          {company.emailProjects}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp Quick Action Button */}
                <div className="pt-2">
                  <a
                    href={whatsappHref(company.whatsappNumber, 'Hello, I would like to schedule a private design consultation with Symmetry Interiors.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-2xl bg-emerald-600/10 dark:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-emerald-800 dark:text-emerald-300 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-medium text-xs">Chat on WhatsApp</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      {company.whatsappNumber} &rarr;
                    </span>
                  </a>
                </div>

                {/* Gallery Hours */}
                <div className="flex items-start gap-3 pt-2">
                  <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-fg block mb-0.5 font-medium">
                      Visiting Hours:
                    </strong>
                    <p>{company.hours}</p>
                    <p>Sunday: By appointment</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-line/60 dark:border-line">
                <span className="text-[11px] uppercase tracking-luxury text-muted font-medium block mb-3">
                  Follow Us:
                </span>
                <div className="flex items-center space-x-2.5">
                  {[
                    { label: 'Instagram', icon: InstagramIcon, href: company.instagram },
                    { label: 'LinkedIn', icon: LinkedinIcon, href: company.linkedin },
                    { label: 'Pinterest', icon: PinterestIcon, href: company.pinterest },
                    { label: 'WhatsApp', icon: MessageCircle, href: whatsappHref(company.whatsappNumber) }
                  ].filter((s) => s.href).map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full border border-line text-fg hover:border-accent hover:text-accent transition"
                        title={s.label}
                        aria-label={s.label}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Precision Joinery Center */}
            <div className="p-6 rounded-3xl bg-sunken/40 dark:bg-surface border border-line text-xs text-muted space-y-2">
              <span className="text-[10px] uppercase tracking-luxury text-accent font-semibold block">
                Our Workshop
              </span>
              <h4 className="text-sm font-semibold text-fg">
                25,000 Sq.Ft. Furniture Workshop
              </h4>
              <p className="leading-relaxed">
                Hardware Park, Shamshabad, Hyderabad. Workshop visits can be arranged for clients and architects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS INTEGRATION SECTION */}
      <section id="studio-location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl overflow-hidden bg-surface border border-line shadow-luxury">
          {/* Map Top Header Bar */}
          <div className="p-4 sm:p-6 bg-stone-50 dark:bg-stone-900 border-b border-line/60 dark:border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                  Find Us
                </span>
              </div>
              <h3 className="text-lg font-bold text-fg mt-0.5">
                Symmetry Office &bull; {company.officeAddress}
              </h3>
            </div>

            {/* Map Mode Controls */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center rounded-xl border border-stone-300 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setMapType('roadmap')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    mapType === 'roadmap'
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    mapType === 'satellite'
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Satellite View
                </button>
              </div>

              <a
                href={mapsHref(company.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-medium flex items-center gap-1.5 transition text-xs shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Canvas */}
          <div className="relative w-full h-[380px] sm:h-[480px] bg-stone-100 dark:bg-stone-900 overflow-hidden">
            <iframe
              key={mapType}
              title="Symmetry Office Google Map"
              src={mapsEmbedSrc(company.mapQuery, mapType === 'satellite')}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* On-Map Floating Overlay Card */}
            <div className="absolute bottom-4 left-4 z-10 max-w-xs p-3.5 rounded-2xl bg-surface/95 dark:bg-canvas/95 backdrop-blur-md border border-stone-200/80 dark:border-stone-800/80 shadow-xl text-xs space-y-1.5 hidden sm:block pointer-events-none">
              <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px] uppercase tracking-luxury">
                <Navigation className="w-3.5 h-3.5" />
                <span>Getting Here</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-snug text-[11px]">
                &bull; 15 mins from Financial District &amp; HITEC City<br />
                &bull; 35 mins from Rajiv Gandhi International Airport (RGIA)<br />
                &bull; Parking available at the building
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-16 rounded-3xl bg-fg dark:bg-surface text-white border border-stone-800 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
              Visit Our Studio
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Start Your Design Journey
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              See real stone slabs, Italian finishes and lighting samples in person, and talk through your ideas with our designers.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-stone-900 hover:bg-accent hover:text-on-accent transition text-[14px] tracking-[-0.01em] font-medium shadow-luxury cursor-pointer"
              >
                Book a Studio Visit
              </a>
              <a
                href={whatsappHref(company.whatsappNumber, 'Hello, I would like to start my design journey with Symmetry Interiors.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-stone-700 hover:border-accent text-white transition text-[14px] tracking-[-0.01em] font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Start on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
