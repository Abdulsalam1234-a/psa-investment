import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Sparkles,
  Calendar,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Announcement, ViewTab } from '../types';

interface NotificationPopupProps {
  onNavigateTab?: (tab: ViewTab) => void;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  onNavigateTab,
  isOpenControlled,
  onCloseControlled
}) => {
  const { announcements, dismissAnnouncement } = useData();
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Sync with controlled prop if provided
  useEffect(() => {
    if (isOpenControlled !== undefined) {
      setShowDrawer(isOpenControlled);
    }
  }, [isOpenControlled]);

  // Check for auto pop-up high priority announcement
  useEffect(() => {
    const pop = announcements.find(a => a.popupAlert && !a.dismissed);
    if (pop) {
      const dismissedIds = JSON.parse(localStorage.getItem('psa_dismissed_announcements') || '[]');
      if (!dismissedIds.includes(pop.id)) {
        // Show after a gentle 1.5 second delay on page load
        const timer = setTimeout(() => {
          setActiveAnnouncement(pop);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [announcements]);

  // Escape key listener for active announcement or notification drawer
  useEffect(() => {
    if (activeAnnouncement || showDrawer) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (activeAnnouncement) {
            handleDismissAlert(activeAnnouncement.id);
          }
          if (showDrawer) {
            setShowDrawer(false);
            if (onCloseControlled) onCloseControlled();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeAnnouncement, showDrawer, onCloseControlled]);

  const handleDismissAlert = (id: string) => {
    dismissAnnouncement(id);
    setActiveAnnouncement(null);
  };

  const handleActionClick = (ann: Announcement) => {
    if (ann.linkUrl?.includes('events') || ann.category === 'event') {
      if (onNavigateTab) {
        onNavigateTab('events');
      }
    }
    handleDismissAlert(ann.id);
  };

  return (
    <>
      {/* HIGH PRIORITY POPUP ALERT MODAL */}
      {activeAnnouncement && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismissAlert(activeAnnouncement.id);
          }}
          className="fixed inset-0 z-[10000] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0A1F44] p-5 text-white relative">
              <button
                onClick={() => handleDismissAlert(activeAnnouncement.id)}
                aria-label="Dismiss alert"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-ping" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C] bg-white/10 px-2 py-0.5 rounded">
                  Official Institutional Announcement
                </span>
              </div>

              <h3 className="font-serif font-black text-lg text-white">
                {activeAnnouncement.title}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeAnnouncement.content}
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <span>
                  All registered members enjoy priority seat reservation and syllabus downloads.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleDismissAlert(activeAnnouncement.id)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => handleActionClick(activeAnnouncement)}
                  className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeAnnouncement.linkText || 'View Event & Register'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER / FLYOUT */}
      {showDrawer && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDrawer(false);
              if (onCloseControlled) onCloseControlled();
            }
          }}
          className="fixed inset-0 z-[9998] bg-slate-950/40 backdrop-blur-xs flex justify-end"
        >
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-[#0A1F44] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C9A84C]" />
                <h3 className="font-serif font-black text-base">Announcements & Intelligence</h3>
              </div>
              <button
                onClick={() => {
                  setShowDrawer(false);
                  if (onCloseControlled) onCloseControlled();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Items */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No announcements at this time.
                </div>
              ) : (
                announcements.map(ann => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0A1F44] bg-[#C9A84C]/20 px-1.5 py-0.5 rounded">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#0A1F44]">{ann.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{ann.summary}</p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleActionClick(ann)}
                        className="text-[11px] font-bold text-[#0A1F44] hover:text-[#C9A84C] flex items-center gap-1 cursor-pointer"
                      >
                        <span>{ann.linkText || 'Details'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => dismissAnnouncement(ann.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
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
