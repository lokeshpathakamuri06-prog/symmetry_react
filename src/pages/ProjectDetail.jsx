import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Maximize2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import SeoMeta from '../components/SeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import ImageGallery from '../components/ImageGallery';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import ContentState from '../components/ContentState';
import { usePublicContent } from '../context/PublicContentContext';
import SmartImage from '../components/SmartImage';

// Loads published content, then renders the page exactly as before
export const ProjectDetail = () => {
  const { content, status, retry } = usePublicContent();
  if (status !== 'ready') return <ContentState status={status} retry={retry} variant="detail" />;
  return <ProjectDetailView projects={content.projects} />;
};

const ProjectDetailView = ({ projects }) => {
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
        title={`${project.title} | Project`}
        description={project.summary}
      />

      {/* Header & Meta */}
      <section className="site-container">
        <Breadcrumb
          items={[
            { label: 'Projects', to: '/projects' },
            { label: project.title },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/15 text-accent">
                {project.typology}
              </span>
              <span className="text-xs text-muted">
                {project.location} &bull; {project.completionYear}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-fg leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted font-normal leading-relaxed max-w-2xl">
              {project.summary}
            </p>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-surface space-y-3 text-xs text-muted">
            <div className="flex justify-between pb-2 border-b border-line/50 dark:border-line">
              <span className="">Client</span>
              <span className="font-medium text-fg">{project.client}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-line/50 dark:border-line">
              <span className="">Total Area</span>
              <span className="font-medium text-fg">{project.areaSqFt}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-line/50 dark:border-line">
              <span className="">Location</span>
              <span className="font-medium text-fg">{project.location}</span>
            </div>
            <div className="pt-1">
              <span className="block mb-1">Scope of Work</span>
              <span className="font-medium text-fg">{project.scope}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 aspect-[16/9] lg:aspect-[21/9] rounded-tile overflow-hidden bg-sunken">
          <SmartImage sizes="100vw" priority
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Architectural Metrics Bar */}
      {project.stats && (
        <section className="site-container">
          <div className="p-8 rounded-2xl bg-sunken/40 dark:bg-surface grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[12px] text-accent font-semibold block">
                  {st.label}
                </span>
                <span className="font-bold text-xl sm:text-2xl text-fg">
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Design Narrative (Concept, Challenge, Solution) */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs text-accent font-semibold">
              The Story
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-fg">
              Design & Execution
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Every space is different. Here is how we approached this one.
            </p>

            {/* Material Palette */}
            {project.materialsPalette && (
              <div className="pt-6 border-t border-line/70 dark:border-line">
                <h4 className="text-xs text-fg font-semibold mb-3">
                  Materials Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.materialsPalette.map((mat, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface dark:bg-sunken text-fg"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-2xl bg-surface space-y-3">
              <h3 className="text-lg font-semibold text-accent">
                01 &bull; The Idea
              </h3>
              <p className="text-sm sm:text-base text-fg leading-relaxed">
                {project.concept}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-surface space-y-3">
              <h3 className="text-lg font-semibold text-accent">
                02 &bull; The Challenge
              </h3>
              <p className="text-sm sm:text-base text-fg leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-surface space-y-3">
              <h3 className="text-lg font-semibold text-accent">
                03 &bull; The Result
              </h3>
              <p className="text-sm sm:text-base text-fg leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High Resolution Gallery */}
      <section className="site-container">
        <div className="mb-8">
          <span className="text-xs text-accent font-semibold">
            Gallery
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-fg mt-1">
            Spaces & Details
          </h2>
        </div>

        <ImageGallery images={allImages} title={project.title} />
      </section>

      {/* Project Navigation (Prev / Next) */}
      <section className="site-container">
        <div className="pt-10 border-t border-line/70 dark:border-line flex items-center justify-between">
          <Link
            to={`/projects/${prevProject.id}`}
            className="group flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center group-hover:border-accent transition-colors">
              <ArrowLeft className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="text-[12px] text-muted block">
                Previous Project
              </span>
              <span className="text-sm sm:text-base font-semibold text-fg group-hover:text-accent transition-colors">
                {prevProject.title}
              </span>
            </div>
          </Link>

          <Link
            to={`/projects/${nextProject.id}`}
            className="group flex items-center gap-3 text-right"
          >
            <div>
              <span className="text-[12px] text-muted block">
                Next Project
              </span>
              <span className="text-sm sm:text-base font-semibold text-fg group-hover:text-accent transition-colors">
                {nextProject.title}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center group-hover:border-accent transition-colors">
              <ArrowRight className="w-4 h-4 text-accent" />
            </div>
          </Link>
        </div>
      </section>

      {/* Related Projects */}
      <section className="site-container">
        <div className="mb-10">
          <span className="text-xs text-accent font-semibold">
            More Projects
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg mt-1">
            You May Also Like
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
