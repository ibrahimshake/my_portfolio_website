import React, { useEffect, useState } from 'react';
import { User, Check, AlertCircle, Save } from 'lucide-react';
import type { Profile } from '../../types';
import { api } from '../../lib/api';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || saving) return;
    setSaving(true);
    setError(null);

    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setSuccessMsg('Profile information updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-zinc-500">Loading profile data...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <User className="h-5 w-5 text-yellow-400" />
          <span>Profile & About Section CMS</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Edit your headline, executive bio, contact email, and availability badge.
        </p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-950/30 text-xs text-red-300">{error}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-950/30 text-xs text-emerald-300">{successMsg}</div>}

      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Full Name</label>
            <input
              type="text"
              value={profile?.fullName || ''}
              onChange={(e) => setProfile(p => p ? { ...p, fullName: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Professional Title</label>
            <input
              type="text"
              value={profile?.title || ''}
              onChange={(e) => setProfile(p => p ? { ...p, title: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <input
              type="email"
              value={profile?.email || ''}
              onChange={(e) => setProfile(p => p ? { ...p, email: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Location</label>
            <input
              type="text"
              value={profile?.location || ''}
              onChange={(e) => setProfile(p => p ? { ...p, location: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Availability Status</label>
            <input
              type="text"
              value={profile?.availabilityStatus || ''}
              onChange={(e) => setProfile(p => p ? { ...p, availabilityStatus: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
              placeholder="Available for Contract / Lead Gen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">GitHub Profile URL</label>
            <input
              type="text"
              value={profile?.githubUrl || ''}
              onChange={(e) => setProfile(p => p ? { ...p, githubUrl: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">LinkedIn Profile URL</label>
            <input
              type="text"
              value={profile?.linkedinUrl || ''}
              onChange={(e) => setProfile(p => p ? { ...p, linkedinUrl: e.target.value } : null)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Avatar / Profile Photo URL</label>
          <input
            type="text"
            value={profile?.avatarUrl || ''}
            onChange={(e) => setProfile(p => p ? { ...p, avatarUrl: e.target.value } : null)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Hero Short Bio</label>
          <textarea
            rows={2}
            value={profile?.shortBio || ''}
            onChange={(e) => setProfile(p => p ? { ...p, shortBio: e.target.value } : null)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Full About Page Content</label>
          <textarea
            rows={6}
            value={profile?.fullAbout || ''}
            onChange={(e) => setProfile(p => p ? { ...p, fullAbout: e.target.value } : null)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
