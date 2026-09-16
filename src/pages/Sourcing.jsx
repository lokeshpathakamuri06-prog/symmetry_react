import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Button from '../components/Button';
import { sourcingCountries, sourcingProcess, sourcingStats } from '../data/sourcing';

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  }
};

export const Sourcing = () => {
  const scrollToAnchor = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-28 overflow-hidden">
      <SeoMeta
        title="Global Sourcing &amp; Provenance — Italy, China, Malaysia, Vietnam, Bali | Symmetry Interiors"
        description="Explore Symmetry Interiors' 5 global sourcing alliances: quarry-direct Italian marble &amp; leather, precision CNC joinery in China, plantation teak in Malaysia, handwoven cane in Vietnam, and volcanic stone in Bali."
      />

      {/* =========================================================================
          SECTION 1: FULL-BLEED ARCHITECTURAL CINEMATIC HERO
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[680px] sm:min-h-[760px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed background media with architectural image & overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=2400&q=85"
            alt="Symmetry Interiors Global Sourcing &amp; Quarry Extraction"
            className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Top Header Spacing with Breadcrumbs */}
        <div className="relative z-10 pt-28 px-4 sm:px-8 lg:px-12 max-w-[1632px] mx-auto w-full flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 text-xs uppercase tracking-luxury"
          >
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-[#BCA575] font-semibold">Global Sourcing</span>
          </motion.div>
        </div>

        {/* Center Viewport Editorial Headline */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-5 my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-serif text-white font-normal leading-[1.05] tracking-tight drop-shadow-md"
          >
            Craftsmanship <br />
            <span className="italic font-light text-[#BCA575]">
              Without Borders
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-white/90 font-light leading-relaxed max-w-3xl mx-auto drop-shadow-sm"
          >
            Twenty-five years of direct extraction rights at Italian stone quarries and generational contracts with master craft guilds across China, Malaysia, Vietnam, and Bali.
          </motion.p>
        </div>
      </section>

      {/* Elevated 4-Metric Trust Strip Floating Directly Below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6"
        >
          {sourcingStats.map((st, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#0D1C29]/95 backdrop-blur-xl border border-[#D1DCDE] dark:border-[#1E3447] shadow-lg text-center group hover:border-[#36656B]/60 dark:hover:border-[#BCA575]/60 hover:shadow-xl transition-all duration-300"
            >
              <p className="font-serif text-2xl sm:text-4xl text-[#36656B] dark:text-[#BCA575] font-normal group-hover:scale-105 transition-transform duration-300">
                {st.value}
              </p>
              <p className="text-xs font-sans uppercase tracking-luxury font-semibold text-[#131E20] dark:text-[#F5F1E8] mt-1">
                {st.label}
              </p>
              <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE] font-light mt-0.5 hidden sm:block">
                {st.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: QUICK-JUMP ORIGIN NAVIGATION PILL BAR
          ========================================================================= */}
      <section id="origins-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-[#FAF8F5] to-white dark:from-[#0D1C29] dark:via-[#091520] dark:to-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-1">
              International Procurement Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal">
              Direct Origin Hubs
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {sourcingCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => scrollToAnchor(country.anchorId)}
                className="px-4 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] dark:hover:border-[#BCA575] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <span>{country.flag}</span>
                <span className="font-mono text-[10px] text-[#36656B] dark:text-[#BCA575]">{country.chapter}.</span>
                <span>{country.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B8083] group-hover:text-[#36656B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE 5 DEDICATED SOURCING SHOWCASE SECTIONS
          1. Italy
          2. China
          3. Malaysia
          4. Vietnam
          5. Bali
          ========================================================================= */}
      <div className="space-y-20 sm:space-y-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sourcingCountries.map((country, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <section
              key={country.id}
              id={country.anchorId}
              className="scroll-mt-28"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-70px' }}
                variants={fadeInUp}
                className="rounded-3xl sm:rounded-[44px] bg-gradient-to-b from-white via-[#FDFCFA] to-white dark:from-[#0D1C29] dark:via-[#091520] dark:to-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B]/50 dark:hover:border-[#BCA575]/50 p-6 sm:p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-500"
              >
                {/* Subtle ambient decorative radial glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#36656B]/5 dark:bg-[#BCA575]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-[#D1DCDE]/70 dark:border-[#1E3447]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{country.flag}</span>
                    <div>
                      <span className="text-[11px] sm:text-xs uppercase tracking-luxury font-semibold text-[#36656B] dark:text-[#BCA575] block">
                        CHAPTER {country.chapter} &bull; {country.name.toUpperCase()} CONDUIT
                      </span>
                      <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                        {country.region}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5ECEC]/40 dark:bg-[#132838] border border-[#D1DCDE]/50 dark:border-[#1E3447] text-[#4F6467] dark:text-[#AEB7BE]">
                      <MapPin className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
                      <span>{country.coordinates}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#36656B]/10 dark:bg-[#BCA575]/10 text-[#36656B] dark:text-[#BCA575] font-semibold border border-[#36656B]/20">
                      {country.provenanceYears}
                    </span>
                  </div>
                </div>

                {/* Two-Column Grid: Images Frame & Narrative/Products */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                  {/* Visuals Column: 3-Image Showcase (Hero + 2 Detail Insets) */}
                  <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                    {/* Primary Large Image Frame */}
                    <div className="relative aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE]/70 dark:border-[#1E3447] shadow-lg group">
                      <img
                        src={country.galleryImages[0].url}
                        alt={`${country.name} procurement showcase`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Subtle hover light sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

                      {/* Floating Provenance Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/90 text-[#F5F1E8] backdrop-blur-md border border-white/15 shadow-md">
                          {country.region}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white text-xs font-mono">
                        <span className="truncate pr-2">{country.galleryImages[0].caption}</span>
                        <span className="text-[#BCA575] shrink-0">{country.partnerAteliers}</span>
                      </div>
                    </div>

                    {/* Secondary Image Grid (2 Inset Cards with Captions) */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {country.galleryImages.slice(1, 3).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] border border-[#D1DCDE]/70 dark:border-[#1E3447] shadow-sm group cursor-pointer"
                        >
                          <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                            <p className="text-[10px] sm:text-[11px] text-white font-light leading-snug line-clamp-2">
                              {img.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Direct Sourcing Verification Banner */}
                    <div className="p-4 rounded-xl sm:rounded-2xl bg-[#F4F7F6] dark:bg-[#07121C] border border-[#D1DCDE]/60 dark:border-[#1E3447] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#131E20] dark:text-[#F5F1E8]">
                        <ShieldCheck className="w-4 h-4 text-[#36656B] dark:text-[#BCA575] shrink-0" />
                        <span className="font-medium">Direct Sourcing Alliance:</span>
                        <span className="text-[#4F6467] dark:text-[#AEB7BE]">{country.partnerAteliers}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-mono text-[#36656B] dark:text-[#BCA575] font-semibold shrink-0">
                        100% IN-PERSON VETTED
                      </span>
                    </div>
                  </div>

                  {/* Content Column: Brief Description, Products Sourced, Craftsmanship Standards */}
                  <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                    {/* Header */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight">
                        {country.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mt-1.5">
                        {country.tagline}
                      </p>
                    </div>

                    {/* Brief Description */}
                    <div className="space-y-3 text-sm sm:text-base text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                      <p>{country.description}</p>
                    </div>

                    {/* Products Sourced Section */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                        <Sparkles className="w-4 h-4 text-[#36656B] dark:text-[#BCA575]" />
                        <h4 className="text-xs uppercase tracking-luxury font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                          Products &amp; Architectural Materials Sourced
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {country.productsSourced.map((product, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3.5 rounded-2xl bg-white dark:bg-[#07121C] border border-[#D1DCDE]/70 dark:border-[#1E3447] shadow-sm flex items-start gap-3.5 text-xs sm:text-sm text-[#131E20] dark:text-[#F5F1E8] hover:border-[#36656B]/60 dark:hover:border-[#BCA575]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#36656B]/15 text-[#36656B] dark:text-[#BCA575] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#36656B] group-hover:text-white transition-colors">
                              <span className="font-mono text-[10px] font-bold">0{pIdx + 1}</span>
                            </div>
                            <span className="font-light leading-snug">{product}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Craftsmanship Highlights & Technical Benchmarks */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#D1DCDE]/60 dark:border-[#1E3447]">
                        <Award className="w-4 h-4 text-[#36656B] dark:text-[#BCA575]" />
                        <h4 className="text-xs uppercase tracking-luxury font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                          Craftsmanship Highlights &amp; Technical Standards
                        </h4>
                      </div>

                      <ul className="space-y-2">
                        {country.craftsmanshipHighlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#36656B] dark:text-[#BCA575] shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action CTA Button */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Button
                        to={`/contact?source=${country.id}`}
                        variant="primary"
                        size="md"
                        showArrow
                      >
                        Inquire for {country.name} Procurement
                      </Button>
                      <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                        Direct Conduit &bull; Zero Middlemen
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION 4: SOURCING PROCESS (THE END-TO-END PROCUREMENT JOURNEY)
          ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#E5ECEC]/30 via-transparent to-[#E5ECEC]/20 dark:from-[#091520] dark:via-[#07121C] dark:to-[#091520] py-24 sm:py-36 border-t border-[#D1DCDE]/70 dark:border-[#1E3447] overflow-hidden">
        {/* Ambient decorative backdrop glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#36656B]/5 dark:bg-[#BCA575]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                Five-Stage Sourcing Pipeline
              </span>
              <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight tracking-tight"
            >
              The End-to-End Procurement Journey
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xs sm:text-sm md:text-base text-[#4F6467] dark:text-[#AEB7BE] font-light max-w-2xl mx-auto leading-relaxed"
            >
              Every stone slab, carved hardwood timber, and Murano chandelier undergoes forensic verification at origin before maritime containerization.
            </motion.p>
          </div>

          {/* Stepper Progress Track Connector (Desktop Only) */}
          <div className="hidden lg:block relative mb-8">
            <div className="absolute top-6 left-12 right-12 h-[2px] bg-[#D1DCDE] dark:bg-[#1E3447] -z-0" />
            <div className="grid grid-cols-5 gap-6 text-center relative z-10">
              {sourcingProcess.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0D1C29] border-2 border-[#36656B] dark:border-[#BCA575] flex items-center justify-center text-xs font-mono font-bold text-[#36656B] dark:text-[#BCA575] shadow-md">
                    {step.step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Step Process Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6">
            {sourcingProcess.map((step, idx) => {
              const StepIcon = step.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative p-6 sm:p-7 rounded-[32px] bg-gradient-to-b from-white via-[#FDFCFA] to-[#F4F7F6] dark:from-[#0D1C29] dark:via-[#091520] dark:to-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] shadow-lg hover:shadow-[0_25px_50px_rgba(54,101,107,0.16)] dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)] hover:border-[#36656B]/70 dark:hover:border-[#BCA575]/70 transition-all duration-500 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Subtle Light Reflection Sweep on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

                  {/* Faint Giant Watermark Numeral */}
                  <span className="absolute -top-3 -right-2 font-serif text-7xl font-extralight text-[#36656B]/10 dark:text-[#BCA575]/10 group-hover:text-[#36656B]/20 group-hover:scale-110 transition-all duration-500 select-none pointer-events-none">
                    {step.step}
                  </span>

                  <div className="relative z-10 space-y-4">
                    {/* Top Row: Phase Tag & Glowing Icon Pod */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#E5ECEC]/60 dark:bg-[#132838] border border-[#D1DCDE]/60 dark:border-[#1E3447] text-[#36656B] dark:text-[#BCA575] font-semibold group-hover:bg-[#36656B] group-hover:text-white transition-colors duration-300">
                        PHASE {step.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F7F6] to-[#E5ECEC] dark:from-[#132838] dark:to-[#07121C] border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center text-[#36656B] dark:text-[#BCA575] shadow-sm group-hover:scale-115 group-hover:rotate-6 group-hover:border-[#36656B] transition-all duration-500">
                        <StepIcon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                    </div>

                    {/* Step Title & Tagline */}
                    <div>
                      <h3 className="font-serif text-2xl text-[#131E20] dark:text-[#F5F1E8] font-normal leading-snug group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors duration-300">
                        {step.name}
                      </h3>
                      <p className="text-[11px] font-sans uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold mt-1">
                        {step.tagline}
                      </p>
                    </div>

                    {/* Narrative Description */}
                    <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Deliverables / Milestones Dossier Vault */}
                  <div className="relative z-10 mt-6 pt-5 border-t border-[#D1DCDE]/60 dark:border-[#1E3447]/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8083] dark:text-[#8E9CA8] flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#36656B] dark:text-[#BCA575]" />
                      Stage Milestones
                    </span>
                    <div className="space-y-1.5">
                      {step.deliverables.map((del, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-white/70 dark:bg-[#07121C]/70 border border-[#D1DCDE]/50 dark:border-[#1E3447]/50 text-[11px] text-[#131E20] dark:text-[#F5F1E8] font-medium group-hover:border-[#36656B]/40 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#36656B] dark:bg-[#BCA575] shrink-0" />
                          <span className="truncate">{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Bottom Step Progress Link */}
                    <div className="mt-4 pt-3 border-t border-[#D1DCDE]/40 dark:border-[#1E3447]/40 flex items-center justify-between text-[10px] font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                      <span>STEP 0{idx + 1} / 05</span>
                      <span className="flex items-center gap-1 text-[#36656B] dark:text-[#BCA575] group-hover:translate-x-1 transition-transform duration-300 font-semibold">
                        Forward &rarr;
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sourcing;
