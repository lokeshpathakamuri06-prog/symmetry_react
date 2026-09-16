import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const defaultPhone = '+919876543210'; // Symmetry Interiors concierge line
  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim() || 'Hello, I would like to schedule a private design consultation with Symmetry Interiors.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${defaultPhone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0D1C29] p-5 shadow-2xl border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8]"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                    VIP Concierge
                  </p>
                </div>
                <h4 className="text-base font-serif font-medium mt-0.5">Symmetry Client Advisor</h4>
                <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE]">Typically responds within 15 minutes</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#4F6467] hover:text-[#131E20] dark:hover:text-white"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] my-3 leading-relaxed">
              Connect directly with our senior architectural consultants regarding turnkey projects, bespoke furniture commissions, or private site visits.
            </p>

            <form onSubmit={handleSend} className="space-y-2.5">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your requirements or project location..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg bg-[#F4F7F6] dark:bg-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] focus:outline-none focus:border-[#36656B] resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#131E20] dark:bg-[#BCA575] text-[#F4F7F6] dark:text-[#07121C] text-xs font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-[#36656B] dark:hover:bg-[#A7C3C6] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Initiate WhatsApp Chat
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#131E20] dark:bg-[#BCA575] text-[#F4F7F6] dark:text-[#07121C] shadow-luxury border border-[#36656B]/40 hover:bg-[#36656B] dark:hover:bg-[#A7C3C6] transition-colors group"
        aria-label="WhatsApp VIP Concierge"
      >
        <MessageSquare className="w-4 h-4 text-[#36656B] dark:text-[#07121C] group-hover:text-white dark:group-hover:text-[#07121C] transition-colors" />
        <span className="text-xs font-medium tracking-wider hidden sm:inline">Concierge</span>
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
