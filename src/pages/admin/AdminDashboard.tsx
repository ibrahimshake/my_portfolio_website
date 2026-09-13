import React, { useEffect, useState, useRef } from 'react';
import { 
  FolderKanban, 
  FileSpreadsheet, 
  MessageSquare, 
  Layers, 
  PlusCircle, 
  Upload, 
  User, 
  CheckCircle2, 
  Circle,
  Clock, 
  Database,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Bell,
  Volume2,
  VolumeX,
  Radio,
  Reply,
  RefreshCw,
  Sparkles,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import type { SiteStats, Project, LeadSample, ContactMessage } from '../../types';
import { api } from '../../lib/api';
import { playMessageChime } from '../../lib/sound';

interface AdminDashboardProps {
  setTab: (tab: string) => void;
  navigate: (path: string) => void;
  goToMessages?: (messageId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setTab, navigate, goToMessages }) => {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentSamples, setRecentSamples] = useState<LeadSample[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('admin_sound_alert') !== 'false';
  });

  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [statsData, projectsData, samplesData, messagesData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAdminProjects().catch(() => []),
        api.getAdminLeadSamples().catch(() => []),
        api.getAdminMessages().catch(() => [])
      ]);

      setStats(statsData);
      setRecentProjects(projectsData.slice(0, 3));
      setRecentSamples(samplesData.slice(0, 3));
      setMessages(messagesData);

      // Check for newly arrived messages
      if (!isInitialLoadRef.current) {
        const newArrivals = messagesData.filter(m => !knownMessageIdsRef.current.has(m.id));
        if (newArrivals.length > 0 && soundEnabled) {
          playMessageChime();
        }
      }

      messagesData.forEach(m => knownMessageIdsRef.current.add(m.id));
      isInitialLoadRef.current = false;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(false);
    }, 6000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('admin_sound_alert', next ? 'true' : 'false');
    if (next) {
      playMessageChime();
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newRead = !msg.read;
      await api.markMessageRead(msg.id, newRead);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: newRead } : m));
      if (stats) {
        setStats({
          ...stats,
          unreadMessages: Math.max(0, stats.unreadMessages + (newRead ? -1 : 1))
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMessage = (id: string) => {
    if (goToMessages) {
      goToMessages(id);
    } else {
      setTab('messages');
    }
  };

  // Helper to simulate a visitor messaging from the portfolio contact form
  const handleSimulateMessage = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const simulationSamples = [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@growthventures.io',
        subject: 'B2B Lead List Quotation for US SaaS Companies',
        message: 'Hi Ibrahim, we saw your Shopify & SaaS lead samples. We need a targeted list of 5,000 verified VP/Director leads in the FinTech space. Are you available this week for a discovery call?'
      },
      {
        name: 'David Miller',
        email: 'david@ecommercealpha.co',
        subject: 'Custom Web Scraping for E-commerce Product Catalog',
        message: 'Hello Ibrahim, I need an automated web scraping pipeline to monitor daily product pricing and stock across 3 major apparel retailers. Let me know your rate and timeline.'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@datamind.agency',
        subject: 'Urgent: Google Maps Local Business Scraping Project',
        message: 'Looking to extract business name, verified phone, address, and ratings for dental clinics across California. Please check your inbox and reply with sample data.'
      }
    ];

    const pick = simulationSamples[Math.floor(Math.random() * simulationSamples.length)];

    try {
      await api.sendMessage(pick);
      await loadData(false);
      if (soundEnabled) {
        playMessageChime();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const unreadMessages = messages.filter(m => !m.read);
  const latestUnread = unreadMessages[0];

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-500">
        Loading CMS metrics...
      </div>
    );
  }

  // Format relative timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            CMS Management Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time control over portfolio case studies, lead spreadsheet samples, and client inquiries.
          </p>
        </div>

        {/* Database Status & Sound controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              soundEnabled
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
            title={soundEnabled ? 'Incoming Message Chime: Active' : 'Incoming Message Chime: Muted'}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-300">{stats?.dbProvider || 'Database Active'}</span>
          </div>
        </div>
      </div>

      {/* 🔔 LIVE "SOMEONE IS MESSAGING YOU" ALERT BANNER */}
      {unreadMessages.length > 0 ? (
        <div className="rounded-2xl border-2 border-emerald-500/60 bg-emerald-950/20 p-5 shadow-xl shadow-emerald-500/5 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 animate-pulse">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                    Someone is messaging you right now!
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-mono font-bold">
                    {unreadMessages.length} New {unreadMessages.length === 1 ? 'Inquiry' : 'Inquiries'}
                  </span>
                </div>

                {latestUnread && (
                  <p className="text-xs text-zinc-300 mt-1">
                    Latest message from <strong className="text-zinc-100 font-semibold">{latestUnread.name}</strong> ({latestUnread.email}) &bull; <span className="text-zinc-400 font-mono text-[11px]">{formatTime(latestUnread.createdAt)}</span>:
                    <span className="italic text-zinc-400 block sm:inline sm:ml-1">&ldquo;{latestUnread.message.slice(0, 100)}...&rdquo;</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {latestUnread && (
                <button
                  onClick={() => handleOpenMessage(latestUnread.id)}
                  className="px-4 py-2 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Reply className="h-3.5 w-3.5" />
                  <span>Open & Reply</span>
                </button>
              )}
              <button
                onClick={() => setTab('messages')}
                className="px-3 py-2 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Status when all messages are read */
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>
              <strong className="text-zinc-200">Live Message Radar Active:</strong> Auto-checking for client inquiries every 6s. You are all caught up!
            </span>
          </div>

          <button
            onClick={handleSimulateMessage}
            disabled={isSimulating}
            className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isSimulating ? 'Sending test...' : 'Simulate Inbound Inquiry'}</span>
          </button>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Projects Metric */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Published Projects</span>
            <FolderKanban className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {stats?.totalProjects || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{stats?.featuredProjects || 0} Featured Case Studies</span>
          </div>
        </div>

        {/* Lead Samples Metric */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Lead Samples & Datasets</span>
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {stats?.totalLeadSamples || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <span>Verified Public Samples</span>
          </div>
        </div>

        {/* Client Messages Metric */}
        <div className={`rounded-2xl border p-5 space-y-2 cursor-pointer transition-all ${
          (stats?.unreadMessages || 0) > 0
            ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/5'
            : 'border-zinc-800 bg-zinc-900/40'
        }`}
        onClick={() => setTab('messages')}
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Client Inquiries</span>
            <MessageSquare className={`h-4 w-4 ${(stats?.unreadMessages || 0) > 0 ? 'text-emerald-400 animate-pulse' : 'text-purple-400'}`} />
          </div>
          <div className="text-2xl font-bold text-zinc-100 flex items-baseline gap-2">
            <span>{stats?.totalMessages || messages.length || 0}</span>
            {unreadMessages.length > 0 && (
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                +{unreadMessages.length} NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className={unreadMessages.length > 0 ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
              {unreadMessages.length} Unread / Awaiting Reply
            </span>
          </div>
        </div>

        {/* System & Storage Metric */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Storage Engine</span>
            <HardDrive className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-sm font-bold text-zinc-200 truncate font-mono">
            {stats?.dbProvider || 'PostgreSQL'}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            SheetJS XLSX Parser Active
          </div>
        </div>

      </div>

      {/* DEDICATED LIVE INCOMING MESSAGES SECTION ON DASHBOARD */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  Live Client Messages & Inbound Leads
                </h3>
                {unreadMessages.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{unreadMessages.length} Unread</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Immediate notification and real-time review of inquiries sent to you by potential clients.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateMessage}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Add a realistic client inquiry to test notification alerts"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span>{isSimulating ? 'Sending...' : 'Test Inquiry'}</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Check for new messages now"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={() => setTab('messages')}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Open Full Inbox</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        {messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 space-y-2">
            <MessageSquare className="h-8 w-8 text-zinc-700 mx-auto" />
            <p>No client inquiries received yet.</p>
            <p className="text-[11px] text-zinc-600">
              When a visitor submits your portfolio contact form, their message will appear here in real time.
            </p>
            <button
              onClick={handleSimulateMessage}
              className="mt-2 px-3 py-1 text-xs text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-950/20"
            >
              Click here to simulate a test message
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 5).map((msg) => {
              const isUnread = !msg.read;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isUnread
                      ? 'border-emerald-500/40 bg-zinc-950/90 hover:border-emerald-500/70 shadow-sm shadow-emerald-500/10'
                      : 'border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Sender Initial Avatar */}
                    <div className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                      isUnread
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${isUnread ? 'text-zinc-100' : 'text-zinc-300'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 truncate">
                          &lt;{msg.email}&gt;
                        </span>
                        {isUnread && (
                          <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 font-semibold">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-medium text-zinc-200 truncate">
                        {msg.subject || '(No Subject)'}
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right text-[11px] text-zinc-500 font-mono">
                      <Clock className="h-3 w-3 inline mr-1 text-zinc-600" />
                      {formatTime(msg.createdAt)}
                    </div>

                    <button
                      onClick={(e) => handleToggleRead(msg, e)}
                      className={`p-1.5 rounded text-xs transition-colors ${
                        msg.read ? 'text-zinc-600 hover:text-zinc-400' : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                      title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.read ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMessage(msg.id);
                      }}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>Quick Portfolio Management Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setTab('lead-samples')}
            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-left transition-colors flex items-center gap-3 group"
          >
            <Upload className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-zinc-100 block">Upload Lead Sample</span>
              <span className="text-[10px] text-zinc-400 block">CSV or XLSX File</span>
            </div>
          </button>

          <button
            onClick={() => setTab('projects')}
            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-left transition-colors flex items-center gap-3 group"
          >
            <FolderKanban className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-zinc-100 block">New Case Study</span>
              <span className="text-[10px] text-zinc-400 block">Publish Case Study</span>
            </div>
          </button>

          <button
            onClick={() => setTab('services')}
            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-left transition-colors flex items-center gap-3 group"
          >
            <Layers className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-zinc-100 block">Manage Services</span>
              <span className="text-[10px] text-zinc-400 block">Update Offerings</span>
            </div>
          </button>

          <button
            onClick={() => setTab('profile')}
            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-left transition-colors flex items-center gap-3 group"
          >
            <User className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-zinc-100 block">Edit Profile & Bio</span>
              <span className="text-[10px] text-zinc-400 block">Title & Socials</span>
            </div>
          </button>

          <button
            onClick={() => setTab('security')}
            className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-left transition-colors flex items-center gap-3 group sm:col-span-2 md:col-span-4"
          >
            <KeyRound className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 block">Change Admin Credentials & Password</span>
                <span className="text-[10px] text-zinc-400 block">Update your administrator username and secure login password</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 hidden sm:inline">
                Security Settings →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Projects & Recent Lead Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Projects Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-blue-400" />
              <span>Recent Projects</span>
            </h3>
            <button
              onClick={() => setTab('projects')}
              className="text-xs text-emerald-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">{p.title}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">{p.category}</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                  p.status === 'published' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-zinc-900 text-zinc-400'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Samples Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Recent Lead Samples</span>
            </h3>
            <button
              onClick={() => setTab('lead-samples')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Upload / Manage
            </button>
          </div>

          <div className="space-y-3">
            {recentSamples.map((s) => (
              <div key={s.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">{s.title}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">{s.niche} ({s.leadCount} leads)</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                  s.status === 'published' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-zinc-900 text-zinc-400'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
