import React from 'react';
import { m } from 'framer-motion';
import { scrollToTarget } from '../lib/scroll';
import { reveal } from '../lib/motion';
import { 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import { SEO_DEFAULTS } from '../lib/seoDefaults';
import Button from '../components/Button';
import { sourcingCountries, sourcingProcess, sourcingStats } from '../data/sourcing';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';


export const Sourcing = () => {
  const scrollToAnchor = (anchorId) => {
    scrollToTarget(document.getElementById(anchorId));
  };

  return (
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-28 overflow-x-clip">
      <SeoMeta page="sourcing" title={SEO_DEFAULTS.sourcing.title} description={SEO_DEFAULTS.sourcing.description} />

      <PageHero
        page="sourcing"
        breadcrumb={[{ label: 'Global Sourcing' }]}
        eyebrow="Global Sourcing"
        title="Craftsmanship"
        highlight="Without Borders"
        subtitle="Twenty-five years of direct extraction rights at Italian stone quarries and generational contracts with master craft guilds across China, Malaysia, Vietnam, and Bali."
        image={heroImage('/images/hero/stock-sourcing.jpeg')}
        imageAlt="A container ship being loaded at a port"
        stats={sourcingStats}
      />

      {/* =========================================================================
          SECTION 2: QUICK-JUMP ORIGIN NAVIGATION PILL BAR
          ========================================================================= */}
      <section id="origins-nav" className="site-container scroll-mt-28">
        <div className="p-6 sm:p-8 rounded-tile bg-gradient-to-r from-surface via-surface to-surface dark:via-canvas border border-line shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs text-accent font-semibold block mb-1">
              International Procurement Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
              Direct Origin Hubs
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {sourcingCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => scrollToAnchor(country.anchorId)}
                className="px-4 py-2.5 rounded-full text-[14px] tracking-[-0.01em] font-medium bg-surface dark:bg-canvas text-fg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <span>{country.flag}</span>
                <span className="font-mono text-[10px] text-accent">{country.chapter}.</span>
                <span>{country.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B8083] group-hover:text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
      <div className="space-y-20 sm:space-y-32 site-container">
        {sourcingCountries.map((country, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <section
              key={country.id}
              id={country.anchorId}
              className="scroll-mt-28"
            >
              <m.div
                {...reveal()}
                className="rounded-tile sm:rounded-[44px] bg-gradient-to-b from-surface via-surface to-surface dark:via-canvas border border-line hover:border-accent/50 p-6 sm:p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-500"
              >
                {/* Subtle ambient decorative radial glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-line/70 dark:border-line">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{country.flag}</span>
                    <div>
                      <span className="text-[12px] sm:text-xs font-semibold text-accent block">
                        {country.chapter} &bull; {country.name}
                      </span>
                      <span className="text-xs font-mono text-subtle">
                        {country.region}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunken/40 dark:bg-sunken border border-line/50 dark:border-line text-muted">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>{country.coordinates}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold border border-accent/20">
                      {country.provenanceYears}
                    </span>
                  </div>
                </div>

                {/* Two-Column Grid: Images Frame & Narrative/Products */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                  {/* Visuals Column: 3-Image Showcase (Hero + 2 Detail Insets) */}
                  <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                    {/* Primary Large Image Frame */}
                    <div className="relative aspect-[16/11] rounded-2xl sm:rounded-tile overflow-hidden bg-sunken group">
                      <img loading="lazy" decoding="async"
                        src={country.galleryImages[0].url}
                        alt={`${country.name} procurement showcase`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


                      {/* Floating Provenance Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3.5 py-1.5 rounded-full text-[12px] font-sans font-medium bg-fg/85 dark:bg-canvas/90 text-[#F5F1E8] backdrop-blur-md border border-white/15 shadow-md">
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
                          className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-sunken group cursor-pointer"
                        >
                          <img loading="lazy" decoding="async"
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                            <p className="text-[10px] sm:text-[11px] text-white leading-snug line-clamp-2">
                              {img.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Direct Sourcing Verification Banner */}
                    <div className="p-4 rounded-xl sm:rounded-2xl bg-canvas flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-fg">
                        <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                        <span className="font-medium">Direct Sourcing Alliance:</span>
                        <span className="text-muted">{country.partnerAteliers}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-mono text-accent font-semibold shrink-0">
                        100% IN-PERSON VETTED
                      </span>
                    </div>
                  </div>

                  {/* Content Column: Brief Description, Products Sourced, Craftsmanship Standards */}
                  <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                    {/* Header */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-fg leading-tight">
                        {country.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans text-accent font-semibold mt-1.5">
                        {country.tagline}
                      </p>
                    </div>

                    {/* Brief Description */}
                    <div className="space-y-3 text-sm sm:text-base text-muted leading-relaxed">
                      <p>{country.description}</p>
                    </div>

                    {/* Products Sourced Section */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line/60 dark:border-line">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <h4 className="text-xs font-semibold text-fg">
                          What We Source Here
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {country.productsSourced.map((product, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3.5 rounded-2xl bg-surface dark:bg-canvas flex items-start gap-3.5 text-xs sm:text-sm text-fg hover:-translate-y-0.5 transition-all duration-300 group"
                          >
                            <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-on-accent transition-colors">
                              <span className="font-mono text-[10px] font-bold">0{pIdx + 1}</span>
                            </div>
                            <span className="leading-snug">{product}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Craftsmanship Highlights & Technical Benchmarks */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line/60 dark:border-line">
                        <Award className="w-4 h-4 text-accent" />
                        <h4 className="text-xs font-semibold text-fg">
                          Craftsmanship Highlights &amp; Technical Standards
                        </h4>
                      </div>

                      <ul className="space-y-2">
                        {country.craftsmanshipHighlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-muted leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
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
                      <span className="text-xs font-mono text-subtle">
                        Direct Conduit &bull; Zero Middlemen
                      </span>
                    </div>
                  </div>
                </div>
              </m.div>
            </section>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION 4: SOURCING PROCESS (THE END-TO-END PROCUREMENT JOURNEY)
          ========================================================================= */}
      <section className="relative bg-gradient-to-b from-sunken/30 via-transparent to-sunken/20 dark:from-canvas dark:via-canvas dark:to-canvas py-24 sm:py-36 border-t border-line/70 dark:border-line overflow-hidden">
        {/* Ambient decorative backdrop glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="site-container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <m.div
              {...reveal()}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <span className="text-xs sm:text-sm text-accent font-semibold">
                Five-Stage Sourcing Pipeline
              </span>
            </m.div>

            <m.h2
              {...reveal({ order: 1 })}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-fg leading-tight tracking-tight"
            >
              The End-to-End Procurement Journey
            </m.h2>

            <m.p
              {...reveal({ order: 2 })}
              className="mt-4 text-xs sm:text-sm md:text-base text-muted max-w-2xl mx-auto leading-relaxed"
            >
              Every stone slab, hardwood piece and Murano chandelier is checked at the source before it is packed and shipped.
            </m.p>
          </div>

          {/* Stepper Progress Track Connector (Desktop Only) */}
          <div className="hidden lg:block relative mb-8">
            <div className="absolute top-6 left-12 right-12 h-[2px] bg-line -z-0" />
            <div className="grid grid-cols-5 gap-6 text-center relative z-10">
              {sourcingProcess.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 flex items-center justify-center text-xs font-mono font-bold text-accent">
                    {step.step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Step Process Pipeline Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
            {sourcingProcess.map((step, idx) => {
              const StepIcon = step.icon;

              return (
                <m.div
                  {...reveal({ order: idx })}
                  key={idx}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative p-4 sm:p-7 rounded-[24px] sm:rounded-[32px] bg-gradient-to-b from-surface via-surface to-canvas dark:via-canvas border border-line shadow-lg hover:shadow-[0_25px_50px_rgba(54,101,107,0.16)] dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)] hover:border-accent/70 transition-all duration-500 flex flex-col justify-between overflow-hidden group"
                >

                  {/* Faint Giant Watermark Numeral */}
                  <span className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 font-bold text-5xl sm:text-7xl text-accent/10 group-hover:text-accent/20 group-hover:scale-[1.05] transition-all duration-500 select-none pointer-events-none">
                    {step.step}
                  </span>

                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    {/* Top Row: Phase Tag & Glowing Icon Pod */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10.5px] sm:text-[12px] font-mono bg-sunken/60 dark:bg-sunken border border-line/60 dark:border-line text-accent font-semibold group-hover:bg-accent group-hover:text-on-accent transition-colors duration-300">
                        PHASE {step.step}
                      </span>
                      <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-canvas to-sunken dark:from-sunken dark:to-canvas border border-line items-center justify-center text-accent shadow-sm group-hover:scale-115 group-hover:rotate-6 group-hover:border-accent transition-all duration-500">
                        <StepIcon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                    </div>

                    {/* Step Title & Tagline */}
                    <div>
                      <h3 className="font-semibold tracking-tight text-[18px] sm:text-2xl text-fg leading-snug group-hover:text-accent transition-colors duration-300">
                        {step.name}
                      </h3>
                      <p className="text-[12px] font-sans text-accent font-semibold mt-1">
                        {step.tagline}
                      </p>
                    </div>

                    {/* Narrative Description */}
                    <p className="text-[12px] sm:text-xs text-muted leading-relaxed line-clamp-5 sm:line-clamp-none">
                      {step.desc}
                    </p>
                  </div>

                  {/* Deliverables / Milestones Dossier Vault */}
                  <div className="hidden sm:block relative z-10 mt-6 pt-5 border-t border-line/60 dark:border-line/80">
                    <span className="text-[12px] font-mono text-subtle flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      Stage Milestones
                    </span>
                    <div className="space-y-1.5">
                      {step.deliverables.map((del, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-surface/70 dark:bg-canvas/70 border border-line/50 text-[11px] text-fg font-medium group-hover:border-accent/40 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span className="truncate">{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Bottom Step Progress Link */}
                    <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-between text-[10px] font-mono text-subtle">
                      <span>STEP 0{idx + 1} / 05</span>
                      <span className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform duration-300 font-semibold">
                        Forward &rarr;
                      </span>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sourcing;
