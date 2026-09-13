import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  CheckCircle, 
  Calendar, 
  Terminal, 
  Layers, 
  AlertCircle,
  Cpu,
  Database
} from 'lucide-react';
import type { Project } from '../types';
import { api } from '../lib/api';

interface ProjectDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, navigate }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getProjectBySlug(slug)
      .then(data => {
        if (isMounted) {
          setProject(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Project not found');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent mb-4" />
        <p className="text-xs text-zinc-400">Loading project case study...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-100">Project Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          The project case study you requested could not be located or may have been unpublished.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            {project.category}
          </span>
          {project.projectDate && (
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{project.projectDate}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
        <img
          src={project.projectImage}
          alt={project.title}
          className="w-full h-auto max-h-[440px] object-cover"
        />
      </div>

      {/* Tech Stack Pills */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
        <h4 className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
          Technologies & Libraries
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-zinc-950 text-emerald-300 border border-zinc-800"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Case Study Grid */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        
        {/* Overview */}
        {project.fullDescription && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-2">
              Project Overview
            </h2>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </p>
          </section>
        )}

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.problem && (
            <div className="p-5 rounded-xl border border-red-900/30 bg-zinc-900/40 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                The Problem
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="p-5 rounded-xl border border-emerald-900/30 bg-zinc-900/40 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                The Solution
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}
        </div>

        {/* Technical Workflow */}
        {project.workflow && (
          <section className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>Automated Extraction Workflow</span>
            </h3>
            <p className="text-xs font-mono text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              {project.workflow}
            </p>
          </section>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-2">
              Key Automation Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {project.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Results & Verification */}
        {project.results && (
          <section className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Real Results & Output
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed">
              {project.results}
            </p>
          </section>
        )}

      </div>

      {/* CTA */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-100">
            Need a similar scraping routine or dataset?
          </h4>
          <p className="text-xs text-zinc-400">
            I can develop and execute this workflow for your target websites.
          </p>
        </div>
        <button
          onClick={() => navigate('/contact')}
          className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0"
        >
          Contact Ibrahim
        </button>
      </div>

    </article>
  );
};
