import React, { useState } from 'react';
import {
  LineChart,
  ShieldCheck,
  Search,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ViewTab, DemoRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup' | 'forgot_password') => void;
  onSelectReport: (reportId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onSelectReport
}) => {
  const { currentUser, memberProfile, isAdmin, logout, switchDemoRole, demoRole } = useAuth();
  const { reports } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navLinks: { id: ViewTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'research', label: 'Research & Insights' },
    { id: 'videos', label: 'PSA Lens (Videos)' },
    { id: 'analyst-circle', label: 'Analyst Circle' },
    { id: 'contact', label: 'Contact' }
  ];

  const filteredReports = searchQuery.trim()
    ? reports.filter(
        r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.ticker && r.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <>
      {/* Demo Persona Bar */}
      <div className="bg-[#0A1F44] border-b border-slate-800 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[#C9A84C]">
            <Sparkles className="w-3.5 h-3.5" />
            PSA
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            Independent Equity Research & Capital Advisory
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          <span className="text-slate-400 hidden md:inline">Preview Persona:</span>
          <div className="relative">
            <button
              onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
              className="bg-slate-800/90 hover:bg-slate-750 text-white font-medium px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 cursor-pointer text-[11px]"
            >
              <span>
                {demoRole === 'admin'
                  ? 'Chief Analyst (Admin)'
                  : demoRole === 'active_member'
                  ? 'Active Circle Member'
                  : demoRole === 'pending_member'
                  ? 'Pending Applicant'
                  : currentUser
                  ? currentUser.displayName || currentUser.email
                  : 'Public Visitor'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#C9A84C]" />
            </button>

            {personaDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Quick Demo Account
                </div>
                <button
                  onClick={() => {
                    switchDemoRole('admin');
                    setPersonaDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-[#C9A84C]">Salami Abdullahi</div>
                    <div className="text-[10px] text-slate-400">Chief Analyst & Admin</div>
                  </div>
                  <span className="text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('active_member');
                    setPersonaDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">Chidinma Okonkwo</div>
                    <div className="text-[10px] text-slate-400">Active Member (7 Refs)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('pending_member');
                    setPersonaDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">Babatunde Adeleke</div>
                    <div className="text-[10px] text-slate-400">Application Under Review</div>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                    Pending
                  </span>
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('visitor');
                    setPersonaDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-300 border-t border-slate-800 cursor-pointer"
                >
                  Reset to Public Visitor State
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A1F44] to-[#13306B] text-[#C9A84C] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <LineChart className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="leading-tight">
                <span className="font-serif font-black text-xl text-[#0A1F44] tracking-tight block">
                  PSA <span className="text-[#C9A84C]">INVESTMENT</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-slate-500 block">
                  Equity Research & Advisory
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === link.id
                      ? 'text-[#0A1F44] bg-[#C9A84C]/15 font-bold'
                      : 'text-slate-600 hover:text-[#0A1F44] hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-lg text-slate-500 hover:text-[#0A1F44] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Search research and tickers"
              >
                <Search className="w-4 h-4" />
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('admin-panel')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      activeTab === 'admin-panel'
                        ? 'bg-[#0A1F44] text-[#C9A84C]'
                        : 'bg-slate-100 text-[#0A1F44] hover:bg-slate-200'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin Command
                  </button>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('member-portal')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      activeTab === 'member-portal'
                        ? 'bg-[#0A1F44] text-[#C9A84C]'
                        : 'bg-[#C9A84C] text-[#0A1F44] hover:bg-[#B8973D]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Member Portal
                    {memberProfile?.status === 'pending' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
                    )}
                  </button>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="px-3.5 py-2 text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('signup')}
                    className="px-4 py-2 rounded-xl bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-102 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Join Circle
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  activeTab === link.id
                    ? 'text-[#0A1F44] bg-[#C9A84C]/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('admin-panel');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#0A1F44] text-[#C9A84C] rounded-xl font-bold text-sm"
                  >
                    Admin Command Backend
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-semibold text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('member-portal');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#C9A84C] text-[#0A1F44] rounded-xl font-bold text-sm"
                  >
                    Open Member Portal
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-semibold text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 border border-slate-200 text-[#0A1F44] rounded-xl font-bold text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuthModal('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#0A1F44] text-[#C9A84C] rounded-xl font-bold text-sm"
                  >
                    Join Circle
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search NGX tickers, valuation notes, reports..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 space-y-2">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Try searching by ticker (e.g. <span className="font-semibold text-slate-600">SEPLAT</span>,{' '}
                  <span className="font-semibold text-slate-600">BANKING</span>) or topic (e.g.{' '}
                  <span className="font-semibold text-slate-600">recapitalization</span>).
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No valuation notes found matching "{searchQuery}".
                </div>
              ) : (
                filteredReports.map(rep => (
                  <div
                    key={rep.id}
                    onClick={() => {
                      onSelectReport(rep.id);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {rep.category}
                        </span>
                        {rep.ticker && (
                          <span className="text-[10px] font-mono font-bold text-[#C9A84C]">
                            {rep.ticker}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#0A1F44] mt-1 line-clamp-1">
                        {rep.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{rep.summary}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
