import React, { useEffect, useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  Eye, 
  Download, 
  CheckCircle2, 
  Layers,
  Search,
  RefreshCw
} from 'lucide-react';
import type { LeadSample } from '../../types';
import { api } from '../../lib/api';

export const AdminLeadSamples: React.FC = () => {
  const [samples, setSamples] = useState<LeadSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    niche: '',
    location: '',
    leadCount: 0,
    dataFields: [] as string[],
    source: '',
    fileType: 'xlsx' as 'csv' | 'xlsx',
    fileUrl: '',
    fileBase64: '',
    originalFilename: '',
    fileSize: 0,
    previewRows: [] as Record<string, any>[],
    publicColumns: [] as string[],
    previewRowCount: 5,
    featured: false,
    downloadEnabled: true,
    status: 'draft' as 'draft' | 'published'
  });

  // Available columns from uploaded file
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadSamples = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminLeadSamples();
      setSamples(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lead samples');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSamples();
  }, []);

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const parsed = await api.uploadLeadSampleFile(file);

      // Pre-fill form with detected data
      setAvailableColumns(parsed.columns || []);
      setFormData(prev => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        originalFilename: parsed.filename,
        fileType: parsed.fileType,
        fileSize: parsed.fileSize,
        fileUrl: parsed.downloadUrl,
        fileBase64: parsed.fileBase64 || '',
        leadCount: parsed.totalRows || 100,
        dataFields: parsed.columns,
        publicColumns: parsed.recommendedPublicColumns || parsed.columns.slice(0, 5),
        previewRows: parsed.previewRows || [],
        previewRowCount: Math.min(parsed.previewRows?.length || 5, 5),
        status: 'draft' // Always draft on upload
      }));

      setSuccessMsg(`Spreadsheet parsed: ${parsed.totalRows} rows and ${parsed.columns.length} columns detected.`);
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Spreadsheet upload and parsing failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Open Edit Modal for existing sample
  const handleEdit = (sample: LeadSample) => {
    setEditingId(sample.id);
    const cols = sample.dataFields || Object.keys(sample.previewRows?.[0] || {});
    setAvailableColumns(cols);
    setFormData({
      title: sample.title,
      slug: sample.slug,
      description: sample.description,
      niche: sample.niche,
      location: sample.location,
      leadCount: sample.leadCount,
      dataFields: sample.dataFields,
      source: sample.source,
      fileType: sample.fileType,
      fileUrl: sample.fileUrl || '',
      fileBase64: sample.fileBase64 || '',
      originalFilename: sample.originalFilename,
      fileSize: sample.fileSize || 0,
      previewRows: sample.previewRows || [],
      publicColumns: sample.publicColumns || cols.slice(0, 5),
      previewRowCount: sample.previewRowCount || 5,
      featured: sample.featured,
      downloadEnabled: sample.downloadEnabled,
      status: sample.status
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await api.updateLeadSample(editingId, formData);
        setSuccessMsg('Lead sample updated successfully.');
      } else {
        await api.createLeadSample(formData);
        setSuccessMsg('Lead sample created as Draft. You can review and publish it.');
      }

      setIsModalOpen(false);
      setEditingId(null);
      await loadSamples();
    } catch (err: any) {
      setError(err.message || 'Failed to save lead sample');
    }
  };

  // Toggle Publish / Draft
  const handleToggleStatus = async (sample: LeadSample) => {
    try {
      const newStatus = sample.status === 'published' ? 'draft' : 'published';
      await api.updateLeadSample(sample.id, { status: newStatus });
      setSamples(samples.map(s => s.id === sample.id ? { ...s, status: newStatus } : s));
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (sample: LeadSample) => {
    try {
      const newFeatured = !sample.featured;
      await api.updateLeadSample(sample.id, { featured: newFeatured });
      setSamples(samples.map(s => s.id === sample.id ? { ...s, featured: newFeatured } : s));
    } catch (err: any) {
      setError(err.message || 'Failed to update featured flag');
    }
  };

  // Delete
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete lead sample "${title}"?`)) return;

    try {
      await api.deleteLeadSample(id);
      setSamples(samples.filter(s => s.id !== id));
      setSuccessMsg(`Deleted "${title}".`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead sample');
    }
  };

  // Toggle column in publicColumns array
  const toggleColumn = (col: string) => {
    setFormData(prev => {
      const exists = prev.publicColumns.includes(col);
      return {
        ...prev,
        publicColumns: exists 
          ? prev.publicColumns.filter(c => c !== col)
          : [...prev.publicColumns, col]
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <span>Lead Samples CMS & Spreadsheet Parser</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Upload CSV/XLSX files, parse schemas, select public columns, and publish verified B2B lead datasets.
          </p>
        </div>

        {/* Action Button: Trigger File Upload */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Parsing File...' : 'Upload CSV / XLSX'}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
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

      {/* Lead Samples Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-mono border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Title & Original File</th>
                <th className="py-3 px-4">Niche & Geo</th>
                <th className="py-3 px-4">Lead Count</th>
                <th className="py-3 px-4">Public Columns</th>
                <th className="py-3 px-4">Download</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {samples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No lead samples created yet. Click "Upload CSV / XLSX" above to parse and publish your first dataset.
                  </td>
                </tr>
              ) : (
                samples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-zinc-900/60 transition-colors">
                    
                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{sample.title}</div>
                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-[9px] uppercase">
                          .{sample.fileType}
                        </span>
                        <span className="truncate max-w-[180px]">{sample.originalFilename}</span>
                      </div>
                    </td>

                    {/* Niche & Location */}
                    <td className="py-3 px-4">
                      <div className="text-zinc-200">{sample.niche}</div>
                      <div className="text-zinc-500 text-[11px]">{sample.location}</div>
                    </td>

                    {/* Lead Count */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {sample.leadCount}+
                    </td>

                    {/* Public columns */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {sample.publicColumns?.slice(0, 3).map((col, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono text-zinc-400">
                            {col}
                          </span>
                        ))}
                        {(sample.publicColumns?.length || 0) > 3 && (
                          <span className="text-[9px] text-zinc-500 font-mono self-center">
                            +{(sample.publicColumns?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Download */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                        sample.downloadEnabled 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-zinc-950 text-zinc-500'
                      }`}>
                        {sample.downloadEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(sample)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                          sample.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-yellow-950/80 text-yellow-400 border border-yellow-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        {sample.status.toUpperCase()}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(sample)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Edit Metadata"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sample.id, sample.title)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Sample"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 w-full max-w-2xl p-6 space-y-6 shadow-2xl my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>{editingId ? 'Edit Lead Sample Metadata' : 'Configure New Lead Sample'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Spreadsheet File Attachment & Replacement Box */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-100 truncate">
                      {formData.originalFilename || 'No spreadsheet attached yet'}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {formData.leadCount > 0 
                        ? `${formData.leadCount} rows extracted • Saved in database • ${formData.fileType.toUpperCase()}`
                        : 'Upload an .xlsx or .csv directly from your phone or PC'}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg cursor-pointer transition-colors shrink-0">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{formData.originalFilename ? 'Replace XLSX' : 'Choose XLSX / CSV'}</span>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Sample Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. US Shopify Fashion Brand Leads"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    URL Slug (auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="us-shopify-fashion-brand-leads"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Niche / Industry
                  </label>
                  <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. E-Commerce / Apparel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Target Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. United States"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Total Lead Count
                  </label>
                  <input
                    type="number"
                    value={formData.leadCount}
                    onChange={(e) => setFormData({ ...formData, leadCount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="Overview of this dataset, data points, and collection parameters..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Data Source
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Shopify Store Registry & Public Web Pages"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Public Preview Rows (Max 10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.previewRowCount}
                    onChange={(e) => setFormData({ ...formData, previewRowCount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Public Columns Selector (Checkboxes) */}
              <div className="space-y-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-200 block">
                    Public Columns Selection
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Checked columns will be visible to public visitors
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                  {availableColumns.map((col) => {
                    const isChecked = formData.publicColumns.includes(col);
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() => toggleColumn(col)}
                        className={`px-2 py-1 text-xs rounded-md border font-mono transition-colors flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 text-emerald-400" />}
                        <span>{col}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.downloadEnabled}
                    onChange={(e) => setFormData({ ...formData, downloadEnabled: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0"
                  />
                  <span>Allow Public Download</span>
                </label>

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

              {/* Form Action Buttons */}
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
                  {editingId ? 'Update Lead Sample' : 'Save as Draft / Publish'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
