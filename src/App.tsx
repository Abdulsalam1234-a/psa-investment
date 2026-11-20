import React, { useState, useEffect } from 'react';
import { ViewTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { Home } from './views/Home';
import { About } from './views/About';
import { Services } from './views/Services';
import { Research } from './views/Research';
import { Videos } from './views/Videos';
import { AnalystCircle } from './views/AnalystCircle';
import { Contact } from './views/Contact';
import { MemberPortal } from './views/MemberPortal';
import { AdminPanel } from './views/AdminPanel';
import { ChronicleView } from './views/ChronicleView';
import { Events } from './views/Events';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

export const AppContent: React.FC = () => {
  const resolveTabFromPath = (path: string): ViewTab => {
    const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (clean === 'about') return 'about';
    if (clean === 'services') return 'services';
    if (clean === 'research') return 'research';
    if (clean === 'videos' || clean === 'psa-lens') return 'videos';
    if (clean === 'events' || clean === 'programs' || clean === 'fmva' || clean === 'masterclass') return 'events';
    if (clean === 'chronicle' || clean === 'transcripts' || clean === 'psa-transcripts' || clean === 'newspaper' || clean === 'daily-report') return 'chronicle';
    if (clean === 'analyst-circle' || clean === 'circle') return 'analyst-circle';
    if (clean === 'contact') return 'contact';
    if (clean === 'member-portal' || clean === 'portal') return 'member-portal';
    if (clean === 'admin-panel' || clean === 'admin') return 'admin-panel';
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<ViewTab>(() => {
    return resolveTabFromPath(window.location.pathname);
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { reports } = useData();

  // Synchronize browser history and navigation tabs
  const handleNavigateTab = (tab: ViewTab) => {
    setActiveTabState(tab);
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  useEffect(() => {
    // Listen for browser Back/Forward popstate events
    const handlePopState = () => {
      setActiveTabState(resolveTabFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    // Check referral query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref') && !currentUser) {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentUser]);

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot_password') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const currentReport = reports.find(r => r.id === selectedReportId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-900 font-sans selection:bg-[#C9A84C]/30 selection:text-[#0A1F44]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenAuthModal={handleOpenAuth}
        onSelectReport={handleSelectReport}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            setActiveTab={handleNavigateTab}
            onOpenAuthModal={handleOpenAuth}
            onSelectReport={handleSelectReport}
          />
        )}
        {activeTab === 'chronicle' && (
          <ChronicleView onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'events' && (
          <Events onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'about' && (
          <About setActiveTab={handleNavigateTab} onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'services' && (
          <Services setActiveTab={handleNavigateTab} onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'research' && (
          <Research
            onSelectReport={handleSelectReport}
            onOpenAuthModal={handleOpenAuth}
          />
        )}
        {activeTab === 'videos' && <Videos onOpenAuthModal={handleOpenAuth} />}
        {activeTab === 'analyst-circle' && (
          <AnalystCircle
            setActiveTab={handleNavigateTab}
            onOpenAuthModal={handleOpenAuth}
          />
        )}
        {activeTab === 'contact' && <Contact />}
        {activeTab === 'member-portal' && (
          <MemberPortal
            onSelectReport={handleSelectReport}
            onOpenAuthModal={handleOpenAuth}
          />
        )}
        {activeTab === 'admin-panel' && <AdminPanel />}
      </main>

      {/* Report Reader / Download Modal */}
      <ReportModal
        report={currentReport}
        onClose={() => setSelectedReportId(null)}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Sign In / Apply Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => handleNavigateTab('member-portal')}
      />

      {/* Footer */}
      <Footer setActiveTab={handleNavigateTab} onOpenAuthModal={handleOpenAuth} />

      {/* PWA Mobile Installation Prompt */}
      <PwaInstallBanner />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
