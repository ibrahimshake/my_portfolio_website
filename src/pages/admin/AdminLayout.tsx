import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileSpreadsheet, 
  Layers, 
  Cpu, 
  Briefcase, 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Database,
  Bell,
  Volume2,
  VolumeX,
  X,
  Radio,
  KeyRound
} from 'lucide-react';
import { api } from '../../lib/api';
import { playMessageChime } from '../../lib/sound';
import type { ContactMessage } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  setTab: (tab: string) => void;
  navigate: (path: string) => void;
  onLogout: () => void;
  onOpenMessage?: (id: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setTab,
  navigate,
  onLogout,
  onOpenMessage,
  children
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [latestMessage, setLatestMessage] = useState<ContactMessage | null>(null);
  const [newIncomingToast, setNewIncomingToast] = useState<ContactMessage | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('admin_sound_alert') !== 'false';
  });

  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const isInitialPollRef = useRef<boolean>(true);

  // Poll for inbound messages every 7 seconds
  useEffect(() => {
    let isMounted = true;

    const checkMessages = async () => {
      try {
        const messages = await api.getAdminMessages();
        if (!isMounted) return;

        const unread = messages.filter(m => !m.read);
        setUnreadCount(unread.length);

        if (messages.length > 0) {
          setLatestMessage(messages[0]);
        }

        // Check if there are newly arrived messages since last check
        if (!isInitialPollRef.current) {
          const newMessages = messages.filter(m => !knownMessageIdsRef.current.has(m.id));
          if (newMessages.length > 0) {
            const newest = newMessages[0];
            setNewIncomingToast(newest);
            if (soundEnabled) {
              playMessageChime();
            }
          }
        }

        // Update known IDs
        messages.forEach(m => knownMessageIdsRef.current.add(m.id));
        isInitialPollRef.current = false;
      } catch (err) {
        // quiet fail on network blip
      }
    };

    checkMessages();
    const interval = setInterval(checkMessages, 7000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('admin_sound_alert', next ? 'true' : 'false');
    if (next) {
      playMessageChime();
    }
  };

  const handleToastClick = (msg: ContactMessage) => {
    setNewIncomingToast(null);
    if (onOpenMessage) {
      onOpenMessage(msg.id);
    } else {
      setTab('messages');
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'lead-samples', label: 'Lead Samples', icon: FileSpreadsheet, highlight: true },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'profile', label: 'Profile & About', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      isPulse: unreadCount > 0
    },
    { id: 'security', label: 'Admin Security', icon: KeyRound },
    { id: 'settings', label: 'Settings & DB', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row relative">
      
      {/* Real-time Floating Incoming Message Alert Toast */}
      {newIncomingToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-zinc-900 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/20 rounded-xl p-4 animate-bounce">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                <Bell className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
                    Someone is messaging you!
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-100">
                  {newIncomingToast.name}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  &ldquo;{newIncomingToast.message}&rdquo;
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleToastClick(newIncomingToast)}
                    className="px-3 py-1 text-[11px] font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors"
                  >
                    View Inquiry
                  </button>
                  <button
                    onClick={() => setNewIncomingToast(null)}
                    className="px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setNewIncomingToast(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-100 block">CMS Admin</span>
                <span className="text-[10px] text-emerald-400 font-mono block -mt-0.5">Control Panel</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Alert Toggle */}
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-md transition-colors ${
                  soundEnabled 
                    ? 'text-emerald-400 hover:bg-emerald-950/40' 
                    : 'text-zinc-500 hover:bg-zinc-900'
                }`}
                title={soundEnabled ? 'Message Chime Alert: ON (Click to mute)' : 'Message Chime Alert: MUTED (Click to enable)'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              <button
                onClick={() => navigate('/')}
                className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="View Public Site"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                        {item.isPulse && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        <span>{item.badge}</span>
                      </span>
                    )}

                    {item.highlight && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-mono">
                        XLSX
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Live Monitor Status */}
        <div className="pt-4 border-t border-zinc-900 space-y-3">
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-zinc-400 flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>Live Inbox Radar</span>
              </span>
              <span className={`text-[10px] font-mono font-bold ${unreadCount > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {unreadCount > 0 ? `${unreadCount} Unread` : 'Clear'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">
              {unreadCount > 0 
                ? `Someone is messaging you. Latest inquiry from ${latestMessage?.name || 'client'}.`
                : 'Auto-detecting inbound inquiries every 7 seconds.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] truncate">Admin Session Active</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main CMS Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
};
