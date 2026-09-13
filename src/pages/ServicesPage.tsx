import React from 'react';
import { 
  Target, 
  Database, 
  MapPin, 
  CheckCircle, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Terminal
} from 'lucide-react';
import type { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, navigate }) => {
  // Map icon names to Lucide components
  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'target': return <Target className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'mappin': return <MapPin className="h-5 w-5" />;
      case 'checkcircle': return <CheckCircle className="h-5 w-5" />;
      case 'cpu': return <Cpu className="h-5 w-5" />;
      case 'shieldcheck': return <ShieldCheck className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Professional Offerings
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Services & Capabilities
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          From custom browser automation to targeted cold-outreach lead lists, explore my technical offerings for high-volume, verified web data collection.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-zinc-900/70 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                  {renderIcon(service.icon)}
                </div>
                {service.featured && (
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    High Demand
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">
                {service.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-2">
                  What's Included:
                </span>
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/80">
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-2 px-3 text-xs font-semibold text-zinc-200 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inquire About This Service</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow assurance */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-lg font-bold text-zinc-100">
          Need a custom extraction script or one-time data dump?
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          I provide both turnkey spreadsheet delivery (CSV/XLSX) and complete Python source code delivery with documented installation instructions.
        </p>
        <button
          onClick={() => navigate('/contact')}
          className="px-6 py-2.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>Get a Custom Proposal</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
