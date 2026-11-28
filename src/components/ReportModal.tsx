import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Calendar,
  Clock,
  User,
  Tag,
  Lock,
  ShieldCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ResearchReport } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ResourceComments } from './ResourceComments';

interface ReportModalProps {
  report: ResearchReport | null;
  onClose: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  report,
  onClose,
  onOpenAuthModal
}) => {
  const { currentUser, memberProfile, isAdmin } = useAuth();
  const { logReportDownload } = useData();

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Lock background scrolling and attach Escape key listener when report modal is open
  useEffect(() => {
    if (report) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
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
  }, [report, onClose]);

  if (!report) return null;

  const isLocked =
    report.access === 'premium' &&
    !isAdmin &&
    (!memberProfile || memberProfile.status !== 'active');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const memberId = currentUser?.uid || memberProfile?.uid || 'guest-user';
      const memberEmail = currentUser?.email || memberProfile?.email || 'guest@psainvestment.com.ng';

      await logReportDownload(report.id, memberId, memberEmail);

      // Trigger simulated PDF download file
      const blob = new Blob(
        [
          `PSA INVESTMENT - INSTITUTIONAL RESEARCH MEMO\n\n` +
            `Title: ${report.title}\n` +
            `Ticker: ${report.ticker || 'N/A'}\n` +
            `Author: ${report.author}\n` +
            `Target Price: ${report.targetPrice || 'N/A'}\n` +
            `Recommendation: ${report.recommendation || 'N/A'}\n` +
            `Date: ${new Date(report.createdAt).toLocaleDateString()}\n\n` +
            `============================================================\n\n` +
            report.body
        ],
        { type: 'application/pdf' }
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                report.access === 'premium'
                  ? 'bg-[#C9A84C]/20 text-[#0A1F44] border border-[#C9A84C]/40'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {report.access === 'premium' ? 'Analyst Circle Exclusive' : 'Public Report'}
            </span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              PSA Equity Research Desk
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isLocked && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Saved to Device</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Preparing...' : 'Download PDF Note'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 flex-1">
          {/* Header Metadata */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#C9A84C] tracking-wider">
                {report.category}
              </span>
              {report.ticker && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0A1F44]">
                  {report.ticker}
                </span>
              )}
              {report.recommendation && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    report.recommendation.includes('Buy')
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.recommendation.includes('Hold')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {report.recommendation}
                </span>
              )}
              {report.targetPrice && (
                <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  Target: <strong>{report.targetPrice}</strong>
                </span>
              )}
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A1F44] tracking-tight leading-snug">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="text-slate-800 font-semibold">{report.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.downloadCount} Downloads</span>
              </div>
            </div>
          </div>

          {/* Locked State for Premium Memos */}
          {isLocked ? (
            <div className="bg-[#0A1F44] bg-gradient-to-b from-slate-950 via-[#0A1F44] to-[#07152E] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="font-serif font-black text-2xl text-white">
                  Restricted to PSA Analyst Circle Members
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  This exclusive valuation note contains proprietary institutional DCF spreadsheets,
                  sovereign debt stress-testing, and detailed cashflow forecasts.
                </p>
              </div>

              <div className="p-4 bg-[#07152E] rounded-2xl border border-slate-700 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300 shadow-md">
                <div className="font-bold text-[#C9A84C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  What is included in this valuation note:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>Full 12-Month Price Target sensitivity matrix</li>
                  <li>ANOH gas processing EBITDA contribution model</li>
                  <li>Brent oil hedging derivatives schedule</li>
                  <li>Downloadable Excel financial model</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuthModal('signup');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Apply for Free Circle Membership
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuthModal('login');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Sign In to Active Account
                </button>
              </div>
            </div>
          ) : (
            /* Unlocked Full Body Content */
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-6 text-sm">
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Executive Summary</strong>
                  {report.summary}
                </div>
              </div>

              {/* Markdown-style Rendered Text */}
              <div className="space-y-4">
                {report.body.split('\n\n').map((block, idx) => {
                  if (block.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="font-serif font-black text-xl text-[#0A1F44] border-b border-slate-200 pb-2 mt-6"
                      >
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-bold text-base text-[#0A1F44] mt-4">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.includes('| :---') || block.includes('| Bank Ticker')) {
                    const rows = block.split('\n').filter(r => r.trim() && !r.includes(':---'));
                    return (
                      <div key={idx} className="overflow-x-auto my-4">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                          <tbody className="divide-y divide-slate-200">
                            {rows.map((row, rIdx) => {
                              const cols = row
                                .split('|')
                                .map(c => c.trim())
                                .filter(c => c);
                              const isHeader = rIdx === 0;
                              return (
                                <tr
                                  key={rIdx}
                                  className={isHeader ? 'bg-[#0A1F44] text-[#C9A84C] font-bold' : 'hover:bg-slate-50'}
                                >
                                  {cols.map((col, cIdx) => (
                                    <td key={cIdx} className="p-3 whitespace-nowrap">
                                      {col.replace(/\*\*/g, '')}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (block.startsWith('- ') || block.startsWith('1. ')) {
                    const items = block.split('\n');
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
                        {items.map((it, iIdx) => (
                          <li key={iIdx}>
                            {it.replace(/^[-*]\s+|\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed">
                      {block.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analyst Circle Discussion on this Report */}
          <ResourceComments
            resourceId={report.id}
            resourceType="report"
            resourceTitle={report.title}
            onOpenAuthModal={onOpenAuthModal}
          />
        </div>
      </div>
    </div>
  );
};
