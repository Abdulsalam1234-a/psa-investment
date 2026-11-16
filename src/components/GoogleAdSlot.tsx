import React, { useEffect, useState } from 'react';
import { DollarSign, ExternalLink, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

interface GoogleAdSlotProps {
  slotType: 'leaderboard' | 'rectangle' | 'in-feed' | 'sidebar';
  slotId?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotType,
  slotId,
  className = ''
}) => {
  const { googleAdsConfig } = useData();
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!googleAdsConfig?.enabled) return;

    // Load Google AdSense script once if publisher ID is configured
    if (googleAdsConfig.publisherId && !document.getElementById('google-adsense-script')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsConfig.publisherId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // Ad blocker or script prevented
      console.warn('AdSense slot init notice:', e);
    }
  }, [googleAdsConfig]);

  if (!googleAdsConfig?.enabled) {
    return null;
  }

  // Real Google Ads markup when publisherId and slotId are live
  if (googleAdsConfig.publisherId && !googleAdsConfig.testMode) {
    const targetSlot = slotId || googleAdsConfig.leaderboardSlot || '1234567890';
    return (
      <div className={`google-ad-container my-4 text-center overflow-hidden ${className}`}>
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-semibold mb-1">
          Advertisement • Sponsored Placement
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={googleAdsConfig.publisherId}
          data-ad-slot={targetSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Institutional Preview / Test Mode Ad Banner
  return (
    <div
      className={`my-6 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-amber-50/30 p-4 shadow-xs overflow-hidden relative ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                Google Ads Placement
              </span>
              <span className="text-[10px] text-slate-500 font-sans font-medium">
                Format: {slotType.toUpperCase()}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#0A1F44] mt-0.5">
              Verified Capital Markets Intelligence & Corporate Sponsorship
            </h4>
            <p className="text-[11px] text-slate-500">
              Institutional visibility for NGX-listed firms, asset managers & financial institutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
            AdSense Active (Pub: {googleAdsConfig.publisherId || 'ca-pub-demo'})
          </span>
        </div>
      </div>
    </div>
  );
};
