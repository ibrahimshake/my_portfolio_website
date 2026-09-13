import React, { useEffect, useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Github,
  Calendar,
  Layers
} from 'lucide-react';
import type { Project } from '../../types';
import { api } from '../../lib/api';
import { ImageUploader } from '../../components/ImageUploader';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Web Scraping',
    technologies: [] as string[],
    techInput: '',
    projectImage: '',
    githubUrl: '',
    liveDemoUrl: '',
    features: [] as string[],
    featureInput: '',
    problem: '',
    solution: '',
    workflow: '',
    results: '',
    projectDate: '',
    featured: false,
    status: 'published' as 'draft' | 'published'
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Web Scraping',
      technologies: ['Python', 'Playwright'],
      techInput: '',
      projectImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      githubUrl: 'https://github.com/IbrahimShakesHuvo/',
      liveDemoUrl: '',
      features: ['Automated browser proxy rotation', 'Headless DOM scraping'],
      featureInput: '',
      problem: '',
      solution: '',
      workflow: '',
      results: '',
      projectDate: '2025',
      featured: false,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription || '',
      category: p.category,
      technologies: p.technologies || [],
      techInput: '',
      projectImage: p.projectImage,
      githubUrl: p.githubUrl || '',
      liveDemoUrl: p.liveDemoUrl || '',
      features: p.features || [],
      featureInput: '',
      problem: p.problem || '',
      solution: p.solution || '',
      workflow: p.workflow || '',
      results: p.results || '',
      projectDate: p.projectDate || '',
      featured: p.featured,
      status: p.status
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      category: formData.category,
      technologies: formData.technologies,
      projectImage: formData.projectImage,
      githubUrl: formData.githubUrl,
      liveDemoUrl: formData.liveDemoUrl,
      features: formData.features,
      problem: formData.problem,
      solution: formData.solution,
      workflow: formData.workflow,
      results: formData.results,
      projectDate: formData.projectDate,
      featured: formData.featured,
      status: formData.status
    };

    try {
      if (editingId) {
        await api.updateProject(editingId, payload);
        setSuccessMsg('Project updated successfully.');
      } else {
        await api.createProject(payload);
        setSuccessMsg('Project created successfully.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setSuccessMsg(`Deleted "${title}".`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  const handleAddTech = () => {
    if (!formData.techInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, prev.techInput.trim()],
      techInput: ''
    }));
  };

  const handleRemoveTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (!formData.featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, prev.featureInput.trim()],
      featureInput: ''
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-400" />
            <span>Projects & Case Studies CMS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage repository showcases, technical workflows, and published scrapers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-xs text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-mono border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Title & Category</th>
                <th className="py-3 px-4">Technologies</th>
                <th className="py-3 px-4">Links</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No projects found. Click "New Project" to add one.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{p.title}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">{p.category}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {p.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {p.githubUrl && <Github className="h-3.5 w-3.5 text-zinc-400" />}
                        {p.liveDemoUrl && <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {p.projectDate}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                        p.status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-yellow-950 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 w-full max-w-3xl p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-blue-400" />
                <span>{editingId ? 'Edit Project Case Study' : 'Create New Project'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Project Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Google Maps Business Data Extraction Suite"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Web Scraping">Web Scraping</option>
                    <option value="B2B Lead Generation">B2B Lead Generation</option>
                    <option value="Data Extraction">Data Extraction</option>
                    <option value="Automation">Automation</option>
                    <option value="QA Automation">QA Automation</option>
                    <option value="Data Processing">Data Processing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">
                  Short Description <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="Concise overview for portfolio cards..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Project Date
                  </label>
                  <input
                    type="text"
                    value={formData.projectDate}
                    onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Nov 2025"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Project Cover Image"
                  value={formData.projectImage}
                  onChange={(url) => setFormData({ ...formData, projectImage: url })}
                  aspectRatio="video"
                  helperText="Upload project screenshot or workflow diagram from your device."
                  maxDimension={1200}
                />
              </div>

              {/* Technologies Tag Input */}
              <div className="space-y-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <label className="text-xs font-medium text-zinc-200 block">
                  Technologies Used
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.techInput}
                    onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                    placeholder="Type tech (e.g. Playwright, Python) and press Add..."
                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-300 flex items-center gap-1">
                      <span>{t}</span>
                      <button type="button" onClick={() => handleRemoveTech(idx)} className="text-zinc-500 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem / Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Problem Solved
                  </label>
                  <textarea
                    rows={2}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="What challenge was the client/target facing?"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Technical Solution
                  </label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="How was the scraping routine architected?"
                  />
                </div>
              </div>

              {/* Workflow & Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Workflow Pipeline
                  </label>
                  <textarea
                    rows={2}
                    value={formData.workflow}
                    onChange={(e) => setFormData({ ...formData, workflow: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Step 1 -> Step 2 -> Step 3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Results / Output Delivered
                  </label>
                  <textarea
                    rows={2}
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="15,000+ verified records delivered with 0% bounce rate..."
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0"
                  />
                  <span className={formData.status === 'published' ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                    Published (Live on Website)
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
