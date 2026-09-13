import React from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Database, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle, 
  ExternalLink, 
  Github, 
  MapPin, 
  Mail, 
  Sparkles,
  Layers,
  Cpu,
  Download
} from 'lucide-react';
import type { Profile, Project, LeadSample, Service } from '../types';

interface HomePageProps {
  profile: Profile | null;
  projects: Project[];
  leadSamples: LeadSample[];
  services: Service[];
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  projects,
  leadSamples,
  services,
  navigate
}) => {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const featuredSamples = leadSamples.filter(s => s.featured).slice(0, 2);
  const displayServices = services.slice(0, 3);

  const renderHeroTitle = () => {
    const raw = profile?.title || 'B2B Lead Generation & Data Scraping Specialist';
    if (raw.includes('&')) {
      const idx = raw.indexOf('&');
      const firstPart = raw.slice(0, idx + 1);
      const secondPart = raw.slice(idx + 1).trim();
      return (
        <>
          {firstPart} <br />
          <span className="text-emerald-400">{secondPart}</span>
        </>
      );
    }
    const words = raw.trim().split(/\s+/);
    if (words.length > 3) {
      const splitAt = Math.ceil(words.length / 2);
      const first = words.slice(0, splitAt).join(' ');
      const second = words.slice(splitAt).join(' ');
      return (
        <>
          {first} <br />
          <span className="text-emerald-400">{second}</span>
        </>
      );
    }
    return <span className="text-emerald-400">{raw}</span>;
  };

  return (
    <div className="space-y-24 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{profile?.availabilityStatus || 'Available for Freelance & Contract Projects'}</span>
            </div>

            {/* Title with Greeting */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono text-emerald-400 tracking-wider block">
                Hi, I'm <strong className="text-zinc-100 font-semibold">{profile?.fullName || 'Ibrahim Shake Shuvo'}</strong>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
                {renderHeroTitle()}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {profile?.shortBio || 
                'I help businesses collect targeted B2B leads and structured web data using Python, browser automation, and modern data extraction techniques.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-lg shadow-emerald-950/40"
              >
                <span>View My Projects</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/lead-samples')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>View Lead Samples</span>
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Me</span>
              </button>
            </div>

            {/* Key Quality Pillars */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero Hallucinated Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Verified Email Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Clean Excel & CSV</span>
              </div>
            </div>

          </div>

          {/* Profile Card & Code Badge */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={profile?.fullName || 'Ibrahim Shake Shuvo'}
                  className="h-16 w-16 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {profile?.fullName || 'Ibrahim Shake Shuvo'}
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    {profile?.title || 'B2B Lead Gen & Data Scraping Specialist'}
                  </p>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile?.location || 'Remote / Worldwide'}</span>
                  </p>
                </div>
              </div>

              {/* Terminal Code Snippet Preview */}
              <div className="mt-4 rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-[11px] text-zinc-300 space-y-2">
                <div className="flex items-center justify-between text-zinc-300 pb-2 border-b border-zinc-900 text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-emerald-400" />
                    scraper_pipeline.py
                  </span>
                  <span className="text-emerald-500">PLAYWRIGHT_READY</span>
                </div>
                <div className="text-zinc-300"># Targeting verified decision makers</div>
                <div>
                  <span className="text-emerald-400">async def</span>{' '}
                  <span className="text-blue-400">extract_leads</span>(niche, target_geo):
                </div>
                <div className="pl-4 text-zinc-400">
                  stealth_browser = await launch_stealth()
                </div>
                <div className="pl-4 text-zinc-400">
                  raw_data = await scrape_portal(stealth_browser)
                </div>
                <div className="pl-4 text-emerald-400">
                  return clean_and_verify(raw_data)
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Verification: MX records + SMTP handshake</span>
                <span className="text-emerald-400 font-semibold">99.2% Accuracy</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICES PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
              Data Solutions & Services
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Explore All 6 Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-all hover:bg-zinc-900/70 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 mb-4 group-hover:border-emerald-500/40 transition-colors">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                {service.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LEAD SAMPLES (CRITICAL SHOWCASE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-zinc-900/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono mb-2">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Interactive Datasets</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
                Verified B2B Lead Samples
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                Inspect genuine sample rows extracted from live directories and e-commerce platforms. No synthetic mock data.
              </p>
            </div>

            <button
              onClick={() => navigate('/lead-samples')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0"
            >
              <span>Explore All Lead Samples</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredSamples.map((sample) => (
              <div
                key={sample.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                        {sample.niche}
                      </span>
                      <h3 className="text-base font-semibold text-zinc-100 mt-0.5">
                        {sample.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-900 text-zinc-300 border border-zinc-800 shrink-0">
                      {sample.leadCount}+ Leads
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {sample.description}
                  </p>

                  {/* Fields Pills */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-semibold text-zinc-300 block mb-1.5">
                      Included Data Fields:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sample.dataFields.slice(0, 5).map((field, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                        >
                          {field}
                        </span>
                      ))}
                      {sample.dataFields.length > 5 && (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-zinc-900 text-zinc-300">
                          +{sample.dataFields.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-mono text-[11px]">
                    Location: <strong className="text-zinc-300">{sample.location}</strong>
                  </span>
                  <button
                    onClick={() => navigate(`/lead-samples/${sample.slug}`)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Inspect Spreadsheet</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Proven Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
              Web Scraping & Automation Projects
            </h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                  <img
                    src={project.projectImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                    {project.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
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
                  <span>Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXTRACTION WORKFLOW PROCESS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Reliable Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
              How I Extract & Verify Data
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              A systematic 4-stage pipeline designed for 0% bot blocks, maximum accuracy, and turnkey CRM imports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-2xl font-mono font-bold text-emerald-500/40">01</span>
              <h4 className="text-sm font-semibold text-zinc-100 mt-2 mb-1.5">
                Target Schema Definition
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Defining ICP parameters, location bounding boxes, required contact columns, and sourcing registries.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-2xl font-mono font-bold text-emerald-500/40">02</span>
              <h4 className="text-sm font-semibold text-zinc-100 mt-2 mb-1.5">
                Stealth Scraping Engine
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Running Playwright or Selenium with rotating user-agents, randomized delays, and DOM sniffers.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-2xl font-mono font-bold text-emerald-500/40">03</span>
              <h4 className="text-sm font-semibold text-zinc-100 mt-2 mb-1.5">
                Data Cleaning & Validation
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pandas normalization, phone formatting (E.164), duplicate eradication, and MX-record validation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-2xl font-mono font-bold text-emerald-500/40">04</span>
              <h4 className="text-sm font-semibold text-zinc-100 mt-2 mb-1.5">
                Turnkey Delivery
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exported into formatted Excel (.xlsx) and CSV datasets ready for Apollo, HubSpot, or cold outreach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              Need targeted B2B leads or custom web scraping?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Tell me your target niche, location, and data requirements. I'll provide a verified sample dataset tailored to your criteria.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-lg shadow-emerald-950/40"
            >
              Request Custom Sample
            </button>
            <button
              onClick={() => navigate('/resume')}
              className="px-5 py-3 text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              View Resume
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
