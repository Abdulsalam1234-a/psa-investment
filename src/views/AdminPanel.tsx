import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  MessageSquare,
  Mail,
  HardDrive,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Briefcase,
  Shield,
  Award,
  UserPlus,
  ChevronDown,
  Check,
  Lock,
  Key,
  Terminal,
  ShieldAlert,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Member, ResearchReport, LearningVideo, StorageFile, StaffMember, StaffRole } from '../types';
import { ChronicleAdminDesk } from '../components/ChronicleAdminDesk';
import { AdminEventsDesk } from '../components/AdminEventsDesk';
import { AdminAdsDesk } from '../components/AdminAdsDesk';
import {
  getSecurityAuditLogs,
  logSecurityEvent,
  checkSqlSafety,
  sanitizeText,
  SecurityAuditEntry
} from '../utils/security';

export const AdminPanel: React.FC = () => {
  const { isAdmin, switchDemoRole, updateAdminProfile, memberProfile } = useAuth();
  const {
    reports,
    videos,
    members,
    contactSubmissions,
    downloadLogs,
    emailLogs,
    storageFiles,
    staffMembers,
    saveReport,
    deleteReport,
    saveVideo,
    deleteVideo,
    approveMember,
    rejectMember,
    suspendMember,
    reinstateMember,
    updateMemberRecord,
    addStaffMember,
    updateStaffRole,
    updateStaffStatus,
    deleteStaffMember,
    updateContactStatus,
    deleteContact,
    addStorageFile,
    deleteStorageFile,
    logReportDownload,
    refreshData
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'chronicle' | 'events' | 'ads' | 'members' | 'staff' | 'reports' | 'videos' | 'contacts' | 'emails' | 'storage' | 'profile' | 'security'
  >('analytics');

  // Security & Injection Firewall state
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditEntry[]>(() => getSecurityAuditLogs());
  const [testPayload, setTestPayload] = useState<string>("' OR '1'='1");
  const [testResult, setTestResult] = useState<{ isSafe: boolean; detected?: string; sanitized: string } | null>(null);
  const [securityPin, setSecurityPin] = useState<string>('2570');
  const [pinInput, setPinInput] = useState<string>('');
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(true);

  // Staff management state
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all');
  const [staffSearch, setStaffSearch] = useState<string>('');
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('analyst');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('');
  const [newStaffNotes, setNewStaffNotes] = useState('');

  // Member filter & state
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [rejectModalMember, setRejectModalMember] = useState<Member | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [editMemberModal, setEditMemberModal] = useState<Member | null>(null);

  // Report editor state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Partial<ResearchReport>>({});

  // Video editor state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<LearningVideo>>({});

  // Storage file upload modal
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileType, setNewFileType] = useState('pdf');
  const [newFileSize, setNewFileSize] = useState(2500000);

  // Admin Profile state
  const [adminFullName, setAdminFullName] = useState(memberProfile?.fullName || 'Salami Abdullahi');
  const [adminPhone, setAdminPhone] = useState(memberProfile?.phone || '+234 706 837 1292');
  const [adminTitle, setAdminTitle] = useState('Founder, CEO, COO, and Chief Analyst');
  const [adminBio, setAdminBio] = useState(
    'Directs institutional equity research, sovereign sensitivity models, and capital allocation frameworks for NGX-listed assets.'
  );
  const [adminPhotoUrl, setAdminPhotoUrl] = useState('');
  const [adminProfileSaved, setAdminProfileSaved] = useState(false);

  // Feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif font-black text-2xl text-[#0A1F44]">
            403: Role Restricted Endpoint
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Executive Command Backend is restricted to Salami Abdullahi (Chief Analyst).
          </p>
        </div>
        <button
          onClick={() => switchDemoRole('admin')}
          className="px-6 py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102"
        >
          Authenticate as Chief Analyst (Admin Demo)
        </button>
      </div>
    );
  }

  // Filtered members
  const filteredMembers = members.filter(m => {
    if (memberFilter === 'all') return true;
    return m.status === memberFilter;
  });

  const pendingCount = members.filter(m => m.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#0A1F44]">
              Executive Command Backend
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-700 font-semibold">Live System Online</span>
          </div>
          <h1 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
            PSA Control Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refreshData();
              showToast('Database records synchronized.');
            }}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveAdminTab('profile')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0A1F44] rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Salami Abdullahi Profile
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Subtabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'analytics'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('chronicle')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'chronicle'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          <span>Daily Chronicle (7 AM)</span>
          <span className="px-1.5 py-0.2 bg-[#C9A84C]/20 text-[#C9A84C] rounded-full text-[10px] font-bold">
            Auto
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'events'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#C9A84C]" />
          <span>Events & Form Builder</span>
          <span className="px-1.5 py-0.2 bg-[#C9A84C]/20 text-[#C9A84C] rounded-full text-[10px] font-bold">
            Nov 28
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ads')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'ads'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-500" />
          <span>Google Ads Monetization</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'members'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Circle Members</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[10px] font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('staff')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'staff'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Staff & Management</span>
          <span className="px-1.5 py-0.2 bg-[#C9A84C]/20 text-[#C9A84C] rounded-full text-[10px] font-bold">
            {staffMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'reports'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Research Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('videos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'videos'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>PSA Lens Videos ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('contacts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'contacts'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inbound Leads ({contactSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('emails')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'emails'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Outbox ({emailLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('storage')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'storage'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Storage Files ({storageFiles.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveAdminTab('security');
            setSecurityLogs(getSecurityAuditLogs());
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'security'
              ? 'bg-[#0A1F44] text-[#C9A84C]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Security & Firewall</span>
          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 rounded-full text-[10px] font-bold">
            Protected
          </span>
        </button>
      </div>

      {/* 1. Analytics Tab */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Total Members</span>
              <div className="font-serif font-black text-3xl text-[#0A1F44]">
                {members.length}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold">
                {pendingCount} Awaiting Review
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Published Reports</span>
              <div className="font-serif font-black text-3xl text-[#0A1F44]">
                {reports.filter(r => r.status === 'published').length}
              </div>
              <div className="text-[11px] text-slate-500">
                {reports.reduce((acc, r) => acc + (r.downloadCount || 0), 0)} Total Downloads
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">PSA Lens Lessons</span>
              <div className="font-serif font-black text-3xl text-[#0A1F44]">{videos.length}</div>
              <div className="text-[11px] text-slate-500">
                {videos.reduce((acc, v) => acc + (v.clicksToYouTube || 0), 0)} YouTube Interactions
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">
                Inbound Consultations
              </span>
              <div className="font-serif font-black text-3xl text-[#0A1F44]">
                {contactSubmissions.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                {contactSubmissions.filter(c => c.status === 'unread').length} Unread Leads
              </div>
            </div>
          </div>

          {/* Leaderboard and Download Audit Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-black text-lg text-[#0A1F44]">
                Top Member Referrers Leaderboard
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {members
                  .slice()
                  .sort((a, b) => b.referralCount - a.referralCount)
                  .slice(0, 5)
                  .map((m, idx) => (
                    <div key={m.uid} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 w-4">#{idx + 1}</span>
                        <div>
                          <div className="font-bold text-slate-800">{m.fullName}</div>
                          <div className="text-[11px] font-mono text-[#C9A84C]">
                            {m.referralCode}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-[#0A1F44] bg-slate-100 px-2.5 py-1 rounded-full text-xs">
                        {m.referralCount} Referred
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-lg text-[#0A1F44]">
                    Download Audit Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Simulate a live research memo download event.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const firstRep = reports[0];
                    if (firstRep) {
                      await logReportDownload(
                        firstRep.id,
                        'demo-audit-member',
                        'auditor@psainvestment.com'
                      );
                      showToast(`Audit log recorded for "${firstRep.title}"`);
                    }
                  }}
                  className="px-3.5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Simulate Download
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                {downloadLogs.slice(0, 6).map(log => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {log.reportTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.memberEmail}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Chronicle Tab */}
      {activeAdminTab === 'chronicle' && <ChronicleAdminDesk />}

      {/* Events & Custom Form Builder Tab */}
      {activeAdminTab === 'events' && <AdminEventsDesk />}

      {/* Google Ads Monetization Tab */}
      {activeAdminTab === 'ads' && <AdminAdsDesk />}

      {/* 2. Members Tab */}
      {activeAdminTab === 'members' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">Circle Member Roster</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter:</span>
              {['all', 'pending', 'active', 'suspended', 'rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setMemberFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    memberFilter === st
                      ? 'bg-[#0A1F44] text-[#C9A84C]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">Referrals</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map(m => (
                  <tr key={m.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{m.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{m.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C9A84C]">
                      {m.referralCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0A1F44]">{m.referralCount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : m.status === 'suspended'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(m.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                approveMember(m.uid);
                                showToast(`Approved membership for ${m.fullName}`);
                              }}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                              title="Approve Member"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setRejectModalMember(m);
                                setRejectNote('');
                              }}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                              title="Reject Application"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {m.status === 'active' && (
                          <button
                            onClick={() => {
                              suspendMember(m.uid);
                              showToast(`Suspended ${m.fullName}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Suspend"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        {m.status === 'suspended' && (
                          <button
                            onClick={() => {
                              reinstateMember(m.uid);
                              showToast(`Reinstated ${m.fullName}`);
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Reinstate"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditMemberModal(m)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-serif font-black text-lg text-rose-700">Reject Application</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to decline membership for{' '}
              <strong className="text-slate-800">{rejectModalMember.fullName}</strong>?
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feedback Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Cohort limit reached / profile outside scope..."
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalMember(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectMember(rejectModalMember.uid, rejectNote);
                  setRejectModalMember(null);
                  showToast(`Rejected ${rejectModalMember.fullName}`);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-serif font-black text-lg text-[#0A1F44]">Edit Member Record</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editMemberModal.fullName}
                  onChange={e =>
                    setEditMemberModal({ ...editMemberModal, fullName: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Referral Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={editMemberModal.referralCount}
                  onChange={e =>
                    setEditMemberModal({
                      ...editMemberModal,
                      referralCount: parseInt(e.target.value, 10) || 0
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditMemberModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateMemberRecord(editMemberModal.uid, {
                    fullName: editMemberModal.fullName,
                    referralCount: editMemberModal.referralCount
                  });
                  setEditMemberModal(null);
                  showToast('Member record updated.');
                }}
                className="px-5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2b. Staff & Management RBAC Tab */}
      {activeAdminTab === 'staff' && (
        <div className="space-y-6">
          {/* Top Bar & Stats */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                    Role-Based Access Control (RBAC)
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {staffMembers.length} Staff Credentials Authorized
                  </span>
                </div>
                <h3 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
                  Staff & Management Governance
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Assign operational access and executive roles across Management, Social Media Director, Analyst, and Partners.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewStaffName('');
                  setNewStaffEmail('');
                  setNewStaffPhone('');
                  setNewStaffRole('analyst');
                  setNewStaffTitle('Associate Equity Analyst');
                  setNewStaffDept('Research & Valuation');
                  setNewStaffNotes('');
                  setIsAddStaffModalOpen(true);
                }}
                className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-2 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Staff</span>
                <span className="font-serif font-black text-2xl text-[#0A1F44]">{staffMembers.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Management</span>
                <span className="font-serif font-black text-2xl text-purple-950">
                  {staffMembers.filter(s => s.role === 'management').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Social Media</span>
                <span className="font-serif font-black text-2xl text-rose-950">
                  {staffMembers.filter(s => s.role === 'social_media_director').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Analysts</span>
                <span className="font-serif font-black text-2xl text-emerald-950">
                  {staffMembers.filter(s => s.role === 'analyst').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Partners</span>
                <span className="font-serif font-black text-2xl text-amber-950">
                  {staffMembers.filter(s => s.role === 'partners').length}
                </span>
              </div>
            </div>

            {/* Role Definitions Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                  <Shield className="w-3.5 h-3.5 text-purple-700" />
                  <span>Management</span>
                </div>
                <p className="text-[11px] text-purple-950/80 leading-relaxed">
                  Executive oversight, firm administration, compliance checks, and member approval workflows.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                  <Video className="w-3.5 h-3.5 text-rose-700" />
                  <span>Social Media Director</span>
                </div>
                <p className="text-[11px] text-rose-950/80 leading-relaxed">
                  Directs PSA Lens video masterclasses, YouTube channel, TikTok shorts, and X (@salami_abdulslm) snippets.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Analyst</span>
                </div>
                <p className="text-[11px] text-emerald-950/80 leading-relaxed">
                  Authors institutional fundamental equity memos, DCF models, and 7 AM Financial Chronicle dispatches.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Partners</span>
                </div>
                <p className="text-[11px] text-amber-950/80 leading-relaxed">
                  Institutional syndication, SME Solar PaaS underwriting, co-investment notes, and family office roundtables.
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff by name, email, department or title..."
                value={staffSearch}
                onChange={e => setStaffSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] font-medium"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Role:
              </span>
              {(['all', 'management', 'social_media_director', 'analyst', 'partners', 'admin'] as const).map(
                r => (
                  <button
                    key={r}
                    onClick={() => setStaffRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      staffRoleFilter === r
                        ? 'bg-[#0A1F44] text-[#C9A84C]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'all'
                      ? 'All Staff'
                      : r === 'social_media_director'
                      ? 'Social Media'
                      : r === 'management'
                      ? 'Management'
                      : r === 'analyst'
                      ? 'Analyst'
                      : r === 'partners'
                      ? 'Partners'
                      : 'Admin'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Staff Member & Department</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">Assigned Access Role</th>
                    <th className="p-4">Key Permissions</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffMembers
                    .filter(s => {
                      const matchesRole =
                        staffRoleFilter === 'all' || s.role === staffRoleFilter;
                      const matchesSearch =
                        s.fullName.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.department.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.title.toLowerCase().includes(staffSearch.toLowerCase());
                      return matchesRole && matchesSearch;
                    })
                    .map(staff => {
                      const isCEO = staff.email === 'salamiabdullahi257@gmail.com' || staff.role === 'admin';

                      return (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Name & Title */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#0A1F44] text-[#C9A84C] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {staff.fullName
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{staff.fullName}</span>
                                  {isCEO && (
                                    <span className="px-1.5 py-0.2 bg-[#C9A84C]/20 text-[#0A1F44] rounded text-[9px] font-black uppercase">
                                      Founder
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">{staff.title}</div>
                                <div className="text-[10px] text-slate-400">{staff.department}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <div className="font-mono text-slate-800 font-semibold">{staff.email}</div>
                              <div className="font-mono text-slate-500 text-[11px]">{staff.phone || '—'}</div>
                            </div>
                          </td>

                          {/* Role Dropdown Selector */}
                          <td className="p-4">
                            {isCEO ? (
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0A1F44] text-[#C9A84C] border border-[#C9A84C]/40 inline-flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Executive Command</span>
                              </span>
                            ) : (
                              <div className="relative inline-block">
                                <select
                                  value={staff.role}
                                  onChange={e => {
                                    const nextRole = e.target.value as StaffRole;
                                    updateStaffRole(staff.id, nextRole);
                                    showToast(`Assigned ${staff.fullName} to ${nextRole.toUpperCase()} role.`);
                                  }}
                                  className="px-3 py-1.5 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#C9A84C] cursor-pointer appearance-none shadow-2xs"
                                >
                                  <option value="management">Management</option>
                                  <option value="social_media_director">Social Media Director</option>
                                  <option value="analyst">Analyst</option>
                                  <option value="partners">Partners</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                              </div>
                            )}
                          </td>

                          {/* Key Permissions */}
                          <td className="p-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {staff.permissions.slice(0, 2).map((perm, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                                >
                                  {perm}
                                </span>
                              ))}
                              {staff.permissions.length > 2 && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-bold">
                                  +{staff.permissions.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                staff.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  staff.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                              {staff.status === 'active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            {!isCEO && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    const nextStatus = staff.status === 'active' ? 'suspended' : 'active';
                                    updateStaffStatus(staff.id, nextStatus);
                                    showToast(
                                      `${staff.fullName} credential ${
                                        nextStatus === 'active' ? 'activated' : 'suspended'
                                      }.`
                                    );
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                  title={staff.status === 'active' ? 'Suspend Access' : 'Activate Access'}
                                >
                                  {staff.status === 'active' ? (
                                    <UserX className="w-3.5 h-3.5 text-amber-600" />
                                  ) : (
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove staff credential for ${staff.fullName}?`)) {
                                      deleteStaffMember(staff.id);
                                      showToast(`Removed staff member ${staff.fullName}.`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Staff Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Staff Modal */}
          {isAddStaffModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C]">
                      Staff Provisioning Desk
                    </span>
                    <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                      Add New Staff / Management Member
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

                    await addStaffMember({
                      fullName: newStaffName.trim(),
                      email: newStaffEmail.trim().toLowerCase(),
                      phone: newStaffPhone.trim() || undefined,
                      role: newStaffRole,
                      title: newStaffTitle.trim() || 'Staff Officer',
                      department: newStaffDept.trim() || 'General Operations',
                      status: 'active',
                      notes: newStaffNotes.trim() || undefined,
                      permissions: []
                    });

                    setIsAddStaffModalOpen(false);
                    showToast(`Successfully added ${newStaffName} as ${newStaffRole.toUpperCase()}.`);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal / Professional Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babajide Olufemi"
                      value={newStaffName}
                      onChange={e => setNewStaffName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Corporate / Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@psainvestment.com"
                        value={newStaffEmail}
                        onChange={e => setNewStaffEmail(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Direct Phone Line
                      </label>
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={newStaffPhone}
                        onChange={e => setNewStaffPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium"
                      />
                    </div>
                  </div>

                  {/* Role Selector with Explanatory Badges */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Assign Access Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          role: 'management' as StaffRole,
                          label: 'Management',
                          desc: 'Executive oversight & compliance'
                        },
                        {
                          role: 'social_media_director' as StaffRole,
                          label: 'Social Media Director',
                          desc: 'PSA Lens, YouTube & social channels'
                        },
                        {
                          role: 'analyst' as StaffRole,
                          label: 'Analyst',
                          desc: 'DCF models, reports & 7 AM Chronicle'
                        },
                        {
                          role: 'partners' as StaffRole,
                          label: 'Partners',
                          desc: 'Commercial Solar & syndication'
                        }
                      ].map(r => (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => {
                            setNewStaffRole(r.role);
                            if (r.role === 'management') {
                              setNewStaffTitle('Operations & Management Director');
                              setNewStaffDept('Executive Management');
                            } else if (r.role === 'social_media_director') {
                              setNewStaffTitle('Director of Social Media Communications');
                              setNewStaffDept('Media & Public Relations');
                            } else if (r.role === 'analyst') {
                              setNewStaffTitle('Senior Equity Research Analyst');
                              setNewStaffDept('Research & Valuation');
                            } else if (r.role === 'partners') {
                              setNewStaffTitle('Managing Partner - Capital Alliances');
                              setNewStaffDept('Strategic Partnerships');
                            }
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            newStaffRole === r.role
                              ? 'border-[#0A1F44] bg-[#0A1F44] text-white shadow-xs'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{r.label}</span>
                            {newStaffRole === r.role && <Check className="w-3.5 h-3.5 text-[#C9A84C]" />}
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 leading-snug ${
                              newStaffRole === r.role ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {r.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Executive Title / Designation
                      </label>
                      <input
                        type="text"
                        value={newStaffTitle}
                        onChange={e => setNewStaffTitle(e.target.value)}
                        placeholder="e.g. Senior Equity Research Analyst"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={newStaffDept}
                        onChange={e => setNewStaffDept(e.target.value)}
                        placeholder="e.g. Research & Valuation"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Internal Notes / Operational Scope
                    </label>
                    <textarea
                      rows={2}
                      value={newStaffNotes}
                      onChange={e => setNewStaffNotes(e.target.value)}
                      placeholder="Notes regarding specific coverage or advisory mandates..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C9A84C] font-medium resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddStaffModalOpen(false)}
                      className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize & Deploy Access</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Reports Tab */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              Research Reports Management
            </h3>
            <button
              onClick={() => {
                setEditingReport({
                  category: 'Market Report',
                  access: 'public',
                  status: 'published',
                  author: 'Salami Abdullahi',
                  recommendation: 'Buy'
                });
                setReportModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Access</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs truncate">
                      {r.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C9A84C]">
                      {r.ticker || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{r.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.access === 'premium'
                            ? 'bg-[#C9A84C]/20 text-[#0A1F44]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.access}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{r.downloadCount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingReport(r);
                            setReportModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Edit Report"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteReport(r.id);
                            showToast(`Deleted ${r.title}`);
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Modal Editor */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h4 className="font-serif font-black text-xl text-[#0A1F44]">
              {editingReport.id ? 'Edit Research Report' : 'Create Research Report'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={editingReport.title || ''}
                  onChange={e => setEditingReport({ ...editingReport, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ticker</label>
                  <input
                    type="text"
                    placeholder="e.g. SEPLAT"
                    value={editingReport.ticker || ''}
                    onChange={e => setEditingReport({ ...editingReport, ticker: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Price
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₦5,850.00"
                    value={editingReport.targetPrice || ''}
                    onChange={e =>
                      setEditingReport({ ...editingReport, targetPrice: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingReport.category || 'Market Report'}
                    onChange={e => setEditingReport({ ...editingReport, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Market Report">Market Report</option>
                    <option value="Equity Valuation">Equity Valuation</option>
                    <option value="Industry Analysis">Industry Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Access</label>
                  <select
                    value={editingReport.access || 'public'}
                    onChange={e =>
                      setEditingReport({
                        ...editingReport,
                        access: e.target.value as 'public' | 'premium'
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="public">Public</option>
                    <option value="premium">Circle Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recommendation
                  </label>
                  <select
                    value={editingReport.recommendation || 'Buy'}
                    onChange={e =>
                      setEditingReport({
                        ...editingReport,
                        recommendation: e.target.value as any
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Strong Buy">Strong Buy</option>
                    <option value="Buy">Buy</option>
                    <option value="Hold">Hold</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary *</label>
                <textarea
                  rows={2}
                  value={editingReport.summary || ''}
                  onChange={e => setEditingReport({ ...editingReport, summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Report Body (Markdown) *
                </label>
                <textarea
                  rows={8}
                  value={editingReport.body || ''}
                  onChange={e => setEditingReport({ ...editingReport, body: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await saveReport(editingReport);
                  setReportModalOpen(false);
                  showToast('Report saved successfully.');
                }}
                className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Videos Tab */}
      {activeAdminTab === 'videos' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              PSA Lens Video Manager
            </h3>
            <button
              onClick={() => {
                setEditingVideo({
                  topicTag: 'NGX Basics',
                  status: 'published',
                  duration: '15:00'
                });
                setVideoModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map(v => (
              <div
                key={v.id}
                className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C9A84C]">
                    {v.topicTag} • {v.duration}
                  </span>
                  <h4 className="font-bold text-sm text-[#0A1F44] mt-1">{v.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{v.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">ID: {v.youtubeId}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingVideo(v);
                        setVideoModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteVideo(v.id);
                        showToast(`Deleted ${v.title}`);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Editor */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h4 className="font-serif font-black text-xl text-[#0A1F44]">
              {editingVideo.id ? 'Edit Video Lesson' : 'Add New Video Lesson'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={editingVideo.title || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube URL or ID *
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editingVideo.youtubeUrl || editingVideo.youtubeId || ''}
                  onChange={e => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={editingVideo.topicTag || 'NGX Basics'}
                    onChange={e => setEditingVideo({ ...editingVideo, topicTag: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration || '15:00'}
                    onChange={e => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingVideo.description || ''}
                  onChange={e =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await saveVideo(editingVideo);
                  setVideoModalOpen(false);
                  showToast('Video saved.');
                }}
                className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Inbound Contacts Tab */}
      {activeAdminTab === 'contacts' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <h3 className="font-serif font-black text-xl text-[#0A1F44]">
            Inbound Consultation Leads ({contactSubmissions.length})
          </h3>

          {contactSubmissions.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No consultation requests submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {contactSubmissions.map(lead => (
                <div
                  key={lead.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-[#0A1F44]">{lead.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{lead.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#0A1F44]">
                        {lead.service}
                      </span>
                      <select
                        value={lead.status}
                        onChange={e =>
                          updateContactStatus(
                            lead.id,
                            e.target.value as 'unread' | 'reviewed' | 'archived'
                          )
                        }
                        className="text-xs p-1 bg-white border border-slate-200 rounded-lg outline-none font-semibold"
                      >
                        <option value="unread">Unread</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => deleteContact(lead.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="font-bold mb-1 text-slate-900">{lead.subject}</div>
                    <p className="leading-relaxed">{lead.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Email Outbox Tab */}
      {activeAdminTab === 'emails' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Automated Email Outbox
              </h3>
              <p className="text-xs text-slate-500">
                Log of automated member approvals, applications, and dispatches.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {emailLogs.map(log => (
              <div key={log.id} className="py-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{log.recipientName}</span>
                    <span className="text-slate-400 font-mono">({log.recipientEmail})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.sentAt).toLocaleString()}
                  </span>
                </div>
                <div className="font-semibold text-[#0A1F44]">{log.subject}</div>
                <p className="text-[11px] text-slate-500 whitespace-pre-line line-clamp-2">
                  {log.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Storage Tab */}
      {activeAdminTab === 'storage' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              Storage File Repository
            </h3>
            <button
              onClick={() => {
                setNewFileName('');
                setNewFileUrl('');
                setFileModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Storage Asset</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storageFiles.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800 max-w-xs truncate">
                      {f.name}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">
                      {f.type}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {(f.sizeBytes / 1000000).toFixed(2)} MB
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(f.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteStorageFile(f.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {fileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-serif font-black text-lg text-[#0A1F44]">
              Register Storage File
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Banking-Recapitalization-Model.pdf"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Download URL *
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newFileUrl}
                  onChange={e => setNewFileUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="image">Image Asset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Size (Bytes)
                  </label>
                  <input
                    type="number"
                    value={newFileSize}
                    onChange={e => setNewFileSize(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFileModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newFileName || !newFileUrl) return;
                  await addStorageFile({
                    name: newFileName,
                    url: newFileUrl,
                    type: newFileType,
                    sizeBytes: newFileSize,
                    uploadedBy: 'Salami Abdullahi'
                  });
                  setFileModalOpen(false);
                  showToast('Storage file added.');
                }}
                className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save File Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Profile Tab */}
      {activeAdminTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-black text-2xl text-[#0A1F44]">
              Executive Administrator Profile
            </h3>
            <p className="text-xs text-slate-500">
              Customize the Chief Analyst public identity and contact details.
            </p>
          </div>

          {adminProfileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Executive profile updated successfully.</span>
            </div>
          )}

          <form
            onSubmit={async e => {
              e.preventDefault();
              await updateAdminProfile({
                fullName: adminFullName.trim(),
                phone: adminPhone.trim(),
                title: adminTitle.trim(),
                bio: adminBio.trim(),
                photoUrl: adminPhotoUrl.trim() || undefined
              });
              setAdminProfileSaved(true);
              setTimeout(() => setAdminProfileSaved(false), 3000);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={adminFullName}
                onChange={e => setAdminFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Title
              </label>
              <input
                type="text"
                required
                value={adminTitle}
                onChange={e => setAdminTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Bio & Philosophy
              </label>
              <textarea
                rows={4}
                required
                value={adminBio}
                onChange={e => setAdminBio(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avatar / Photo URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={adminPhotoUrl}
                onChange={e => setAdminPhotoUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              Save Executive Administrator Changes
            </button>
          </form>
        </div>
      )}

      {/* 11. Security & Injection Firewall Tab */}
      {activeAdminTab === 'security' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Production Hardened
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-emerald-700 font-semibold">Firewall Active</span>
              </div>
              <h2 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
                Security Architecture & Injection Defense
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Active multi-layer protection neutralizing SQL injection vectors, Cross-Site Scripting (XSS), script exploits, and malicious payloads across all member inputs, transcripts, and contact forms.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSecurityLogs(getSecurityAuditLogs());
                  showToast('Security audit logs refreshed.');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0A1F44] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Audit Log</span>
              </button>
            </div>
          </div>

          {/* Defense Posture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900">SQL Injection Shield</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Disarms UNION SELECT, stacked queries (;), OR 1=1, comment tokens (--/*), and parameter evasion attempts.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-emerald-700">
                STATUS: 100% PROTECTED
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900">XSS & Script Stripper</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Neutralizes &lt;script&gt;, &lt;iframe&gt;, javascript: URIs, and dangerous on* event attributes in comments and forms.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-blue-700">
                STATUS: ACTIVE FILTERING
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900">RBAC Governance</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Enforced role boundaries for CEO/COO, Analysts, Partners, Social Media Directors, and Circle Members.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-amber-700">
                STATUS: STRICT ISOLATION
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900">Production Headers</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and strict HSTS configured in vercel.json.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-purple-700">
                STATUS: DEPLOY READY
              </div>
            </div>
          </div>

          {/* Interactive Penetration & Injection Testing Sandbox */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#0A1F44]" />
              <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
                Interactive Penetration & Injection Testing Sandbox
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify the defense system yourself. Inject any attack payload below to test real-time signature detection and disarming mechanisms.
            </p>

            {/* Quick Test Vectors */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Quick Test Payloads:</span>
              <button
                onClick={() => setTestPayload("' OR '1'='1' --")}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-mono cursor-pointer"
              >
                ' OR '1'='1' --
              </button>
              <button
                onClick={() => setTestPayload("UNION SELECT null, username, password FROM users--")}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-mono cursor-pointer"
              >
                UNION SELECT users--
              </button>
              <button
                onClick={() => setTestPayload("<script>alert('XSS Exploit')</script>")}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-mono cursor-pointer"
              >
                &lt;script&gt;alert()&lt;/script&gt;
              </button>
              <button
                onClick={() => setTestPayload("'; DROP TABLE members; --")}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-mono cursor-pointer"
              >
                DROP TABLE members;
              </button>
              <button
                onClick={() => setTestPayload("<img src=x onerror=alert(1)>")}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-mono cursor-pointer"
              >
                &lt;img onerror=alert(1)&gt;
              </button>
            </div>

            {/* Input & Action */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={testPayload}
                  onChange={e => setTestPayload(e.target.value)}
                  placeholder="Enter test SQL or HTML script injection vector..."
                  className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-[#C9A84C]"
                />
                <button
                  onClick={() => {
                    const check = checkSqlSafety(testPayload);
                    const sanitized = sanitizeText(check.sanitized);
                    setTestResult({
                      isSafe: check.isSafe,
                      detected: check.detectedPattern,
                      sanitized
                    });
                    if (!check.isSafe) {
                      logSecurityEvent(
                        'Simulated Penetration Test',
                        'Security Admin Console',
                        'input_threat',
                        `Disarmed vector: '${check.detectedPattern}' in sandbox test.`,
                        'medium'
                      );
                      setSecurityLogs(getSecurityAuditLogs());
                    }
                  }}
                  className="px-6 py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Run Defense Test
                </button>
              </div>

              {/* Test Output Evaluation */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl border text-xs font-sans space-y-2 ${
                    !testResult.isSafe
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {!testResult.isSafe
                        ? 'Malicious Vector Detected & Neutralized'
                        : 'Clean / Safe Input Verified'}
                    </span>
                    {!testResult.isSafe && (
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">
                        DEFENSE SUCCESSFUL
                      </span>
                    )}
                  </div>
                  {!testResult.isSafe && (
                    <div className="text-[11px] font-mono text-slate-700">
                      Detected Attack Pattern: <span className="font-bold text-rose-700">"{testResult.detected}"</span>
                    </div>
                  )}
                  <div className="text-[11px] font-mono bg-white/70 p-2.5 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Sanitized / Safe Output:</div>
                    <div className="text-slate-900 mt-0.5 break-all">
                      {testResult.sanitized || '(Empty string after script stripping)'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Audit Trail Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
                  Security Audit Trail & Integrity Log
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time tamper-evident log tracking authentication, administrative state changes, and disarmed threat attempts.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                {securityLogs.length} Events Recorded
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#0A1F44] text-[#C9A84C] uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Technical Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {securityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{log.actor}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.severity === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : log.severity === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
