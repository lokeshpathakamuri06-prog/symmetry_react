import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Newsletter = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className={`p-8 sm:p-10 rounded-2xl bg-[#E5ECEC]/50 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] ${className}`}>
      <div className="max-w-xl">
        <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-2">
          The Symmetry Journal
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] mb-3">
          Curated Design Dispatches
        </h3>
        <p className="text-base text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed mb-6 font-normal">
          Receive our quarterly monographs exploring architectural case studies, rare Italian stones, and vanguard interior trends.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-base text-[#36656B] dark:text-[#BCA575] font-medium"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you for subscribing. Welcome to the Symmetry circle.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your private email..."
              required
              className="flex-1 px-4 py-3.5 rounded-full bg-white dark:bg-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] text-base text-[#131E20] dark:text-[#F5F1E8] placeholder-[#4F6467]/60 focus:outline-none focus:border-[#36656B] dark:focus:border-[#BCA575] transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] transition-colors text-sm uppercase tracking-luxury font-medium flex items-center justify-center gap-2 group shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
        <p className="text-xs text-[#4F6467]/70 dark:text-[#AEB7BE]/70 mt-3">
          We honor discretion. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
