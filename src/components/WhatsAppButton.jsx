import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useSiteText } from '../context/PublicContentContext';
import { whatsappHref } from '../lib/contact';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const company = useSiteText('company');
  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim() || 'Hello, I would like to schedule a private design consultation with Symmetry Interiors.';
    const href = whatsappHref(company.whatsappNumber, text);
    if (href) window.open(href, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-3 w-80 sm:w-96 rounded-2xl bg-surface p-5 text-fg"
          >
            <div className="flex items-start justify-between pb-3 border-b border-line/60 dark:border-line">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs text-accent font-semibold">
                    VIP Concierge
                  </p>
                </div>
                <h4 className="text-base font-medium mt-0.5">Symmetry Client Advisor</h4>
                <p className="text-xs text-muted">Typically responds within 15 minutes</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#4F6467] hover:text-[#1D1D1F] dark:hover:text-white"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted my-3 leading-relaxed">
              Connect directly with our senior architectural consultants regarding turnkey projects, bespoke furniture commissions, or private site visits.
            </p>

            <form onSubmit={handleSend} className="space-y-2.5">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your requirements or project location..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg bg-canvas border border-line focus:outline-none focus:border-accent resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-fg dark:bg-accent text-canvas text-xs font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-accent dark:hover:bg-[#A7C3C6] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Initiate WhatsApp Chat
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-fg dark:bg-accent text-canvas shadow-luxury border border-accent/40 hover:bg-accent dark:hover:bg-[#A7C3C6] transition-colors group"
        aria-label="WhatsApp VIP Concierge"
      >
        <MessageSquare className="w-4 h-4 text-accent dark:text-canvas group-hover:text-on-accent dark:group-hover:text-canvas transition-colors" />
        <span className="text-xs font-medium tracking-wider hidden sm:inline">Concierge</span>
      </m.button>
    </div>
  );
};

export default WhatsAppButton;
