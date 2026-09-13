import pg from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { Profile, Project, LeadSample, Service, Skill, Experience, ResumeData, ContactMessage } from '../src/types.js';

const { Pool } = pg;

// Check if PostgreSQL connection is provided
const isPostgresConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

let pool: pg.Pool | null = null;
let isConnectedToPostgres = false;

if (isPostgresConfigured) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
    pool = null;
  }
}

// Initial Realistic Seed Data
const initialProfile: Profile = {
  id: 'default',
  fullName: 'Ibrahim Shake Shuvo',
  title: 'B2B Lead Generation & Data Scraping Specialist',
  shortBio: 'I build automated web scrapers, data pipelines, and verify targeted B2B contact lists using Python, Playwright, Selenium, and modern data processing workflows.',
  fullAbout: `I am a dedicated B2B Lead Generation and Web Data Scraping specialist with extensive experience in automated data collection, browser automation, and data hygiene.

My focus is on extracting high-accuracy, structured business data from modern web applications, directories, e-commerce platforms, and public registries. I prioritize data integrity: cleaning invalid emails, normalizing phone numbers, deduplicating records, and delivering ready-to-use CSV/XLSX datasets for sales and marketing outreach.

Whether navigating complex single-page apps with Playwright/Selenium or architecting high-throughput data extraction routines, I deliver reliable, reproducible workflows that save teams hundreds of manual research hours.`,
  location: 'Remote / Global (UTC+6)',
  email: 'ibrahimshakeshuvo6@gmail.com',
  linkedin: 'https://linkedin.com/in/ibrahimshakeshuvo',
  github: 'https://github.com/ibrahimshakeshuvo',
  availabilityStatus: 'Available for Projects',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Google Maps Business Lead Extractor',
    slug: 'google-maps-business-lead-extractor',
    shortDescription: 'Automated Python & Playwright pipeline extracting verified local business data with phone, website, coordinates, and operating hours.',
    fullDescription: 'An automated browser automation pipeline built with Python and Playwright to extract high-fidelity local business information across specific geographic bounding boxes on Google Maps without triggering aggressive CAPTCHA challenges.',
    category: 'Google Maps Lead Generation' as any,
    technologies: ['Python', 'Playwright', 'Pandas', 'Asyncio', 'Geopy'],
    projectImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/ibrahimshakeshuvo/google-maps-lead-extractor',
    liveDemoUrl: '',
    features: [
      'Coordinate-based bounding box grid search for 100% geographic coverage',
      'Dynamic scrolling with lazy-loaded element interceptors',
      'Contact enrichment finding public emails and owner social handles',
      'Automated rate-limiting and rotating user-agent headers',
      'Clean output formatted directly to formatted Excel (.xlsx) and CSV'
    ],
    problem: 'Sales teams targeting local service contractors struggle with manual copy-pasting from Google Maps and incomplete business records.',
    solution: 'Designed an asynchronous Playwright crawler with adaptive wait times that systematically traverses targeted metropolitan grids and outputs structured contact records.',
    workflow: 'Target Coordinates Grid -> Playwright Asynchronous Browser Session -> DOM Extraction & Request Sniffing -> Deduplication via Pandas -> CSV/Excel Export.',
    results: 'Extracted 12,000+ verified roofing, plumbing, and HVAC contractor leads across 15 US states with 98% field completeness.',
    projectDate: '2025-11',
    featured: true,
    status: 'published',
    createdAt: new Date('2025-11-15').toISOString(),
    updatedAt: new Date('2025-11-15').toISOString(),
  },
  {
    id: 'p2',
    title: 'E-Commerce Store & Tech Stack Profiler',
    slug: 'ecommerce-store-tech-stack-profiler',
    shortDescription: 'High-speed web scraper detecting Shopify, WooCommerce, and custom checkout platforms alongside public merchant contact info.',
    fullDescription: 'Custom data extraction script capable of analyzing thousands of domain names, identifying their underlying e-commerce CMS, installed tracking pixels, and extracting decision-maker contact details from public about/contact pages.',
    category: 'Web Scraping',
    technologies: ['Python', 'BeautifulSoup4', 'Requests', 'Wappalyzer API', 'Concurrent.futures'],
    projectImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/ibrahimshakeshuvo/ecommerce-profiler-scraper',
    features: [
      'Multi-threaded domain verification processing 100 domains/minute',
      'Pattern matching for Shopify, Magento, BigCommerce, and WooCommerce footprints',
      'Regex-based email, phone, and social profile parsing across contact pages',
      'Automated HTTP status code validation and redirect tracking'
    ],
    problem: 'B2B SaaS companies selling Shopify plugins need filtered lists of merchants running specific store configurations with verified contact points.',
    solution: 'Built a lightweight asynchronous scanner that inspects script tags, meta headers, and sitemaps to profile web technologies and retrieve business emails.',
    workflow: 'Input Domain List -> Concurrency Pool -> Header/DOM Inspection -> Technology Fingerprinting -> Contact Page Deep Crawl -> Clean Dataset.',
    results: 'Profiled 45,000+ online stores with 89% tech-stack classification accuracy.',
    projectDate: '2025-08',
    featured: true,
    status: 'published',
    createdAt: new Date('2025-08-20').toISOString(),
    updatedAt: new Date('2025-08-20').toISOString(),
  },
  {
    id: 'p3',
    title: 'SeleniumBase Infinite-Scroll Directory Scraper',
    slug: 'seleniumbase-infinite-scroll-directory-scraper',
    shortDescription: 'Resilient web scraper using SeleniumBase UC mode to harvest gated B2B marketplace supplier profiles.',
    fullDescription: 'Engineered a specialized scraper utilizing SeleniumBase with Undetected Chromedriver mode to bypass bot-detection protections on modern heavy JavaScript supplier directories.',
    category: 'Automation',
    technologies: ['Python', 'SeleniumBase', 'Undetected-Chromedriver', 'Pandas', 'XLSXWriter'],
    projectImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/ibrahimshakeshuvo/seleniumbase-b2b-directory-scraper',
    features: [
      'Stealth browser emulation handling Cloudflare Turnstile challenges',
      'Infinite-scroll handling with dynamic viewport height evaluation',
      'Structured JSON-LD schema parsing from page sources',
      'Automatic resume capability if network disconnection occurs'
    ],
    problem: 'The target B2B wholesaler directory relied on dynamic client-side hydration and anti-bot measures that blocked traditional cURL and Requests scripts.',
    solution: 'Deployed SeleniumBase with human-like cursor movements, randomized delays, and headless stealth flags to scrape catalog listings seamlessly.',
    workflow: 'Automated Login -> Stealth Navigation -> Virtual Viewport Scroll -> Schema Extraction -> Data Normalization -> Output Generation.',
    results: 'Harvested 8,500+ industrial equipment suppliers across Europe and North America with zero IP bans.',
    projectDate: '2025-05',
    featured: false,
    status: 'published',
    createdAt: new Date('2025-05-10').toISOString(),
    updatedAt: new Date('2025-05-10').toISOString(),
  }
];

const initialLeadSamples: LeadSample[] = [
  {
    id: 'ls1',
    title: 'US Shopify Fashion & Apparel Brand Leads',
    slug: 'us-shopify-fashion-apparel-brand-leads',
    description: 'Verified direct-to-consumer fashion brands running on Shopify in the United States with contact email, domain, state, and Instagram handles.',
    niche: 'Fashion & Apparel / E-commerce',
    location: 'United States',
    leadCount: 250,
    dataFields: ['Company Name', 'Website', 'Contact Email', 'Phone', 'City', 'State', 'Instagram URL', 'Monthly Traffic Range'],
    source: 'Shopify Store Registry & Public Web Pages',
    fileType: 'xlsx',
    originalFilename: 'US_Shopify_Fashion_Brands_Sample.xlsx',
    publicColumns: ['Company Name', 'Website', 'Contact Email', 'City', 'State', 'Instagram URL'],
    previewRowCount: 6,
    featured: true,
    downloadEnabled: true,
    status: 'published',
    createdAt: new Date('2025-10-01').toISOString(),
    updatedAt: new Date('2025-10-01').toISOString(),
    previewRows: [
      {
        'Company Name': 'Aura Studio Wear',
        'Website': 'https://aurastudiowear.example.com',
        'Contact Email': 'support@aurastudiowear.example.com',
        'Phone': '+1 (415) 555-0192',
        'City': 'San Francisco',
        'State': 'CA',
        'Instagram URL': 'https://instagram.com/aurastudiowear'
      },
      {
        'Company Name': 'Nordic Linen Co.',
        'Website': 'https://nordiclinenco.example.com',
        'Contact Email': 'hello@nordiclinenco.example.com',
        'Phone': '+1 (206) 555-0144',
        'City': 'Seattle',
        'State': 'WA',
        'Instagram URL': 'https://instagram.com/nordiclinenco'
      },
      {
        'Company Name': 'Velvet & Stone Threads',
        'Website': 'https://velvetandstone.example.com',
        'Contact Email': 'info@velvetandstone.example.com',
        'Phone': '+1 (512) 555-0811',
        'City': 'Austin',
        'State': 'TX',
        'Instagram URL': 'https://instagram.com/velvetandstonethreads'
      },
      {
        'Company Name': 'Solstice Activewear',
        'Website': 'https://solsticeactive.example.com',
        'Contact Email': 'contact@solsticeactive.example.com',
        'Phone': '+1 (303) 555-0283',
        'City': 'Denver',
        'State': 'CO',
        'Instagram URL': 'https://instagram.com/solsticeactivewear'
      },
      {
        'Company Name': 'Echo Park Goods',
        'Website': 'https://echoparkgoods.example.com',
        'Contact Email': 'orders@echoparkgoods.example.com',
        'Phone': '+1 (213) 555-0729',
        'City': 'Los Angeles',
        'State': 'CA',
        'Instagram URL': 'https://instagram.com/echoparkgoods'
      },
      {
        'Company Name': 'Hudson Bay Outfitters',
        'Website': 'https://hudsonbayoutfitters.example.com',
        'Contact Email': 'concierge@hudsonbayoutfitters.example.com',
        'Phone': '+1 (212) 555-0371',
        'City': 'New York',
        'State': 'NY',
        'Instagram URL': 'https://instagram.com/hudsonbayoutfitters'
      }
    ]
  },
  {
    id: 'ls2',
    title: 'California Dental Clinics & Orthodontists',
    slug: 'california-dental-clinics-orthodontists',
    description: 'Cleaned Google Maps extraction containing registered dental practitioners, clinic phone numbers, addresses, and review counts across Greater Los Angeles.',
    niche: 'Healthcare / Dental',
    location: 'California, US',
    leadCount: 420,
    dataFields: ['Practice Name', 'Website', 'Office Phone', 'Address', 'City', 'Google Rating', 'Total Reviews'],
    source: 'Google Maps Business Directory',
    fileType: 'csv',
    originalFilename: 'California_Dental_Offices_Sample.csv',
    publicColumns: ['Practice Name', 'Website', 'Office Phone', 'City', 'Google Rating', 'Total Reviews'],
    previewRowCount: 5,
    featured: true,
    downloadEnabled: true,
    status: 'published',
    createdAt: new Date('2025-09-18').toISOString(),
    updatedAt: new Date('2025-09-18').toISOString(),
    previewRows: [
      {
        'Practice Name': 'Pacific Coast Smiles Dental',
        'Website': 'https://pacificcoastsmiles.example.com',
        'Office Phone': '+1 (310) 555-0482',
        'City': 'Santa Monica',
        'Google Rating': '4.9',
        'Total Reviews': '184'
      },
      {
        'Practice Name': 'Beverly Hills Modern Orthodontics',
        'Website': 'https://bhmodernortho.example.com',
        'Office Phone': '+1 (323) 555-0931',
        'City': 'Beverly Hills',
        'Google Rating': '4.8',
        'Total Reviews': '210'
      },
      {
        'Practice Name': 'Golden State Family Dentistry',
        'Website': 'https://goldenstatedental.example.com',
        'Office Phone': '+1 (626) 555-0715',
        'City': 'Pasadena',
        'Google Rating': '4.7',
        'Total Reviews': '96'
      },
      {
        'Practice Name': 'Orange County Pediatric Dental Care',
        'Website': 'https://ocpediatricdentistry.example.com',
        'Office Phone': '+1 (949) 555-0322',
        'City': 'Irvine',
        'Google Rating': '5.0',
        'Total Reviews': '142'
      },
      {
        'Practice Name': 'South Bay Gentle Dental',
        'Website': 'https://southbaygentledental.example.com',
        'Office Phone': '+1 (310) 555-0867',
        'City': 'Torrance',
        'Google Rating': '4.8',
        'Total Reviews': '119'
      }
    ]
  },
  {
    id: 'ls3',
    title: 'UK B2B Logistics & Freight Forwarders',
    slug: 'uk-b2b-logistics-freight-forwarders',
    description: 'Companies House registered transport and warehouse operators across London, Birmingham, and Manchester with verified commercial contact details.',
    niche: 'Supply Chain & Logistics',
    location: 'United Kingdom',
    leadCount: 180,
    dataFields: ['Company Name', 'Company Number', 'Website', 'Contact Email', 'Phone', 'Postcode', 'Head Office City'],
    source: 'Companies House & Industry Portals',
    fileType: 'xlsx',
    originalFilename: 'UK_Freight_Logistics_Sample.xlsx',
    publicColumns: ['Company Name', 'Website', 'Contact Email', 'Phone', 'Head Office City'],
    previewRowCount: 5,
    featured: false,
    downloadEnabled: true,
    status: 'published',
    createdAt: new Date('2025-08-05').toISOString(),
    updatedAt: new Date('2025-08-05').toISOString(),
    previewRows: [
      {
        'Company Name': 'Apex Global Cargo Ltd',
        'Website': 'https://apexgloballogistics.example.co.uk',
        'Contact Email': 'freight@apexgloballogistics.example.co.uk',
        'Phone': '+44 20 7946 0912',
        'Head Office City': 'London'
      },
      {
        'Company Name': 'Mersey Warehousing Solutions',
        'Website': 'https://merseywarehousing.example.co.uk',
        'Contact Email': 'enquiries@merseywarehousing.example.co.uk',
        'Phone': '+44 151 496 0341',
        'Head Office City': 'Liverpool'
      },
      {
        'Company Name': 'Midlands Express Haulage',
        'Website': 'https://midlandsexpress.example.co.uk',
        'Contact Email': 'dispatch@midlandsexpress.example.co.uk',
        'Phone': '+44 121 496 0885',
        'Head Office City': 'Birmingham'
      },
      {
        'Company Name': 'Caledonia Freight Services',
        'Website': 'https://caledoniafreight.example.co.uk',
        'Contact Email': 'quotes@caledoniafreight.example.co.uk',
        'Phone': '+44 141 496 0229',
        'Head Office City': 'Glasgow'
      },
      {
        'Company Name': 'Thames Valley Distribution',
        'Website': 'https://thamesvalleydist.example.co.uk',
        'Contact Email': 'operations@thamesvalleydist.example.co.uk',
        'Phone': '+44 118 496 0673',
        'Head Office City': 'Reading'
      }
    ]
  }
];

const initialServices: Service[] = [
  {
    id: 's1',
    title: 'B2B Lead Generation',
    description: 'Targeted business contact lists filtered by geography, industry niche, job title, and verified company parameters for outreach.',
    icon: 'Target',
    features: [
      'Ideal Customer Profile (ICP) alignment',
      'Multi-source contact cross-referencing',
      'Zero-bounce email verification filters',
      'Delivered in structured Excel/CSV formats'
    ],
    displayOrder: 1,
    featured: true
  },
  {
    id: 's2',
    title: 'Web Data Scraping & Extraction',
    description: 'Custom automated scripts to harvest raw structured data from e-commerce catalogs, business portals, and publicly available web registries.',
    icon: 'Database',
    features: [
      'Bypass complex pagination and dynamic feeds',
      'Extract nested specifications and pricing',
      'HTML and API response parsing',
      'Scheduled automated delivery options'
    ],
    displayOrder: 2,
    featured: true
  },
  {
    id: 's3',
    title: 'Google Maps Lead Generation',
    description: 'Deep geographic data collection capturing business name, full address, direct phone number, rating, reviews, and website URL.',
    icon: 'MapPin',
    features: [
      'Bounding box grid search for maximum coverage',
      'Deduplicated local contractor and store lists',
      'Website email discovery integration',
      'Coordinates and operating hours mapping'
    ],
    displayOrder: 3,
    featured: true
  },
  {
    id: 's4',
    title: 'Data Cleaning & Hygiene',
    description: 'Transforming messy, incomplete raw web datasets into standardized, error-free spreadsheets ready for CRM import.',
    icon: 'CheckCircle',
    features: [
      'Phone number standardization (E.164 format)',
      'Syntax and MX record email validation',
      'Removal of duplicate records and casing normalization',
      'Splitting names into First/Last fields accurately'
    ],
    displayOrder: 4,
    featured: false
  },
  {
    id: 's5',
    title: 'Browser Automation (Playwright / Selenium)',
    description: 'Reliable headless scripts navigating dynamic single-page applications, handling infinite scrolling, and form interactions.',
    icon: 'Cpu',
    features: [
      'Playwright and SeleniumBase Python scripts',
      'Simulated human actions and delay randomized patterns',
      'Automated file downloads and report generation',
      'Headless browser execution on cloud instances'
    ],
    displayOrder: 5,
    featured: true
  },
  {
    id: 's6',
    title: 'QA & Test Automation',
    description: 'End-to-end automated UI test scripts ensuring website forms, navigations, and web flows operate predictably.',
    icon: 'ShieldCheck',
    features: [
      'Automated smoke and regression test suites',
      'Detailed test execution logs and failure screenshots',
      'Cross-browser compatibility validation',
      'Continuous integration (CI) script maintenance'
    ],
    displayOrder: 6,
    featured: false
  }
];

const initialSkills: Skill[] = [
  { id: 'sk1', name: 'Python', category: 'Core Scraping', displayOrder: 1, level: 'Advanced' },
  { id: 'sk2', name: 'Web Scraping', category: 'Core Scraping', displayOrder: 2, level: 'Advanced' },
  { id: 'sk3', name: 'B2B Lead Generation', category: 'Core Scraping', displayOrder: 3, level: 'Expert' },
  { id: 'sk4', name: 'Google Maps Scraping', category: 'Core Scraping', displayOrder: 4, level: 'Expert' },
  { id: 'sk5', name: 'Playwright', category: 'Browser Automation', displayOrder: 5, level: 'Advanced' },
  { id: 'sk6', name: 'Selenium & SeleniumBase', category: 'Browser Automation', displayOrder: 6, level: 'Advanced' },
  { id: 'sk7', name: 'BeautifulSoup4 & lxml', category: 'Core Scraping', displayOrder: 7, level: 'Advanced' },
  { id: 'sk8', name: 'Pandas', category: 'Data Processing', displayOrder: 8, level: 'Advanced' },
  { id: 'sk9', name: 'Excel / CSV Processing', category: 'Data Processing', displayOrder: 9, level: 'Expert' },
  { id: 'sk10', name: 'Data Cleaning & Hygiene', category: 'Data Processing', displayOrder: 10, level: 'Expert' },
  { id: 'sk11', name: 'SQL & PostgreSQL', category: 'Data Processing', displayOrder: 11, level: 'Intermediate' },
  { id: 'sk12', name: 'Git & GitHub Actions', category: 'Testing & Tools', displayOrder: 12, level: 'Intermediate' },
  { id: 'sk13', name: 'QA / Test Automation', category: 'Testing & Tools', displayOrder: 13, level: 'Intermediate' },
  { id: 'sk14', name: 'HTML & CSS Selectors', category: 'Web Tech', displayOrder: 14, level: 'Advanced' },
  { id: 'sk15', name: 'JavaScript & JSON-LD Parsing', category: 'Web Tech', displayOrder: 15, level: 'Intermediate' },
];

const initialExperience: Experience[] = [
  {
    id: 'exp1',
    company: 'Independent Data Consultant & Specialist',
    position: 'Lead Generation & Web Scraping Specialist',
    startDate: '2023-01',
    endDate: 'Present',
    current: true,
    description: 'Providing bespoke B2B lead generation, directory scraping, and automated data processing solutions for international agencies, sales teams, and SaaS founders.',
    responsibilities: [
      'Constructed robust Python scraping pipelines with Playwright and SeleniumBase handling anti-bot measures',
      'Engineered automated Google Maps extraction scripts generating geo-targeted business databases',
      'Standardized, cleaned, and verified 200,000+ business leads with high accuracy rates',
      'Delivered clean, deduplicated datasets formatted for direct HubSpot, Apollo, and Salesforce import'
    ],
    technologies: ['Python', 'Playwright', 'SeleniumBase', 'Pandas', 'PostgreSQL', 'Excel'],
    displayOrder: 1
  },
  {
    id: 'exp2',
    company: 'Digital Growth Agency',
    position: 'Data Research & Automation Associate',
    startDate: '2021-06',
    endDate: '2022-12',
    current: false,
    description: 'Led research workflows and built custom scrapers to gather competitive intelligence and targeted prospect lists for outbound cold email campaigns.',
    responsibilities: [
      'Automated daily extraction of e-commerce brand data and verified contact endpoints',
      'Built automated QA regression scripts to ensure internal scraper health',
      'Reduced list-building delivery turnaround time by 65% through Python automation scripts'
    ],
    technologies: ['Python', 'BeautifulSoup4', 'Requests', 'Excel/CSV', 'Regex'],
    displayOrder: 2
  }
];

const initialResume: ResumeData = {
  id: 'default',
  summary: 'Detail-oriented B2B Lead Generation & Web Scraping Specialist with expertise in Python, Playwright, Selenium, and data cleaning. Proven track record of architecting scalable scraping workflows and delivering verified, high-converting B2B prospect lists.',
  education: [
    {
      institution: 'State University',
      degree: 'Bachelor of Science in Computer Science / Information Technology',
      year: 'Graduated',
      details: 'Focus on algorithms, database management, and web programming'
    }
  ],
  certifications: [
    'Python for Data Science & Automation',
    'Playwright End-to-End Automation Specialist',
    'Advanced Web Scraping & Anti-Bot Navigation'
  ],
  pdfUrl: '',
  updatedAt: new Date().toISOString()
};

// In-Memory / File Fallback Store
class MemoryStore {
  profile: Profile = { ...initialProfile };
  projects: Project[] = [...initialProjects];
  leadSamples: LeadSample[] = [...initialLeadSamples];
  services: Service[] = [...initialServices];
  skills: Skill[] = [...initialSkills];
  experience: Experience[] = [...initialExperience];
  resume: ResumeData = { ...initialResume };
  messages: ContactMessage[] = [
    {
      id: 'm1',
      name: 'Marcus Vance',
      email: 'marcus@growthscale.agency',
      subject: 'Inquiry: US B2B SaaS Founders Lead List',
      message: 'Hello Ibrahim, looking for someone to scrape 2,500 verified US-based SaaS company founders with LinkedIn URLs and active business emails. Would love to discuss timeline and sample data.',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
  adminAuth = {
    username: 'ibrahim@07',
    passwordHash: bcrypt.hashSync('ibrahim@07', 10),
    updatedAt: new Date().toISOString()
  };
}

const memoryStore = new MemoryStore();

// Initialize Postgres Schema if pool exists
export async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!pool && dbUrl) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 7000,
      });
      console.log('Database: Initialized PostgreSQL pool from DATABASE_URL.');
    } catch (err) {
      console.error('Failed to create PostgreSQL pool from DATABASE_URL:', err);
      pool = null;
    }
  }

  if (!pool) {
    console.log('Database: Running in Fast In-Memory Fallback Mode (Set DATABASE_URL for Postgres)');
    isConnectedToPostgres = false;
    return;
  }

  try {
    const client = await pool.connect();
    isConnectedToPostgres = true;
    console.log('Database: Successfully connected to PostgreSQL.');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_profile (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        data JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lead_samples (
        id VARCHAR(50) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        niche VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        lead_count INTEGER DEFAULT 0,
        data JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        data JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS skills (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        data JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS experience (
        id VARCHAR(50) PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        data JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS resume_data (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_auth (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed if empty
    const checkProfile = await client.query(`SELECT COUNT(*) FROM site_profile`);
    if (parseInt(checkProfile.rows[0].count) === 0) {
      await client.query(`INSERT INTO site_profile (id, data) VALUES ($1, $2)`, ['default', JSON.stringify(initialProfile)]);
    } else {
      // Auto-correct initial typo if present
      const profRes = await client.query(`SELECT data FROM site_profile WHERE id = 'default'`);
      if (profRes.rows[0] && profRes.rows[0].data?.fullName === 'Ibrahim Shakes Huvo') {
        const fixedData = { ...profRes.rows[0].data, fullName: 'Ibrahim Shake Shuvo' };
        await client.query(`UPDATE site_profile SET data = $1 WHERE id = 'default'`, [JSON.stringify(fixedData)]);
      }
    }

    const checkProjects = await client.query(`SELECT COUNT(*) FROM projects`);
    if (parseInt(checkProjects.rows[0].count) === 0) {
      for (const p of initialProjects) {
        await client.query(
          `INSERT INTO projects (id, slug, title, category, status, featured, data) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [p.id, p.slug, p.title, p.category, p.status, p.featured, JSON.stringify(p)]
        );
      }
    }

    const checkLeadSamples = await client.query(`SELECT COUNT(*) FROM lead_samples`);
    if (parseInt(checkLeadSamples.rows[0].count) === 0) {
      for (const ls of initialLeadSamples) {
        await client.query(
          `INSERT INTO lead_samples (id, slug, title, niche, location, lead_count, status, featured, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [ls.id, ls.slug, ls.title, ls.niche, ls.location, ls.leadCount, ls.status, ls.featured, JSON.stringify(ls)]
        );
      }
    }

    const checkServices = await client.query(`SELECT COUNT(*) FROM services`);
    if (parseInt(checkServices.rows[0].count) === 0) {
      for (const s of initialServices) {
        await client.query(`INSERT INTO services (id, title, display_order, data) VALUES ($1, $2, $3, $4)`, [s.id, s.title, s.displayOrder, JSON.stringify(s)]);
      }
    }

    const checkSkills = await client.query(`SELECT COUNT(*) FROM skills`);
    if (parseInt(checkSkills.rows[0].count) === 0) {
      for (const sk of initialSkills) {
        await client.query(`INSERT INTO skills (id, name, category, display_order, data) VALUES ($1, $2, $3, $4, $5)`, [sk.id, sk.name, sk.category, sk.displayOrder, JSON.stringify(sk)]);
      }
    }

    const checkExp = await client.query(`SELECT COUNT(*) FROM experience`);
    if (parseInt(checkExp.rows[0].count) === 0) {
      for (const exp of initialExperience) {
        await client.query(`INSERT INTO experience (id, company, display_order, data) VALUES ($1, $2, $3, $4)`, [exp.id, exp.company, exp.displayOrder, JSON.stringify(exp)]);
      }
    }

    const checkResume = await client.query(`SELECT COUNT(*) FROM resume_data`);
    if (parseInt(checkResume.rows[0].count) === 0) {
      await client.query(`INSERT INTO resume_data (id, data) VALUES ($1, $2)`, ['default', JSON.stringify(initialResume)]);
    }

    const checkAdminAuth = await client.query(`SELECT COUNT(*) FROM admin_auth`);
    const ibrahimHash = bcrypt.hashSync('ibrahim@07', 10);
    if (parseInt(checkAdminAuth.rows[0].count) === 0) {
      await client.query(
        `INSERT INTO admin_auth (id, username, password_hash) VALUES ($1, $2, $3)`,
        ['default', 'ibrahim@07', ibrahimHash]
      );
    } else {
      // If still set to default 'admin', update to 'ibrahim@07'
      const authRow = await client.query(`SELECT username FROM admin_auth WHERE id = 'default'`);
      if (authRow.rows[0] && authRow.rows[0].username === 'admin') {
        await client.query(
          `UPDATE admin_auth SET username = $1, password_hash = $2, updated_at = NOW() WHERE id = 'default'`,
          ['ibrahim@07', ibrahimHash]
        );
      }
    }

    client.release();
    console.log('Database: PostgreSQL tables verified and initial seed loaded.');
  } catch (err) {
    console.error('Database connection error. Falling back to local storage:', err);
    isConnectedToPostgres = false;
  }
}

// Data Access Layer (Clean Interface)
export const db = {
  isPostgres: () => isConnectedToPostgres,
  getProviderName: () => (isConnectedToPostgres ? 'PostgreSQL (Connected)' : 'Local High-Performance Store'),

  // PROFILE
  getProfile: async (): Promise<Profile> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM site_profile WHERE id = 'default'`);
      if (res.rows[0]) return res.rows[0].data;
    }
    return memoryStore.profile;
  },
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    if (isConnectedToPostgres && pool) {
      const current = await db.getProfile();
      const updated = { ...current, ...data };
      await pool.query(
        `INSERT INTO site_profile (id, data, updated_at) VALUES ('default', $1, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()`,
        [JSON.stringify(updated)]
      );
      return updated;
    }
    memoryStore.profile = { ...memoryStore.profile, ...data };
    return memoryStore.profile;
  },

  // PROJECTS
  getProjects: async (includeDrafts = false): Promise<Project[]> => {
    if (isConnectedToPostgres && pool) {
      const query = includeDrafts 
        ? `SELECT data FROM projects ORDER BY created_at DESC`
        : `SELECT data FROM projects WHERE status = 'published' ORDER BY created_at DESC`;
      const res = await pool.query(query);
      return res.rows.map(r => r.data);
    }
    return memoryStore.projects
      .filter(p => includeDrafts || p.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getProjectBySlug: async (slug: string, includeDrafts = false): Promise<Project | null> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM projects WHERE slug = $1`, [slug]);
      if (!res.rows[0]) return null;
      const project: Project = res.rows[0].data;
      if (!includeDrafts && project.status !== 'published') return null;
      return project;
    }
    const p = memoryStore.projects.find(item => item.slug === slug);
    if (!p) return null;
    if (!includeDrafts && p.status !== 'published') return null;
    return p;
  },
  createProject: async (project: Project): Promise<Project> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO projects (id, slug, title, category, status, featured, data) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [project.id, project.slug, project.title, project.category, project.status, project.featured, JSON.stringify(project)]
      );
      return project;
    }
    memoryStore.projects.unshift(project);
    return project;
  },
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM projects WHERE id = $1`, [id]);
      if (!res.rows[0]) return null;
      const updated: Project = { ...res.rows[0].data, ...updates, updatedAt: new Date().toISOString() };
      await pool.query(
        `UPDATE projects SET slug = $1, title = $2, category = $3, status = $4, featured = $5, data = $6, updated_at = NOW() WHERE id = $7`,
        [updated.slug, updated.title, updated.category, updated.status, updated.featured, JSON.stringify(updated), id]
      );
      return updated;
    }
    const idx = memoryStore.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    memoryStore.projects[idx] = { ...memoryStore.projects[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryStore.projects[idx];
  },
  deleteProject: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const initialLen = memoryStore.projects.length;
    memoryStore.projects = memoryStore.projects.filter(p => p.id !== id);
    return memoryStore.projects.length < initialLen;
  },

  // LEAD SAMPLES
  getLeadSamples: async (includeDrafts = false): Promise<LeadSample[]> => {
    if (isConnectedToPostgres && pool) {
      const query = includeDrafts
        ? `SELECT data FROM lead_samples ORDER BY created_at DESC`
        : `SELECT data FROM lead_samples WHERE status = 'published' ORDER BY created_at DESC`;
      const res = await pool.query(query);
      return res.rows.map(r => r.data);
    }
    return memoryStore.leadSamples
      .filter(ls => includeDrafts || ls.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getLeadSampleBySlug: async (slug: string, includeDrafts = false): Promise<LeadSample | null> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM lead_samples WHERE slug = $1`, [slug]);
      if (!res.rows[0]) return null;
      const sample: LeadSample = res.rows[0].data;
      if (!includeDrafts && sample.status !== 'published') return null;
      return sample;
    }
    const s = memoryStore.leadSamples.find(item => item.slug === slug);
    if (!s) return null;
    if (!includeDrafts && s.status !== 'published') return null;
    return s;
  },
  createLeadSample: async (sample: LeadSample): Promise<LeadSample> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO lead_samples (id, slug, title, niche, location, lead_count, status, featured, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [sample.id, sample.slug, sample.title, sample.niche, sample.location, sample.leadCount, sample.status, sample.featured, JSON.stringify(sample)]
      );
      return sample;
    }
    memoryStore.leadSamples.unshift(sample);
    return sample;
  },
  updateLeadSample: async (id: string, updates: Partial<LeadSample>): Promise<LeadSample | null> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM lead_samples WHERE id = $1`, [id]);
      if (!res.rows[0]) return null;
      const updated: LeadSample = { ...res.rows[0].data, ...updates, updatedAt: new Date().toISOString() };
      await pool.query(
        `UPDATE lead_samples SET slug = $1, title = $2, niche = $3, location = $4, lead_count = $5, status = $6, featured = $7, data = $8, updated_at = NOW() WHERE id = $9`,
        [updated.slug, updated.title, updated.niche, updated.location, updated.leadCount, updated.status, updated.featured, JSON.stringify(updated), id]
      );
      return updated;
    }
    const idx = memoryStore.leadSamples.findIndex(s => s.id === id);
    if (idx === -1) return null;
    memoryStore.leadSamples[idx] = { ...memoryStore.leadSamples[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryStore.leadSamples[idx];
  },
  deleteLeadSample: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM lead_samples WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const initialLen = memoryStore.leadSamples.length;
    memoryStore.leadSamples = memoryStore.leadSamples.filter(s => s.id !== id);
    return memoryStore.leadSamples.length < initialLen;
  },

  // SERVICES
  getServices: async (): Promise<Service[]> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM services ORDER BY display_order ASC`);
      return res.rows.map(r => r.data);
    }
    return [...memoryStore.services].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  saveService: async (service: Service): Promise<Service> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO services (id, title, display_order, data) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET title = $2, display_order = $3, data = $4`,
        [service.id, service.title, service.displayOrder, JSON.stringify(service)]
      );
      return service;
    }
    const idx = memoryStore.services.findIndex(s => s.id === service.id);
    if (idx >= 0) memoryStore.services[idx] = service;
    else memoryStore.services.push(service);
    return service;
  },
  deleteService: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM services WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const len = memoryStore.services.length;
    memoryStore.services = memoryStore.services.filter(s => s.id !== id);
    return memoryStore.services.length < len;
  },

  // SKILLS
  getSkills: async (): Promise<Skill[]> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM skills ORDER BY display_order ASC`);
      return res.rows.map(r => r.data);
    }
    return [...memoryStore.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  saveSkill: async (skill: Skill): Promise<Skill> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO skills (id, name, category, display_order, data) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET name = $2, category = $3, display_order = $4, data = $5`,
        [skill.id, skill.name, skill.category, skill.displayOrder, JSON.stringify(skill)]
      );
      return skill;
    }
    const idx = memoryStore.skills.findIndex(s => s.id === skill.id);
    if (idx >= 0) memoryStore.skills[idx] = skill;
    else memoryStore.skills.push(skill);
    return skill;
  },
  deleteSkill: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM skills WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const len = memoryStore.skills.length;
    memoryStore.skills = memoryStore.skills.filter(s => s.id !== id);
    return memoryStore.skills.length < len;
  },

  // EXPERIENCE
  getExperience: async (): Promise<Experience[]> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM experience ORDER BY display_order ASC`);
      return res.rows.map(r => r.data);
    }
    return [...memoryStore.experience].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  saveExperience: async (exp: Experience): Promise<Experience> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO experience (id, company, display_order, data) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET company = $2, display_order = $3, data = $4`,
        [exp.id, exp.company, exp.displayOrder, JSON.stringify(exp)]
      );
      return exp;
    }
    const idx = memoryStore.experience.findIndex(e => e.id === exp.id);
    if (idx >= 0) memoryStore.experience[idx] = exp;
    else memoryStore.experience.push(exp);
    return exp;
  },
  deleteExperience: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM experience WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const len = memoryStore.experience.length;
    memoryStore.experience = memoryStore.experience.filter(e => e.id !== id);
    return memoryStore.experience.length < len;
  },

  // RESUME
  getResume: async (): Promise<ResumeData> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT data FROM resume_data WHERE id = 'default'`);
      if (res.rows[0]) return res.rows[0].data;
    }
    return memoryStore.resume;
  },
  updateResume: async (data: Partial<ResumeData>): Promise<ResumeData> => {
    if (isConnectedToPostgres && pool) {
      const current = await db.getResume();
      const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
      await pool.query(
        `INSERT INTO resume_data (id, data, updated_at) VALUES ('default', $1, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()`,
        [JSON.stringify(updated)]
      );
      return updated;
    }
    memoryStore.resume = { ...memoryStore.resume, ...data, updatedAt: new Date().toISOString() };
    return memoryStore.resume;
  },

  // CONTACT MESSAGES
  getMessages: async (): Promise<ContactMessage[]> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        subject: r.subject || '',
        message: r.message,
        read: r.read,
        createdAt: r.created_at
      }));
    }
    return [...memoryStore.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createMessage: async (msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> => {
    const fullMsg: ContactMessage = {
      id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 7),
      name: msg.name,
      email: msg.email,
      subject: msg.subject || 'Website Inquiry',
      message: msg.message,
      read: false,
      createdAt: new Date().toISOString()
    };
    if (isConnectedToPostgres && pool) {
      await pool.query(
        `INSERT INTO contact_messages (id, name, email, subject, message, read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [fullMsg.id, fullMsg.name, fullMsg.email, fullMsg.subject, fullMsg.message, fullMsg.read, fullMsg.createdAt]
      );
      return fullMsg;
    }
    memoryStore.messages.unshift(fullMsg);
    return fullMsg;
  },
  markMessageRead: async (id: string, read = true): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      await pool.query(`UPDATE contact_messages SET read = $1 WHERE id = $2`, [read, id]);
      return true;
    }
    const msg = memoryStore.messages.find(m => m.id === id);
    if (msg) {
      msg.read = read;
      return true;
    }
    return false;
  },
  deleteMessage: async (id: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      const res = await pool.query(`DELETE FROM contact_messages WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    }
    const len = memoryStore.messages.length;
    memoryStore.messages = memoryStore.messages.filter(m => m.id !== id);
    return memoryStore.messages.length < len;
  },

  // STATS
  getStats: async () => {
    const allProjects = await db.getProjects(true);
    const allSamples = await db.getLeadSamples(true);
    const allMessages = await db.getMessages();

    return {
      totalProjects: allProjects.length,
      publishedProjects: allProjects.filter(p => p.status === 'published').length,
      draftProjects: allProjects.filter(p => p.status === 'draft').length,
      totalLeadSamples: allSamples.length,
      publishedLeadSamples: allSamples.filter(s => s.status === 'published').length,
      draftLeadSamples: allSamples.filter(s => s.status === 'draft').length,
      totalMessages: allMessages.length,
      unreadMessages: allMessages.filter(m => !m.read).length,
      dbConnected: isConnectedToPostgres,
      dbProvider: db.getProviderName()
    };
  },

  // ADMIN CREDENTIALS
  getAdminAuth: async (): Promise<{ username: string; passwordHash: string }> => {
    if (isConnectedToPostgres && pool) {
      try {
        const res = await pool.query(`SELECT username, password_hash FROM admin_auth WHERE id = 'default'`);
        if (res.rows[0]) {
          return {
            username: res.rows[0].username,
            passwordHash: res.rows[0].password_hash
          };
        }
      } catch (e) {
        console.error('Error fetching admin auth from postgres:', e);
      }
    }
    return {
      username: memoryStore.adminAuth.username,
      passwordHash: memoryStore.adminAuth.passwordHash
    };
  },
  updateAdminAuth: async (username: string, passwordHash: string): Promise<boolean> => {
    if (isConnectedToPostgres && pool) {
      try {
        await pool.query(
          `INSERT INTO admin_auth (id, username, password_hash, updated_at) VALUES ('default', $1, $2, NOW())
           ON CONFLICT (id) DO UPDATE SET username = $1, password_hash = $2, updated_at = NOW()`,
          [username, passwordHash]
        );
      } catch (e) {
        console.error('Error updating admin auth in postgres:', e);
      }
    }
    memoryStore.adminAuth = {
      username,
      passwordHash,
      updatedAt: new Date().toISOString()
    };
    return true;
  },

  // DATABASE BACKUP & RESTORE
  exportFullDatabase: async () => {
    const profile = await db.getProfile();
    const projects = await db.getProjects(true);
    const leadSamples = await db.getLeadSamples(true);
    const services = await db.getServices();
    const skills = await db.getSkills();
    const experiences = await db.getExperience();
    const resume = await db.getResume();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      projects,
      leadSamples,
      services,
      skills,
      experiences,
      resume
    };
  },

  importFullDatabase: async (data: any) => {
    if (data.profile) {
      await db.updateProfile(data.profile);
    }
    if (Array.isArray(data.projects)) {
      const allProjects = await db.getProjects(true);
      for (const p of data.projects) {
        const existing = allProjects.find(item => item.id === p.id);
        if (existing) {
          await db.updateProject(p.id, p);
        } else {
          await db.createProject(p);
        }
      }
    }
    if (Array.isArray(data.leadSamples)) {
      const allSamples = await db.getLeadSamples(true);
      for (const ls of data.leadSamples) {
        const existing = allSamples.find(item => item.id === ls.id);
        if (existing) {
          await db.updateLeadSample(ls.id, ls);
        } else {
          await db.createLeadSample(ls);
        }
      }
    }
    if (Array.isArray(data.services)) {
      for (const s of data.services) {
        await db.saveService(s);
      }
    }
    if (Array.isArray(data.skills)) {
      for (const sk of data.skills) {
        await db.saveSkill(sk);
      }
    }
    if (Array.isArray(data.experiences)) {
      for (const exp of data.experiences) {
        await db.saveExperience(exp);
      }
    }
    if (data.resume) {
      await db.updateResume(data.resume);
    }
    return true;
  },

  connectCustomDatabase: async (connectionString: string) => {
    try {
      const testPool = new Pool({
        connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 7000
      });
      const client = await testPool.connect();
      client.release();
      pool = testPool;
      isConnectedToPostgres = true;
      process.env.DATABASE_URL = connectionString;
      await initDatabase();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to database' };
    }
  }
};
