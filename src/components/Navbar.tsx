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
  Sparkles,
  Bell,
  Phone,
  Mail
} from 'lucide-react';
import { ViewTab } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { NotificationPopup } from './NotificationPopup';

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
  const { currentUser, memberProfile, isAdmin, logout } = useAuth();
  const { reports, announcements, siteSettings } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = announcements.filter(a => !a.dismissed).length;

  const navLinks: { id: ViewTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'chronicle', label: 'PSA Transcripts', badge: '07:00 WAT' },
    { id: 'events', label: 'Events & FMVA', badge: 'Nov 28' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'research', label: 'Research' },
    { id: 'videos', label: 'PSA Lens' },
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
    <div className="navbar-sticky-highest sticky top-0 z-[9999] w-full bg-white shadow-md">
      {/* Official Executive Header Top Bar (Replaces Demo Persona Switcher) */}
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

        <div className="flex items-center gap-3 text-[11px]">
          <a
            href="mailto:psainvestment.ng@gmail.com"
            className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-[#C9A84C] transition-colors"
          >
            <Mail className="w-3 h-3 text-[#C9A84C]" />
            <span>psainvestment.ng@gmail.com</span>
          </a>
          <span className="hidden md:inline text-slate-600">|</span>
          <a
            href="tel:+2347068371292"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-[#C9A84C] font-mono transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C9A84C]" />
            <span>+234 706 837 1292</span>
          </a>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setActiveTab('events')}
            className="text-[#C9A84C] hover:underline font-bold text-[11px] cursor-pointer"
          >
            Nov 28 FMVA Summit &rarr;
          </button>
        </div>
      </div>

      {/* Optional Top Announcement Ticker */}
      {siteSettings?.showTicker && siteSettings?.announcementTickerText && (
        <div className="bg-[#C9A84C] text-[#0A1F44] text-[11px] font-bold px-4 py-1.5 flex items-center justify-between border-b border-[#b8973d] overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-[#0A1F44] text-[#C9A84C] text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold shrink-0">
              DISPATCH
            </span>
            <span className="truncate">{siteSettings.announcementTickerText}</span>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-[10px] uppercase font-black tracking-wider underline hover:opacity-80 shrink-0 cursor-pointer ml-3 hidden sm:inline"
          >
            Explore Nov 28 &rarr;
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <header className="bg-white border-b border-slate-200/80 shadow-xs relative">
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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A1F44] to-[#13306B] text-[#C9A84C] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                {siteSettings?.logoUrl ? (
                  <img src={siteSettings.logoUrl} alt={siteSettings.siteTitle} className="w-full h-full object-cover" />
                ) : (
                  <LineChart className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>
              <div className="leading-tight">
                <span className="font-serif font-black text-xl text-[#0A1F44] tracking-tight block">
                  {siteSettings?.siteTitle ? (
                    <>
                      {siteSettings.siteTitle.split(' ')[0]}{' '}
                      <span className="text-[#C9A84C]">{siteSettings.siteTitle.split(' ').slice(1).join(' ') || 'INVESTMENT'}</span>
                    </>
                  ) : (
                    <>PSA <span className="text-[#C9A84C]">INVESTMENT</span></>
                  )}
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-slate-500 block truncate max-w-[200px]">
                  {siteSettings?.tagline || 'Equity Research & Advisory'}
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
                  className={`px-2.5 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    activeTab === link.id
                      ? 'text-[#0A1F44] bg-[#C9A84C]/15 font-bold'
                      : 'text-slate-600 hover:text-[#0A1F44] hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="hidden xl:inline-block px-1.5 py-0.2 bg-[#0A1F44] text-[#C9A84C] text-[9px] font-bold rounded uppercase tracking-tighter">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-lg text-slate-500 hover:text-[#0A1F44] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Search research and tickers"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setNotificationsOpen(true)}
                className="p-2.5 rounded-lg text-slate-500 hover:text-[#0A1F44] hover:bg-slate-100 transition-colors cursor-pointer relative"
                title="Announcements & Intelligence Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
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

            {/* Mobile Menu & Search Buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#0A1F44]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Backdrop Overlay - Click outside to dismiss */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[120px] z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 relative z-50 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
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
                    className="w-full py-2.5 bg-[#0A1F44] text-[#C9A84C] rounded-xl font-bold text-sm cursor-pointer"
                  >
                    Admin Command Backend
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-semibold text-sm cursor-pointer"
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
                    className="w-full py-2.5 bg-[#C9A84C] text-[#0A1F44] rounded-xl font-bold text-sm cursor-pointer"
                  >
                    Open Member Portal
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-semibold text-sm cursor-pointer"
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
                    className="w-full py-2.5 border border-slate-200 text-[#0A1F44] rounded-xl font-bold text-sm cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuthModal('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#0A1F44] text-[#C9A84C] rounded-xl font-bold text-sm cursor-pointer"
                  >
                    Join Circle
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal - Click backdrop outside to dismiss */}
      {searchOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
          className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
        >
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
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
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

      {/* Notification Drawer & Alerts */}
      <NotificationPopup
        isOpenControlled={notificationsOpen}
        onCloseControlled={() => setNotificationsOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
};
