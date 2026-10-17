import React, { useState } from 'react';
import { FileText, Download, ExternalLink, X, Sparkles, CheckCircle2, MessageSquare, Send, MessageCircle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '../lib/scroll';
import { useSiteText } from '../context/PublicContentContext';
import { whatsappHref } from '../lib/contact';

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
  const company = useSiteText('company');
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  useScrollLock(catalogModalOpen);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const [hoveredButton, setHoveredButton] = useState(null);
  // Phones: the three actions fold into one button so they never cover the page
  const [mobileOpen, setMobileOpen] = useState(false);

  const pdfUrl = '/Symmetry-Interiors-Catalog.pdf';

  const handleSendWhatsapp = (e) => {
    e.preventDefault();
    const text = whatsappMessage.trim() || 'Hello, I would like to schedule a private design consultation with Symmetry Interiors.';
    const href = whatsappHref(company.whatsappNumber, text);
    if (href) window.open(href, '_blank');
    setWhatsappModalOpen(false);
    setWhatsappMessage('');
  };

  return (
    <>
      {/* Floating quick actions: one quiet glass pill, bottom right */}
      <div className="fixed bottom-5 right-4 md:bottom-8 md:right-6 z-40">
        <div className="glass flex flex-col items-center gap-1 p-1.5 rounded-full border border-line/70 dark:border-line shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className={`${mobileOpen ? 'flex' : 'hidden'} sm:flex flex-col items-center gap-1`}>
          {[
            { id: 'instagram', label: 'Instagram', href: company.instagram, icon: <InstagramIcon className="w-[18px] h-[18px]" />, tint: 'hover:text-[#DC2743]' },
            { id: 'whatsapp', label: 'Chat on WhatsApp', onClick: () => setWhatsappModalOpen((prev) => !prev), icon: <WhatsAppIcon className="w-5 h-5" />, tint: 'text-[#1FAF55] dark:text-[#25D366]' },
            { id: 'catalog', label: 'Download Catalog PDF', onClick: () => setCatalogModalOpen(true), icon: <FileText className="w-[18px] h-[18px]" strokeWidth={1.8} />, tint: 'hover:text-accent' },
          ].map((b) => {
            const Tag = b.href ? 'a' : 'button';
            return (
              <div key={b.id} className="relative flex items-center">
                <AnimatePresence>
                  {hoveredButton === b.id && (
                    <m.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.18 }}
                      className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-full bg-fg text-canvas text-[12px] font-medium whitespace-nowrap pointer-events-none"
                    >
                      {b.label}
                    </m.span>
                  )}
                </AnimatePresence>
                <Tag
                  {...(b.href
                    ? { href: b.href, target: '_blank', rel: 'noopener noreferrer' }
                    : { type: 'button', onClick: b.onClick })}
                  onMouseEnter={() => setHoveredButton(b.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-fg/80 hover:bg-fg/[0.07] transition-colors cursor-pointer ${b.tint}`}
                  title={b.label}
                  aria-label={b.label}
                >
                  {b.icon}
                </Tag>
              </div>
            );
          })}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden w-11 h-11 rounded-full flex items-center justify-center text-fg/80 hover:bg-fg/[0.07] transition-colors"
            aria-label={mobileOpen ? 'Close quick actions' : 'Open quick actions'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.8} /> : <MessageCircle className="w-5 h-5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          WHATSAPP QUICK CHAT MODAL
      ========================================================================= */}
      <AnimatePresence>
        {whatsappModalOpen && (
          <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-end p-4 sm:p-8 pointer-events-none">
            <m.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto mb-48 sm:mb-40 sm:mr-14 w-full max-w-sm rounded-card bg-surface p-6 shadow-2xl border border-line/70 dark:border-line text-fg"
            >
              <div className="flex items-start justify-between pb-3 border-b border-line/60 dark:border-line">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[12px] font-medium text-accent">
                      WhatsApp
                    </p>
                  </div>
                  <h4 className="text-[17px] font-semibold mt-0.5">Chat with Symmetry</h4>
                  <p className="text-[11px] text-muted">Usually replies within a few hours</p>
                </div>
                <button
                  onClick={() => setWhatsappModalOpen(false)}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full text-muted hover:text-fg hover:bg-fg/[0.06] cursor-pointer"
                  aria-label="Close concierge"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[14px] text-muted my-3 leading-relaxed">
                Ask us about a project, custom furniture or a site visit.
              </p>

              <form onSubmit={handleSendWhatsapp} className="space-y-2.5">
                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="What can we help you with?"
                  rows={2}
                  className="field !text-[14px] resize-none"
                />
                <button
                  type="submit"
                  className="btn w-full bg-[#25D366] text-white hover:bg-[#20ba5a] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Start WhatsApp Chat</span>
                </button>
              </form>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CATALOG PREVIEW & DOWNLOAD MODAL
      ========================================================================= */}
      <AnimatePresence>
        {catalogModalOpen && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" data-lenis-prevent>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCatalogModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Modal Container */}
            <m.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-surface rounded-panel shadow-2xl border border-line/70 dark:border-line overflow-hidden z-10 my-8"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setCatalogModalOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 inline-flex items-center justify-center rounded-full bg-sunken text-fg hover:bg-line transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-10 items-center">
                {/* Left Side: Catalog Visual Cover Box */}
                <div className="md:col-span-5 relative group">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-canvas dark:bg-sunken border border-line shadow-xl relative">
                    <img loading="lazy" decoding="async"
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85"
                      alt="Symmetry Interiors Official Catalog"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-6">
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
                        <h4 className="text-2xl font-semibold tracking-tight leading-tight">
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
                    <span className="eyebrow mb-2">
                      Company Brochure
                    </span>
                    <h3 className="text-2xl sm:text-[32px] text-fg font-semibold tracking-tight leading-tight">
                      Symmetry Interiors &amp; Building Solutions Catalog
                    </h3>
                  </div>

                  <p className="text-[15px] text-muted leading-relaxed">
                    Our 11-page brochure covers 25+ years of international furniture sourcing, bespoke joinery manufacturing, and turnkey interiors for luxury hotels, commercial spaces, healthcare facilities, and private estates.
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-line/60 dark:border-line">
                    {[
                      'Global Procurement (Italy, China, Malaysia, Vietnam)',
                      'Signature Offerings: Sofas, Beds, Wardrobes & Dining',
                      'Turnkey Hospitality, Residential & Healthcare Solutions',
                      'Clientele: Courtyard Marriott, Ginger, Yashoda Hospitals',
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[14px] text-fg">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Download & View Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={pdfUrl}
                      download="Symmetry-Interiors-Catalog.pdf"
                      className="btn-primary flex-1 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Catalog (PDF)</span>
                    </a>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary cursor-pointer"
                    >
                      <span>View Online</span>
                      <ExternalLink className="w-4 h-4 text-accent" />
                    </a>
                  </div>

                  <p className="text-[11px] text-subtle font-mono text-center sm:text-left">
                    Direct PDF Download &bull; High Resolution Document &bull; 4.7 MB
                  </p>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionStack;
