import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Trash2, Edit3, Check, X, AlertCircle } from 'lucide-react';
import type { Skill } from '../../types';
import { api } from '../../lib/api';

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Core Scraping' as Skill['category'],
    level: 'Advanced',
    displayOrder: 0
  });

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminSkills();
      setSkills(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Core Scraping',
      level: 'Advanced',
      displayOrder: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditingId(s.id);
    setFormData({
      name: s.name,
      category: s.category,
      level: s.level,
      displayOrder: s.displayOrder
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateSkill(editingId, formData);
        setSuccessMsg('Skill updated.');
      } else {
        await api.createSkill(formData);
        setSuccessMsg('Skill created.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      await loadSkills();
    } catch (err: any) {
      setError(err.message || 'Failed to save skill');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      setSuccessMsg(`Deleted "${name}".`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-400" />
            <span>Skills & Tools CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add or update technical capabilities and categories.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-950/30 text-xs text-red-300">{error}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-950/30 text-xs text-emerald-300">{successMsg}</div>}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-mono border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Skill Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Proficiency Level</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {skills.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/60">
                <td className="py-3 px-4 font-semibold text-zinc-100">{s.name}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{s.category}</td>
                <td className="py-3 px-4 text-zinc-400">{s.level}</td>
                <td className="py-3 px-4 font-mono text-zinc-500">{s.displayOrder}</td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 text-zinc-400 hover:text-zinc-200">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 text-zinc-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Skill Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Playwright"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                >
                  <option value="Core Scraping">Core Scraping</option>
                  <option value="Browser Automation">Browser Automation</option>
                  <option value="Data Processing">Data Processing</option>
                  <option value="Testing & Tools">Testing & Tools</option>
                  <option value="Web Tech">Web Tech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Level</label>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  placeholder="Expert / Advanced / Intermediate"
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
