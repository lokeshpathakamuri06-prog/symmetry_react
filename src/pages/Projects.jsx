import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  MapPin 
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import { projects } from '../data/projects';

// Curated architectural project walkthrough video streams
const PROJECT_VIDEOS = [
  {
    id: 1,
    title: 'Architectural Stone & Roman Travertine Portals',
    src: 'https://media.yoointerior.com/yoo_web_3.mp4',
  },
  {
    id: 2,
    title: 'Private Sky Penthouse Spatial Flow',
    src: 'https://media.yoointerior.com/yooweb_4.mp4',
  },
  {
    id: 3,
    title: 'Monolithic Living & Daylight Choreography',
    src: 'https://media.yoointerior.com/yoo_web_1.mp4',
  },
  {
    id: 4,
    title: 'Executive Suite & Precision Joinery',
    src: 'https://media.yoointerior.com/yooweb_2.mp4',
  },
];

export const Projects = () => {
  // Video hero state
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Filters requested: All, Residential, Commercial, Hospitality
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filterCategories = ['All', 'Residential', 'Commercial', 'Hospitality'];

  // Identify featured project
  const featuredProject = projects.find((p) => p.featured) || projects[0];

  // Filter projects by category/typology
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => {
        const cat = p.category || p.typology;
        return cat?.toLowerCase() === selectedCategory.toLowerCase();
      });

  // Calculate count for each category
  const getCategoryCount = (category) => {
    if (category === 'All') return projects.length;
    return projects.filter((p) => {
      const cat = p.category || p.typology;
      return cat?.toLowerCase() === category.toLowerCase();
    }).length;
  };

  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % PROJECT_VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoIndex]);

  return (
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-24 overflow-hidden">
      <SeoMeta
        title="Architectural Projects &amp; Commissions — Symmetry Interiors"
        description="Explore curated architectural masterworks by Symmetry Interiors: private residential estates, executive commercial headquarters, and boutique hospitality pavilions."
      />

      {/* =========================================================================
          SECTION 1: ARCHITECTURAL CINEMATIC HERO WITH VIDEO BACKGROUND
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[680px] sm:min-h-[760px] w-full bg-black overflow-hidden flex flex-col justify-between select-none">
        {/* Full-Bleed Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={PROJECT_VIDEOS[videoIndex].src}
            autoPlay
            muted
            loop={false}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onEnded={handleVideoEnded}
            poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
            className={`w-full h-full object-cover object-center scale-[1.03] transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <source src={PROJECT_VIDEOS[videoIndex].src} type="video/mp4" />
          </video>
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
            <span className="text-[#BCA575] font-semibold">Turnkey Projects</span>
          </motion.div>
        </div>

        {/* Center Viewport Editorial Headline */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-5 my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl text-white font-bold leading-[1.08] tracking-tight drop-shadow-md"
          >
            Spaces We’ve <span className="text-[#BCA575] font-bold">Brought to Life</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
          >
            Explore our residential, hospitality, commercial, healthcare, and bespoke interior projects delivered with singular turnkey accountability.
          </motion.p>
        </div>
      </section>

      {/* Elevated Portfolio Stats Strip Floating Directly Below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { value: '450+', label: 'Commissions Handed Over', sub: 'Zero Contractual Delay' },
            { value: '3', label: 'Core Typologies', sub: 'Residential, Commercial, Hospitality' },
            { value: '25k', label: 'Sq.Ft. Fabrication Campus', sub: 'In-House Joinery & Stone' },
            { value: '100%', label: 'Turnkey Handover Record', sub: 'Single-Point Engineering' },
          ].map((st, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#0D1C29]/90 backdrop-blur-xl border border-[#D1DCDE] dark:border-[#1E3447] shadow-lg text-center group hover:border-[#36656B]/60 dark:hover:border-[#BCA575]/60 hover:shadow-xl transition-all duration-300"
            >
              <p className="font-bold text-2xl sm:text-4xl text-[#36656B] dark:text-[#BCA575] group-hover:scale-105 transition-transform duration-300">
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
          SECTION 2: FEATURED PROJECT SPOTLIGHT
          ========================================================================= */}
      {featuredProject && (
        <section id="featured-commission" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-3xl sm:rounded-[40px] bg-[#E5ECEC]/40 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B]/60 dark:hover:border-[#BCA575]/60 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-500 relative"
          >
            {/* Ambient golden radial glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#36656B]/10 dark:bg-[#BCA575]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Featured Visual */}
              <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838] shadow-lg">
                <img
                  src={featuredProject.heroImage}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-luxury font-medium bg-[#131E20]/85 dark:bg-[#07121C]/85 text-[#BCA575] backdrop-blur-md border border-[#BCA575]/30 shadow-md">
                    Featured Commission
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[#F5F1E8] text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#BCA575]" />
                    {featuredProject.location}
                  </span>
                  <span className="text-[#BCA575] font-semibold">{featuredProject.areaSqFt}</span>
                </div>
              </div>

              {/* Featured Narrative */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-luxury font-semibold text-[#36656B] dark:text-[#BCA575]">
                    {featuredProject.typology} Architecture
                  </span>
                  <span className="text-xs font-mono text-[#6B8083] dark:text-[#8E9CA8]">
                    • {featuredProject.completionYear}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8] leading-tight group-hover:text-[#36656B] dark:group-hover:text-[#BCA575] transition-colors duration-300">
                  {featuredProject.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed">
                  {featuredProject.summary}
                </p>

                {/* Stats Grid with Interactive Tiles */}
                {featuredProject.stats && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D1DCDE] dark:border-[#1E3447]">
                    {featuredProject.stats.slice(0, 4).map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-xl bg-white/60 dark:bg-[#07121C]/60 border border-[#D1DCDE]/50 dark:border-[#1E3447]/50 hover:scale-102 transition-transform"
                      >
                        <p className="text-xs font-semibold text-[#131E20] dark:text-[#F5F1E8]">
                          {st.value}
                        </p>
                        <p className="text-[10px] uppercase font-sans tracking-wider text-[#6B8083] dark:text-[#8E9CA8]">
                          {st.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Materials palette */}
                {featuredProject.materialsPalette && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono text-[#6B8083] dark:text-[#8E9CA8] block mb-2">
                      Materials Palette:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredProject.materialsPalette.slice(0, 4).map((mat, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2.5 py-1 rounded-md text-[10px] font-sans bg-white dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] border border-[#D1DCDE]/60 dark:border-[#1E3447] hover:scale-105 hover:bg-[#36656B]/15 hover:text-[#36656B] dark:hover:text-[#BCA575] transition-all cursor-default"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <Button
                    to={`/projects/${featuredProject.id}`}
                    variant="primary"
                    size="md"
                    showArrow
                  >
                    Explore Featured Commission
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: PROJECT FILTERS (ALL, RESIDENTIAL, COMMERCIAL, HOSPITALITY)
          ========================================================================= */}
      <section id="browse-projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#D1DCDE] dark:border-[#1E3447] pb-6">
          <div>
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block mb-1">
              Curated Commissions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#131E20] dark:text-[#F5F1E8]">
              Browse by Typology
            </h2>
          </div>

          {/* Filter Buttons with Smooth Micro-Transitions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {filterCategories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] shadow-md ring-1 ring-[#36656B]'
                      : 'bg-white dark:bg-[#0D1C29] text-[#4F6467] dark:text-[#AEB7BE] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] dark:hover:border-[#BCA575]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                        : 'bg-[#E5ECEC] dark:bg-[#132838] text-[#4F6467] dark:text-[#AEB7BE]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: MASONRY / EDITORIAL PROJECT GALLERY
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                className={idx % 5 === 0 ? 'lg:col-span-1' : ''}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center rounded-3xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] shadow-sm"
          >
            <Layers className="w-10 h-10 text-[#36656B] dark:text-[#BCA575] mx-auto mb-3 opacity-60 animate-pulse" />
            <h3 className="font-bold tracking-tight text-2xl text-[#131E20] dark:text-[#F5F1E8]">
              No Projects in This Category
            </h3>
            <p className="text-xs text-[#4F6467] dark:text-[#AEB7BE] mt-2 max-w-sm mx-auto font-light">
              We are currently preparing documentation for upcoming commissions in this typology.
            </p>
            <div className="mt-5">
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] hover:underline font-medium cursor-pointer"
              >
                Reset Filter to All
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Projects;
