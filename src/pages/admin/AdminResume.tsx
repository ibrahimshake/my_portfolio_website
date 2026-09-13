import React, { useEffect, useState } from 'react';
import { FileText, Save, Plus, Trash2 } from 'lucide-react';
import type { ResumeData } from '../../types';
import { api } from '../../lib/api';

export const AdminResume: React.FC = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getResume()
      .then(data => {
        setResume(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || saving) return;
    setSaving(true);
    try {
      const updated = await api.updateResume(resume);
      setResume(updated);
      setMsg('Resume updated successfully.');
    } catch (err: any) {
      setMsg('Failed to update resume.');
    } finally {
      setSaving(false);
    }
  };

  const addCert = () => {
    if (!resume) return;
    setResume({
      ...resume,
      certifications: [...(resume.certifications || []), 'New Certification']
    });
  };

  const updateCert = (idx: number, val: string) => {
    if (!resume) return;
    const certs = [...resume.certifications];
    certs[idx] = val;
    setResume({ ...resume, certifications: certs });
  };

  const removeCert = (idx: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      certifications: resume.certifications.filter((_, i) => i !== idx)
    });
  };

  if (loading) return <div className="py-12 text-center text-xs text-zinc-500">Loading resume...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          <span>Resume & Credentials CMS</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Update executive summary, certifications, and direct downloadable PDF link.
        </p>
      </div>

      {msg && <div className="p-3 rounded-lg bg-emerald-950/30 text-xs text-emerald-300">{msg}</div>}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Executive Summary</label>
          <textarea
            rows={4}
            value={resume?.summary || ''}
            onChange={(e) => setResume(r => r ? { ...r, summary: e.target.value } : null)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">PDF Download URL</label>
          <input
            type="text"
            value={resume?.pdfUrl || ''}
            onChange={(e) => setResume(r => r ? { ...r, pdfUrl: e.target.value } : null)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100"
            placeholder="https://..."
          />
        </div>

        {/* Certifications List */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-200">Certifications & Badges</label>
            <button
              type="button"
              onClick={addCert}
              className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add Cert</span>
            </button>
          </div>

          <div className="space-y-2">
            {resume?.certifications?.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => updateCert(idx, e.target.value)}
                  className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => removeCert(idx)}
                  className="p-1.5 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Resume'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
