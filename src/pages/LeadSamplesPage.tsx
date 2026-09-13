import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Download,
  Database,
  Layers
} from 'lucide-react';
import type { LeadSample } from '../types';

interface LeadSamplesPageProps {
  leadSamples: LeadSample[];
  navigate: (path: string) => void;
}

export const LeadSamplesPage: React.FC<LeadSamplesPageProps> = ({ leadSamples, navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');

  // Extract unique niches
  const niches = useMemo(() => {
    const list = ['All'];
    leadSamples.forEach(s => {
      if (s.niche && !list.includes(s.niche)) {
        list.push(s.niche);
      }
    });
    return list;
  }, [leadSamples]);

  const filteredSamples = useMemo(() => {
    return leadSamples.filter(sample => {
      const matchNiche = selectedNiche === 'All' || sample.niche.toLowerCase().includes(selectedNiche.toLowerCase());
      const matchSearch = 
        sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.dataFields.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchNiche && matchSearch;
    });
  }, [leadSamples, selectedNiche, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>Real Lead Extraction Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          B2B Lead Samples & Datasets
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Inspect live, structured spreadsheets extracted from public business registers, maps, and e-commerce platforms. We protect private contacts while allowing full structure and quality verification.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        
        {/* Niche Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {niches.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedNiche === niche
                  ? 'bg-emerald-400 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by niche, state, or field..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Samples Grid */}
      {filteredSamples.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          <FileSpreadsheet className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No lead samples match your search</h3>
          <p className="text-xs text-zinc-500 mt-1">Try another keyword or select "All" niches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-zinc-900/70 group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                      {sample.niche}
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-100 mt-1 group-hover:text-emerald-400 transition-colors">
                      {sample.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-zinc-950 text-emerald-400 border border-emerald-500/30">
                      .{sample.fileType}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {sample.leadCount}+ Leads
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {sample.description}
                </p>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-zinc-900 text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Location: <strong className="text-zinc-200">{sample.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Database className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Source: <strong className="text-zinc-200">{sample.source}</strong></span>
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] uppercase font-semibold text-zinc-300 block">
                    Structured Columns in Dataset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sample.dataFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] text-zinc-300 font-mono">
                  {sample.originalFilename}
                </span>

                <button
                  onClick={() => navigate(`/lead-samples/${sample.slug}`)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  <span>Inspect Live Spreadsheet</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
