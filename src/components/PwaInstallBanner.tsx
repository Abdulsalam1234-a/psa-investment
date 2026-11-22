import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, Sparkles, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('psa_pwa_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const isRecentlyDismissed = Date.now() - dismissedTime < 24 * 60 * 60 * 1000;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isRecentlyDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    // If on iOS and not standalone and not recently dismissed, show banner after brief delay
    if (isIosDevice && !isRecentlyDismissed && !window.matchMedia('(display-mode: standalone)').matches) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Lock background scrolling and attach Escape key listener when iOS guide modal is open
  useEffect(() => {
    if (showIosGuide) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowIosGuide(false);
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
  }, [showIosGuide]);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowBanner(false);
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIosGuide(false);
    localStorage.setItem('psa_pwa_dismissed', Date.now().toString());
  };

  if (installed || !showBanner) return null;

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0A1F44] text-white p-4 rounded-2xl shadow-2xl border border-[#C9A84C]/40 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F2752] to-[#0A1F44] border border-[#C9A84C] flex items-center justify-center shrink-0 shadow-md">
              <span className="font-serif font-black text-sm text-[#C9A84C]">PSA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">
                  Mobile App
                </span>
                <span className="text-xs font-bold text-white">Install PSA App</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Install on your mobile phone for instant 07:00 WAT dispatches, offline access & events.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIos ? 'How to Install on iPhone' : 'Install App Now'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowIosGuide(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#0A1F44]" />
                <h3 className="font-serif font-bold text-base text-[#0A1F44]">
                  Install on iOS / iPhone
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Safari on iOS does not support one-click automatic installation, but you can install PSA Investment to your home screen in two simple steps:
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    Tap the Share Button
                    <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Look at the bottom toolbar in Safari and tap the square icon with the upward arrow.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    Tap "Add to Home Screen"
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Scroll down in the share sheet and tap <strong>"Add to Home Screen"</strong>, then tap <strong>"Add"</strong>.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIosGuide(false);
                setShowBanner(false);
              }}
              className="w-full py-2.5 bg-[#0A1F44] text-[#C9A84C] font-bold text-xs rounded-xl hover:bg-[#13306B] transition-all cursor-pointer"
            >
              Got It, Thank You!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
