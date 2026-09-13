import React, { useEffect, useState, useRef } from 'react';
import { 
  Settings, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  ArrowRight,
  Download,
  Upload,
  Link,
  Check,
  Zap,
  Smartphone,
  Laptop
} from 'lucide-react';
import { api } from '../../lib/api';
import type { SiteStats } from '../../types';

interface AdminSettingsProps {
  onNavigateSecurity?: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigateSecurity }) => {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  // DB Connection form
  const [connectionString, setConnectionString] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectResult, setConnectResult] = useState<{ success: boolean; message: string } | null>(null);

  // Backup / Restore states
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const importFileRef = useRef<HTMLInputElement | null>(null);

  const fetchStats = () => {
    api.getStats().then(s => {
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleConnectDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionString.trim()) return;

    setConnecting(true);
    setConnectResult(null);

    try {
      const res = await api.connectDatabaseUrl(connectionString.trim());
      setConnectResult({ success: true, message: res.message || 'Connected to database successfully!' });
      fetchStats();
    } catch (err: any) {
      setConnectResult({ success: false, message: err.message || 'Failed to connect to database' });
    } finally {
      setConnecting(false);
    }
  };

  const handleExportBackup = async () => {
    setExporting(true);
    setBackupMsg(null);
    try {
      await api.exportDatabaseBackup();
      setBackupMsg({ type: 'success', text: 'Full database backup downloaded successfully! All projects, spreadsheets, and profile data are safely saved in JSON.' });
    } catch (err: any) {
      setBackupMsg({ type: 'error', text: err.message || 'Failed to export backup.' });
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setBackupMsg(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await api.importDatabaseBackup(json);
      setBackupMsg({ type: 'success', text: 'Database restored successfully! All records have been synchronized.' });
      fetchStats();
    } catch (err: any) {
      setBackupMsg({ type: 'error', text: 'Failed to restore: ' + (err.message || 'Invalid JSON backup file.') });
    } finally {
      setImporting(false);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          <span>Universal Database & Multi-Device Synchronization</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Manage your persistent cloud database, backup snapshots, and ensure every change instantly updates across all devices (Mobile, Laptop, Tablet) and visitors.
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

      {/* 1. CLOUD DATABASE PERSISTENCE FOR VERCEL & ALL DEVICES */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>Multi-Device Cloud Database Status</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Syncs all projects, profile edits, photos, and spreadsheet datasets across Mobile, Desktop, and all visitors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
              stats?.dbConnected
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}>
              <span className={`h-2 w-2 rounded-full ${stats?.dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>{stats?.dbConnected ? 'PostgreSQL Active (Permanent)' : 'Fast Local Store (Vercel Standby)'}</span>
            </span>
          </div>
        </div>

        {/* Explain how Vercel & Multi-device Sync works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Smartphone className="h-4 w-4" />
              <Laptop className="h-4 w-4" />
              <span>Universal Multi-Device Sync</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Everything you upload—including full Excel (.xlsx) files and photos from your phone camera—is stored in structured binary & JSON tables. When anyone opens your website link on their phone, laptop, or tablet, they immediately view the live data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Zap className="h-4 w-4" />
              <span>Vercel Permanent Database Setup</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              To make your database 100% permanent on Vercel for free: Create a free PostgreSQL database on <strong>Neon.tech</strong> or <strong>Supabase</strong>, copy the connection URI (<code>postgres://...</code>), and paste it into Vercel Project Settings &gt; Environment Variables as <code>DATABASE_URL</code>.
            </p>
          </div>
        </div>

        {/* Step by Step Guide in Bengali */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-2 text-zinc-300">
          <div className="font-semibold text-emerald-400 flex items-center gap-2">
            <span>সব ব্রাউজার ও ডিভাইসে স্থায়ীভাবে ডাটা দেখানোর ৩টি সহজ ধাপ (Vercel):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-100">Neon.tech</strong> বা <strong className="text-zinc-100">Supabase</strong>-এ ফ্রি অ্যাকাউন্ট খুলে একটি ফ্রি PostgreSQL ডেটাবেস তৈরি করুন (সময় লাগবে ১ মিনিট, কোনো ক্রেডিট কার্ড লাগে না)।</li>
            <li>সেখান থেকে আপনার ডেটাবেসের <code className="text-emerald-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">DATABASE_URL</code> (কানেকশন স্ট্রিং) কপি করুন।</li>
            <li>আপনার <strong className="text-zinc-100">Vercel Dashboard</strong> &gt; <strong className="text-zinc-100">Settings</strong> &gt; <strong className="text-zinc-100">Environment Variables</strong>-এ গিয়ে Key হিসেবে <code className="text-emerald-300">DATABASE_URL</code> এবং Value হিসেবে আপনার লিঙ্কটি বসিয়ে সেভ করে একবার <strong className="text-zinc-100">Redeploy</strong> দিন।</li>
          </ol>
          <p className="text-[11px] text-emerald-400/90 pt-1">
            💡 এটি সেট করার পর আপনি অ্যাডমিন থেকে যা-ই আপডেট করবেন তা মোবাইল, ল্যাপটপ, ট্যাবলেট বা যে কোনো ব্রাউজারে সাথে সাথে পার্মানেন্টলি দেখা যাবে।
          </p>
        </div>

        {/* Live Connect Form */}
        <form onSubmit={handleConnectDb} className="space-y-3 pt-2">
          <label className="text-xs font-medium text-zinc-200 block">
            Connect Cloud Database via Connection String (PostgreSQL / Neon / Supabase):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none placeholder-zinc-600"
            />
            <button
              type="submit"
              disabled={connecting || !connectionString.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {connecting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Link className="h-3.5 w-3.5" />
                  <span>Connect & Migrate DB</span>
                </>
              )}
            </button>
          </div>

          {connectResult && (
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              connectResult.success 
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' 
                : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
            }`}>
              {connectResult.success ? <Check className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
              <span>{connectResult.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* 2. 1-CLICK DATABASE BACKUP & RESTORE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5 shadow-xl">
        <div className="pb-3 border-b border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-purple-400" />
            <span>Database Backup Snapshot & 1-Click Restore</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Download your complete portfolio database snapshot to your device anytime, or restore it in 1 second.
          </p>
        </div>

        {backupMsg && (
          <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
            backupMsg.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
          }`}>
            {backupMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            <span>{backupMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export Box */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Export Complete Database Backup</span>
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Downloads all Profile data, Projects, Excel (.xlsx) files with complete preview tables, Services, Skills, and Resume records into a portable JSON backup file.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              disabled={exporting}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {exporting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5 text-emerald-400" />}
              <span>Download Backup (.json)</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-400" />
                <span>Restore Database from Backup</span>
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Upload a previous database backup file to restore all your projects, XLSX spreadsheet samples, and profile details instantly.
              </p>
            </div>
            <label className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer text-center">
              {importing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <span>Upload & Restore Backup</span>
              <input
                ref={importFileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>

        </div>
      </div>

      {/* 3. VERCEL ENVIRONMENT CHECKLIST */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Server className="h-4 w-4 text-purple-400" />
          <span>Vercel Deployment Environment Checklist</span>
        </h3>
        
        <div className="space-y-2 text-xs text-zinc-300">
          <p className="text-zinc-400 text-[11px]">
            In your Vercel Project Dashboard (<strong>Settings &gt; Environment Variables</strong>), add these variables:
          </p>
          <div className="p-3 rounded-lg bg-zinc-950 font-mono text-[11px] space-y-1.5 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-emerald-400">DATABASE_URL</span>
              <span className="text-zinc-500 text-[10px]">Neon.tech or Supabase connection string (Permanent)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-emerald-400">SESSION_SECRET</span>
              <span className="text-zinc-500 text-[10px]">Your secret key for HMAC stateless tokens</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-emerald-400">ADMIN_USERNAME</span>
              <span className="text-zinc-500 text-[10px]">ibrahim@07</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-emerald-400">ADMIN_PASSWORD</span>
              <span className="text-zinc-500 text-[10px]">ibrahim@07</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
