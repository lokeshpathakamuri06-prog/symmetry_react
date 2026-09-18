import React, { useState } from 'react';
import { FileText, Download, ExternalLink, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CatalogFloatingWidget = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const pdfUrl = '/Symmetry-Interiors-Catalog.pdf';

  return (
    <>
      {/* =========================================================================
          BOTTOM-RIGHT CIRCULAR CATALOG DOWNLOAD BUTTON
      ========================================================================= */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-3">
        {/* Hover Pill Label on Left of Circle */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#131E20]/95 dark:bg-[#07121C]/95 backdrop-blur-md text-white dark:text-[#F5F1E8] border border-white/20 dark:border-[#BCA575]/40 text-xs font-semibold uppercase tracking-luxury shadow-lg whitespace-nowrap pointer-events-none"
            >
              <FileText className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
              <span>Download Catalog PDF</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Floating Download Trigger */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setModalOpen(true)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#36656B] via-[#2A4F54] to-[#131E20] dark:from-[#BCA575] dark:via-[#A8905E] dark:to-[#07121C] text-white dark:text-[#07121C] shadow-[0_12px_30px_rgba(54,101,107,0.45)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.8)] border-2 border-white/30 dark:border-[#BCA575]/50 flex items-center justify-center cursor-pointer transition-all duration-300 group"
          title="Download Official Corporate Catalog PDF"
          aria-label="Download Official Corporate Catalog PDF"
        >
          {/* Animated Gold Ring Pulse */}
          <span className="absolute -inset-1 rounded-full bg-[#36656B]/40 dark:bg-[#BCA575]/40 animate-ping opacity-60 pointer-events-none" />

          {/* Center Icon Box */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <FileText className="w-6 h-6 text-white dark:text-[#07121C] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold font-mono uppercase tracking-tighter text-amber-300 dark:text-[#07121C] leading-none mt-0.5">
              PDF
            </span>
          </div>

          {/* Download Arrow Badge on Circle Top-Right */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C06C52] text-white flex items-center justify-center shadow-md border border-white/60">
            <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </motion.button>
      </div>

      {/* =========================================================================
          CATALOG PREVIEW & DOWNLOAD MODAL
      ========================================================================= */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-[#07121C]/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0D1C29] rounded-3xl shadow-apple-dark dark:shadow-apple-dark overflow-hidden z-10 my-8"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-[#F4F7F6] dark:bg-[#132838] text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Side: Catalog Cover Image Card */}
                <div className="md:col-span-5">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group bg-[#132838]">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85"
                      alt="Symmetry Interiors Official Catalog"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07121C] via-[#07121C]/40 to-transparent flex flex-col justify-between p-6">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
                          Official PDF
                        </span>
                        <Sparkles className="w-4 h-4 text-[#BCA575]" />
                      </div>

                      <div className="space-y-1.5 text-white">
                        <p className="text-[10px] uppercase font-mono tracking-luxury text-[#BCA575]">
                          Symmetry Interiors &amp; Building Solutions
                        </p>
                        <h4 className="text-2xl font-medium leading-tight">
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

export default CatalogFloatingWidget;
