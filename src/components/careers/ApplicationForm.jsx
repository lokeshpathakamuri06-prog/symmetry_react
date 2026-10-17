import React, { useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CircleCheck, FileText, Paperclip, Pencil, Send, X } from 'lucide-react';
import Honeypot from '../Honeypot';
import { submitCareerApplication, formErrorMessage } from '../../services/publicApi';
import { opportunityAreas, GENERAL_POSITION, experienceLevels } from '../../data/careers';
import { scrollToTarget } from '../../lib/scroll';
import { dur, ease } from '../../lib/motion';

const MB = 1024 * 1024;
const FILES = {
  resume: { label: 'Resume', max: 5 * MB, exts: ['pdf', 'doc', 'docx'], accept: '.pdf,.doc,.docx', hint: 'PDF, DOC or DOCX, up to 5 MB' },
  portfolio: { label: 'Portfolio', max: 15 * MB, exts: ['pdf'], accept: '.pdf', hint: 'PDF, up to 15 MB' },
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  experienceLevel: '',
  portfolioUrl: '',
  message: '',
  consent: false,
  resume: null,
  portfolio: null,
};

// 10-digit Indian mobile number from "98765 43210", "+91 98765-43210", "09876543210"…
const nationalNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};
const formatPhone = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
const fileSize = (bytes) => (bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const extension = (name) => name.split('.').pop().toLowerCase();

const positionLabel = (value, jobs) => {
  if (value.startsWith('job:')) return jobs.find((j) => `job:${j.id}` === value)?.title || 'Open position';
  return [...opportunityAreas, GENERAL_POSITION].find((a) => a.key === value)?.position || '';
};

const Label = ({ htmlFor, children, optional }) => (
  <label htmlFor={htmlFor} className="block text-[14px] font-medium text-fg mb-1.5">
    {children}
    {optional ? <span className="text-subtle font-normal"> (optional)</span> : <span className="text-accent" aria-hidden="true"> *</span>}
  </label>
);

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-1.5 text-[13px] text-red-600 dark:text-red-400">
      {message}
    </p>
  ) : null;

/**
 * Careers application: fill in → review the summary → submit. Files go to the backend's private
 * storage (POST /api/public/career-applications); success is shown only after the server confirms.
 * `position` is controlled by the page so "Apply" buttons elsewhere can preselect it.
 */
export const ApplicationForm = ({ jobs = [], position, onPositionChange }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('edit'); // edit | review | done
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [reference, setReference] = useState('');
  const [website, setWebsite] = useState('');
  const topRef = useRef(null);

  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const onInput = (e) => set(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);

  const fileError = (kind, file) => {
    const rule = FILES[kind];
    if (!rule.exts.includes(extension(file.name))) return `Please choose a ${rule.exts.map((x) => x.toUpperCase()).join(', ')} file.`;
    if (file.size > rule.max) return `This file is too large (max ${rule.max / MB} MB).`;
    if (file.size === 0) return 'This file is empty.';
    return null;
  };

  const onFile = (kind) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // so choosing the same file again still fires a change
    if (!file) return;
    const problem = fileError(kind, file);
    if (problem) {
      setErrors((prev) => ({ ...prev, [kind]: problem }));
      return;
    }
    set(kind, file);
  };

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Please enter a valid email address, e.g. name@example.com.';
    if (!/^[6-9]\d{9}$/.test(nationalNumber(form.phone))) errs.phone = 'Please enter a 10-digit mobile number.';
    if (!position) errs.position = 'Please choose the position you are applying for.';
    if (!form.experienceLevel) errs.experienceLevel = 'Please choose your experience level.';
    if (form.portfolioUrl.trim() && !/^https?:\/\/\S+$/.test(form.portfolioUrl.trim())) {
      errs.portfolioUrl = 'Link should start with http:// or https://';
    }
    if (!form.resume) errs.resume = 'Please attach your resume.';
    if (form.message.length > 5000) errs.message = 'Please keep this under 5,000 characters.';
    if (!form.consent) errs.consent = 'Please confirm that we may use your details for recruitment.';
    return errs;
  };

  const focusFirstError = (errs) => {
    const first = ['position', 'name', 'email', 'phone', 'experienceLevel', 'portfolioUrl', 'resume', 'message', 'consent'].find((k) => errs[k]);
    const el = first && document.getElementById(`apply-${first}`);
    if (el) {
      scrollToTarget(el, { offset: 140 });
      el.focus({ preventScroll: true });
    }
  };

  const toReview = (e) => {
    e.preventDefault();
    setFormError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    setStep('review');
    scrollToTarget(topRef.current);
  };

  const backToEdit = () => {
    setStep('edit');
    scrollToTarget(topRef.current);
  };

  const submit = async () => {
    setSubmitting(true);
    setFormError('');
    try {
      const result = await submitCareerApplication({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: formatPhone(nationalNumber(form.phone)),
        position,
        experienceLevel: form.experienceLevel,
        portfolioUrl: form.portfolioUrl.trim(),
        message: form.message.trim(),
        consent: 'true',
        website,
        resume: form.resume,
        portfolio: form.portfolio,
      });
      setReference(result?.reference || '');
      setStep('done');
      scrollToTarget(topRef.current);
    } catch (err) {
      if (err.status === 422 && err.field) {
        // The server found a problem with one field: back to the form with the message, nothing cleared
        setErrors({ [err.field]: err.message });
        setStep('edit');
        setTimeout(() => focusFirstError({ [err.field]: true }), 50);
      } else {
        setFormError(formErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startAgain = () => {
    setForm(emptyForm);
    setErrors({});
    setReference('');
    onPositionChange('');
    setStep('edit');
  };

  const describedBy = (name) => (errors[name] ? `apply-${name}-error` : undefined);
  const fieldProps = (name) => ({
    id: `apply-${name}`,
    name,
    value: form[name],
    onChange: onInput,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': describedBy(name),
    className: `field ${errors[name] ? '!border-red-500 focus:!ring-red-500/15' : ''}`,
  });

  const filePicker = (kind, optional = false) => {
    const rule = FILES[kind];
    const file = form[kind];
    return (
      <div>
        <Label htmlFor={`apply-${kind}`} optional={optional}>
          {kind === 'resume' ? 'Resume upload' : 'Portfolio upload'}
        </Label>
        {file ? (
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <FileText className="w-5 h-5 shrink-0 text-accent" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-fg">{file.name}</p>
              <p className="text-[12.5px] text-subtle">{fileSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => set(kind, null)}
              className="p-2 rounded-full text-muted hover:text-fg hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Remove ${rule.label.toLowerCase()} ${file.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 transition hover:border-accent focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 ${
              errors[kind] ? 'border-red-500' : 'border-line'
            }`}
          >
            <Paperclip className="w-5 h-5 shrink-0 text-muted" aria-hidden="true" />
            <span className="text-[14px] text-fg">
              Choose a file <span className="block text-[12.5px] text-subtle">{rule.hint}</span>
            </span>
            <input
              id={`apply-${kind}`}
              type="file"
              accept={rule.accept}
              onChange={onFile(kind)}
              aria-invalid={errors[kind] ? true : undefined}
              aria-describedby={describedBy(kind)}
              className="sr-only"
            />
          </label>
        )}
        <FieldError id={`apply-${kind}-error`} message={errors[kind]} />
      </div>
    );
  };

  const summary = [
    ['Position', positionLabel(position, jobs)],
    ['Full name', form.name.trim()],
    ['Email', form.email.trim()],
    ['Phone', step === 'edit' ? form.phone : formatPhone(nationalNumber(form.phone))],
    ['Experience', form.experienceLevel],
    ['Portfolio link', form.portfolioUrl.trim() || '—'],
    ['Resume', form.resume ? `${form.resume.name} (${fileSize(form.resume.size)})` : '—'],
    ['Portfolio file', form.portfolio ? `${form.portfolio.name} (${fileSize(form.portfolio.size)})` : '—'],
    ['About you', form.message.trim() || '—'],
  ];

  const swap = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: dur.base * 0.6, ease: ease.out } };

  return (
    <div ref={topRef} className="rounded-panel bg-surface border border-line/70 dark:border-line shadow-card p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {step === 'done' && (
          <m.div key="done" {...swap} className="text-center py-6 space-y-4" role="status">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
              <CircleCheck className="w-7 h-7" />
            </div>
            <h3 className="text-display-md text-fg">Application received</h3>
            <p className="text-[17px] text-muted max-w-md mx-auto leading-relaxed">
              Thank you, {form.name.trim()}. Your application for <strong className="text-fg font-medium">{positionLabel(position, jobs)}</strong> has
              been saved{reference ? <> with reference <strong className="text-fg font-medium whitespace-nowrap">{reference}</strong></> : null}. Our team will review it and contact you if there is a suitable opportunity.
            </p>
            <button type="button" onClick={startAgain} className="btn-secondary">
              Submit another application
            </button>
          </m.div>
        )}

        {step === 'review' && (
          <m.div key="review" {...swap} className="space-y-6">
            <div>
              <p className="eyebrow mb-2">Step 2 of 2</p>
              <h3 className="text-display-md text-fg">Check your application</h3>
              <p className="mt-2 text-[15px] text-muted">Nothing has been sent yet. Review your details, then submit.</p>
            </div>
            <dl className="divide-y divide-line/70 dark:divide-line rounded-2xl border border-line/70 dark:border-line">
              {summary.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-4 px-4 sm:px-5 py-3">
                  <dt className="text-[13px] font-medium text-subtle">{label}</dt>
                  <dd className="text-[15px] text-fg break-words whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[13px] text-muted">You agreed that Symmetry may process this information for recruitment purposes.</p>
            {formError && (
              <p role="alert" className="text-[14px] text-red-600 dark:text-red-400">
                {formError} Your details are still here; you can try again.
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={backToEdit} disabled={submitting} className="btn-secondary">
                <Pencil className="w-4 h-4" /> Edit details
              </button>
              <button type="button" onClick={submit} disabled={submitting} className="btn-primary">
                <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </m.div>
        )}

        {step === 'edit' && (
          <m.form key="edit" {...swap} onSubmit={toReview} noValidate className="space-y-6">
            <div>
              <p className="eyebrow mb-2">Step 1 of 2</p>
              <h3 className="text-display-md text-fg">Your details</h3>
              <p className="mt-2 text-[15px] text-muted">
                Fields marked <span className="text-accent">*</span> are required. You can review everything before it is sent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label htmlFor="apply-name">Full name</Label>
                <input {...fieldProps('name')} autoComplete="name" placeholder="Your full name" />
                <FieldError id="apply-name-error" message={errors.name} />
              </div>
              <div>
                <Label htmlFor="apply-email">Email address</Label>
                <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" />
                <FieldError id="apply-email-error" message={errors.email} />
              </div>
              <div>
                <Label htmlFor="apply-phone">Phone number</Label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-sunken px-3 text-[15px] text-muted" aria-hidden="true">
                    +91
                  </span>
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    placeholder="98765 43210"
                    aria-label="Phone number (India, +91)"
                    className={`${fieldProps('phone').className} !rounded-l-none`}
                  />
                </div>
                <FieldError id="apply-phone-error" message={errors.phone} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="apply-position">Position applying for</Label>
                <select
                  id="apply-position"
                  value={position}
                  onChange={(e) => {
                    onPositionChange(e.target.value);
                    if (errors.position) setErrors((prev) => ({ ...prev, position: undefined }));
                  }}
                  aria-invalid={errors.position ? true : undefined}
                  aria-describedby={describedBy('position')}
                  className={`field ${errors.position ? '!border-red-500' : ''}`}
                >
                  <option value="">Choose a position</option>
                  {[...opportunityAreas, GENERAL_POSITION].map((a) => (
                    <option key={a.key} value={a.key}>{a.position}</option>
                  ))}
                  {jobs.length > 0 && (
                    <optgroup label="Current openings">
                      {jobs.map((j) => (
                        <option key={j.id} value={`job:${j.id}`}>{j.title}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <FieldError id="apply-position-error" message={errors.position} />
              </div>
            </div>

            <fieldset aria-describedby={describedBy('experienceLevel')}>
              <legend className="block text-[14px] font-medium text-fg mb-2">
                Experience level <span className="text-accent" aria-hidden="true">*</span>
              </legend>
              <div className="flex flex-wrap gap-2" id="apply-experienceLevel" tabIndex={-1}>
                {experienceLevels.map((level) => (
                  <label
                    key={level}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] transition focus-within:ring-4 focus-within:ring-accent/15 ${
                      form.experienceLevel === level ? 'border-accent bg-accent/10 text-fg' : 'border-line text-muted hover:border-accent/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={form.experienceLevel === level}
                      onChange={onInput}
                      className="sr-only"
                    />
                    {level}
                  </label>
                ))}
              </div>
              <FieldError id="apply-experienceLevel-error" message={errors.experienceLevel} />
            </fieldset>

            <div>
              <Label htmlFor="apply-portfolioUrl" optional>Portfolio link</Label>
              <input {...fieldProps('portfolioUrl')} type="url" inputMode="url" placeholder="Behance, Google Drive, personal website…" />
              <FieldError id="apply-portfolioUrl-error" message={errors.portfolioUrl} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filePicker('resume')}
              {filePicker('portfolio', true)}
            </div>

            <div>
              <Label htmlFor="apply-message" optional>Tell us about yourself</Label>
              <textarea
                {...fieldProps('message')}
                rows={5}
                maxLength={5000}
                placeholder="Introduce yourself and tell us why you would like to join Symmetry."
              />
              <FieldError id="apply-message-error" message={errors.message} />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="apply-consent"
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={onInput}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={describedBy('consent')}
                  className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--c-accent))] focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="text-[14px] text-muted leading-relaxed">
                  I agree to Symmetry Interiors &amp; Building Solutions processing the information I submit for recruitment purposes.
                  <span className="text-accent" aria-hidden="true"> *</span>
                </span>
              </label>
              <FieldError id="apply-consent-error" message={errors.consent} />
            </div>

            <Honeypot value={website} onChange={setWebsite} />
            {Object.values(errors).some(Boolean) && (
              <p role="alert" className="text-[14px] text-red-600 dark:text-red-400">
                Please check the highlighted fields.
              </p>
            )}

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Prepare application summary
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationForm;
