import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  User, 
  Send, 
  Briefcase, 
  FileText, 
  Lock, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import type { Profile } from '../types';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  isAdminLoggedIn?: boolean;
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, isAdminLoggedIn, profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Lead Samples', path: '/lead-samples', highlight: true },
    { label: 'Services', path: '/services' },
    { label: 'Skills', path: '/skills' },
    { label: 'Experience', path: '/experience' },
    { label: 'Resume', path: '/resume' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const displayName = profile?.fullName || 'Ibrahim Shake Shuvo';
  const displayTitle = profile?.title || 'B2B Lead Gen & Scraping';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <button 
          onClick={() => handleNav('/')}
          className="group flex items-center gap-2.5 text-left transition-all cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 group-hover:border-emerald-500/60 group-hover:bg-emerald-900/40 transition-colors shrink-0">
            <Database className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold tracking-tight text-zinc-100 block truncate max-w-[170px] sm:max-w-[240px]">
              {displayName}
            </span>
            <span className="text-[11px] font-mono tracking-wide text-emerald-400 block -mt-0.5 truncate max-w-[170px] sm:max-w-[240px]">
              {displayTitle}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-emerald-400 bg-zinc-900 font-semibold'
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/60'
                } ${link.highlight ? 'border border-emerald-500/30 text-emerald-300' : ''}`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <button
              onClick={() => handleNav('/admin/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 rounded-lg hover:bg-emerald-900/50 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Admin CMS</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/admin/login')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Admin CMS Login"
            >
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => handleNav('/contact')}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm shadow-emerald-900/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Hire Me</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex xl:hidden items-center gap-2">
          {isAdminLoggedIn && (
            <button
              onClick={() => handleNav('/admin/dashboard')}
              className="p-1.5 text-emerald-400 bg-emerald-950/60 rounded-md border border-emerald-500/40 text-xs"
            >
              CMS
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-zinc-800 bg-zinc-950/98 px-4 pt-2 pb-6 space-y-1">
          <div className="grid grid-cols-2 gap-1 pb-3 mb-3 border-b border-zinc-900">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-emerald-400 bg-zinc-900 font-semibold'
                      : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => handleNav('/contact')}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              Contact Specialist
            </button>
            <button
              onClick={() => handleNav(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
              className="w-full py-2 px-4 text-center text-xs font-medium text-zinc-400 bg-zinc-900 hover:text-zinc-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isAdminLoggedIn ? 'Go to Admin CMS' : 'Admin CMS Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
