import React, { useState } from 'react';
import { FileText, Download, ExternalLink, X, Sparkles, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstagramIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.228.728 4.286 1.961 5.952L2.5 21.5l3.687-1.428C7.79 21.238 9.824 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.92 0-3.692-.556-5.187-1.517l-.372-.238-2.585 1.002.998-2.519-.261-.397A7.954 7.954 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

export const FloatingActionStack = () => {
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const [hoveredButton, setHoveredButton] = useState(null);

  const pdfUrl = '/Symmetry-Interiors-Catalog.pdf';
  const whatsappPhone = '919963499635'; // Symmetry Interiors Sales / Concierge

  const handleSendWhatsapp = (e) => {
    e.preventDefault();
    const text = whatsappMessage.trim() || 'Hello, I would like to schedule a private design consultation with Symmetry Interiors.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappPhone}?text=${encoded}`, '_blank');
    setWhatsappModalOpen(false);
    setWhatsappMessage('');
  };

  return (
    <>
      {/* =========================================================================
          RIGHT SIDE BOTTOM CIRCULAR FLOATING STACK
      ========================================================================= */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
        {/* 1. INSTAGRAM CIRCLE BUTTON */}
        <div className="relative flex items-center gap-2">
          <AnimatePresence>
            {hoveredButton === 'instagram' && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131E20]/90 dark:bg-[#07121C]/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-luxury shadow-md whitespace-nowrap pointer-events-none"
              >
                <span>Instagram</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href="https://www.instagram.com/symmetryinteriors.ltd/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onMouseEnter={() => setHoveredButton('instagram')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg border-2 border-white/40 flex items-center justify-center cursor-pointer transition-all duration-300"
            title="Follow Symmetry Interiors on Instagram"
            aria-label="Instagram Page"
          >
            <InstagramIcon className="w-5 h-5 text-white" />
          </motion.a>
        </div>

        {/* 2. WHATSAPP CIRCLE BUTTON */}
        <div className="relative flex items-center gap-2">
          <AnimatePresence>
            {hoveredButton === 'whatsapp' && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131E20]/90 dark:bg-[#07121C]/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-luxury shadow-md whitespace-nowrap pointer-events-none"
              >
                <span>WhatsApp Concierge</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onMouseEnter={() => setHoveredButton('whatsapp')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setWhatsappModalOpen((prev) => !prev)}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white shadow-lg border-2 border-white/40 flex items-center justify-center cursor-pointer transition-all duration-300"
            title="WhatsApp VIP Concierge"
            aria-label="WhatsApp VIP Concierge"
          >
            <WhatsAppIcon className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* 3. CATALOG PDF CIRCLE BUTTON */}
        <div className="relative flex items-center gap-2">
          <AnimatePresence>
            {hoveredButton === 'catalog' && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131E20]/90 dark:bg-[#07121C]/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-luxury shadow-md whitespace-nowrap pointer-events-none"
              >
                <span>Download Catalog PDF</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onMouseEnter={() => setHoveredButton('catalog')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setCatalogModalOpen(true)}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#36656B] via-[#2A4F54] to-[#131E20] dark:from-[#BCA575] dark:via-[#A8905E] dark:to-[#07121C] text-white dark:text-[#07121C] shadow-xl border-2 border-white/40 dark:border-[#BCA575]/50 flex items-center justify-center cursor-pointer transition-all duration-300 group"
            title="Download Corporate Catalog PDF"
            aria-label="Download Corporate Catalog PDF"
          >
            {/* Animated Ring Pulse */}
            <span className="absolute -inset-1 rounded-full bg-[#36656B]/40 dark:bg-[#BCA575]/40 animate-ping opacity-50 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <FileText className="w-5 h-5 text-white dark:text-[#07121C] group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-bold font-mono uppercase tracking-tighter text-amber-300 dark:text-[#07121C] leading-none mt-0.5">
                PDF
              </span>
            </div>

            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#C06C52] text-white flex items-center justify-center shadow-md border border-white/60">
              <Download className="w-2.5 h-2.5" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* =========================================================================
          WHATSAPP QUICK CHAT MODAL
      ========================================================================= */}
      <AnimatePresence>
        {whatsappModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-end p-4 sm:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto mb-20 sm:mb-24 sm:mr-2 w-full max-w-sm rounded-3xl bg-white dark:bg-[#0D1C29] p-6 shadow-2xl border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8]"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                      VIP WhatsApp Concierge
                    </p>
                  </div>
                  <h4 className="text-base font-serif font-medium mt-0.5">Symmetry Client Advisor</h4>
                  <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">Direct Sourcing &amp; Project Assistance</p>
                </div>
                <button
                  onClick={() => setWhatsappModalOpen(false)}
                  className="p-1 text-[#4F6467] hover:text-[#131E20] dark:hover:text-white cursor-pointer"
                  aria-label="Close concierge"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] my-3 leading-relaxed">
                Connect directly with our senior architectural advisors regarding turnkey projects, bespoke furniture commissions, or private site visits.
              </p>

              <form onSubmit={handleSendWhatsapp} className="space-y-2.5">
                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Share your requirements or project location..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl bg-[#F4F7F6] dark:bg-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] focus:outline-none focus:border-[#36656B] resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Initiate WhatsApp Chat</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CATALOG PREVIEW & DOWNLOAD MODAL
      ========================================================================= */}
      <AnimatePresence>
        {catalogModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCatalogModalOpen(false)}
              className="fixed inset-0 bg-[#07121C]/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0D1C29] rounded-3xl shadow-2xl border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden z-10 my-8"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setCatalogModalOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-[#F4F7F6] dark:bg-[#132838] text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-10 items-center">
                {/* Left Side: Catalog Visual Cover Box */}
                <div className="md:col-span-5 relative group">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F4F7F6] dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] shadow-xl relative">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85"
                      alt="Symmetry Interiors Official Catalog"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07121C] via-[#07121C]/40 to-transparent flex flex-col justify-between p-6">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                          Official PDF
                        </span>
                        <Sparkles className="w-4 h-4 text-[#BCA575]" />
                      </div>

                      <div className="space-y-1.5 text-white">
                        <p className="text-[10px] uppercase font-mono tracking-luxury text-[#BCA575]">
                          Symmetry Interiors &amp; Building Solutions
                        </p>
                        <h4 className="font-serif text-2xl font-normal leading-tight">
                          Where Vision Meets Craftsmanship
                        </h4>
                        <p className="text-xs text-white/80 font-light">
                          25+ Years Sourcing &amp; Turnkey Execution
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Catalog Description & Download Actions */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-1">
                      Official Corporate Presentation
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight">
                      Symmetry Interiors &amp; Building Solutions Catalog
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light">
                    Explore our comprehensive 11-page corporate dossier showcasing 25+ years of international furniture sourcing, bespoke joinery manufacturing, and turnkey interiors for luxury hotels, commercial spaces, healthcare facilities, and private estates.
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]">
                    {[
                      'Global Procurement (Italy, China, Malaysia, Vietnam)',
                      'Signature Offerings: Sofas, Beds, Wardrobes & Dining',
                      'Turnkey Hospitality, Residential & Healthcare Solutions',
                      'Clientele: Courtyard Marriott, Ginger, Yashoda Hospitals',
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#131E20] dark:text-[#F5F1E8]">
                        <CheckCircle2 className="w-4 h-4 text-[#36656B] dark:text-[#BCA575] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Download & View Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={pdfUrl}
                      download="Symmetry-Interiors-Catalog.pdf"
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-[#36656B] dark:bg-[#BCA575] text-white dark:text-[#07121C] font-semibold text-xs sm:text-sm uppercase tracking-luxury hover:bg-[#284c50] dark:hover:bg-[#d4be8d] transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Catalog (PDF)</span>
                    </a>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-5 rounded-2xl border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B] dark:hover:border-[#BCA575] text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                    >
                      <span>View Online</span>
                      <ExternalLink className="w-4 h-4 text-[#36656B] dark:text-[#BCA575]" />
                    </a>
                  </div>

                  <p className="text-[11px] text-[#6B8083] dark:text-[#8E9CA8] font-mono text-center sm:text-left">
                    Direct PDF Download &bull; High Resolution Document &bull; 4.7 MB
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionStack;
