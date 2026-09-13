import React, { useEffect, useState } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProjects } from './admin/AdminProjects';
import { AdminLeadSamples } from './admin/AdminLeadSamples';
import { AdminServices } from './admin/AdminServices';
import { AdminSkills } from './admin/AdminSkills';
import { AdminExperience } from './admin/AdminExperience';
import { AdminProfile } from './admin/AdminProfile';
import { AdminResume } from './admin/AdminResume';
import { AdminMessages } from './admin/AdminMessages';
import { AdminSettings } from './admin/AdminSettings';
import { api } from '../lib/api';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
  subTab?: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate, subTab = 'dashboard' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentTab, setCurrentTab] = useState<string>(subTab);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    api.checkAuth()
      .then(auth => {
        setIsAuthenticated(auth.authenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  const handleGoToMessages = (messageId?: string) => {
    if (messageId) {
      setSelectedMessageId(messageId);
    }
    setCurrentTab('messages');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="text-xs text-zinc-500 font-mono">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        navigate={navigate}
      />
    );
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      setTab={setCurrentTab}
      navigate={navigate}
      onLogout={handleLogout}
      onOpenMessage={handleGoToMessages}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboard 
          setTab={setCurrentTab} 
          navigate={navigate}
          goToMessages={handleGoToMessages}
        />
      )}
      {currentTab === 'projects' && <AdminProjects />}
      {currentTab === 'lead-samples' && <AdminLeadSamples />}
      {currentTab === 'services' && <AdminServices />}
      {currentTab === 'skills' && <AdminSkills />}
      {currentTab === 'experience' && <AdminExperience />}
      {currentTab === 'profile' && <AdminProfile />}
      {currentTab === 'resume' && <AdminResume />}
      {currentTab === 'messages' && <AdminMessages initialSelectedId={selectedMessageId} />}
      {currentTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};
