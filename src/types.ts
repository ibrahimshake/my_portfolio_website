export interface Profile {
  id: string;
  fullName: string;
  title: string;
  shortBio: string;
  fullAbout: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  twitter?: string;
  availabilityStatus: 'Available for Projects' | 'Partially Available' | 'Booked';
  avatarUrl: string;
}

export type ProjectCategory = 
  | 'B2B Lead Generation'
  | 'Web Scraping'
  | 'Data Extraction'
  | 'Automation'
  | 'QA Automation'
  | 'Data Processing';

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory;
  technologies: string[];
  projectImage: string;
  githubUrl: string;
  liveDemoUrl?: string;
  features: string[];
  problem: string;
  solution: string;
  workflow: string;
  results?: string;
  projectDate: string;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface LeadSample {
  id: string;
  title: string;
  slug: string;
  description: string;
  niche: string;
  location: string;
  leadCount: number;
  dataFields: string[];
  source: string;
  fileType: 'csv' | 'xlsx';
  fileUrl?: string;
  originalFilename: string;
  fileSize?: number;
  previewRows: Record<string, any>[];
  publicColumns: string[];
  previewRowCount: number;
  featured: boolean;
  downloadEnabled: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  displayOrder: number;
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Core Scraping' | 'Browser Automation' | 'Data Processing' | 'Testing & Tools' | 'Web Tech';
  displayOrder: number;
  level?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  displayOrder: number;
}

export interface ResumeData {
  id: string;
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    details?: string;
  }>;
  certifications: string[];
  pdfUrl?: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalLeadSamples: number;
  publishedLeadSamples: number;
  draftLeadSamples: number;
  totalMessages: number;
  unreadMessages: number;
  dbConnected: boolean;
  dbProvider: string;
}
