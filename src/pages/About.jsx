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
  whyChoosePillars 
} from '../data/aboutData';
import { useTeam } from '../context/PublicContentContext';
import { useSiteText } from '../context/PublicContentContext';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';

export const About = () => {
  const text = useSiteText('about');
  const { items: teamMembers } = useTeam();
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

      <PageHero
        page="about"
        breadcrumb={[{ label: 'About Symmetry' }]}
        eyebrow="About Symmetry"
        title={text.heroTitle}
        highlight={text.heroTitleHighlight}
        image={heroImage('/images/hero/hero-about.jpeg')}
        imageAlt="Symmetry Interiors studio lounge"
        stats={heroStats}
      />

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
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                Our Story
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.15] tracking-tight"
            >
              {text.storyTitle}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-base sm:text-lg text-muted font-light leading-relaxed"
            >
              <p className="font-normal text-fg">
                {text.storyParagraph1}
              </p>
              <p>
                {text.storyParagraph2}
              </p>
              {text.storyParagraph3 && (
                <p>
                  {text.storyParagraph3}
                </p>
              )}
            </motion.div>

            {/* Brand Message & Company Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 sm:p-8 rounded-2xl bg-sunken/40 dark:bg-surface border-l-4 border-accent border-y border-r border-line space-y-3"
            >
              <span className="text-xs uppercase tracking-luxury text-accent font-semibold block">
                Brand Message
              </span>
              <p className="font-bold text-xl sm:text-2xl text-fg">
                Your Space. Our Expertise.
              </p>
              <p className="text-sm text-muted">
                From globally sourced furniture to complete interior execution, we create spaces designed around your vision.
              </p>
              <div className="pt-2 border-t border-line/70 dark:border-line text-xs space-y-1">
                <p className="font-semibold text-fg">
                  Registered Office: <span className="font-normal text-muted">Plot No. 65, Seva Mandal Shantiniketan Colony, M. Hills, Secunderabad, Hyderabad, Telangana – 500026, India.</span>
                </p>
                <p className="font-semibold text-fg">
                  CIN: <span className="font-mono text-accent">U51909TG2017PTC115299</span>
                </p>
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
              className="col-span-7 aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken shadow-lg"
            >
              <img loading="lazy" decoding="async"
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
              <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken shadow-lg">
                <img loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                  alt="Bespoke timber joinery atelier"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-line text-center">
                <p className="font-bold text-3xl text-accent">100%</p>
                <p className="text-[11px] uppercase tracking-luxury text-fg font-medium mt-1">
                  In-House Execution
                </p>
                <p className="text-[10px] text-muted mt-0.5">
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
      <section id="legacy-section" className="bg-sunken/40 dark:bg-surface/60 py-20 sm:py-32 border-y border-line/70 dark:border-line">
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
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                Our History
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fg leading-tight tracking-tight"
            >
              25 Years in the Making
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-muted font-light leading-relaxed"
            >
              How a small design studio grew into one of South Asia’s leading turnkey interior companies.
            </motion.p>
          </div>

          {/* Visual Timeline Spine */}
          <div className="relative">
            {/* Center Vertical Guideline for Desktop */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-accent/20 via-accent to-accent/20" />

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
                      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-surface border border-line shadow-sm hover:shadow-md transition-shadow">
                        <div className={`flex items-center gap-3 mb-3 ${isEven ? 'lg:justify-end' : 'justify-start'}`}>
                          <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] uppercase tracking-luxury font-medium bg-accent/10 dark:bg-accent/15 text-accent">
                            {item.phase}
                          </span>
                          <span className="text-xs font-mono text-subtle flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        </div>

                        <h3 className="font-bold tracking-tight text-2xl sm:text-3xl text-fg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs uppercase tracking-luxury text-accent font-medium mb-3">
                          {item.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-muted font-light leading-relaxed mb-4">
                          {item.desc}
                        </p>

                        <div className={`pt-3 border-t border-sunken dark:border-line flex items-center gap-2 ${isEven ? 'lg:justify-end' : 'justify-start'}`}>
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-xs font-medium text-fg">
                            {item.metric}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center Year Marker Node */}
                    <div className="hidden lg:flex lg:col-span-2 lg:order-2 lg:col-start-6 items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-fg text-[#F5F1E8] dark:text-canvas flex flex-col items-center justify-center font-bold text-base shadow-lg ring-8 ring-sunken dark:ring-surface z-10">
                        <span>{item.year}</span>
                      </div>
                    </div>

                    {/* Visual Milestone Photo (Right on even, Left on odd) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:order-3 lg:col-start-8' : 'lg:order-1'
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-sunken shadow-md group">
                        <img loading="lazy" decoding="async"
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
                <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                  25+ Years of Global Sourcing
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fg leading-tight tracking-tight max-w-2xl"
              >
                25+ Years of Global Sourcing Mastery
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-muted font-light max-w-xl leading-relaxed"
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
                className="group rounded-2xl sm:rounded-3xl bg-surface border border-line overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Hub Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-sunken">
                  <img loading="lazy" decoding="async"
                    src={hub.image}
                    alt={`${hub.country} sourcing origin`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Country Flag & Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-surface/90 dark:bg-canvas/90 backdrop-blur-md text-xs font-sans font-medium text-fg">
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
                    <span className="text-xs uppercase tracking-luxury text-accent font-semibold block mb-1">
                      {hub.tag}
                    </span>
                    <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>

                  {/* Curated Materials Pills */}
                  <div className="pt-4 border-t border-sunken dark:border-line">
                    <span className="text-[10px] uppercase font-mono text-subtle block mb-2">
                      Key Provenance Curations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hub.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[10px] font-sans bg-canvas text-fg border border-line/50"
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
                  className="p-6 sm:p-8 rounded-2xl bg-sunken/40 dark:bg-surface border border-line flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-fg">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted font-light leading-relaxed mt-1">
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
            className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-surface border border-line shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-luxury text-accent font-semibold">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-fg">
                {missionData.title}
              </h2>

              <p className="text-lg sm:text-xl font-serif italic text-accent leading-snug">
                “{missionData.lead}”
              </p>

              <p className="text-sm sm:text-base text-muted font-light leading-relaxed">
                {missionData.statement}
              </p>

              {/* Mission Pillars */}
              <div className="pt-6 space-y-4 border-t border-sunken dark:border-line">
                {missionData.pillars.map((pillar, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/15 dark:bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury font-medium text-fg">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-muted font-light mt-0.5">
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
            className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-fg dark:bg-canvas text-[#F5F1E8] border border-[#333] dark:border-line shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-[#BCA575]" />
                <span className="text-xs uppercase tracking-luxury text-[#BCA575] font-semibold">
                  Our Vision
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
                <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                  Our Team
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-fg font-normal leading-tight tracking-tight"
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
                      ? 'bg-fg text-canvas shadow-sm'
                      : 'bg-surface text-muted border border-line hover:border-accent'
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

          {/* Join Our Team CTA */}
          <div className="mt-4 p-8 sm:p-10 rounded-3xl bg-fg dark:bg-surface border border-fg dark:border-line flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-luxury text-[#A7C3C6] dark:text-accent font-semibold">Careers</span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">Join Our Team</h3>
              <p className="text-sm text-white/70 mt-2 max-w-xl">
                We&apos;re looking for designers, site engineers and visualisers who care about craft. Explore our open roles in Hyderabad.
              </p>
            </div>
            <Link
              to="/careers"
              className="shrink-0 inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-[#1D1D1F] text-[14px] tracking-[-0.01em] font-medium hover:bg-[#BCA575] hover:text-white transition"
            >
              View Open Roles
            </Link>
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
              <span className="text-xs sm:text-sm uppercase tracking-luxury text-accent font-semibold">
                Why Choose Symmetry
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-fg font-normal leading-tight tracking-tight"
            >
              Why Choose Symmetry
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-muted font-light leading-relaxed"
            >
              How working with one team that designs, sources and builds compares with a typical contractor.
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
                  className="p-8 rounded-2xl sm:rounded-3xl bg-surface border border-line shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 dark:bg-accent/15 text-accent flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-canvas text-accent border border-line/50">
                        {item.stat}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-fg font-normal mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-sunken dark:border-line flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-luxury text-accent font-medium">
                      Guaranteed In Contract
                    </span>
                    <span className="text-xs font-mono text-subtle">
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
