import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { m } from 'framer-motion';
import Honeypot from './Honeypot';
import { subscribeNewsletter, formErrorMessage } from '../services/publicApi';

export const Newsletter = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSending(true);
    setError('');
    try {
      await subscribeNewsletter(email.trim(), website);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(formErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-panel bg-surface border border-line/60 dark:border-line p-8 sm:p-12 ${className}`}>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div>
          <span className="eyebrow mb-3">The Symmetry Journal</span>
          <h3 className="text-[28px] sm:text-[36px] font-semibold tracking-tight leading-tight text-fg">
            Design Ideas, Four Times a Year
          </h3>
          <p className="mt-3 text-[16px] text-muted leading-relaxed">
            Our newsletter shares recent projects, beautiful materials and new interior trends.
          </p>
        </div>

        <div>
          {submitted ? (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-[16px] text-accent font-medium"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you for subscribing. Welcome to the Symmetry circle.</span>
            </m.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
              <Honeypot value={website} onChange={setWebsite} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                aria-label="Email address"
                className="field flex-1 !rounded-full !bg-canvas px-5"
              />
              <button type="submit" disabled={sending} className="btn-dark group shrink-0">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-red-500">{error}</p>}
          <p className="text-[12.5px] text-subtle mt-3 sm:pl-5">No spam. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
