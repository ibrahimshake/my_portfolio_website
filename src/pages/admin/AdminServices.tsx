import React, { useEffect, useState } from 'react';
import { Layers, Plus, Trash2, Edit3, Check, X, AlertCircle } from 'lucide-react';
import type { Service } from '../../types';
import { api } from '../../lib/api';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Target',
    features: [] as string[],
    featureInput: '',
    featured: false,
    displayOrder: 0
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Target',
      features: ['Custom target extraction', 'Data cleaning & deduplication'],
      featureInput: '',
      featured: true,
      displayOrder: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setFormData({
      title: s.title,
      description: s.description,
      icon: s.icon,
      features: s.features || [],
      featureInput: '',
      featured: s.featured,
      displayOrder: s.displayOrder
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        features: formData.features,
        featured: formData.featured,
        displayOrder: formData.displayOrder
      };

      if (editingId) {
        await api.updateService(editingId, payload);
        setSuccessMsg('Service updated successfully.');
      } else {
        await api.createService(payload);
        setSuccessMsg('Service created successfully.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      await loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      setSuccessMsg(`Deleted "${title}".`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    }
  };

  const addFeature = () => {
    if (!formData.featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, prev.featureInput.trim()],
      featureInput: ''
    }));
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>Service Offerings CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your service cards, inclusions, and homepage featured offerings.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-xs text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-xs text-emerald-300 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">{s.icon}</span>
                {s.featured && (
                  <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-zinc-100 mt-2">{s.title}</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{s.description}</p>
            </div>

            <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Order: {s.displayOrder}</span>
              <div className="space-x-1">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.title)}
                  className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Icon Name</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  >
                    <option value="Target">Target (Lead Gen)</option>
                    <option value="Database">Database (Extraction)</option>
                    <option value="MapPin">MapPin (Google Maps)</option>
                    <option value="CheckCircle">CheckCircle (Cleaning)</option>
                    <option value="Cpu">Cpu (Browser Automation)</option>
                    <option value="ShieldCheck">ShieldCheck (QA Testing)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              {/* Features Tag Input */}
              <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <label className="text-xs font-medium text-zinc-200">Included Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.featureInput}
                    onChange={(e) => setFormData({ ...formData, featureInput: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="Add feature..."
                    className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
                  />
                  <button type="button" onClick={addFeature} className="px-3 py-1 text-xs bg-zinc-800 rounded">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {formData.features.map((f, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1">
                      <span>{f}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-zinc-500 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-zinc-800 text-emerald-500"
                />
                <span>Feature on Homepage</span>
              </label>

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
