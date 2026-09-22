import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  MapPin, 
  Check 
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Button from '../components/Button';
import TeamCard from '../components/TeamCard';
import FinalCta from '../components/FinalCta';
import { 
  heroStats, 
  timelineMilestones, 
  sourcingHubs, 
  sourcingGuarantees, 
  missionData, 
  visionData, 
  teamMembers, 
  whyChoosePillars 
} from '../data/aboutData';

export const About = () => {
  // Department filter for team section
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Architecture & Design', 'Sourcing & Materials', 'Fabrication & Engineering'];

  const filteredTeam = selectedDept === 'All'
    ? teamMembers
    : teamMembers.filter((m) => m.department === selectedDept);

  return (
    <div className="pb-0 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="About Symmetry Interiors — Creating Spaces With Character"
        description="Discover Symmetry Interiors: 25+ years of legacy, proprietary 25,000 sq.ft. high-precision joinery, direct quarry sourcing across Italy and Asia, and turnkey architectural execution."
      />

      {/* =========================================================================
          SECTION 1: FULL-BLEED ARCHITECTURAL CINEMATIC HERO
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[680px] sm:min-h-[760px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed background media with architectural image & overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/hero/hero-about.jpeg"
            alt="Symmetry Interiors Architectural Atelier & Pavilion"
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
            <span className="text-[#BCA575] font-semibold">About Symmetry</span>
          </motion.div>
        </div>

        {/* Center Title */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-tight tracking-tight drop-shadow-md"
          >
            Built on Legacy. <span className="text-[#BCA575] font-bold">Designed for Modern Living.</span>
          </motion.h1>
        </div>
      </section>

      {/* Metrics Strip Directly Under Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6"
        >
          {heroStats.map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-xl hover:-translate-y-1 transition-transform duration-300"
            >
              <p className="font-bold text-3xl sm:text-4xl lg:text-5xl text-[#36656B] dark:text-[#BCA575]">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-sans font-medium text-[#131E20] dark:text-[#F5F1E8] mt-1.5">
                {stat.label}
              </p>
              <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE] font-light mt-0.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: COMPANY STORY
          ========================================================================= */}
      <section id="story-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                Chapter I • Company Story
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#131E20] dark:text-[#F5F1E8] leading-[1.15] tracking-tight"
            >
              Resolving the Divide Between Visionary Blueprint &amp; Physical Reality.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed"
            >
              <p>
                In the late 1990s, the Indian luxury interior landscape suffered from a pervasive dilemma: visionary architects would draw poetic, millimeter-precise concepts, only to watch them unravel at the hands of disjointed regional subcontractors and unvetted materials.
              </p>
              <p>
                Symmetry Interiors was established to cure this structural fragmentation. We rejected the traditional broker model in favor of an uncompromising vertical ecosystem: securing direct quarry concessions in Italy, building our own 25,000 sq.ft. computerized fabrication campus, and fielding our own civil site directors.
              </p>
              <p>
                Today, our commissions span high-net-worth family compounds, boutique private art galleries, and enterprise penthouses—each delivered with the quiet confidence of timeless materiality.
              </p>
            </motion.div>

            {/* Founder Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 sm:p-8 rounded-2xl bg-[#E5ECEC]/40 dark:bg-[#0D1C29] border-l-4 border-[#36656B] dark:border-[#BCA575] border-y border-r border-[#D1DCDE] dark:border-[#1E3447]"
            >
              <p className="font-semibold italic text-lg sm:text-xl text-[#131E20] dark:text-[#F5F1E8] leading-snug">
                “A space achieves character not through superficial decoration, but when the stone, the grain of the oak, and the light operate in quiet, honest equilibrium.”
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-luxury font-medium text-[#36656B] dark:text-[#BCA575]">
                    Vikramaditya Rao
                  </p>
                  <p className="text-[11px] text-[#4F6467] dark:text-[#AEB7BE]">
                    Founder &amp; Principal Architect
                  </p>
                </div>
                <Button to="/projects" variant="ghost" size="sm" showArrow>
                  Explore Works
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Editorial Asymmetric Visual Grid */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="col-span-7 aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural details and precision stonework"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="col-span-5 space-y-4 sm:space-y-6 pt-8 sm:pt-12"
            >
              <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                  alt="Bespoke timber joinery atelier"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] text-center">
                <p className="font-bold text-3xl text-[#36656B] dark:text-[#BCA575]">100%</p>
                <p className="text-[11px] uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] font-medium mt-1">
                  In-House Execution
                </p>
                <p className="text-[10px] text-[#4F6467] dark:text-[#AEB7BE] mt-0.5">
                  Zero sub-contracting risk
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LEGACY & EXPERIENCE (VISUAL TIMELINE)
          ========================================================================= */}
      <section id="legacy-section" className="bg-[#E5ECEC]/40 dark:bg-[#0D1C29]/60 py-20 sm:py-32 border-y border-[#D1DCDE]/70 dark:border-[#1E3447]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
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
                Chapter II • Legacy &amp; Experience
              </span>
              <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#131E20] dark:text-[#F5F1E8] leading-tight tracking-tight"
            >
              Twenty-Five Years of Architectural Milestones
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed"
            >
              Trace our journey from an ambitious boutique studio into South Asia’s foremost turnkey architectural interior authority.
            </motion.p>
          </div>

          {/* Visual Timeline Spine */}
          <div className="relative">
            {/* Center Vertical Guideline for Desktop */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[#36656B]/20 via-[#36656B] to-[#36656B]/20 dark:from-[#BCA575]/20 dark:via-[#BCA575] dark:to-[#BCA575]/20" />

            <div className="space-y-12 sm:space-y-20">
              {timelineMilestones.map((item, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                      isEven ? 'lg:text-right' : 'lg:text-left'
                    }`}
                  >
                    {/* Content Card (Left on even, Right on odd) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:order-1' : 'lg:order-2 lg:col-start-8'
                      }`}
                    >
                      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm hover:shadow-md transition-shadow">
                        <div className={`flex items-center gap-3 mb-3 ${isEven ? 'lg:justify-end' : 'justify-start'}`}>
                          <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] uppercase tracking-luxury font-medium bg-[#36656B]/10 dark:bg-[#BCA575]/15 text-[#36656B] dark:text-[#BCA575]">
                            {item.phase}
                          </span>
                          <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        </div>

                        <h3 className="font-bold tracking-tight text-2xl sm:text-3xl text-[#131E20] dark:text-[#F5F1E8] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-medium mb-3">
                          {item.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed mb-4">
                          {item.desc}
                        </p>

                        <div className={`pt-3 border-t border-[#E5ECEC] dark:border-[#1E3447] flex items-center gap-2 ${isEven ? 'lg:justify-end' : 'justify-start'}`}>
                          <CheckCircle2 className="w-4 h-4 text-[#36656B] dark:text-[#BCA575]" />
                          <span className="text-xs font-medium text-[#131E20] dark:text-[#F5F1E8]">
                            {item.metric}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center Year Marker Node */}
                    <div className="hidden lg:flex lg:col-span-2 lg:order-2 lg:col-start-6 items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-[#131E20] dark:bg-[#F5F1E8] text-[#F5F1E8] dark:text-[#07121C] flex flex-col items-center justify-center font-bold text-base shadow-lg ring-8 ring-[#E5ECEC] dark:ring-[#0D1C29] z-10">
                        <span>{item.year}</span>
                      </div>
                    </div>

                    {/* Visual Milestone Photo (Right on even, Left on odd) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:order-3 lg:col-start-8' : 'lg:order-1'
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-md group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-4 text-[#F5F1E8] text-xs font-mono">
                          {item.year} • ARCHIVAL RECORD
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 25+ YEARS OF GLOBAL SOURCING
          ========================================================================= */}
      <section id="sourcing-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />
                <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  Chapter III • 25+ Years of Global Sourcing
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#131E20] dark:text-[#F5F1E8] leading-tight tracking-tight max-w-2xl"
              >
                25+ Years of Global Sourcing Mastery
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#4F6467] dark:text-[#AEB7BE] font-light max-w-xl leading-relaxed"
            >
              Direct quarry extractions, multi-generational weaving guilds, and European hardware leaders. We eliminate trading brokers to ensure immaculate material purity.
            </motion.p>
          </div>

          {/* Sourcing Hubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sourcingHubs.map((hub, idx) => (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Hub Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E5ECEC] dark:bg-[#132838]">
                  <img
                    src={hub.image}
                    alt={`${hub.country} sourcing origin`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Country Flag & Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#07121C]/90 backdrop-blur-md text-xs font-sans font-medium text-[#131E20] dark:text-[#F5F1E8]">
                    <span>{hub.flag}</span>
                    <span>{hub.country}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 text-[#F5F1E8]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#BCA575]">
                      {hub.city}
                    </span>
                  </div>
                </div>

                {/* Hub Description */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-1">
                      {hub.tag}
                    </span>
                    <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>

                  {/* Curated Materials Pills */}
                  <div className="pt-4 border-t border-[#E5ECEC] dark:border-[#1E3447]">
                    <span className="text-[10px] uppercase font-mono text-[#6B8083] dark:text-[#8E9CA8] block mb-2">
                      Key Provenance Curations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hub.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[10px] font-sans bg-[#F4F7F6] dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] border border-[#D1DCDE]/50 dark:border-[#1E3447]/50"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sourcing Guarantees Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {sourcingGuarantees.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-2xl bg-[#E5ECEC]/40 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#36656B]/10 dark:bg-[#BCA575]/15 text-[#36656B] dark:text-[#BCA575] flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#131E20] dark:text-[#F5F1E8]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: MISSION & VISION (EDITORIAL DUAL SPREAD)
          ========================================================================= */}
      <section id="mission-vision-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />
                <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  Chapter IV • Our Mission
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8]">
                {missionData.title}
              </h2>

              <p className="text-lg sm:text-xl font-serif italic text-[#36656B] dark:text-[#BCA575] leading-snug">
                “{missionData.lead}”
              </p>

              <p className="text-sm sm:text-base text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                {missionData.statement}
              </p>

              {/* Mission Pillars */}
              <div className="pt-6 space-y-4 border-t border-[#E5ECEC] dark:border-[#1E3447]">
                {missionData.pillars.map((pillar, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#36656B]/15 dark:bg-[#BCA575]/20 text-[#36656B] dark:text-[#BCA575] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury font-medium text-[#131E20] dark:text-[#F5F1E8]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] font-light mt-0.5">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#131E20] dark:bg-[#07121C] text-[#F5F1E8] border border-[#333] dark:border-[#1E3447] shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#36656B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-[#BCA575]" />
                <span className="text-xs uppercase tracking-luxury text-[#BCA575] font-semibold">
                  Chapter IV • Our Vision
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F1E8] font-normal">
                {visionData.title}
              </h2>

              <p className="text-lg sm:text-xl font-serif italic text-[#BCA575] leading-snug">
                “{visionData.lead}”
              </p>

              <p className="text-sm sm:text-base text-[#AEB7BE] font-light leading-relaxed">
                {visionData.statement}
              </p>

              {/* Vision Commitments */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/15">
                {visionData.commitments.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs font-mono text-[#BCA575]">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-luxury text-[#AEB7BE] mt-1 font-medium">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OUR TEAM (REUSABLE TEAM CARD COMPONENTS)
          ========================================================================= */}
      <section id="team-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="w-6 h-px bg-[#36656B] dark:bg-[#BCA575]" />
                <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                  Chapter V • Our Team
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight tracking-tight"
              >
                Our Leadership &amp; Mastercraft
              </motion.h2>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-luxury font-medium transition-all duration-300 cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-sm'
                      : 'bg-white dark:bg-[#0D1C29] text-[#4F6467] dark:text-[#AEB7BE] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Reusable TeamCard Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredTeam.map((member, idx) => (
                <TeamCard key={member.id} member={member} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY CHOOSE SYMMETRY
          ========================================================================= */}
      <section id="why-choose-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <span className="w-8 h-px bg-[#36656B] dark:bg-[#BCA575]" />
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
                Chapter VI • Why Choose Symmetry
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
              Why Choose Symmetry
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed"
            >
              A structural comparison between conventional interior contracting and our vertically unified architectural practice.
            </motion.p>
          </div>

          {/* 6 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {whyChoosePillars.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#36656B]/10 dark:bg-[#BCA575]/15 text-[#36656B] dark:text-[#BCA575] flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#F4F7F6] dark:bg-[#07121C] text-[#36656B] dark:text-[#BCA575] border border-[#D1DCDE]/50 dark:border-[#1E3447]/50">
                        {item.stat}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#131E20] dark:text-[#F5F1E8] font-normal mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E5ECEC] dark:border-[#1E3447] flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-medium">
                      Guaranteed In Contract
                    </span>
                    <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                      {item.number}/06
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CTA (CALL TO ACTION)
          ========================================================================= */}
      <FinalCta />
    </div>
  );
};

export default About;
