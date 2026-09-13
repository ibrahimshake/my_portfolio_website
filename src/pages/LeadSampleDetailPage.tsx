import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  MapPin, 
  Database, 
  CheckCircle, 
  ShieldCheck, 
  Search, 
  AlertCircle,
  Table,
  Info
} from 'lucide-react';
import type { LeadSample } from '../types';
import { api } from '../lib/api';

interface LeadSampleDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const LeadSampleDetailPage: React.FC<LeadSampleDetailPageProps> = ({ slug, navigate }) => {
  const [sample, setSample] = useState<LeadSample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSearch, setRowSearch] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getLeadSampleBySlug(slug)
      .then(data => {
        if (isMounted) {
          setSample(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Lead sample not found');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [slug]);

  // Public columns
  const displayColumns = useMemo(() => {
    if (!sample) return [];
    if (sample.publicColumns && sample.publicColumns.length > 0) {
      return sample.publicColumns;
    }
    if (sample.previewRows && sample.previewRows.length > 0) {
      return Object.keys(sample.previewRows[0]);
    }
    return sample.dataFields || [];
  }, [sample]);

  // Filter preview rows by search
  const filteredRows = useMemo(() => {
    if (!sample || !sample.previewRows) return [];
    if (!rowSearch.trim()) return sample.previewRows;

    return sample.previewRows.filter(row => {
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(rowSearch.toLowerCase())
      );
    });
  }, [sample, rowSearch]);

  const handleDownload = () => {
    if (!sample) return;
    setDownloading(true);
    // Direct browser download from secure server endpoint
    window.location.href = `/api/lead-samples/${sample.slug}/download`;
    setTimeout(() => setDownloading(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent mb-4" />
        <p className="text-xs text-zinc-400">Loading spreadsheet preview...</p>
      </div>
    );
  }

  if (error || !sample) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-100">Lead Sample Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          The requested lead sample dataset could not be found or is currently in draft mode.
        </p>
        <button
          onClick={() => navigate('/lead-samples')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Lead Samples</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/lead-samples')}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Lead Samples</span>
      </button>

      {/* Header Info Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono uppercase rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {sample.niche}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                Format: .{sample.fileType.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                {sample.leadCount}+ Total Leads Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              {sample.title}
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {sample.description}
            </p>
          </div>

          {/* Action Download */}
          <div className="shrink-0 space-y-2 text-right">
            {sample.downloadEnabled ? (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-emerald-950/40"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? 'Preparing Download...' : `Download Sample (.${sample.fileType})`}</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                Download disabled by Admin
              </div>
            )}
            <p className="text-[11px] text-zinc-300">
              Verified & formatted dataset
            </p>
          </div>
        </div>

        {/* Dataset Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-300 font-mono text-[11px] block">Target Geography</span>
            <span className="font-semibold text-zinc-200 mt-0.5 block flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>{sample.location}</span>
            </span>
          </div>

          <div>
            <span className="text-zinc-300 font-mono text-[11px] block">Data Source</span>
            <span className="font-semibold text-zinc-200 mt-0.5 block flex items-center gap-1">
              <Database className="h-3 w-3 text-emerald-400" />
              <span>{sample.source}</span>
            </span>
          </div>

          <div>
            <span className="text-zinc-300 font-mono text-[11px] block">Original File</span>
            <span className="font-mono text-zinc-300 mt-0.5 block truncate">
              {sample.originalFilename}
            </span>
          </div>

          <div>
            <span className="text-zinc-300 font-mono text-[11px] block">Verification Status</span>
            <span className="font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified & Deduplicated</span>
            </span>
          </div>
        </div>
      </div>

      {/* SPREADSHEET PREVIEW TABLE */}
      <section className="space-y-4">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <Table className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              Public Spreadsheet Sample Preview
            </h3>
            <span className="text-xs text-zinc-300 font-mono">
              ({filteredRows.length} rows previewed)
            </span>
          </div>

          {/* Table Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={rowSearch}
              onChange={(e) => setRowSearch(e.target.value)}
              placeholder="Filter preview rows..."
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/90 pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* The Table Container with Horizontal Scroll */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-900/90 text-zinc-300 font-mono uppercase text-[11px] sticky top-0 z-10 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-zinc-500 text-center font-normal">#</th>
                  {displayColumns.map((col, idx) => (
                    <th key={idx} className="py-3 px-4 font-semibold tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/80 text-zinc-300">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={displayColumns.length + 1} className="py-12 text-center text-zinc-500 text-xs">
                      No rows match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono text-[10px] text-zinc-500">
                        {rIdx + 1}
                      </td>
                      {displayColumns.map((col, cIdx) => {
                        const val = row[col];
                        const isEmail = typeof val === 'string' && val.includes('@');
                        const isUrl = typeof val === 'string' && (val.startsWith('http') || val.startsWith('www.'));

                        return (
                          <td key={cIdx} className="py-2.5 px-4 whitespace-nowrap text-zinc-200">
                            {isUrl ? (
                              <a
                                href={val.startsWith('http') ? val : `https://${val}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                <span>{val}</span>
                              </a>
                            ) : isEmail ? (
                              <span className="font-mono text-emerald-300 text-[11px]">
                                {val}
                              </span>
                            ) : (
                              <span>{val !== undefined && val !== '' ? String(val) : <span className="text-zinc-600">—</span>}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-400">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Data Privacy & Sampling Policy:</strong> In accordance with data privacy guidelines, this live viewer only presents a sample subset of rows. Full customized datasets with complete geographic coverage, verified decision-maker emails, and phone extensions are extracted directly for active client projects.
          </p>
        </div>

      </section>

      {/* Inquiry CTA */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-emerald-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100">
            Need this exact lead list or a custom geo-targeted extract?
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl">
            I can extract the complete list of {sample.leadCount}+ records or customize the filters to your specific ideal customer profile.
          </p>
        </div>

        <button
          onClick={() => navigate('/contact')}
          className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0 shadow-lg shadow-emerald-950/40"
        >
          Request Full Dataset
        </button>
      </div>

    </div>
  );
};
