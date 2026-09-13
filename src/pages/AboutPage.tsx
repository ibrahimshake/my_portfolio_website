import React from 'react';
import { 
  CheckCircle, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Layers, 
  ArrowRight,
  Code,
  Zap,
  MapPin,
  Mail
} from 'lucide-react';
import type { Profile } from '../types';

interface AboutPageProps {
  profile: Profile | null;
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile, navigate }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Professional Background
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          About Ibrahim Shakes Huvo
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Specializing in automated web data collection, Python browser scripting, and verified B2B lead list engineering.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Story & Philosophy */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Introduction Block */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <span>Who I Am & What I Do</span>
            </h2>
            <div className="text-sm text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line bg-zinc-900/40 p-6 rounded-xl border border-zinc-800">
              {profile?.fullAbout || `I am a dedicated B2B Lead Generation and Web Data Scraping specialist with extensive experience in automated data collection, browser automation, and data hygiene.

My focus is on extracting high-accuracy, structured business data from modern web applications, directories, e-commerce platforms, and public registries. I prioritize data integrity: cleaning invalid emails, normalizing phone numbers, deduplicating records, and delivering ready-to-use CSV/XLSX datasets for sales and marketing outreach.

Whether navigating complex single-page apps with Playwright/Selenium or architecting high-throughput data extraction routines, I deliver reliable, reproducible workflows that save teams hundreds of manual research hours.`}
            </div>
          </section>

          {/* My Focus & Principles */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Core Working Principles</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-100 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Real Data Only</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Never generating fake statistics, hallucinated leads, or unverified contact info. Every record corresponds to a verified entity.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-100 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Anti-Bot Stealth</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Employing realistic user behaviors, header randomization, and adaptive delays to respect server limits and avoid IP throttling.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-100 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>CRM-Ready Formatting</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Clean columns, normalized telephone formats, standard title casings, and zero empty or duplicate rows.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-100 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Continuous Automation</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Designing scrapers that can run periodically via cron or GitHub Actions to deliver refreshed datasets automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Working Approach */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" />
              <span>My Working Approach</span>
            </h2>
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                1. <strong>Discovery & Feasibility:</strong> We review the target portal, inspect its DOM / network requests, verify pagination logic, and check for bot protection mechanisms (Cloudflare, Akamai, etc.).
              </p>
              <p>
                2. <strong>Sample Validation:</strong> I generate a 10 to 50 row sample dataset for your review before building the full extraction routine.
              </p>
              <p>
                3. <strong>Full Scale Run:</strong> I execute the automation across the full geographic or category range with automated checkpointing.
              </p>
              <p>
                4. <strong>Delivery & Support:</strong> You receive clean CSV and XLSX spreadsheets with documented field definitions and ongoing script maintenance if requested.
              </p>
            </div>
          </section>

        </div>

        {/* Right Column: Profile Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
            <div className="text-center">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={profile?.fullName || 'Ibrahim'}
                className="h-28 w-28 rounded-2xl object-cover mx-auto border-2 border-emerald-500/40 shadow-lg"
              />
              <h3 className="text-lg font-bold text-zinc-100 mt-4">
                {profile?.fullName || 'Ibrahim Shakes Huvo'}
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                {profile?.title || 'Lead Gen & Web Scraping Specialist'}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Location</span>
                <span className="text-zinc-200 font-medium">{profile?.location || 'Remote'}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Availability</span>
                <span className="text-emerald-400 font-medium">{profile?.availabilityStatus || 'Available'}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Primary Language</span>
                <span className="text-zinc-200 font-medium">Python 3.11+</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Automation Tools</span>
                <span className="text-zinc-200 font-medium">Playwright, SeleniumBase</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span>Discuss Your Project</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
