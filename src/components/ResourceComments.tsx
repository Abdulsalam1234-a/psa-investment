import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ResourceType } from '../types';

interface ResourceCommentsProps {
  resourceId: string;
  resourceType: ResourceType;
  resourceTitle?: string;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const ResourceComments: React.FC<ResourceCommentsProps> = ({
  resourceId,
  resourceType,
  resourceTitle,
  onOpenAuthModal
}) => {
  const { comments, addComment, deleteComment, likeComment } = useData();
  const { currentUser, memberProfile, isAdmin } = useAuth();

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Filter comments for this specific resource
  const resourceComments = comments.filter(c => c.resourceId === resourceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const authorName =
        currentUser?.displayName || memberProfile?.fullName || 'Circle Analyst';
      const authorEmail =
        currentUser?.email || memberProfile?.email || 'analyst@circle.psainvestment.com';

      let authorTier = 'Associate Analyst';
      if (isAdmin) {
        authorTier = 'Chief Analyst';
      } else if (memberProfile?.membershipTier === 'institutional') {
        authorTier = 'Partner / Fellow';
      } else if (memberProfile?.membershipTier === 'executive') {
        authorTier = 'Charter Analyst';
      }

      const authorRole = isAdmin
        ? 'Founder & Chief Analyst'
        : memberProfile?.status === 'active'
        ? 'Analyst Circle Member'
        : 'Circle Candidate';

      await addComment({
        resourceId,
        resourceType,
        authorId: currentUser?.uid || memberProfile?.uid || `anon-${Date.now()}`,
        authorName,
        authorEmail,
        authorTier,
        authorRole,
        content: commentText.trim()
      });

      setCommentText('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierBadgeStyle = (tier: string) => {
    if (tier.includes('Chief')) {
      return 'bg-[#0A1F44] text-[#C9A84C] border border-[#C9A84C]/40';
    }
    if (tier.includes('Partner') || tier.includes('Fellow')) {
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    }
    if (tier.includes('Charter')) {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    return 'bg-blue-50 text-blue-800 border border-blue-200';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="mt-8 pt-8 border-t border-slate-200 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-black text-lg text-[#0A1F44]">
              Analyst Circle Commentary & Inquiries
            </h4>
            <p className="text-xs text-slate-500">
              Technical Q&A, valuation sensitivity adjustments, and institutional feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">
            {resourceComments.length} {resourceComments.length === 1 ? 'Comment' : 'Comments'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Members Only
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your technical commentary has been published to the resource thread.</span>
        </div>
      )}

      {/* Comment Form for Members / Prompt for Visitors */}
      {currentUser || memberProfile ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-[#C9A84C] text-[10px] font-black flex items-center justify-center">
                {getInitials(currentUser?.displayName || memberProfile?.fullName || 'Analyst')}
              </span>
              <span className="font-bold text-[#0A1F44]">
                {currentUser?.displayName || memberProfile?.fullName}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isAdmin ? 'bg-[#C9A84C]/20 text-[#0A1F44]' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isAdmin ? 'Chief Analyst' : memberProfile?.membershipTier || 'Analyst Circle Member'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Press post when complete</span>
          </div>

          <textarea
            rows={3}
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={`Ask a question regarding ${resourceTitle || 'this memo'}, suggest DCF adjustments, or add pre-market insight...`}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#C9A84C] transition-all font-medium leading-relaxed resize-none shadow-xs"
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-slate-400">
              Respect professional decorum. Comments are archived for institutional records.
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] disabled:opacity-50 text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Inquiries'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h5 className="font-serif font-black text-sm text-[#0A1F44]">
              Analyst Circle Members Discussion
            </h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Inquiries and model discussions are restricted to active PSA Analyst Circle members.
            </p>
          </div>
          {onOpenAuthModal && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                Sign In to Account
              </button>
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply for Membership
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {resourceComments.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            No institutional comments posted yet. Be the first to initiate technical discussion on this resource.
          </div>
        ) : (
          resourceComments.map(comment => {
            const isAuthor =
              currentUser?.uid === comment.authorId ||
              currentUser?.email === comment.authorEmail;
            const canDelete = isAuthor || isAdmin;

            return (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5 transition-all hover:border-slate-300"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-[#C9A84C] text-xs font-black flex items-center justify-center shrink-0">
                      {getInitials(comment.authorName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0A1F44]">
                          {comment.authorName}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getTierBadgeStyle(
                            comment.authorTier
                          )}`}
                        >
                          {comment.authorTier}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}{' '}
                          •{' '}
                          {new Date(comment.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {comment.authorRole && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 font-medium">{comment.authorRole}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Comment Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal pl-10">
                  {comment.content}
                </p>

                {/* Comment Actions / Likes */}
                <div className="flex items-center gap-4 pl-10 pt-1 text-[11px] text-slate-500">
                  <button
                    onClick={() => likeComment(comment.id)}
                    className="flex items-center gap-1.5 hover:text-[#0A1F44] font-medium transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-[#C9A84C]" />
                    <span>{comment.likes || 0} Upvotes</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
