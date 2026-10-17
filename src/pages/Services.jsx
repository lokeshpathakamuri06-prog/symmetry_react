import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { reveal } from '../lib/motion';
import { 
  Check, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Sun, 
  Award 
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Button from '../components/Button';
import FinalCta from '../components/FinalCta';
import { services, processSteps } from '../data/services';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';


/* =========================================================================
   1. RESIDENTIAL INTERIORS: Grand Editorial Asymmetric Split
   ========================================================================= */
const ResidentialSection = ({ service }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={containerRef} id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-surface border border-line shadow-sm hover:shadow-xl transition-all duration-700"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 01 &bull; {service.subtitle}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-[1.12] tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-2">
                {service.tagline}
              </p>
            </div>

            <p className="text-base text-muted font-light leading-relaxed">
              {service.description}
            </p>

            {/* 3 Key Stats Pills */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1">
              {service.stats?.map((stat, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 rounded-xl bg-sunken/40 dark:bg-canvas border border-line/60 text-center"
                >
                  <span className="block font-semibold text-base sm:text-lg text-fg">
                    {stat.value}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-subtle mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Deliverables Checklist */}
            <div className="pt-2">
              <h3 className="text-xs uppercase tracking-luxury text-fg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Scope &amp; Key Deliverables</span>
              </h3>
              <ul className="space-y-2">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light">
                    <div className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button to={service.ctaLink} variant="primary" size="md" showArrow>
                {service.ctaText}
              </Button>
              <span className="text-xs font-mono text-subtle flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                {service.provenance}
              </span>
            </div>
          </div>

          {/* Asymmetric Overlapping Visuals */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken border border-line shadow-lg group">
              <m.img
                style={{ y: imageY }}
                src={service.image}
                alt={service.title}
                className="w-full h-[115%] object-cover object-center will-change-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-luxury font-medium bg-canvas/90 text-fg backdrop-blur-md border border-[#D1DCDE]/60 shadow-sm">
                  {service.accentBadge}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[#F5F1E8] text-xs font-mono">
                <span>01 // RESIDENTIAL SANCTUARIES</span>
                <span className="text-[#BCA575]">SYMMETRY STUDIO</span>
              </div>
            </div>

            {/* Overlapping Inset Detail */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-sunken border border-[#D1DCDE]/70 shadow-sm">
                <img src={service.detailImage} alt="Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="col-span-7 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-sunken/30 dark:bg-canvas border border-[#D1DCDE]/60">
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent block mb-1">
                  Millimeter Precision
                </span>
                <p className="text-xs text-muted font-light leading-snug">
                  Full-height Italian marble reveals and continuous grain walnut joinery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   2. COMMERCIAL INTERIORS: Monolithic Executive Modernism
   ========================================================================= */
const CommercialSection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-fg dark:bg-canvas text-[#F5F1E8] border border-[#333] dark:border-line shadow-2xl p-6 sm:p-10 lg:p-14"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Top Row: Eyebrow and Headline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-3xl sm:text-4xl text-[#BCA575]">
                  {service.number}
                </span>
                <span className="w-8 h-px bg-[#BCA575]" />
                <span className="text-xs uppercase tracking-luxury text-[#BCA575] font-semibold">
                  Practice 02 &bull; {service.subtitle}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {service.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury bg-white/10 border border-white/15 text-[#BCA575]">
                {service.accentBadge}
              </span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Panoramic Executive Imagery */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken border border-white/15 shadow-xl group">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#AEB7BE]">
                  <span className="text-[#BCA575]">ENTERPRISE &bull; BOARDROOM ARCHITECTURE</span>
                  <span>LEED GOLD COMPLIANT</span>
                </div>
              </div>
            </div>

            {/* Right: Narrative & Enterprise Benchmarks */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-base text-[#AEB7BE] font-light leading-relaxed">
                {service.description}
              </p>

              {/* 3 Enterprise Metric Bars */}
              <div className="space-y-3">
                {service.stats?.map((stat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <span className="text-xs uppercase tracking-luxury text-[#AEB7BE]">
                      {stat.label}
                    </span>
                    <span className="font-bold text-base text-[#BCA575]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Enterprise Features */}
              <ul className="space-y-2 pt-2">
                {service.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#AEB7BE] font-light">
                    <Check className="w-3.5 h-3.5 text-[#BCA575] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Button to={service.ctaLink} variant="accent" size="md" showArrow>
                  {service.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   3. HOSPITALITY INTERIORS: The Sensory Gallery Triptych
   ========================================================================= */
const HospitalitySection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-sunken/30 dark:bg-surface border border-line shadow-sm space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 03 &bull; {service.subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg tracking-tight">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-1">
              {service.tagline}
            </p>
          </div>
          <Button to={service.ctaLink} variant="primary" size="md" showArrow>
            {service.ctaText}
          </Button>
        </div>

        {/* 3-Image Gallery Triptych */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sunken border border-line shadow-sm group">
            <img src={service.image} alt="Hospitality Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sunken border border-line shadow-sm group">
            <img src={service.detailImage} alt="Spa Lounge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div className="p-6 sm:p-7 rounded-2xl bg-surface dark:bg-canvas border border-line flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-accent">
                Sensory Vocabulary
              </span>
              <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                Stone bars, quiet private dining rooms and lighting that changes through the day.
              </p>
            </div>
            <div className="pt-4 border-t border-line/60 dark:border-line flex items-center justify-between text-xs font-medium text-fg">
              <span>Michelin &bull; 5-Star Scope</span>
              <span className="text-accent">&bull; Turnkey</span>
            </div>
          </div>
        </div>

        {/* Narrative & Checklist Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-line">
          <p className="text-sm sm:text-base text-muted font-light leading-relaxed">
            {service.description}
          </p>
          <ul className="space-y-2">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light">
                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   4. TURNKEY PROJECTS: The Technical Blueprint & Timeline Dashboard
   ========================================================================= */
const TurnkeySection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-surface border border-line shadow-sm hover:shadow-xl transition-all duration-700"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Blueprint Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 04 &bull; {service.subtitle}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-tight tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-2">
                {service.tagline}
              </p>
            </div>

            <p className="text-base text-muted font-light leading-relaxed">
              {service.description}
            </p>

            {/* 4-Phase Turnkey Protocol Badge Bar */}
            <div className="p-4 rounded-2xl bg-sunken/40 dark:bg-canvas border border-line/60 dark:border-line space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-accent block font-semibold">
                Single-Point Engineering Protocol:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-medium text-fg">
                <div className="p-2 rounded-lg bg-surface border border-[#D1DCDE]/50">01 Scan</div>
                <div className="p-2 rounded-lg bg-surface border border-[#D1DCDE]/50">02 Civil</div>
                <div className="p-2 rounded-lg bg-surface border border-[#D1DCDE]/50">03 Joinery</div>
                <div className="p-2 rounded-lg bg-surface border border-[#D1DCDE]/50">04 Handover</div>
              </div>
            </div>

            <ul className="space-y-2">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex items-center gap-4">
              <Button to={service.ctaLink} variant="primary" size="md" showArrow>
                {service.ctaText}
              </Button>
            </div>
          </div>

          {/* Right Column: Industrial Campus Visual */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken border border-line shadow-lg group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-luxury font-medium bg-canvas/90 text-fg backdrop-blur-md border border-[#D1DCDE]/60 shadow-sm">
                  {service.accentBadge}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[#F5F1E8] text-xs font-mono">
                <span>04 // SINGLE-POINT ACCOUNTABILITY</span>
                <span className="text-[#BCA575]">100% IN-HOUSE</span>
              </div>
            </div>

            {/* Turnkey Metric Card */}
            <div className="p-4 rounded-2xl bg-sunken/30 dark:bg-canvas border border-[#D1DCDE]/60 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-mono text-accent">Turnkey Commitment</p>
                <p className="text-sm font-serif font-medium text-fg mt-0.5">
                  Contracted Handover Date &bull; Fixed Cost Guarantee
                </p>
              </div>
              <Award className="w-7 h-7 text-accent shrink-0" />
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   5. CUSTOMIZED FURNITURE: Atelier Craftsmanship & Joinery Showcase
   ========================================================================= */
const CustomizedFurnitureSection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-sunken/30 dark:bg-surface border border-line shadow-sm space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Atelier Photo */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken border border-line shadow-lg group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-luxury font-medium bg-canvas/90 text-fg backdrop-blur-md border border-[#D1DCDE]/60">
                  {service.accentBadge}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono text-[#F5F1E8]">
                <span>25,000 SQ.FT. WORKSHOP</span>
                <span className="text-[#BCA575]">GERMAN 5-AXIS CNC</span>
              </div>
            </div>

            {/* Tactile Material Pills */}
            <div className="p-4 rounded-2xl bg-surface dark:bg-canvas border border-[#D1DCDE]/60 flex flex-wrap gap-2 text-xs font-medium text-fg">
              <span className="px-2.5 py-1 rounded-md bg-sunken/50 dark:bg-sunken">Burl Walnut</span>
              <span className="px-2.5 py-1 rounded-md bg-sunken/50 dark:bg-sunken">Smoked French Oak</span>
              <span className="px-2.5 py-1 rounded-md bg-sunken/50 dark:bg-sunken">Cast Bronze</span>
              <span className="px-2.5 py-1 rounded-md bg-sunken/50 dark:bg-sunken">Italian PU Lacquers</span>
            </div>
          </div>

          {/* Right: Narrative & Scope */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 05 &bull; {service.subtitle}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-tight tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-2">
                {service.tagline}
              </p>
            </div>

            <p className="text-base text-muted font-light leading-relaxed">
              {service.description}
            </p>

            <ul className="space-y-2">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button to={service.ctaLink} variant="primary" size="md" showArrow>
                {service.ctaText}
              </Button>
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   6. FURNITURE SOURCING: Global Quarry Conduits & International Hubs
   ========================================================================= */
const FurnitureSourcingSection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-surface border border-line shadow-sm space-y-8"
      >
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 06 &bull; {service.subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg tracking-tight">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-1">
              {service.tagline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase bg-accent/10 text-accent">
              0% Broker Markups
            </span>
          </div>
        </div>

        {/* 4 International Sourcing Conduit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { country: 'Italy', city: 'Carrara & Verona', desc: 'Direct quarry extraction of Calacatta & Travertine blocks.', flag: '🇮🇹' },
            { country: 'Italy', city: 'Brianza & Milan', desc: 'Hand-stitched leather & haute upholstery ateliers.', flag: '🇮🇹' },
            { country: 'SE Asia', city: 'Malaysia & Vietnam', desc: 'Kiln-dried FSC legal timber reserves & hand ceramics.', flag: '🇲🇾' },
            { country: 'Indonesia', city: 'Bali Guilds', desc: 'Hand-carved volcanic stone and organic rattan tapestries.', flag: '🇮🇩' },
          ].map((hub, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-sunken/40 dark:bg-canvas border border-line/60 space-y-2"
            >
              <span className="text-2xl">{hub.flag}</span>
              <h4 className="font-bold text-base text-fg">{hub.city}</h4>
              <p className="text-xs text-muted font-light leading-relaxed">{hub.desc}</p>
            </div>
          ))}
        </div>

        {/* Narrative & Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-sm sm:text-base text-muted font-light leading-relaxed">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-subtle">
              <span>&bull; Full Provenance Passports</span>
              <span>&bull; Climate-Controlled Containers</span>
              <span>&bull; White-Glove Installation</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Button to={service.ctaLink} variant="primary" size="md" showArrow>
              {service.ctaText}
            </Button>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   7. LIGHTING & DECOR: Atmospheric Scenography & Museum Acoustics
   ========================================================================= */
const LightingDecorSection = ({ service }) => {
  return (
    <section id={service.id} className="scroll-mt-28">
      <m.div
        {...reveal()}
        className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[36px] bg-sunken/30 dark:bg-surface border border-line shadow-sm space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Atmospheric Lighting Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl sm:text-4xl text-accent">
                {service.number}
              </span>
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                Practice 07 &bull; {service.subtitle}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-tight tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-medium mt-2">
                {service.tagline}
              </p>
            </div>

            <p className="text-base text-muted font-light leading-relaxed">
              {service.description}
            </p>

            {/* 3 Lighting Specs */}
            <div className="grid grid-cols-3 gap-3">
              {service.stats?.map((stat, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-surface dark:bg-canvas border border-[#D1DCDE]/60 text-center">
                  <span className="block font-bold text-base text-accent">{stat.value}</span>
                  <span className="block text-[10px] uppercase text-subtle mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

            <ul className="space-y-2">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button to={service.ctaLink} variant="primary" size="md" showArrow>
                {service.ctaText}
              </Button>
            </div>
          </div>

          {/* Right: Lighting Photography with Ambient Warm Glow */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken border border-line shadow-xl group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-luxury font-medium bg-canvas/90 text-fg backdrop-blur-md border border-[#D1DCDE]/60">
                  {service.accentBadge}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono text-[#F5F1E8]">
                <span>CIRCADIAN LIGHTING 2700K – 4000K</span>
                <span className="text-[#BCA575]">MUSEUM 98+ CRI</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface dark:bg-canvas border border-[#D1DCDE]/60 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-accent">Acoustic Balance</span>
                <p className="text-sm font-semibold text-fg mt-0.5">
                  Micro-perforated acoustic felt &amp; library silence dampening
                </p>
              </div>
              <Sun className="w-6 h-6 text-accent shrink-0" />
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
};

/* =========================================================================
   MAIN SERVICES PAGE COMPONENT
   ========================================================================= */
export const Services = () => {
  return (
    <div className="pb-0 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="Services — Symmetry Interiors & Building Solutions"
        description="Explore Symmetry Interiors' 7 dedicated practices: Residential Interiors, Commercial Interiors, Hospitality Interiors, Turnkey Projects, Customized Furniture, Furniture Sourcing, and Lighting & Decor."
      />

      <PageHero
        page="services"
        breadcrumb={[{ label: 'Services' }]}
        eyebrow="Services"
        title="Comprehensive Interior"
        highlight="Solutions"
        subtitle="From concept design to final turnkey execution across residential, commercial, hospitality, healthcare, and institutional spaces."
        image={heroImage('/images/hero/hero-services.jpeg')}
        imageAlt="Symmetry Interiors design and execution"
        stats={[
          { value: '07', label: 'Specialist Services', sub: 'One Team' },
          { value: '25k', label: 'Sq.Ft. Workshop', sub: 'German CNC Machines' },
          { value: '14', label: 'Global Sourcing Hubs', sub: 'Quarry-Direct Stone' },
          { value: '450+', label: 'Projects Delivered', sub: 'Across Asia' },
        ]}
      />

      {/* =========================================================================
          DISCIPLINE QUICK-NAV JUMP BAR
          ========================================================================= */}
      <div id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <span className="text-xs uppercase tracking-luxury text-accent font-semibold block mb-1">
              What We Do
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
              Our Services
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(svc.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-full text-[14px] tracking-[-0.01em] font-medium bg-sunken/40 dark:bg-surface text-muted border border-line/70 dark:border-line hover:border-accent hover:text-fg transition-all cursor-pointer"
              >
                {svc.number}. {svc.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEVEN DEDICATED SERVICE SECTIONS WITH UNIQUE INDIVIDUAL STYLES
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 1. Residential Interiors */}
        <ResidentialSection service={services[0]} />

        {/* 2. Commercial Interiors */}
        <CommercialSection service={services[1]} />

        {/* 3. Hospitality Interiors */}
        <HospitalitySection service={services[2]} />

        {/* 4. Turnkey Projects */}
        <TurnkeySection service={services[3]} />

        {/* 5. Customized Furniture */}
        <CustomizedFurnitureSection service={services[4]} />

        {/* 6. Furniture Sourcing */}
        <FurnitureSourcingSection service={services[5]} />

        {/* 7. Lighting & Decor */}
        <LightingDecorSection service={services[6]} />
      </div>

      {/* =========================================================================
          PROCESS SECTION: METHODOLOGY & THE TURNKEY ARCHITECTURAL JOURNEY
          ========================================================================= */}
      <section className="bg-sunken/40 dark:bg-surface/60 py-20 sm:py-28 border-y border-line/70 dark:border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <m.div
              {...reveal()}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                Our Process
              </span>
            </m.div>

            <m.h2
              {...reveal({ order: 1 })}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fg leading-tight tracking-tight"
            >
              How a Project Works
            </m.h2>

            <m.p
              {...reveal({ order: 2 })}
              className="mt-4 text-base sm:text-lg text-muted font-light leading-relaxed"
            >
              Six clear steps that keep your project on budget, true to the design and on time.
            </m.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {processSteps.map((phase, idx) => {
              const IconComp = phase.icon;
              return (
                <m.div
                  {...reveal({ order: idx })}
                  key={phase.step}
                  className="p-8 rounded-2xl sm:rounded-3xl bg-surface border border-line shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-bold text-3xl sm:text-4xl text-accent">
                        {phase.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 dark:bg-accent/15 text-accent flex items-center justify-center">
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-fg mb-1">
                      {phase.name}
                    </h3>

                    <p className="text-xs uppercase tracking-luxury text-accent font-medium mb-3">
                      {phase.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-sunken dark:border-line">
                    <span className="text-[10px] uppercase font-mono text-subtle block mb-2">
                      What You Get:
                    </span>
                    <ul className="space-y-1.5">
                      {phase.deliverables.map((deliv, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-center gap-2 text-xs text-fg font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLEAN FINAL CTA SECTION
          ========================================================================= */}
      <FinalCta />
    </div>
  );
};

export default Services;
