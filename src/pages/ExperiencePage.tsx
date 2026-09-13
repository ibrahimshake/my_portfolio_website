import React from 'react';
import { Briefcase, Calendar, CheckCircle, Terminal, Building2 } from 'lucide-react';
import type { Experience } from '../types';

interface ExperiencePageProps {
  experience: Experience[];
  navigate: (path: string) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ experience, navigate }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Career Timeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Professional Experience
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Track record of delivering automated data scrapers, building targeted prospect databases, and managing automated test suites.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-zinc-800 ml-4 sm:ml-6 space-y-12 pb-4">
        {experience.map((exp, index) => (
          <div key={exp.id} className="relative pl-6 sm:pl-8 group">
            
            {/* Dot marker */}
            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-emerald-500 bg-zinc-950 group-hover:scale-125 transition-transform" />

            {/* Content card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-4 hover:border-zinc-700 transition-all">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-0.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{exp.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 shrink-0">
                  <Calendar className="h-3 w-3 text-emerald-400" />
                  <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {exp.description}
              </p>

              {/* Responsibilities */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-zinc-900">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                    Core Responsibilities & Deliverables:
                  </span>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech stack */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="pt-3 border-t border-zinc-900 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
