import React from 'react';
import { Terminal, Cpu, Database, ShieldCheck, Check, Layers, Code } from 'lucide-react';
import type { Skill } from '../types';

interface SkillsPageProps {
  skills: Skill[];
  navigate: (path: string) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ skills, navigate }) => {
  // Group skills by category
  const categories = ['Core Scraping', 'Browser Automation', 'Data Processing', 'Testing & Tools', 'Web Tech'] as const;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Core Scraping': return <Terminal className="h-4 w-4 text-emerald-400" />;
      case 'Browser Automation': return <Cpu className="h-4 w-4 text-blue-400" />;
      case 'Data Processing': return <Database className="h-4 w-4 text-emerald-400" />;
      case 'Testing & Tools': return <ShieldCheck className="h-4 w-4 text-purple-400" />;
      default: return <Code className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Technical Stack
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Skills & Technologies
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Specialized tooling focused on browser emulation, asynchronous concurrency, structured data sanitization, and automated pipeline execution.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySkills = skills.filter(s => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  {getCategoryIcon(category)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">{category}</h2>
                  <p className="text-xs text-zinc-400">
                    {category === 'Core Scraping' && 'DOM parsing, HTTP session pooling, and public registry extraction.'}
                    {category === 'Browser Automation' && 'Headless browser control, anti-bot circumvention, and infinite scrolling.'}
                    {category === 'Data Processing' && 'Data hygiene, spreadsheet formatting, and relational data modeling.'}
                    {category === 'Testing & Tools' && 'Version control, script reliability testing, and scheduled workflows.'}
                    {category === 'Web Tech' && 'Modern front-end architecture inspection, JSON-LD, and network sniffer tools.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-zinc-200 block">
                        {skill.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Proficiency: {skill.level || 'Advanced'}
                      </span>
                    </div>

                    <div className="h-6 w-6 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Commitment */}
      <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/20 text-xs text-zinc-400 max-w-3xl mx-auto text-center space-y-2">
        <p>
          <strong className="text-zinc-200">No Inflated Metrics:</strong> All capabilities listed reflect hands-on production code, real client deliverables, and verifiable repository implementations.
        </p>
      </div>

    </div>
  );
};
