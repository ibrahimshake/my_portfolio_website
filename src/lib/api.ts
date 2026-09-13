import type { 
  Profile, 
  Project, 
  LeadSample, 
  Service, 
  Skill, 
  Experience, 
  ResumeData, 
  ContactMessage, 
  SiteStats 
} from '../types';

let adminToken: string | null = null;

// Retrieve persisted token if any
if (typeof window !== 'undefined') {
  adminToken = localStorage.getItem('leadgen_admin_token');
}

export function setAuthToken(token: string | null) {
  adminToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('leadgen_admin_token', token);
    } else {
      localStorage.removeItem('leadgen_admin_token');
    }
  }
}

export function getAuthToken(): string | null {
  return adminToken;
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }
  return headers;
}

export const api = {
  // Public
  getProfile: async (): Promise<Profile> => {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  getProjects: async (category?: string, featured?: boolean): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (featured) params.append('featured', 'true');
    const res = await fetch(`/api/projects?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const res = await fetch(`/api/projects/${slug}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  getLeadSamples: async (niche?: string, location?: string, featured?: boolean): Promise<LeadSample[]> => {
    const params = new URLSearchParams();
    if (niche && niche !== 'All') params.append('niche', niche);
    if (location && location !== 'All') params.append('location', location);
    if (featured) params.append('featured', 'true');
    const res = await fetch(`/api/lead-samples?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch lead samples');
    return res.json();
  },

  getLeadSampleBySlug: async (slug: string): Promise<LeadSample> => {
    const res = await fetch(`/api/lead-samples/${slug}`);
    if (!res.ok) throw new Error('Lead sample not found');
    return res.json();
  },

  getServices: async (): Promise<Service[]> => {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  getSkills: async (): Promise<Skill[]> => {
    const res = await fetch('/api/skills');
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  getExperience: async (): Promise<Experience[]> => {
    const res = await fetch('/api/experience');
    if (!res.ok) throw new Error('Failed to fetch experience');
    return res.json();
  },

  getResume: async (): Promise<ResumeData> => {
    const res = await fetch('/api/resume');
    if (!res.ok) throw new Error('Failed to fetch resume');
    return res.json();
  },

  sendMessage: async (data: { name: string; email: string; subject?: string; message: string }) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send message');
    return json;
  },

  // Admin Auth
  login: async (username: string, password: string): Promise<{ success: boolean; token: string; username: string }> => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    setAuthToken(json.token);
    return json;
  },

  logout: async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: getAuthHeaders() });
    } finally {
      setAuthToken(null);
    }
  },

  checkSession: async (): Promise<{ authenticated: boolean; username?: string; dbProvider?: string }> => {
    try {
      const res = await fetch('/api/admin/me', { headers: getAuthHeaders() });
      if (!res.ok) return { authenticated: false };
      return res.json();
    } catch {
      return { authenticated: false };
    }
  },

  checkAuth: async (): Promise<{ authenticated: boolean; username?: string; dbProvider?: string }> => {
    return api.checkSession();
  },

  getStats: async (): Promise<SiteStats> => {
    const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  // Admin CRUD
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  getAdminProjects: async (): Promise<Project[]> => {
    const res = await fetch('/api/admin/projects', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin projects');
    return res.json();
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  deleteProject: async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Admin Lead Samples
  getAdminLeadSamples: async (): Promise<LeadSample[]> => {
    const res = await fetch('/api/admin/lead-samples', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin lead samples');
    return res.json();
  },

  uploadLeadSampleFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/lead-samples/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to upload spreadsheet');
    return json;
  },

  createLeadSample: async (sample: Partial<LeadSample>): Promise<LeadSample> => {
    const res = await fetch('/api/admin/lead-samples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(sample)
    });
    if (!res.ok) throw new Error('Failed to create lead sample');
    return res.json();
  },

  updateLeadSample: async (id: string, updates: Partial<LeadSample>): Promise<LeadSample> => {
    const res = await fetch(`/api/admin/lead-samples/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update lead sample');
    return res.json();
  },

  deleteLeadSample: async (id: string) => {
    const res = await fetch(`/api/admin/lead-samples/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete lead sample');
    return res.json();
  },

  // Services
  getAdminServices: async (): Promise<Service[]> => {
    return api.getServices();
  },

  createService: async (service: Partial<Service>): Promise<Service> => {
    return api.saveService(service, false);
  },

  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    return api.saveService({ id, ...service }, true);
  },

  saveService: async (service: Partial<Service>, isEdit = false): Promise<Service> => {
    const url = isEdit ? `/api/admin/services/${service.id}` : '/api/admin/services';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to save service');
    return res.json();
  },

  deleteService: async (id: string) => {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // Skills
  getAdminSkills: async (): Promise<Skill[]> => {
    return api.getSkills();
  },

  createSkill: async (skill: Partial<Skill>): Promise<Skill> => {
    return api.saveSkill(skill, false);
  },

  updateSkill: async (id: string, skill: Partial<Skill>): Promise<Skill> => {
    return api.saveSkill({ id, ...skill }, true);
  },

  saveSkill: async (skill: Partial<Skill>, isEdit = false): Promise<Skill> => {
    const url = isEdit ? `/api/admin/skills/${skill.id}` : '/api/admin/skills';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(skill)
    });
    if (!res.ok) throw new Error('Failed to save skill');
    return res.json();
  },

  deleteSkill: async (id: string) => {
    const res = await fetch(`/api/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
  },

  // Experience
  getAdminExperience: async (): Promise<Experience[]> => {
    return api.getExperience();
  },

  createExperience: async (exp: Partial<Experience>): Promise<Experience> => {
    return api.saveExperience(exp, false);
  },

  updateExperience: async (id: string, exp: Partial<Experience>): Promise<Experience> => {
    return api.saveExperience({ id, ...exp }, true);
  },

  saveExperience: async (exp: Partial<Experience>, isEdit = false): Promise<Experience> => {
    const url = isEdit ? `/api/admin/experience/${exp.id}` : '/api/admin/experience';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(exp)
    });
    if (!res.ok) throw new Error('Failed to save experience');
    return res.json();
  },

  deleteExperience: async (id: string) => {
    const res = await fetch(`/api/admin/experience/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete experience');
    return res.json();
  },

  // Resume
  updateResume: async (data: Partial<ResumeData>): Promise<ResumeData> => {
    const res = await fetch('/api/admin/resume', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update resume');
    return res.json();
  },

  // Messages
  getAdminMessages: async (): Promise<ContactMessage[]> => {
    const res = await fetch('/api/admin/messages', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  markMessageRead: async (id: string, read: boolean) => {
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ read })
    });
    if (!res.ok) throw new Error('Failed to update message');
    return res.json();
  },

  deleteMessage: async (id: string) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  }
};
