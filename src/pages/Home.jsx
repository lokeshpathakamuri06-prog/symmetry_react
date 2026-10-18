import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { reveal, dur, ease } from '../lib/motion';
import { scrollToTarget } from '../lib/scroll';
import {
  ChevronRight,
  Globe,
  Compass,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import { SEO_DEFAULTS } from '../lib/seoDefaults';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import QuickViewModal from '../components/QuickViewModal';
import TestimonialCard from '../components/TestimonialCard';
import InstagramMosaic from '../components/InstagramMosaic';
import CollectionsGallery from '../components/CollectionsGallery';
import SourcingGallery from '../components/SourcingGallery';
import CategoryGallery from '../components/CategoryGallery';
import CardGallery from '../components/CardGallery';
import FinalCta from '../components/FinalCta';
import HomeContact from '../components/HomeContact';
import SiteOverview from '../components/SiteOverview';
import ZoomOutPhoto from '../components/motion/ZoomOutPhoto';
import CountUp from '../components/motion/CountUp';
import ScrollHighlight from '../components/motion/ScrollHighlight';
import ContentState from '../components/ContentState';
import { usePublicContent, useSiteText, useTestimonials } from '../context/PublicContentContext';
import SmartImage from '../components/SmartImage';
import { heroImage } from '../lib/staticImages';

// The six "Why Symmetry" points
const WHY_ITEMS = [
  {
    icon: Globe,
    kicker: 'PROCUREMENT',
    title: '25+ Years of Global Sourcing',
    desc: 'Long-standing partnerships with stone quarries in Carrara and Verona and furniture makers across Europe and Asia, with no middleman markups.',
    highlight: 'Direct Quarry & Foundry Access',
    benchmark: 'Benchmark 01',
  },
  {
    icon: Compass,
    kicker: 'BESPOKE',
    title: 'Designed Around You',
    desc: 'No templates. Every layout, cabinet and piece of furniture is designed from scratch for your space, its proportions and its light.',
    highlight: '100% Bespoke Dimensions',
    benchmark: 'Benchmark 02',
  },
  {
    icon: Award,
    kicker: 'PRECISION',
    title: 'International Craftsmanship',
    desc: 'European techniques and our own 25,000 sq.ft. CNC workshop in Hyderabad, for joinery that is precise to the millimetre.',
    highlight: '25,000 Sq.Ft. CNC Joinery',
    benchmark: 'Benchmark 03',
  },
  {
    icon: Layers,
    kicker: 'TURNKEY',
    title: 'End-to-End Solutions',
    desc: 'One team responsible for everything: civil work, planning, electrical and plumbing, installation and final handover.',
    highlight: 'Single-Point Accountability',
    benchmark: 'Benchmark 04',
  },
  {
    icon: Sparkles,
    kicker: 'PURITY',
    title: 'Real, Honest Materials',
    desc: 'Natural materials only: honed Roman travertine, Nero Marquina marble, smoked French oak and Belgian linen.',
    highlight: '100% Authentic Origins',
    benchmark: 'Benchmark 05',
  },
  {
    icon: ShieldCheck,
    kicker: 'ASSURANCE',
    title: 'Personal Service & 10-Year Warranty',
    desc: 'Careful installation, complete confidentiality, after-care once you move in, and a 10-year structural warranty.',
    highlight: '10-Year Structural Coverage',
    benchmark: 'Benchmark 06',
  },
];

// Facts from the "Why Symmetry" points, shown as figures under the About story
const ABOUT_FIGURES = [
  { value: '25+', label: 'Years of expertise', sub: 'Sourcing across Europe & Asia' },
  { value: '25,000', label: 'Sq.ft. own workshop', sub: 'CNC joinery in Hyderabad' },
  { value: '100%', label: 'Bespoke', sub: 'Designed for your space' },
  { value: '10', label: 'Year warranty', sub: 'Structural coverage' },
];

const PROJECT_FILTERS = ['All', 'Residential', 'Commercial', 'Hospitality'];

// Loads published content, then renders the page
export const Home = () => {
  const { content, status, retry } = usePublicContent();
  if (status !== 'ready') return <ContentState status={status} retry={retry} variant="grid" />;
  return <HomeView products={content.products} projects={content.projects} blogs={content.blogs} />;
};

const HomeView = ({ products, projects, blogs }) => {
  const text = useSiteText('home');
  const { items: testimonials } = useTestimonials();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [projectFilter, setProjectFilter] = useState('All');

  // Featured projects: exactly 4 per filter (featured ones first for "All")
  const filteredProjects = useMemo(() => {
    if (projectFilter === 'All') {
      const feat = projects.filter((p) => p.featured);
      if (feat.length >= 4) return feat.slice(0, 4);
      return projects.slice(0, 4);
    }
    return projects.filter((p) => p.typology === projectFilter).slice(0, 4);
  }, [projectFilter, projects]);

  return (
    <div className="overflow-x-clip">
      <SeoMeta page="home" title={SEO_DEFAULTS.home.title} description={SEO_DEFAULTS.home.description} />

      {/* Home order (client brief): hero, site at a glance, about, collections, categories, products, projects, sourcing,
          why us, testimonials, journal, Instagram, call to action, contact information */}

      {/* 1. Hero banner: full-screen photos or video with the headline, description and actions on them */}
      <Hero
        eyebrow="Symmetry Interiors"
        title={text.heroTitle}
        accent={text.heroTitleHighlight}
        subtitle={text.heroSubtitle}
        actions={
          <>
            <button type="button" onClick={() => scrollToTarget('#projects-section')} className="btn-light cursor-pointer">
              {text.heroPrimaryCta}
            </button>
            <button type="button" onClick={() => scrollToTarget('#about-section')} className="btn-glass cursor-pointer">
              {text.heroSecondaryCta}
            </button>
          </>
        }
      />

      {/* 1b. Site at a glance: one small card per page, so visitors see everything without opening each page */}
      <SiteOverview products={products} projects={projects} blogs={blogs} />

      {/* 2. About: the story as an Apple-style statement that brightens as you scroll */}
      <section id="about-section" className="section">
        <div className="site-container">
          <div className="max-w-4xl mx-auto text-center">
            <m.p {...reveal()} className="eyebrow mb-3">{text.storyKicker}</m.p>
            <m.h2 {...reveal({ order: 1 })} className="text-display-lg text-fg">{text.storyTitle}</m.h2>
            <ScrollHighlight
              className="mt-8 sm:mt-14 text-[21px] sm:text-[36px] lg:text-[40px] font-semibold tracking-[-0.025em] leading-[1.2] text-fg"
              text={text.storyParagraph1}
            />
          </div>

          <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <m.div {...reveal({ variant: 'scaleIn' })} className="lg:col-span-7 relative">
              <div className="aspect-[16/11] rounded-tile overflow-hidden bg-sunken">
                <img
                  {...heroImage('/images/home/home-about.jpeg', '(min-width: 1024px) 58vw, 100vw')}
                  alt="Architectural space planning and interior design"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="glass absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rounded-2xl px-5 py-4 max-w-[240px]">
                <span className="text-[12px] font-semibold text-accent block mb-0.5">Made In-House</span>
                <p className="text-[17px] text-fg font-semibold tracking-tight leading-tight">25,000 sq.ft. Own Workshop</p>
              </div>
            </m.div>

            <m.div {...reveal({ order: 1 })} className="lg:col-span-5 space-y-6">
              <p className="text-[17px] sm:text-[19px] text-muted leading-relaxed">{text.storyParagraph2}</p>
              <div className="flex items-center gap-4">
                <span className="w-1 self-stretch rounded-full bg-accent" />
                <div>
                  <strong className="text-fg block text-[19px] font-semibold tracking-tight">{text.storyBadgeTitle}</strong>
                  <span className="text-[15px] text-muted">{text.storyBadgeText}</span>
                </div>
              </div>
              <Link to="/about" className="link-apple">
                Discover Our Story <ChevronRight className="w-4 h-4" />
              </Link>
            </m.div>
          </div>

          {/* The studio in four figures */}
          <dl className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-tile overflow-hidden bg-line/60">
            {ABOUT_FIGURES.map((f, i) => (
              <m.div {...reveal({ order: i })} key={f.label} className="bg-surface px-3 py-6 sm:px-8 sm:py-10 text-center">
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-[32px] sm:text-[56px] font-semibold tracking-[-0.035em] text-fg leading-none">
                  <CountUp value={f.value} />
                </dd>
                <dd className="mt-3 text-[15px] sm:text-[17px] font-semibold text-fg">{f.label}</dd>
                <dd className="mt-1 text-[13px] sm:text-[14px] text-muted">{f.sub}</dd>
              </m.div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Featured collections: swipeable gallery */}
      <CollectionsGallery className="band-white" />

      {/* 4. Shop by category */}
      <section className="section">
        <div className="site-container mb-10 sm:mb-14">
          <SectionHeading eyebrow="Furniture & Objects" title={text.categoriesTitle} subtitle={text.categoriesSubtitle} align="center" />
        </div>
        <CategoryGallery />
        <m.div {...reveal({ order: 2 })} className="mt-12 sm:mt-14 flex justify-center">
          <Link to="/shop" className="link-apple">
            Browse the full shop <ChevronRight className="w-4 h-4" />
          </Link>
        </m.div>
      </section>

      {/* 5. Featured products */}
      <section className="band-white section">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
            <SectionHeading eyebrow="Featured Pieces" title={text.productsTitle} subtitle={text.productsSubtitle} />
            <m.div {...reveal({ order: 2 })} className="shrink-0">
              <Link to="/shop" className="link-apple">
                Explore All 24+ Pieces <ChevronRight className="w-4 h-4" />
              </Link>
            </m.div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {products.slice(0, 6).map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} onQuickView={(p) => setQuickViewProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured projects, with a segmented filter; cards glide when it changes */}
      <section id="projects-section" className="section scroll-mt-20">
        <div className="site-container">
          <div className="text-center mb-10 sm:mb-14">
            <SectionHeading eyebrow="Featured Projects" title={text.projectsTitle} subtitle={text.projectsSubtitle} align="center" />
            <m.div {...reveal({ order: 3 })} className="mt-8 flex justify-center">
              <div className="segmented max-w-full overflow-x-auto no-scrollbar" role="group" aria-label="Filter projects">
                {PROJECT_FILTERS.map((type) => (
                  <button key={type} type="button" aria-pressed={projectFilter === type} onClick={() => setProjectFilter(type)}>
                    {type}
                  </button>
                ))}
              </div>
            </m.div>
          </div>

          {/* Wide and narrow cards alternate (7/5, then 5/7) on large screens */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProjects.map((proj, idx) => (
                <m.div
                  layout
                  key={proj.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: dur.base, ease: ease.out }}
                  className={`h-full ${idx % 4 === 0 || idx % 4 === 3 ? 'lg:col-span-7' : 'lg:col-span-5'}`}
                >
                  <Link to={`/projects/${proj.id}`} className="card-apple card-apple-hover group flex flex-col h-full overflow-hidden">
                    <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[400px] overflow-hidden bg-sunken">
                      <SmartImage
                        sizes="(min-width: 1024px) 50vw, 50vw"
                        src={proj.heroImage}
                        alt={proj.title}
                        loading="lazy"
                        className="tile-media w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 sm:p-8 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-[14px]">
                        <span className="font-semibold text-accent">
                          {proj.typology}
                          {proj.featured && <span className="hidden sm:inline text-subtle font-normal"> · Case Study</span>}
                        </span>
                        <span className="text-subtle tabular-nums">{proj.completionYear}</span>
                      </div>
                      <h3 className="mt-1 sm:mt-1.5 text-[15px] sm:text-[28px] font-semibold tracking-tight text-fg leading-tight group-hover:text-accent transition-colors">
                        {proj.title}
                      </h3>
                      <p className="mt-1 text-[12px] sm:text-[15px] text-muted truncate">
                        {proj.location}
                        {proj.areaSqFt && <span className="hidden sm:inline text-subtle"> · {proj.areaSqFt}</span>}
                      </p>
                      <p className="hidden sm:block mt-3 text-[15px] sm:text-[17px] text-muted leading-relaxed line-clamp-2">{proj.summary}</p>
                      {proj.materialsPalette && (
                        <p className="hidden sm:block mt-4 text-[13px] text-subtle">
                          <span className="text-muted">Palette: </span>
                          {proj.materialsPalette.slice(0, 3).join(' · ')}
                        </p>
                      )}
                      <span className="link-apple mt-auto pt-3 sm:pt-5 !text-[13px] sm:!text-[15px]">
                        View project <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </m.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link to="/projects" className="btn-secondary">See All Projects</Link>
          </div>
        </div>
      </section>

      {/* 7. Global sourcing: swipeable gallery */}
      <SourcingGallery className="band-white" />

      {/* 8. Why Symmetry: a photo that closes in to a card, then six tiles */}
      <div className="pt-20 sm:pt-28">
        <ZoomOutPhoto
          image={heroImage('/images/hero/hero-haj-slide-3.jpeg')}
          alt="A finished Symmetry living space"
          eyebrow="Why Symmetry"
          title={text.whyTitle}
          subtitle={text.whySubtitle}
        />
      </div>
      <section className="pb-20 sm:pb-28 lg:pb-32 pt-10 sm:pt-14">
        <div className="site-container grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {WHY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <m.div {...reveal({ order: idx })} key={item.title} className="card-apple p-4 sm:p-10 flex flex-col">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent" strokeWidth={1.6} />
                <p className="mt-4 sm:mt-6 text-[11px] sm:text-[13px] font-semibold text-muted">
                  0{idx + 1} · {item.kicker.charAt(0) + item.kicker.slice(1).toLowerCase()}
                </p>
                <h3 className="mt-1 text-[16px] sm:text-[28px] font-semibold tracking-tight text-fg leading-tight">{item.title}</h3>
                <p className="mt-2 sm:mt-3 text-[13px] sm:text-[17px] text-muted leading-snug sm:leading-relaxed flex-1 line-clamp-4 sm:line-clamp-none">{item.desc}</p>
                <p className="mt-3 sm:mt-6 text-[12px] sm:text-[14px] font-semibold text-fg">{item.highlight}</p>
                <p className="hidden sm:block text-[12px] text-subtle">{item.benchmark}</p>
              </m.div>
            );
          })}
        </div>
      </section>

      {/* 9. Testimonials: swipeable cards */}
      {testimonials.length > 0 && (
        <section className="band-white section overflow-x-clip">
          <div className="site-container mb-10 sm:mb-14">
            <SectionHeading eyebrow="What Our Clients Say" title={text.testimonialsTitle} subtitle={text.testimonialsSubtitle} />
          </div>
          <CardGallery label="Client testimonials">
            {testimonials.map((t) => (
              <div key={t.id} className="w-[84vw] sm:w-[440px] h-full">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </CardGallery>
        </section>
      )}

      {/* 10. Journal */}
      <section className="section">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
            <SectionHeading eyebrow="From the Journal" title={text.journalTitle} subtitle={text.journalSubtitle} />
            <m.div {...reveal({ order: 2 })} className="shrink-0">
              <Link to="/journal" className="link-apple">
                View All Essays <ChevronRight className="w-4 h-4" />
              </Link>
            </m.div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {blogs.slice(0, 6).map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 11. Instagram */}
      <section className="band-white section">
        <div className="site-container">
          <InstagramMosaic />
        </div>
      </section>

      {/* 12. Closing call to action */}
      <FinalCta />

      {/* 13. Contact information */}
      <HomeContact />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default Home;
