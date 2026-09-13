import express from 'express';
import multer from 'multer';
import path from 'path';
import * as XLSX from 'xlsx';
import { db } from './db.js';
import { auth } from './auth.js';
import { storage } from './storage.js';
import type { Project, LeadSample, Service, Skill, Experience, ResumeData } from '../src/types.js';

export const apiRouter = express.Router();

// Multer in-memory storage for handling uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .csv and .xlsx files are supported.'));
    }
  }
});

// Helper for generating slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/* ==========================================================================
   PUBLIC ENDPOINTS
   ========================================================================== */

// Profile
apiRouter.get('/profile', async (req, res) => {
  try {
    const profile = await db.getProfile();
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Projects
apiRouter.get('/projects', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let projects = await db.getProjects(false);

    if (category && typeof category === 'string' && category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      projects = projects.filter(p => p.featured);
    }

    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// Single Project by Slug
apiRouter.get('/projects/:slug', async (req, res) => {
  try {
    const project = await db.getProjectBySlug(req.params.slug, false);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// Lead Samples
apiRouter.get('/lead-samples', async (req, res) => {
  try {
    const { niche, location, featured } = req.query;
    let samples = await db.getLeadSamples(false);

    if (niche && typeof niche === 'string' && niche !== 'All') {
      samples = samples.filter(s => s.niche.toLowerCase().includes(niche.toLowerCase()));
    }

    if (location && typeof location === 'string' && location !== 'All') {
      samples = samples.filter(s => s.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (featured === 'true') {
      samples = samples.filter(s => s.featured);
    }

    // Public list returns sanitized preview summaries
    const sanitized = samples.map(s => {
      const { ...safeSample } = s;
      return safeSample;
    });

    res.json(sanitized);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve lead samples' });
  }
});

// Single Lead Sample by Slug (Controlled Public Preview)
apiRouter.get('/lead-samples/:slug', async (req, res) => {
  try {
    const sample = await db.getLeadSampleBySlug(req.params.slug, false);
    if (!sample) {
      return res.status(404).json({ error: 'Lead sample not found' });
    }

    // Security: Only return configured public columns and up to configured previewRowCount
    const publicCols = sample.publicColumns && sample.publicColumns.length > 0 
      ? sample.publicColumns 
      : Object.keys(sample.previewRows[0] || {});

    const maxRows = sample.previewRowCount || 10;
    const filteredRows = (sample.previewRows || []).slice(0, maxRows).map(row => {
      const publicRow: Record<string, any> = {};
      publicCols.forEach(col => {
        publicRow[col] = row[col] !== undefined ? row[col] : '';
      });
      return publicRow;
    });

    res.json({
      ...sample,
      publicColumns: publicCols,
      previewRows: filteredRows
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve lead sample details' });
  }
});

// Download Lead Sample (Controlled)
apiRouter.get('/lead-samples/:slug/download', async (req, res) => {
  try {
    const sample = await db.getLeadSampleBySlug(req.params.slug, false);
    if (!sample) {
      return res.status(404).json({ error: 'Lead sample not found' });
    }

    if (!sample.downloadEnabled) {
      return res.status(403).json({ error: 'Public download is disabled for this sample dataset.' });
    }

    // If a physical/cached file is linked
    if (sample.fileUrl && sample.fileUrl.startsWith('/api/lead-samples/download/')) {
      const fileId = sample.fileUrl.replace('/api/lead-samples/download/', '');
      const cached = storage.getFile(fileId);
      if (cached) {
        res.setHeader('Content-Disposition', `attachment; filename="${cached.filename}"`);
        res.setHeader('Content-Type', cached.mimeType);
        return res.send(cached.buffer);
      }
    }

    // Otherwise generate clean sample spreadsheet from preview data
    const publicCols = sample.publicColumns && sample.publicColumns.length > 0 
      ? sample.publicColumns 
      : Object.keys(sample.previewRows[0] || {});

    const exportData = (sample.previewRows || []).map(row => {
      const cleanRow: Record<string, any> = {};
      publicCols.forEach(col => {
        cleanRow[col] = row[col] || '';
      });
      return cleanRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample_Leads');

    if (sample.fileType === 'xlsx') {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Disposition', `attachment; filename="${sample.slug}_sample.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buffer);
    } else {
      const csvStr = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader('Content-Disposition', `attachment; filename="${sample.slug}_sample.csv"`);
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csvStr);
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process sample download' });
  }
});

// Download by cached File ID
apiRouter.get('/lead-samples/download/:fileId', (req, res) => {
  const cached = storage.getFile(req.params.fileId);
  if (!cached) {
    return res.status(404).json({ error: 'File not found or session expired.' });
  }
  res.setHeader('Content-Disposition', `attachment; filename="${cached.filename}"`);
  res.setHeader('Content-Type', cached.mimeType);
  res.send(cached.buffer);
});

// Services
apiRouter.get('/services', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// Skills
apiRouter.get('/skills', async (req, res) => {
  try {
    const skills = await db.getSkills();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve skills' });
  }
});

// Experience
apiRouter.get('/experience', async (req, res) => {
  try {
    const exp = await db.getExperience();
    res.json(exp);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve experience' });
  }
});

// Resume
apiRouter.get('/resume', async (req, res) => {
  try {
    const resume = await db.getResume();
    res.json(resume);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve resume' });
  }
});

// Contact Form Submission
apiRouter.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const saved = await db.createMessage({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || '').trim(),
      message: message.trim()
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.', id: saved.id });
  } catch (err: any) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

/* ==========================================================================
   ADMIN AUTHENTICATION
   ========================================================================== */

// Admin Login
apiRouter.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }

    const result = await auth.verifyCredentials(username, password, clientIp);

    if (!result.success || !result.token) {
      return res.status(401).json({ error: result.error || 'Invalid credentials' });
    }

    // Set HTTP-only session cookie
    res.cookie('admin_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token: result.token,
      username: auth.getAdminUsername()
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login process error' });
  }
});

// Admin Logout
apiRouter.post('/admin/logout', (req, res) => {
  const cookieToken = req.cookies?.['admin_session'];
  auth.invalidateToken(cookieToken);
  res.clearCookie('admin_session');
  res.json({ success: true });
});

// Check Session Status
apiRouter.get('/admin/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.['admin_session'];
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  const isValid = auth.validateToken(token);
  if (!isValid) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    username: auth.getAdminUsername(),
    dbProvider: db.getProviderName()
  });
});

// Dashboard Stats
apiRouter.get('/admin/stats', auth.requireAuth, async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

/* ==========================================================================
   ADMIN MANAGEMENT (PROTECTED)
   ========================================================================== */

// Profile Update
apiRouter.put('/admin/profile', auth.requireAuth, async (req, res) => {
  try {
    const updated = await db.updateProfile(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Projects: List All (including drafts)
apiRouter.get('/admin/projects', auth.requireAuth, async (req, res) => {
  try {
    const projects = await db.getProjects(true);
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Projects: Create
apiRouter.post('/admin/projects', auth.requireAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
    const existing = await db.getProjectBySlug(slug, true);
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const project: Project = {
      id: 'proj_' + Date.now(),
      title: body.title,
      slug: finalSlug,
      shortDescription: body.shortDescription || '',
      fullDescription: body.fullDescription || '',
      category: body.category || 'Web Scraping',
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      projectImage: body.projectImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
      githubUrl: body.githubUrl || '',
      liveDemoUrl: body.liveDemoUrl || '',
      features: Array.isArray(body.features) ? body.features : [],
      problem: body.problem || '',
      solution: body.solution || '',
      workflow: body.workflow || '',
      results: body.results || '',
      projectDate: body.projectDate || new Date().toISOString().slice(0, 7),
      featured: Boolean(body.featured),
      status: body.status === 'published' ? 'published' : 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await db.createProject(project);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Projects: Update
apiRouter.put('/admin/projects/:id', auth.requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.title && !updates.slug) {
      updates.slug = slugify(updates.title);
    }
    const updated = await db.updateProject(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Projects: Delete
apiRouter.delete('/admin/projects/:id', auth.requireAuth, async (req, res) => {
  try {
    const success = await db.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Lead Samples: List All (including drafts)
apiRouter.get('/admin/lead-samples', auth.requireAuth, async (req, res) => {
  try {
    const samples = await db.getLeadSamples(true);
    res.json(samples);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch lead samples' });
  }
});

// Lead Samples: CSV / XLSX File Upload & Parsing
apiRouter.post('/admin/lead-samples/upload', auth.requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a .csv or .xlsx file.' });
    }

    const buffer = req.file.buffer;
    const filename = req.file.originalname;
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    const fileType = ext === 'csv' ? 'csv' : 'xlsx';

    // Parse spreadsheet using storage engine
    const parsed = storage.parseSpreadsheet(buffer, filename);
    const fileId = 'file_' + Date.now();
    const downloadUrl = await storage.saveFile(fileId, filename, buffer, req.file.mimetype);

    res.json({
      fileId,
      filename,
      fileType,
      fileSize: req.file.size,
      columns: parsed.columns,
      totalRows: parsed.totalRows,
      previewRows: parsed.previewRows,
      downloadUrl,
      recommendedPublicColumns: parsed.columns.slice(0, Math.min(6, parsed.columns.length))
    });
  } catch (err: any) {
    console.error('File upload/parsing error:', err);
    res.status(400).json({ error: err.message || 'Failed to parse uploaded spreadsheet.' });
  }
});

// Lead Samples: Create
apiRouter.post('/admin/lead-samples', auth.requireAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
    const existing = await db.getLeadSampleBySlug(slug, true);
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const sample: LeadSample = {
      id: 'ls_' + Date.now(),
      title: body.title,
      slug: finalSlug,
      description: body.description || '',
      niche: body.niche || 'General Business',
      location: body.location || 'Global',
      leadCount: Number(body.leadCount) || 0,
      dataFields: Array.isArray(body.dataFields) ? body.dataFields : [],
      source: body.source || 'Public Web Extraction',
      fileType: body.fileType === 'csv' ? 'csv' : 'xlsx',
      fileUrl: body.fileUrl || '',
      originalFilename: body.originalFilename || 'sample_data.csv',
      fileSize: body.fileSize,
      previewRows: Array.isArray(body.previewRows) ? body.previewRows : [],
      publicColumns: Array.isArray(body.publicColumns) ? body.publicColumns : [],
      previewRowCount: Number(body.previewRowCount) || 5,
      featured: Boolean(body.featured),
      downloadEnabled: body.downloadEnabled !== undefined ? Boolean(body.downloadEnabled) : true,
      status: body.status === 'published' ? 'published' : 'draft', // Draft by default unless specified
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await db.createLeadSample(sample);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Create lead sample error:', err);
    res.status(500).json({ error: 'Failed to create lead sample' });
  }
});

// Lead Samples: Update
apiRouter.put('/admin/lead-samples/:id', auth.requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.title && !updates.slug) {
      updates.slug = slugify(updates.title);
    }
    const updated = await db.updateLeadSample(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Lead sample not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update lead sample' });
  }
});

// Lead Samples: Delete
apiRouter.delete('/admin/lead-samples/:id', auth.requireAuth, async (req, res) => {
  try {
    const success = await db.deleteLeadSample(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Lead sample not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete lead sample' });
  }
});

// Services Management
apiRouter.post('/admin/services', auth.requireAuth, async (req, res) => {
  try {
    const service: Service = {
      id: 'srv_' + Date.now(),
      title: req.body.title,
      description: req.body.description || '',
      icon: req.body.icon || 'Target',
      features: Array.isArray(req.body.features) ? req.body.features : [],
      displayOrder: Number(req.body.displayOrder) || 1,
      featured: Boolean(req.body.featured)
    };
    const saved = await db.saveService(service);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save service' });
  }
});

apiRouter.put('/admin/services/:id', auth.requireAuth, async (req, res) => {
  try {
    const service: Service = { ...req.body, id: req.params.id };
    const saved = await db.saveService(service);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

apiRouter.delete('/admin/services/:id', auth.requireAuth, async (req, res) => {
  try {
    await db.deleteService(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Skills Management
apiRouter.post('/admin/skills', auth.requireAuth, async (req, res) => {
  try {
    const skill: Skill = {
      id: 'sk_' + Date.now(),
      name: req.body.name,
      category: req.body.category || 'Core Scraping',
      displayOrder: Number(req.body.displayOrder) || 1,
      level: req.body.level || 'Advanced'
    };
    const saved = await db.saveSkill(skill);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save skill' });
  }
});

apiRouter.put('/admin/skills/:id', auth.requireAuth, async (req, res) => {
  try {
    const skill: Skill = { ...req.body, id: req.params.id };
    const saved = await db.saveSkill(skill);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

apiRouter.delete('/admin/skills/:id', auth.requireAuth, async (req, res) => {
  try {
    await db.deleteSkill(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Experience Management
apiRouter.post('/admin/experience', auth.requireAuth, async (req, res) => {
  try {
    const exp: Experience = {
      id: 'exp_' + Date.now(),
      company: req.body.company,
      position: req.body.position,
      startDate: req.body.startDate,
      endDate: req.body.endDate || 'Present',
      current: Boolean(req.body.current),
      description: req.body.description || '',
      responsibilities: Array.isArray(req.body.responsibilities) ? req.body.responsibilities : [],
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
      displayOrder: Number(req.body.displayOrder) || 1
    };
    const saved = await db.saveExperience(exp);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save experience' });
  }
});

apiRouter.put('/admin/experience/:id', auth.requireAuth, async (req, res) => {
  try {
    const exp: Experience = { ...req.body, id: req.params.id };
    const saved = await db.saveExperience(exp);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

apiRouter.delete('/admin/experience/:id', auth.requireAuth, async (req, res) => {
  try {
    await db.deleteExperience(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Resume Update
apiRouter.put('/admin/resume', auth.requireAuth, async (req, res) => {
  try {
    const updated = await db.updateResume(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Contact Messages Management
apiRouter.get('/admin/messages', auth.requireAuth, async (req, res) => {
  try {
    const messages = await db.getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

apiRouter.patch('/admin/messages/:id/read', auth.requireAuth, async (req, res) => {
  try {
    const { read } = req.body;
    await db.markMessageRead(req.params.id, read !== undefined ? Boolean(read) : true);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

apiRouter.delete('/admin/messages/:id', auth.requireAuth, async (req, res) => {
  try {
    await db.deleteMessage(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
