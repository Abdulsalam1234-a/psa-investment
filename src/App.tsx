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
  const resolveRouteFromPath = (path: string): { tab: ViewTab; eventSlug?: string } => {
    const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    const parts = clean.split('/');
    const firstPart = parts[0] || '';
    const secondPart = parts.length > 1 ? parts.slice(1).join('/') : undefined;

    if (firstPart === 'events' || firstPart === 'programs') {
      return { tab: 'events', eventSlug: secondPart };
    }
    if (firstPart === 'fmva' || firstPart === 'masterclass') {
      return {
        tab: 'events',
        eventSlug: 'financial-modeling-valuation-analysis-masterclass-nov-2026'
      };
    }
    if (firstPart === 'about') return { tab: 'about' };
    if (firstPart === 'services') return { tab: 'services' };
    if (firstPart === 'research') return { tab: 'research' };
    if (firstPart === 'videos' || firstPart === 'psa-lens') return { tab: 'videos' };
    if (
      firstPart === 'chronicle' ||
      firstPart === 'transcripts' ||
      firstPart === 'psa-transcripts' ||
      firstPart === 'newspaper' ||
      firstPart === 'daily-report'
    )
      return { tab: 'chronicle' };
    if (firstPart === 'analyst-circle' || firstPart === 'circle') return { tab: 'analyst-circle' };
    if (firstPart === 'contact') return { tab: 'contact' };
    if (firstPart === 'member-portal' || firstPart === 'portal') return { tab: 'member-portal' };
    if (firstPart === 'admin-panel' || firstPart === 'admin') return { tab: 'admin-panel' };
    return { tab: 'home' };
  };

  const initialRoute = resolveRouteFromPath(window.location.pathname);
  const [activeTab, setActiveTabState] = useState<ViewTab>(initialRoute.tab);
  const [activeEventSlug, setActiveEventSlug] = useState<string | undefined>(initialRoute.eventSlug);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { reports } = useData();

  // Synchronize browser history and navigation tabs
  const handleNavigateTab = (tab: ViewTab, eventSlug?: string) => {
    setActiveTabState(tab);
    setActiveEventSlug(eventSlug);
    let targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (tab === 'events' && eventSlug) {
      targetPath = `/events/${eventSlug}`;
    }
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, eventSlug }, '', targetPath);
    }
  };

  useEffect(() => {
    // Listen for browser Back/Forward popstate events
    const handlePopState = () => {
      const route = resolveRouteFromPath(window.location.pathname);
      setActiveTabState(route.tab);
      setActiveEventSlug(route.eventSlug);
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
          <Events
            activeEventSlug={activeEventSlug}
            onNavigateEvent={(slug?: string) => handleNavigateTab('events', slug)}
            onOpenAuthModal={handleOpenAuth}
          />
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
