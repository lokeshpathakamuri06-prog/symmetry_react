import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Globe,
  Compass,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import QuickViewModal from '../components/QuickViewModal';
import TestimonialCarousel from '../components/TestimonialCarousel';
import InstagramMosaic from '../components/InstagramMosaic';
import CoverflowCollections from '../components/CoverflowCollections';
import CoverflowSourcing from '../components/CoverflowSourcing';
import CategoryCircleMarquee from '../components/CategoryCircleMarquee';
import FinalCta from '../components/FinalCta';
import DynamicScrollShowcase from '../components/DynamicScrollShowcase';
import ScribbleUnderline from '../components/ScribbleUnderline';
import AppleCardWrapper from '../components/AppleCardWrapper';

// Data imports
import { products } from '../data/products';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';

export const Home = () => {
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Projects Typology Filter State
  const [projectFilter, setProjectFilter] = useState('All');

  // Filtered Projects for Section 6 (Guarantees exactly 4 curated projects per category)
  const filteredProjects = useMemo(() => {
    if (projectFilter === 'All') {
      const feat = projects.filter((p) => p.featured);
      if (feat.length >= 4) return feat.slice(0, 4);
      return projects.slice(0, 4);
    }
    return projects.filter((p) => p.typology === projectFilter).slice(0, 4);
  }, [projectFilter]);


  return (
    <div className="space-y-8 sm:space-y-12">
      <SeoMeta
        title="Spaces Designed Beyond the Ordinary | Symmetry Interiors"
        description="Luxury interiors, bespoke furniture and globally sourced craftsmanship — thoughtfully curated for exceptional living by Symmetry Interiors & Building Solutions Pvt. Ltd."
      />

      {/* =========================================================================
          SECTION 1: HERO
          Full viewport, parallax, image scale, text fade-up, scroll indicator
      ========================================================================= */}
      <Hero />

      {/* =========================================================================
          SECTION 2: ABOUT
          Editorial two-column section: Image + text
          Heading: "Where Architecture Meets Artistry"
          CTA: "Discover Our Story"
      ========================================================================= */}
      <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Subtle Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural space planning and interior design"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Architectural Badge */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-white dark:bg-[#0D1C29] shadow-apple dark:shadow-apple-dark hidden sm:block max-w-[240px]">
              <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-1.5">
                Heritage &bull; Excellence
              </span>
              <p className="text-xl text-[#131E20] dark:text-[#F5F1E8] font-medium leading-tight">
                25,000 sq.ft. Dedicated Atelier
              </p>
            </div>
          </motion.div>

          {/* Right Column: Text & Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs sm:text-sm uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              25+ Years Sourcing Expertise
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-medium text-[#131E20] dark:text-[#F5F1E8] leading-[1.12] tracking-tight">
              Built on Legacy.{' '}
              <ScribbleUnderline color="#36656B">Designed for Modern Living.</ScribbleUnderline>
            </h2>

            <p className="text-lg sm:text-xl text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
              Symmetry Interiors &amp; Building Solutions Private Limited is an interior design and furniture solutions company with over 25 years of sourcing expertise. We create elegant, functional, and timeless spaces through global sourcing, thoughtful design, premium materials, and professional execution.
            </p>

            <p className="text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
              From homes and offices to hotels, hospitals, clubs, and commercial spaces, we provide complete interior solutions from concept to completion.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <Button to="/about" variant="primary" size="lg" showArrow>
                Discover Our Story
              </Button>
              <div className="hidden sm:block pl-6 text-sm text-[#4F6467] dark:text-[#AEB7BE]">
                <strong className="text-[#131E20] dark:text-[#F5F1E8] block text-base font-medium">
                  25+ Years Legacy
                </strong>
                <span>Pan-India &bull; Global Sourcing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURED COLLECTIONS (3D COVERFLOW PERSPECTIVE CAROUSEL)
          Designs That Inspire Living — Luna Sofa, Aurelia Table, Elysian Chair, etc.
      ========================================================================= */}
      <CoverflowCollections />


      {/* =========================================================================
          SECTION 4: SHOP BY CATEGORY (CIRCULAR IMAGES & SLOW SCROLLING MARQUEE)
          Luxury Sofas, Lounge Chairs, Dining Furniture, Bedroom Furniture,
          Coffee Tables, Lighting, Rugs, Decorative Accessories
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <SectionHeading
            eyebrow="Furniture &amp; Objects"
            title="Shop by Category"
            subtitle="Browse individual bespoke archetypes engineered for luxury residential fitouts."
            align="center"
          />
        </div>

        <CategoryCircleMarquee />
      </section>


      {/* =========================================================================
          SECTION 5: FEATURED PRODUCTS
          Reusable ProductCard with image, name, category, price, wishlist, quick view
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <SectionHeading
            eyebrow="Collector Pieces"
            title="Featured Products"
            subtitle="Sculptural masterworks available with custom dimensions, Italian leathers, and tailored finishes."
          />
          <Button to="/shop" variant="secondary" size="md" showArrow className="self-start sm:self-auto">
            Explore All 24+ Pieces
          </Button>
        </div>

        {/* Responsive 3-column desktop / 2-column mobile Flipkart-inspired luxury grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {products.slice(0, 6).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FEATURED PROJECTS (ASYMMETRIC EDITORIAL GALLERY)
          Categories: Residential, Commercial, Hospitality
      ========================================================================= */}
      <section id="projects-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Spaces We’ve Brought to Life"
            subtitle="Explore our residential, hospitality, commercial, healthcare, and bespoke interior projects."
          />

          {/* Typology Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white dark:bg-[#0D1C29] shadow-apple dark:shadow-apple-dark">
            {['All', 'Residential', 'Commercial', 'Hospitality'].map((type) => (
              <button
                key={type}
                onClick={() => setProjectFilter(type)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm uppercase tracking-luxury font-medium transition-all ${
                  projectFilter === type
                    ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] font-semibold'
                    : 'text-[#4F6467] dark:text-[#AEB7BE] hover:text-[#131E20] dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Equal Size Architectural Showcase Grid (Balanced 2x2 Layout) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={projectFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch"
          >
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group flex flex-col h-full"
              >
                <Link
                  to={`/projects/${proj.id}`}
                  className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#E5ECEC] dark:bg-[#132838] mb-4 block shadow-sm group-hover:shadow-luxury-hover transition-all duration-500"
                >
                  <img
                    src={proj.heroImage}
                    alt={proj.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle Luxury Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/85 backdrop-blur-md text-[#F4F7F6] border border-white/15 shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36656B]" />
                      {proj.typology}
                    </span>
                    {proj.featured && (
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
                        Case Study
                      </span>
                    )}
                  </div>

                  {/* Bottom Left Footprint Badge */}
                  {proj.areaSqFt && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-[#131E20]/80 dark:bg-[#07121C]/80 backdrop-blur-md text-[#E5ECEC] border border-white/10">
                        {proj.areaSqFt}
                      </span>
                    </div>
                  )}

                  {/* Bottom Right Circular Action Trigger */}
                  <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] flex items-center justify-center shadow-lg group-hover:bg-[#36656B] group-hover:text-white transition-all duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* Metadata: Location & Year */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#36656B] dark:text-[#BCA575] uppercase tracking-luxury font-semibold mb-1.5">
                  <span>{proj.location}</span>
                  <span className="text-[#4F6467] dark:text-[#AEB7BE] font-normal">{proj.completionYear}</span>
                </div>

                {/* Title */}
                <Link to={`/projects/${proj.id}`} className="hover:text-[#36656B] dark:hover:text-[#BCA575] transition-colors">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] leading-snug">
                    {proj.title}
                  </h3>
                </Link>

                {/* Summary */}
                <p className="text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed mt-2.5 line-clamp-2">
                  {proj.summary}
                </p>

                {/* Materials Tag Strip */}
                {proj.materialsPalette && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#D1DCDE]/50 dark:border-[#1E3447]/60">
                    <span className="text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] mr-1">
                      Palette:
                    </span>
                    {proj.materialsPalette.slice(0, 3).map((mat, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-xs sm:text-sm px-3 py-0.5 rounded-full bg-[#E5ECEC]/60 dark:bg-[#132838] text-[#131E20] dark:text-[#F5F1E8] font-light"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-8">
          <Button to="/projects" variant="outline" size="md" showArrow>
            View Complete Architectural Portfolio
          </Button>
        </div>
      </section>

      {/* =========================================================================
          21OAKS-INSPIRED SCROLL-PINNED DYNAMIC PARALLAX GALLERY
          Central architectural pavilion with 6 dispersing 3D floating perspectives
      ========================================================================= */}
      <DynamicScrollShowcase />

      {/* =========================================================================
          SECTION 7: GLOBAL SOURCING (3D COVERFLOW PERSPECTIVE CAROUSEL)
          Show: Italy, China, Malaysia, Vietnam, Bali
          Same 3D perspective coverflow as Featured Collections
      ========================================================================= */}
      <CoverflowSourcing />

      {/* =========================================================================
          SECTION 8: WHY CHOOSE SYMMETRY (6 APPLE-INSPIRED ROUNDED CARDS)
          1. 25+ Years of Global Sourcing
          2. Architectural Tailoring
          3. International Craftsmanship
          4. End-to-End Solutions
          5. Curated Material Authenticity
          6. Private Concierge & 10-Yr Warranty
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <SectionHeading
            eyebrow="The Symmetry Distinction"
            title="Why Choose Symmetry"
            subtitle="Six foundational benchmarks that set our architectural delivery, proprietary joinery, and direct global procurement apart."
            align="center"
          />
        </div>

        {/* Apple-style Bento 6-Card Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Globe,
              kicker: 'PROCUREMENT',
              title: '25+ Years of Global Sourcing',
              desc: 'Direct, long-standing partnerships with generational stone quarries in Carrara and Verona, and master furniture ateliers across Europe and Asia with zero middleman markups.',
              highlight: 'Direct Quarry & Foundry Access',
              benchmark: 'Benchmark 01',
            },
            {
              icon: Compass,
              kicker: 'BESPOKE',
              title: 'Architectural Tailoring',
              desc: 'Zero generic templates. Every spatial layout, millwork elevation, and furniture piece is sculpted from scratch to honor your unique architectural proportions and daylight paths.',
              highlight: '100% Bespoke Dimensions',
              benchmark: 'Benchmark 02',
            },
            {
              icon: Award,
              kicker: 'PRECISION',
              title: 'International Craftsmanship',
              desc: 'European engineering married with our proprietary 25,000 sq.ft. five-axis CNC joinery facility in Hyderabad, achieving aerospace-level joinery tolerances.',
              highlight: '25,000 Sq.Ft. CNC Joinery',
              benchmark: 'Benchmark 03',
            },
            {
              icon: Layers,
              kicker: 'TURNKEY',
              title: 'End-to-End Solutions',
              desc: 'Single-point accountability from civil restructuring, acoustic space planning, and MEP coordination to white-glove site installation and final signoff.',
              highlight: 'Single-Point Accountability',
              benchmark: 'Benchmark 04',
            },
            {
              icon: Sparkles,
              kicker: 'PURITY',
              title: 'Curated Material Authenticity',
              desc: 'Uncompromising dedication to honest textures: honed Roman travertine, monolithic Nero Marquina, smoked French oak parquet, and raw Belgian linen.',
              highlight: '100% Authentic Origins',
              benchmark: 'Benchmark 05',
            },
            {
              icon: ShieldCheck,
              kicker: 'ASSURANCE',
              title: 'Private Concierge & 10-Yr Warranty',
              desc: 'White-glove placement under strict client confidentiality, post-installation surface conditioning, and complete peace of mind with a 10-year structural warranty.',
              highlight: '10-Year Structural Coverage',
              benchmark: 'Benchmark 06',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <AppleCardWrapper className="group relative p-8 sm:p-9 rounded-[32px] bg-white dark:bg-[#0D1C29] flex flex-col justify-between h-full">
                  <div>
                    {/* Top Header Row: Apple-like Squircle Icon & Kicker Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F7F6] dark:bg-[#132838] flex items-center justify-center text-[#36656B] dark:text-[#BCA575] shadow-sm group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-mono font-medium bg-[#F4F7F6] dark:bg-[#07121C] text-[#36656B] dark:text-[#BCA575]">
                        0{idx + 1} &bull; {item.kicker}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-medium text-[#131E20] dark:text-[#F5F1E8] leading-snug group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors">
                      {item.title}
                    </h3>

                    {/* Narrative Body */}
                    <p className="text-base text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light mt-3.5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Apple-style Stat */}
                  <div className="pt-6 mt-6 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-[#131E20] dark:text-[#F5F1E8] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36656B]" />
                      {item.highlight}
                    </span>

                    <span className="text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] font-light">
                      {item.benchmark}
                    </span>
                  </div>
                </AppleCardWrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: TESTIMONIALS
          Animated testimonial carousel
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <SectionHeading
            eyebrow="Client Endorsements"
            title="Voices of Discerning Owners"
            subtitle="Reflections from penthouse homeowners, estate founders, and collaborating architects."
            align="center"
          />
        </div>

        <TestimonialCarousel />
      </section>

      {/* =========================================================================
          SECTION 10: JOURNAL (LATEST 6 ARTICLES)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <SectionHeading
            eyebrow="Editorial Monographs"
            title="The Symmetry Journal"
            subtitle="Essays exploring quiet luxury, monolithic stone selections, acoustic engineering, biophilic microclimates, and bespoke joinery."
          />
          <Button to="/journal" variant="secondary" size="md" showArrow className="self-start sm:self-auto">
            View All Essays
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {blogs.slice(0, 6).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: INSTAGRAM IMAGE MOSAIC
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstagramMosaic />
      </section>

      {/* =========================================================================
          SECTION 12: ARCHITECTURAL COMMISSION CTA
      ========================================================================= */}
      <FinalCta />

      {/* Quick View Modal Overlay (Activated when Eye icon clicked in ProductCard) */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Home;
