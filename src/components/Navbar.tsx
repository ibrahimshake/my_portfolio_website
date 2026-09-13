import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Database, 
  FileSpreadsheet, 
  FolderKanban, 
  User, 
  Send, 
  Briefcase, 
  FileText, 
  Lock, 
  LayoutDashboard,
  Sparkles,
  Home,
  CheckCircle2,
  ChevronRight,
  Layers,
  Wrench
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
    { label: 'Home', path: '/', icon: Home },
    { label: 'About', path: '/about', icon: User },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Lead Samples', path: '/lead-samples', icon: FileSpreadsheet, highlight: true, badge: 'Live XLSX' },
    { label: 'Services', path: '/services', icon: Briefcase },
    { label: 'Skills', path: '/skills', icon: Wrench },
    { label: 'Experience', path: '/experience', icon: Layers },
    { label: 'Resume', path: '/resume', icon: FileText },
    { label: 'Contact', path: '/contact', icon: Send },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const displayName = profile?.fullName || 'Ibrahim Shake Shuvo';
  const displayTitle = profile?.title || 'B2B Lead Gen & Data Scraping';

  // Bottom nav items for 1-thumb mobile navigation
  const bottomNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Samples', path: '/lead-samples', icon: FileSpreadsheet, highlight: true },
    { label: 'Contact', path: '/contact', icon: Send },
    { 
      label: isAdminLoggedIn ? 'CMS' : 'Menu', 
      path: isAdminLoggedIn ? '/admin/dashboard' : '#menu', 
      icon: isAdminLoggedIn ? LayoutDashboard : Menu,
      action: () => setMobileMenuOpen(!mobileMenuOpen)
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand */}
          <button 
            onClick={() => handleNav('/')}
            className="group flex items-center gap-2.5 text-left transition-all cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/50 text-emerald-400 group-hover:border-emerald-500/60 group-hover:bg-emerald-900/40 transition-all shrink-0 shadow-sm shadow-emerald-950/50">
              <Database className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold tracking-tight text-zinc-100 block truncate max-w-[175px] sm:max-w-[240px]">
                {displayName}
              </span>
              <span className="text-[11px] font-mono tracking-wide text-emerald-400 block -mt-0.5 truncate max-w-[175px] sm:max-w-[240px]">
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
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-emerald-400 bg-zinc-900 font-semibold shadow-sm'
                      : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/60'
                  } ${link.highlight ? 'border border-emerald-500/30 text-emerald-300' : ''}`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdminLoggedIn ? (
              <button
                onClick={() => handleNav('/admin/dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 rounded-lg hover:bg-emerald-900/50 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Admin CMS</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Admin CMS Login"
              >
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={() => handleNav('/contact')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm shadow-emerald-900/30 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Hire Me</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/contact')}
              className="px-3 py-1 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors sm:hidden"
            >
              Hire
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors border border-zinc-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-emerald-400" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* UPGRADED MOBILE MENU DRAWER (Clean, Fresh, Modern layout) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-zinc-800 bg-zinc-950/98 px-4 pt-3 pb-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Status indicator badge in mobile drawer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  {profile?.availabilityStatus || 'Available for Projects'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Global (UTC+6)</span>
            </div>

            {/* Clean, spacious navigation list with icons */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 font-semibold'
                        : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 text-zinc-400'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{link.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
              <button
                onClick={() => handleNav('/contact')}
                className="w-full py-3 px-4 text-center text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Get in Touch / Request Lead Dataset</span>
              </button>
              
              <button
                onClick={() => handleNav(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
                className="w-full py-2.5 px-4 text-center text-xs font-medium text-zinc-400 bg-zinc-900/90 hover:text-zinc-100 rounded-xl transition-colors flex items-center justify-center gap-2 border border-zinc-800"
              >
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAdminLoggedIn ? 'Open Admin Control Panel' : 'Admin CMS Portal'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SLEEK MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly app-like viewpoint) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/' && item.path !== '#menu' && currentPath.startsWith(item.path));
          
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  handleNav(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors relative cursor-pointer min-w-[58px] ${
                isActive 
                  ? 'text-emerald-400 font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                {item.highlight && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
