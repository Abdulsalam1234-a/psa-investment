import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';

interface CookieConsentProps {
  onNavigatePrivacy?: () => void;
}

const CONSENT_STORAGE_KEY = 'psa_cookie_consent_status';

export const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigatePrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        // Show after a brief delay for optimal page rendering
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted_' + new Date().toISOString());
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'dismissed_' + new Date().toISOString());
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Local Storage Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-[#0A1F44] text-white p-5 rounded-2xl border border-[#C9A84C]/40 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#C9A84C] font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-[#C9A84C]" />
            <span>Privacy &amp; Data Protection (NDPA 2023)</span>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Close Cookie Notice"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          PSA Investment uses essential local storage and security tokens to maintain your session, protect against unauthorized access, and preserve research preferences.
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          {onNavigatePrivacy && (
            <button
              onClick={() => {
                setIsVisible(false);
                onNavigatePrivacy();
              }}
              className="text-xs text-[#C9A84C] hover:underline font-semibold cursor-pointer"
            >
              Read Privacy Policy
            </button>
          )}

          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Accept Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
