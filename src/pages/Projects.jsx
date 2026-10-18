import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { reveal } from '../lib/motion';
import { 
  Layers, 
  MapPin 
} from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import { SEO_DEFAULTS } from '../lib/seoDefaults';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import ContentState from '../components/ContentState';
import { usePublicContent } from '../context/PublicContentContext';
import SmartImage from '../components/SmartImage';
import { heroImage } from '../lib/staticImages';
import PageHero from '../components/PageHero';

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

// Loads published content, then renders the page exactly as before
export const Projects = () => {
  const { content, status, retry } = usePublicContent();
  if (status !== 'ready') return <ContentState status={status} retry={retry} variant="grid" />;
  return <ProjectsView projects={content.projects} />;
};

const ProjectsView = ({ projects }) => {
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
    <div className="pb-20 sm:pb-32 space-y-16 sm:space-y-24 overflow-x-clip">
      <SeoMeta page="projects" title={SEO_DEFAULTS.projects.title} description={SEO_DEFAULTS.projects.description} />

      <PageHero
        page="projects"
        breadcrumb={[{ label: 'Turnkey Projects' }]}
        eyebrow="Turnkey Projects"
        title="Spaces We’ve"
        highlight="Brought to Life"
        subtitle="Homes, offices, hotels and healthcare spaces we have designed and delivered from start to finish."
        image={heroImage('/images/hero/stock-projects.jpeg')}
        imageAlt="A pavilion house beside a pool"
        stats={[
          { value: '450+', label: 'Projects Delivered', sub: 'On Time' },
          { value: '3', label: 'Project Types', sub: 'Homes, Offices, Hospitality' },
          { value: '25k', label: 'Sq.Ft. Workshop', sub: 'Our Own Joinery & Stone' },
          { value: '100%', label: 'Turnkey Delivery', sub: 'One Team, Start to Finish' },
        ]}
      />

      {/* =========================================================================
          SECTION 2: FEATURED PROJECT SPOTLIGHT
          ========================================================================= */}
      {featuredProject && (
        <section id="featured-commission" className="site-container scroll-mt-28">
          <m.div
            {...reveal()}
            whileHover={{ y: -4 }}
            className="group rounded-tile sm:rounded-[40px] bg-sunken/40 dark:bg-surface p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-500 relative"
          >
            {/* Ambient golden radial glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover:scale-[1.05] transition-transform duration-700" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Featured Visual */}
              <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl sm:rounded-tile overflow-hidden bg-sunken">
                <SmartImage sizes="100vw" priority
                  src={featuredProject.heroImage}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full text-[12px] font-sans font-medium bg-fg/85 dark:bg-canvas/85 text-[#BCA575] backdrop-blur-md border border-[#BCA575]/30 shadow-md">
                    Featured Project
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
                  <span className="text-xs font-semibold text-accent">
                    {featuredProject.typology} Architecture
                  </span>
                  <span className="text-xs font-mono text-subtle">
                    • {featuredProject.completionYear}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-fg leading-tight group-hover:text-accent transition-colors duration-300">
                  {featuredProject.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {featuredProject.summary}
                </p>

                {/* Stats Grid with Interactive Tiles */}
                {featuredProject.stats && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line">
                    {featuredProject.stats.slice(0, 4).map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-xl bg-surface/60 dark:bg-canvas/60 border border-line/50 hover:scale-102 transition-transform"
                      >
                        <p className="text-xs font-semibold text-fg">
                          {st.value}
                        </p>
                        <p className="text-[12px] font-sans text-subtle">
                          {st.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Materials palette */}
                {featuredProject.materialsPalette && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono text-subtle block mb-2">
                      Materials Palette:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredProject.materialsPalette.slice(0, 4).map((mat, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2.5 py-1 rounded-md text-[10px] font-sans bg-surface dark:bg-canvas text-fg hover:scale-105 hover:bg-accent/15 hover:text-accent transition-all cursor-default"
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
                    View This Project
                  </Button>
                </div>
              </div>
            </div>
          </m.div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: PROJECT FILTERS (ALL, RESIDENTIAL, COMMERCIAL, HOSPITALITY)
          ========================================================================= */}
      <section id="browse-projects" className="site-container scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-line pb-6">
          <div>
            <span className="text-xs text-accent font-semibold block mb-1">
              All Projects
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
              Browse by Type
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
                  className={`relative px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-fg text-canvas shadow-md ring-1 ring-accent'
                      : 'bg-surface text-muted border border-line hover:border-accent'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                        : 'bg-sunken text-muted'
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
      <section className="site-container">
        <m.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10"
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
        </m.div>

        {filteredProjects.length === 0 && (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center rounded-tile bg-surface"
          >
            <Layers className="w-10 h-10 text-accent mx-auto mb-3 opacity-60 animate-pulse" />
            <h3 className="font-semibold tracking-tight text-2xl text-fg">
              No Projects in This Category
            </h3>
            <p className="text-xs text-muted mt-2 max-w-sm mx-auto">
              New projects in this category are coming soon.
            </p>
            <div className="mt-5">
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-accent hover:underline font-medium cursor-pointer"
              >
                Reset Filter to All
              </button>
            </div>
          </m.div>
        )}
      </section>
    </div>
  );
};

export default Projects;
