import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { LeadSamplesPage } from './pages/LeadSamplesPage';
import { LeadSampleDetailPage } from './pages/LeadSampleDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ResumePage } from './pages/ResumePage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { api } from './lib/api';
import type { 
  Profile, 
  Project, 
  LeadSample, 
  Service, 
  Skill, 
  Experience, 
  ResumeData 
} from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Global shared data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leadSamples, setLeadSamples] = useState<LeadSample[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial portfolio content
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.getProfile().catch(() => null),
      api.getProjects().catch(() => []),
      api.getLeadSamples().catch(() => []),
      api.getServices().catch(() => []),
      api.getSkills().catch(() => []),
      api.getExperience().catch(() => []),
      api.getResume().catch(() => null)
    ]).then(([prof, proj, leads, serv, skl, exp, res]) => {
      if (!isMounted) return;
      if (prof) setProfile(prof);
      if (proj) setProjects(proj);
      if (leads) setLeadSamples(leads);
      if (serv) setServices(serv);
      if (skl) setSkills(skl);
      if (exp) setExperience(exp);
      if (res) setResume(res);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin');

  // Router resolution
  const renderRoute = () => {
    // 1. Project Detail: /projects/:slug
    if (currentPath.startsWith('/projects/') && currentPath.length > 10) {
      const slug = currentPath.replace('/projects/', '');
      return <ProjectDetailPage slug={slug} navigate={navigate} />;
    }

    // 2. Lead Sample Detail: /lead-samples/:slug
    if (currentPath.startsWith('/lead-samples/') && currentPath.length > 14) {
      const slug = currentPath.replace('/lead-samples/', '');
      return <LeadSampleDetailPage slug={slug} navigate={navigate} />;
    }

    // 3. Admin routes
    if (isAdminRoute) {
      let subTab = 'dashboard';
      if (currentPath.includes('/projects')) subTab = 'projects';
      else if (currentPath.includes('/lead-samples')) subTab = 'lead-samples';
      else if (currentPath.includes('/services')) subTab = 'services';
      else if (currentPath.includes('/skills')) subTab = 'skills';
      else if (currentPath.includes('/experience')) subTab = 'experience';
      else if (currentPath.includes('/profile')) subTab = 'profile';
      else if (currentPath.includes('/resume')) subTab = 'resume';
      else if (currentPath.includes('/messages')) subTab = 'messages';
      else if (currentPath.includes('/settings')) subTab = 'settings';

      return <AdminDashboardPage navigate={navigate} subTab={subTab} />;
    }

    // 4. Standard public pages
    switch (currentPath) {
      case '/about':
        return <AboutPage profile={profile} navigate={navigate} />;

      case '/projects':
        return <ProjectsPage projects={projects} navigate={navigate} />;

      case '/lead-samples':
        return <LeadSamplesPage leadSamples={leadSamples} navigate={navigate} />;

      case '/services':
        return <ServicesPage services={services} navigate={navigate} />;

      case '/skills':
        return <SkillsPage skills={skills} navigate={navigate} />;

      case '/experience':
        return <ExperiencePage experience={experience} navigate={navigate} />;

      case '/resume':
        return (
          <ResumePage
            profile={profile}
            resume={resume}
            experience={experience}
            projects={projects}
            navigate={navigate}
          />
        );

      case '/contact':
        return <ContactPage profile={profile} />;

      case '/':
      default:
        return (
          <HomePage
            profile={profile}
            projects={projects}
            leadSamples={leadSamples}
            services={services}
            skills={skills}
            experience={experience}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Show Navbar on non-admin routes */}
      {!isAdminRoute && (
        <Navbar currentPath={currentPath} navigate={navigate} />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="text-xs text-zinc-400 font-mono">Initializing portfolio datasets...</p>
            </div>
          </div>
        ) : (
          renderRoute()
        )}
      </main>

      {/* Show Footer on non-admin routes */}
      {!isAdminRoute && (
        <Footer profile={profile} navigate={navigate} />
      )}
    </div>
  );
}
