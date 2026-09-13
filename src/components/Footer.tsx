import React from 'react';
import { Database, Mail, MapPin, Github, Linkedin, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import type { Profile } from '../types';

interface FooterProps {
  profile: Profile | null;
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, navigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Bio & Status */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/50 text-emerald-400">
                <Database className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm text-zinc-100">
                {profile?.fullName || 'Ibrahim Shake Shuvo'}
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              B2B Lead Generation & Web Scraping Specialist. Engineering high-precision data extraction workflows, browser automation scripts, and validated prospect lists.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-zinc-300">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile?.availabilityStatus || 'Available for Projects'}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Explore Portfolio
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-emerald-400 transition-colors">
                  Case Studies & Projects
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/lead-samples')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>B2B Lead Samples</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">
                    Live
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-emerald-400 transition-colors">
                  Services & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/skills')} className="hover:text-emerald-400 transition-colors">
                  Technical Skillset
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/experience')} className="hover:text-emerald-400 transition-colors">
                  Career Experience
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/resume')} className="hover:text-emerald-400 transition-colors">
                  Curriculum Vitae / Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialist Capabilities */}
          <div>
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Specialist Stack
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>Python & Asyncio Scraping</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>Playwright & Selenium Automation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>Google Maps Business Extraction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>Pandas & Excel Lead Cleaning</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>PostgreSQL & Cloud Databases</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div>
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Direct Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <a href={`mailto:${profile?.email || 'ibrahimshakeshuvo6@gmail.com'}`} className="hover:text-emerald-400 transition-colors break-all">
                  {profile?.email || 'ibrahimshakeshuvo6@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                <span>{profile?.location || 'Remote / Global'}</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-300">
          <div>
            © {currentYear} {profile?.fullName || 'Ibrahim Shakes Huvo'}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Vercel Serverless Ready & PostgreSQL Connected</span>
            </span>
            <button 
              onClick={() => navigate('/admin/login')}
              className="text-zinc-300 hover:text-zinc-200 transition-colors underline"
            >
              CMS Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
