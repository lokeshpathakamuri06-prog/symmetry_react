import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Maximize2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import ImageGallery from '../components/ImageGallery';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import { projects } from '../data/projects';

export const ProjectDetail = () => {
  const { id } = useParams();
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return <Navigate to="/projects" replace />;
  }

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : projects[projects.length - 1];
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : projects[0];
  const relatedProjects = projects.filter((p) => p.id !== project.id).slice(0, 2);

  const allImages = [project.heroImage, ...(project.galleryImages || [])];

  return (
    <div className="pt-28 pb-24 space-y-20 sm:space-y-28">
      <SeoMeta
        title={`${project.title} | Architectural Case Study`}
        description={project.summary}
      />

      {/* Header & Meta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Projects', to: '/projects' },
            { label: project.title },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-luxury font-medium bg-[#36656B]/15 text-[#36656B] dark:text-[#BCA575] border border-[#36656B]/30">
                {project.typology}
              </span>
              <span className="text-xs uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE]">
                {project.location} &bull; {project.completionYear}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#131E20] dark:text-[#F5F1E8] font-normal leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#4F6467] dark:text-[#AEB7BE] font-light leading-relaxed max-w-2xl">
              {project.summary}
            </p>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-3 text-xs text-[#4F6467] dark:text-[#AEB7BE]">
            <div className="flex justify-between pb-2 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
              <span className="uppercase tracking-wider">Client Typology</span>
              <span className="font-medium text-[#131E20] dark:text-[#F5F1E8]">{project.client}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
              <span className="uppercase tracking-wider">Total Area</span>
              <span className="font-medium text-[#131E20] dark:text-[#F5F1E8]">{project.areaSqFt}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#D1DCDE]/50 dark:border-[#1E3447]">
              <span className="uppercase tracking-wider">Location</span>
              <span className="font-medium text-[#131E20] dark:text-[#F5F1E8]">{project.location}</span>
            </div>
            <div className="pt-1">
              <span className="uppercase tracking-wider block mb-1">Execution Scope</span>
              <span className="font-medium text-[#131E20] dark:text-[#F5F1E8]">{project.scope}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-[#E5ECEC] dark:bg-[#132838]">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Architectural Metrics Bar */}
      {project.stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-[#E5ECEC]/40 dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[11px] uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold block">
                  {st.label}
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#131E20] dark:text-[#F5F1E8] font-normal">
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Design Narrative (Concept, Challenge, Solution) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
              The Narrative
            </span>
            <h2 className="text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8]">
              Spatial Concept &amp; Engineering Solutions
            </h2>
            <p className="text-sm text-[#4F6467] dark:text-[#AEB7BE] leading-relaxed font-light">
              We approach each space as a tailored canvas where site constraints spark custom architectural interventions.
            </p>

            {/* Material Palette */}
            {project.materialsPalette && (
              <div className="pt-6 border-t border-[#D1DCDE]/70 dark:border-[#1E3447]">
                <h4 className="text-xs uppercase tracking-luxury text-[#131E20] dark:text-[#F5F1E8] font-semibold mb-3">
                  Materiality Palette
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.materialsPalette.map((mat, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#132838] border border-[#D1DCDE] dark:border-[#1E3447] text-[#131E20] dark:text-[#F5F1E8]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-3">
              <h3 className="text-lg font-serif text-[#36656B] dark:text-[#BCA575]">
                01 &bull; Architectural Concept
              </h3>
              <p className="text-sm sm:text-base text-[#131E20] dark:text-[#F5F1E8] font-light leading-relaxed">
                {project.concept}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-3">
              <h3 className="text-lg font-serif text-[#36656B] dark:text-[#BCA575]">
                02 &bull; Structural Challenge
              </h3>
              <p className="text-sm sm:text-base text-[#131E20] dark:text-[#F5F1E8] font-light leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#0D1C29] border border-[#D1DCDE] dark:border-[#1E3447] space-y-3">
              <h3 className="text-lg font-serif text-[#36656B] dark:text-[#BCA575]">
                03 &bull; Execution &amp; Resolution
              </h3>
              <p className="text-sm sm:text-base text-[#131E20] dark:text-[#F5F1E8] font-light leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High Resolution Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
            Visual Documentation
          </span>
          <h2 className="text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] mt-1">
            Spaces &amp; Tactile Details
          </h2>
        </div>

        <ImageGallery images={allImages} title={project.title} />
      </section>

      {/* Project Navigation (Prev / Next) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-10 border-t border-[#D1DCDE]/70 dark:border-[#1E3447] flex items-center justify-between">
          <Link
            to={`/projects/${prevProject.id}`}
            className="group flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center group-hover:border-[#36656B] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#36656B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] block">
                Previous Case
              </span>
              <span className="text-sm sm:text-base font-serif text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] transition-colors">
                {prevProject.title}
              </span>
            </div>
          </Link>

          <Link
            to={`/projects/${nextProject.id}`}
            className="group flex items-center gap-3 text-right"
          >
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-[#4F6467] dark:text-[#AEB7BE] block">
                Next Case
              </span>
              <span className="text-sm sm:text-base font-serif text-[#131E20] dark:text-[#F5F1E8] group-hover:text-[#36656B] transition-colors">
                {nextProject.title}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#D1DCDE] dark:border-[#1E3447] flex items-center justify-center group-hover:border-[#36656B] transition-colors">
              <ArrowRight className="w-4 h-4 text-[#36656B]" />
            </div>
          </Link>
        </div>
      </section>

      {/* Related Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-luxury text-[#36656B] dark:text-[#BCA575] font-semibold">
            Further Explorations
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#131E20] dark:text-[#F5F1E8] mt-1">
            Related Architectural Commissions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
