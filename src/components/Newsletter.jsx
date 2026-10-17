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
    <div className={`text-center ${className}`}>
      <span className="eyebrow mb-2">The Symmetry Journal</span>
      <h3 className="text-display-sm text-fg">Design Ideas, Four Times a Year</h3>
      <p className="mt-3 text-[17px] text-muted leading-relaxed max-w-xl mx-auto">
        Our newsletter shares recent projects, beautiful materials and new interior trends.
      </p>

      <div className="mt-7 max-w-md mx-auto">
        {submitted ? (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-[16px] text-accent font-medium"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you for subscribing. Welcome to the Symmetry circle.</span>
          </m.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <Honeypot value={website} onChange={setWebsite} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              aria-label="Email address"
              className="field !rounded-full !bg-surface pl-5 pr-36 h-12"
            />
            <button
              type="submit"
              disabled={sending}
              className="btn-primary btn-sm group absolute right-1.5 top-1/2 -translate-y-1/2 active:!scale-100"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-500">{error}</p>}
        <p className="text-[12px] text-subtle mt-3">No spam. Unsubscribe at any time.</p>
      </div>
    </div>
  );
};

export default Newsletter;
