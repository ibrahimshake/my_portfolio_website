import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, Database, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, navigate }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('leadgen2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await api.login(username, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login attempt rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-sm space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
              Admin CMS Authentication
            </h1>
            <p className="text-xs text-zinc-400">
              Sign in to manage projects, lead sample spreadsheets, and profile content.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">
                Administrator Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>

          </form>

          {/* Seed Notice */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-200 block">Default Credentials:</span>
            <div>Username: <code className="text-emerald-400 font-mono">admin</code></div>
            <div>Password: <code className="text-emerald-400 font-mono">leadgen2026!</code></div>
          </div>

        </div>

      </div>
    </div>
  );
};
