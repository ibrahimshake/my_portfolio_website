import React, { useEffect, useState } from 'react';
import { Settings, Database, HardDrive, ShieldCheck, Server, RefreshCw, CheckCircle2, AlertTriangle, KeyRound, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import type { SiteStats } from '../../types';

interface AdminSettingsProps {
  onNavigateSecurity?: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigateSecurity }) => {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(s => {
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-zinc-400" />
          <span>System Architecture & Database Settings</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Review environment parameters, storage providers, and Vercel serverless configurations.
        </p>
      </div>

      {/* Admin Security Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-100">
              Admin Login Credentials & Security
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
              You can change your administrative login username and password at any time. New credentials are saved in your database and default credentials have been hidden from the login screen.
            </p>
          </div>
        </div>

        {onNavigateSecurity && (
          <button
            onClick={onNavigateSecurity}
            className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-bold transition-colors shrink-0 flex items-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <span>Manage Credentials</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Database Status Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Database className="h-4 w-4" />
            <span>Database Connection Layer</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">Active Provider:</span>
              <span className="font-mono text-emerald-400 font-semibold">{stats?.dbProvider || 'PostgreSQL Engine'}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 leading-relaxed">
              <p>
                <strong>Dual-Mode Storage Architecture:</strong> The application automatically connects to PostgreSQL when <code>DATABASE_URL</code> is present. If running in a local environment or during preview without credentials, it falls back seamlessly to the resilient in-memory store initialized with seed records.
              </p>
              <p className="text-zinc-300">
                To migrate schema on your PostgreSQL cluster, run:
                <code className="block mt-1 p-1 rounded bg-zinc-900 font-mono text-emerald-300">npm run migrate</code>
              </p>
            </div>
          </div>
        </div>

        {/* File & Object Storage Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <HardDrive className="h-4 w-4" />
            <span>Spreadsheet & File Storage</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">Storage Engine:</span>
              <span className="font-mono text-blue-400 font-semibold">Vercel Blob / Memory Buffer</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 leading-relaxed">
              <p>
                <strong>Spreadsheet Parser:</strong> Uploaded <code>.csv</code> and <code>.xlsx</code> spreadsheets are parsed using SheetJS (<code>xlsx</code>). Generated sample rows are safely stored in the database for instant table previewing without client-side heavy lifting.
              </p>
              <p className="text-zinc-300">
                Downloads are served through controlled endpoint:
                <code className="block mt-1 p-1 rounded bg-zinc-900 font-mono text-blue-300">/api/lead-samples/:slug/download</code>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Deployment & Environment Reference */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Server className="h-4 w-4 text-purple-400" />
          <span>Vercel Full-Stack Deployment Guide</span>
        </h3>

        <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
          <p>
            This portfolio includes production-ready <code>vercel.json</code> and serverless API proxy handlers in <code>/api/index.ts</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="font-semibold text-zinc-200 block">Required Environment Variables:</span>
              <ul className="text-[11px] font-mono text-zinc-400 space-y-1">
                <li>• DATABASE_URL (PostgreSQL connection string)</li>
                <li>• SESSION_SECRET (Secret for signing admin cookies)</li>
                <li>• ADMIN_USERNAME (Optional, defaults to admin)</li>
                <li>• ADMIN_PASSWORD (Optional, defaults to leadgen2026!)</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="font-semibold text-zinc-200 block">Deploying to Vercel:</span>
              <ol className="text-[11px] text-zinc-400 space-y-1 list-decimal list-inside">
                <li>Push repository to GitHub</li>
                <li>Import into Vercel dashboard</li>
                <li>Add your DATABASE_URL in Project Settings</li>
                <li>Deploy! Output builds to static SPA + Serverless functions</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
