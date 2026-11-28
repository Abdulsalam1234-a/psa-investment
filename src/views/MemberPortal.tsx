import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  Copy,
  Check,
  Download,
  Clock,
  FileText,
  Lock,
  ExternalLink,
  Edit3,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderOpen,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface MemberPortalProps {
  onSelectReport: (reportId: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  onSelectReport,
  onOpenAuthModal
}) => {
  const {
    currentUser,
    memberProfile,
    updateMemberProfile,
    logout
  } = useAuth();

  const { reports, downloadLogs, logReportDownload, chronicles, logChronicleDownload } = useData();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(memberProfile?.fullName || '');
  const [editPhone, setEditPhone] = useState(memberProfile?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Lock background scrolling and add Escape key listener when edit profile modal is open
  useEffect(() => {
    if (editProfileOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setEditProfileOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }, [editProfileOpen]);

  // 1. Unauthenticated State
  if (!currentUser && !memberProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-16 h-16 rounded-3xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <h2 className="font-serif font-black text-3xl text-[#0A1F44]">
            PSA Analyst Circle Member Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Please sign in to access your member dashboard, confidential equity valuation models,
            and personalized referral tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuthModal('login')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102"
          >
            Member Sign In
          </button>
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-xs rounded-xl border border-slate-200 shadow-xs cursor-pointer transition-all"
          >
            Apply for Free Access
          </button>
        </div>
      </div>
    );
  }

  // 2. Pending Approval State
  if (memberProfile?.status === 'pending') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-500" />

          <div className="flex items-center gap-3 text-amber-600">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Application Status: Pending Review
              </span>
              <h2 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
                Application Awaiting Executive Approval
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4">
            <p>
              Welcome, <strong className="text-slate-800">{memberProfile.fullName}</strong>!
            </p>
            <p>
              Your application to the PSA Analyst Circle has been successfully submitted and is
              currently being reviewed by Chief Analyst Salami Abdullahi.
            </p>
            <p>
              An automated application receipt email has been queued to your inbox. As soon as your
              credentials are confirmed in the admin panel, your status will switch to Active and your
              full research access will unlock.
            </p>
          </div>

          {/* Preliminary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Submission Timestamp:</span>
              <span className="font-medium text-slate-800">
                {new Date(memberProfile.appliedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Referral Code:</span>
              <span className="font-mono font-bold text-sm text-[#0A1F44]">
                {memberProfile.referralCode}
              </span>
            </div>
          </div>

          {/* Session Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">Need to switch accounts or exit?</span>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-600 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Member State
  const activeReports = reports.filter(r => r.status === 'published');
  const userDownloads = downloadLogs.filter(
    d => d.memberId === (currentUser?.uid || memberProfile?.uid)
  );

  const referralLink = `https://psainvestment.com.ng/?ref=${memberProfile?.referralCode}`;

  const handleCopyCode = () => {
    if (memberProfile?.referralCode) {
      navigator.clipboard.writeText(memberProfile.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMemberProfile({
      fullName: editName.trim(),
      phone: editPhone.trim()
    });
    setEditProfileOpen(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleDownload = async (rep: typeof reports[0]) => {
    const memberId = currentUser?.uid || memberProfile?.uid || 'user-active';
    const memberEmail = currentUser?.email || memberProfile?.email || 'member@psainvestment.com.ng';

    await logReportDownload(rep.id, memberId, memberEmail);

    const blob = new Blob(
      [
        `PSA INVESTMENT - INSTITUTIONAL RESEARCH MEMO\n\n` +
          `Title: ${rep.title}\n` +
          `Ticker: ${rep.ticker || 'N/A'}\n` +
          `Author: ${rep.author}\n` +
          `Access: ${rep.access}\n` +
          `Member Authentication: ${memberProfile?.fullName} (${memberProfile?.referralCode})\n\n` +
          `============================================================\n\n` +
          rep.body
      ],
      { type: 'application/pdf' }
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner: Member Welcome & Profile Hub */}
      <div className="bg-[#0A1F44] bg-gradient-to-br from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A84C] text-[#0A1F44] flex items-center justify-center font-serif font-black text-2xl shadow-lg">
              {memberProfile?.fullName
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'MB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#C9A84C]">
                  {memberProfile?.membershipTier?.toUpperCase() || 'STANDARD'} TIER
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-white mt-1">
                {memberProfile?.fullName}
              </h1>
              <div className="text-xs text-slate-300 font-mono">{memberProfile?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditName(memberProfile?.fullName || '');
                setEditPhone(memberProfile?.phone || '');
                setEditProfileOpen(true);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Sign Out of Member Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {profileSaved && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile changes saved successfully.</span>
          </div>
        )}

        {/* Member Referral Hub Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-800/80 items-center">
          <div className="md:col-span-4 space-y-1">
            <div className="text-xs uppercase font-bold text-[#C9A84C] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Your Exclusive Referral Hub
            </div>
            <div className="text-xs text-slate-300">
              Share PSA Intelligence & Build Your Record
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Total Successful Admissions Tracked:{' '}
              <strong className="text-white font-mono text-sm">
                {memberProfile?.referralCount || 0}
              </strong>
            </div>
          </div>

          {/* Copyable Code & Link */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80 space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Your Referral Code:
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#C9A84C]">
                  {memberProfile?.referralCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700/80 space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Direct Invitation Link:
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300 truncate max-w-[160px]">
                  {referralLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer shrink-0"
                  title="Copy Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditProfileOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditProfileOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-black text-xl text-[#0A1F44] pr-8">
              Update Member Information
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Desk Note Callout */}
      <div className="p-6 sm:p-8 bg-amber-50/70 border border-amber-200/80 rounded-3xl text-amber-950 space-y-2">
        <div className="font-bold text-xs uppercase tracking-wider text-[#C9A84C]">
          Chief Analyst Desk Note • Institutional Valuation Access
        </div>
        <p className="text-xs sm:text-sm leading-relaxed italic text-amber-900">
          "Welcome to the PSA Analyst Circle. Our research memos prioritize balance sheet scrutiny,
          foreign currency obligations, and verifiable free cash flows of NGX-listed firms. Every
          valuation note in your vault below includes sensitivity models and downloadable PDF files."
        </p>
        <div className="text-xs font-bold text-amber-950 pt-1"> -  Salami Abdullahi</div>
      </div>

      {/* Unlocked Research Vault */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              Institutional Research Vault
            </span>
            <h2 className="font-serif font-black text-2xl text-[#0A1F44]">
              Premium Valuation Notes & PDF Memos
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {activeReports.length} Documents Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeReports.map(rep => (
            <div
              key={rep.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {rep.category}
                  </span>
                  {rep.ticker && (
                    <span className="text-xs font-mono font-bold text-[#0A1F44]">
                      {rep.ticker}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onSelectReport(rep.id)}
                  className="font-serif font-black text-lg text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer transition-colors"
                >
                  {rep.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {rep.summary}
                </p>

                <div className="flex items-center gap-3 text-xs pt-1">
                  {rep.targetPrice && (
                    <span className="font-semibold text-slate-700">
                      Target: <strong>{rep.targetPrice}</strong>
                    </span>
                  )}
                  {rep.recommendation && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {rep.recommendation}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectReport(rep.id)}
                  className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Read Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(rep)}
                  className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 07:00 WAT Daily Financial Chronicle Vault */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xs space-y-6 font-serif">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div className="space-y-1 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#0A1F44]">
                07:00 WAT Daily Intelligence Archive
              </span>
            </div>
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              The PSA Financial Chronicle (Archived Editions)
            </h3>
            <p className="text-xs text-slate-600">
              Verified daily broadsheets published every morning before floor open.
            </p>
          </div>

          <button
            onClick={() => {
              if (chronicles[0]) {
                logChronicleDownload(chronicles[0].id, memberProfile?.email);
                window.print();
              }
            }}
            className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer font-sans"
          >
            <Download className="w-4 h-4" />
            <span>Download Today's Broadsheet (PDF)</span>
          </button>
        </div>

        <div className="divide-y divide-slate-200 font-sans">
          {chronicles.map(chron => (
            <div
              key={chron.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#0A1F44] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {chron.volume}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{chron.editionDate}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                  {chron.headline}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{chron.subheadline}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    logChronicleDownload(chron.id, memberProfile?.email);
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-xs rounded-lg border border-slate-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Downloads Audit Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-[#0A1F44]">
              Your Document Downloads Log
            </h3>
            <p className="text-xs text-slate-500">
              Audit-logged for compliance and watermark tracking.
            </p>
          </div>
          <FolderOpen className="w-5 h-5 text-slate-400" />
        </div>

        {userDownloads.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            You have not downloaded any PDF memos yet. Click "Download PDF" on any valuation memo
            above to save it to your local device.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userDownloads.slice(0, 5).map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {log.reportTitle}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
