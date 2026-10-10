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
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Member, ResearchReport, LearningVideo, StorageFile } from '../types';

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
    saveReport,
    deleteReport,
    saveVideo,
    deleteVideo,
    approveMember,
    rejectMember,
    suspendMember,
    reinstateMember,
    updateMemberRecord,
    updateContactStatus,
    deleteContact,
    addStorageFile,
    deleteStorageFile,
    logReportDownload,
    refreshData
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'members' | 'reports' | 'videos' | 'contacts' | 'emails' | 'storage' | 'profile'
  >('analytics');

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
  const [adminPhone, setAdminPhone] = useState(memberProfile?.phone || '+234 803 000 0000');
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
    </div>
  );
};
