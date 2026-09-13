import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, Github, ExternalLink, Database, Calendar } from 'lucide-react';
import type { Project, ProjectCategory } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  navigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'B2B Lead Generation',
    'Web Scraping',
    'Data Extraction',
    'Automation',
    'QA Automation',
    'Data Processing'
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Case Studies & Repositories
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Web Scraping & Lead Gen Projects
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Production scrapers, automated browser workflows, and structured business data pipelines engineered with Python.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        
        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-400 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tools..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          <Database className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No projects found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try selecting another category or clear your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                  <img
                    src={project.projectImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                    {project.category}
                  </div>
                  {project.projectDate && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950/80 text-zinc-400 backdrop-blur-sm flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{project.projectDate}</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 5).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-zinc-900/80 flex items-center justify-between text-xs mt-2">
                <button
                  onClick={() => navigate(`/projects/${project.slug}`)}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-800 transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-800 transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
