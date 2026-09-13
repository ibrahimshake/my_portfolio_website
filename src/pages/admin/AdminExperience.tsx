import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, Edit3, Check, X, AlertCircle } from 'lucide-react';
import type { Experience } from '../../types';
import { api } from '../../lib/api';

export const AdminExperience: React.FC = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [] as string[],
    respInput: '',
    technologies: [] as string[],
    techInput: '',
    displayOrder: 0
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminExperience();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      company: '',
      position: '',
      startDate: '2023',
      endDate: '',
      current: true,
      description: '',
      responsibilities: ['Developed automated web data extraction scripts.'],
      respInput: '',
      technologies: ['Python', 'Playwright'],
      techInput: '',
      displayOrder: items.length + 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.description,
      responsibilities: exp.responsibilities || [],
      respInput: '',
      technologies: exp.technologies || [],
      techInput: '',
      displayOrder: exp.displayOrder
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.current ? '' : formData.endDate,
        current: formData.current,
        description: formData.description,
        responsibilities: formData.responsibilities,
        technologies: formData.technologies,
        displayOrder: formData.displayOrder
      };

      if (editingId) {
        await api.updateExperience(editingId, payload);
        setSuccessMsg('Experience updated.');
      } else {
        await api.createExperience(payload);
        setSuccessMsg('Experience added.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      await loadItems();
    } catch (err: any) {
      setError(err.message || 'Failed to save experience');
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!window.confirm(`Delete experience at "${company}"?`)) return;
    try {
      await api.deleteExperience(id);
      setItems(items.filter(i => i.id !== id));
      setSuccessMsg(`Deleted.`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            <span>Work Experience Timeline CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your career history, roles, and project responsibilities.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Role</span>
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-950/30 text-xs text-red-300">{error}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-950/30 text-xs text-emerald-300">{successMsg}</div>}

      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">{exp.position}</h3>
                <span className="text-xs text-emerald-400">{exp.company}</span>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>

              <div className="space-x-1">
                <button onClick={() => openEdit(exp)} className="p-1.5 text-zinc-400 hover:text-zinc-200">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(exp.id, exp.company)} className="p-1.5 text-zinc-500 hover:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 w-full max-w-lg p-6 space-y-4 shadow-2xl my-8">
            <h3 className="text-base font-bold text-zinc-100">
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Position / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Start Date</label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">End Date</label>
                  <input
                    type="text"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="rounded border-zinc-800 text-emerald-500"
                />
                <span>Currently Working Here</span>
              </label>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Overview Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
