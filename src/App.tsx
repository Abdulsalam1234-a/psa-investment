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
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { reports } = useData();

  useEffect(() => {
    // Check referral query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref') && !currentUser) {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }

    // Check direct path
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (path === 'admin' || path === 'admin-panel') {
      setActiveTab('admin-panel');
    } else if (path === 'portal' || path === 'member-portal') {
      setActiveTab('member-portal');
    } else if (path === 'chronicle' || path === 'transcripts' || path === 'psa-transcripts' || path === 'newspaper' || path === 'daily-report') {
      setActiveTab('chronicle');
    }
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
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenAuth}
        onSelectReport={handleSelectReport}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            onOpenAuthModal={handleOpenAuth}
            onSelectReport={handleSelectReport}
          />
        )}
        {activeTab === 'chronicle' && (
          <ChronicleView onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'about' && (
          <About setActiveTab={setActiveTab} onOpenAuthModal={handleOpenAuth} />
        )}
        {activeTab === 'services' && (
          <Services setActiveTab={setActiveTab} onOpenAuthModal={handleOpenAuth} />
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
            setActiveTab={setActiveTab}
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
        onSuccess={() => setActiveTab('member-portal')}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenAuthModal={handleOpenAuth} />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
