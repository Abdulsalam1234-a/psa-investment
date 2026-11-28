import { MarketBriefing } from '../types';

export const INITIAL_MARKET_BRIEFINGS: MarketBriefing[] = [
  {
    id: 'briefing-2026-11-27',
    slug: 'ngx-pre-market-briefing-2026-11-27',
    title: 'NGX Pre-Market Briefing: Banking Crosses Expand Turnover as ASI Tests 253,000 Milestone',
    date: '2026-11-27',
    volume: 'VOL. LVII',
    asiSnapshot: {
      asi: '252,890.40 pts',
      dayChange: '+0.21% (+523.60 pts)',
      marketCap: '₦164.20 Trillion',
      volume: '1.85 Billion units',
      value: '₦42.15 Billion',
      deals: '26,104 deals',
      breadth: 'Positive (1.35x - 27 Gainers / 20 Decliners)'
    },
    topGainers: [
      { ticker: 'GTCO', name: 'Guaranty Trust Holding Co', close: '₦119.20', change: '+3.65%' },
      { ticker: 'FIDSON', name: 'Fidson Healthcare Plc', close: '₦94.50', change: '+9.88%' },
      { ticker: 'PRESCO', name: 'Presco Plc', close: '₦620.00', change: '+5.44%' },
      { ticker: 'STANBIC', name: 'Stanbic IBTC Holdings', close: '₦168.00', change: '+3.07%' },
      { ticker: 'OANDO', name: 'Oando Plc', close: '₦88.50', change: '+4.73%' }
    ],
    topLosers: [
      { ticker: 'INTBREW', name: 'International Breweries', close: '₦8.10', change: '-3.57%' },
      { ticker: 'HONYFLOUR', name: 'Honeywell Flour Mills', close: '₦30.20', change: '-3.82%' },
      { ticker: 'TANTALIZER', name: 'Tantalizers Plc', close: '₦3.30', change: '-5.71%' },
      { ticker: 'VITAFOAM', name: 'Vitafoam Nigeria Plc', close: '₦130.00', change: '-3.63%' },
      { ticker: 'JAPAULGOLD', name: 'Japaul Gold & Ventures', close: '₦2.15', change: '-4.44%' }
    ],
    moverDrivers: {
      gainers: [
        'GTCO (+3.65% to ₦119.20): Heavy foreign portfolio investor (FPI) crosses cleared block offers following Q3 earnings recapitalization clearance.',
        'FIDSON (+9.88% to ₦94.50): Continued rally on federal healthcare tariff exemptions and active API production lines.',
        'PRESCO (+5.44% to ₦620.00): Bullish crude palm oil (CPO) local realization prices lifted agro-industrial sentiment.'
      ],
      losers: [
        'INTBREW (-3.57% to ₦8.10) & HONYFLOUR (-3.82% to ₦30.20): Short-term profit harvesting across defensive consumer staples.',
        'VITAFOAM (-3.63% to ₦130.00): Institutional reallocation into higher-yielding sovereign treasury paper.'
      ]
    },
    corporateDisclosures: [
      {
        entity: 'Guaranty Trust Holding Co (GTCO)',
        event: 'Recapitalization Regulatory Clearance',
        details: 'Central Bank of Nigeria issues formal verification certificate acknowledging GTCO compliance with ₦500 billion international banking benchmark with surplus equity headroom.',
        timeline: 'Effective Immediately'
      },
      {
        entity: 'Seplat Energy Plc (SEPLAT)',
        event: 'ANOH Gas Plant Final Throughput',
        details: 'Commercial feedgas delivery crossed 240 MMscfd toward full nameplate 300 MMscfd capacity, supplying Obiafu-Obrikom-Oben (OB3) network.',
        timeline: 'Q4 2026 Ramp'
      },
      {
        entity: 'Airtel Africa Plc (AIRTELAFRI)',
        event: 'Interim Dividend Settlement',
        details: 'Registrar confirms dispatched electronic payment advices for 2.6c per share USD-denominated interim dividend.',
        timeline: 'Settlement Dec 2026'
      }
    ],
    macroDrivers: [
      {
        indicator: 'Monetary Policy Rate (MPR)',
        level: '23.00%',
        variance: 'Unchanged (+50/-300 bps corridor)',
        source: 'CBN Monetary Policy Committee'
      },
      {
        indicator: 'Official FX Fixing (NFEM)',
        level: '₦1,348.50 / $1.00',
        variance: '+₦4.20 appreciation',
        source: 'FMDQ Securities Exchange'
      },
      {
        indicator: '364-Day NTB Stop Rate',
        level: '15.89%',
        variance: 'Oversubscribed 1.8x',
        source: 'Debt Management Office (DMO)'
      },
      {
        indicator: 'External Sovereign Reserves',
        level: '$52.84 Billion',
        variance: '+$7.27B YTD',
        source: 'Central Bank of Nigeria'
      }
    ],
    tacticalPlaybook: [
      '1. Banking Sector Rotation: With GTCO and Zenith Bank solidifying recapitalization milestones, institutional order flow is tilting decisively toward Tier-1 banks with verified low-cost deposit franchises.',
      '2. Year-End Dividend Harvesting: Build tactical allocations in Seplat Energy and Stanbic IBTC ahead of FY2026 dividend announcements to capture inflation-beating cash payouts.',
      '3. Liquidity Caution at 253k: Respect technical resistance around the 253,000 ASI psychological boundary. Retain 15% cash buffers in high-yield short-term paper.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    leadArticle: `Trading on the Nigerian Exchange Limited (NGX) approaches the final weekend of November 2026 with strong bullish momentum as market capitalization firmly holds above the ₦164 trillion milestone. Institutional interest was dominated by strategic block crossings in tier-1 financial institutions, led by Guaranty Trust Holding Company and Stanbic IBTC.\n\nMarket breadth maintained positive territory for the third consecutive session, supported by resilient export-oriented energy stocks and agro-industrial counters. While fixed-income sovereign yields on 1-year Treasury bills hover near 15.89%, equity dividend yields on premier blue chips continue to offer superior real-return potential.`,
    whatsappTeaser: `*PSA INVESTMENT • DAILY NGX PRE-MARKET INTELLIGENCE*\n📅 *Friday, Nov 27, 2026 | Vol. LVII*\n• *ASI Snapshot:* 252,890.40 pts (+0.21%) | Mkt Cap: ₦164.20 Trillion\n• *Top Gainers:* GTCO (+3.65% to ₦119.20), FIDSON (+9.88%), PRESCO (+5.44%)\n• *Key Disclosure:* GTCO completes CBN recapitalization verification with surplus headroom.\n🔗 Read Full Briefing: https://psainvestment.com.ng/market-briefings/ngx-pre-market-briefing-2026-11-27?utm_source=whatsapp&utm_medium=social`,
    publishedAt: '2026-11-27T06:45:00Z'
  },
  {
    id: 'briefing-2026-11-26',
    slug: 'ngx-pre-market-briefing-2026-11-26',
    title: 'NGX Pre-Market Briefing: Energy Equities Rally on Crude Gains; FPI Flows Return',
    date: '2026-11-26',
    volume: 'VOL. LVI',
    asiSnapshot: {
      asi: '252,366.80 pts',
      dayChange: '+0.20% (+505.56 pts)',
      marketCap: '₦163.86 Trillion',
      volume: '2.91 Billion units',
      value: '₦78.66 Billion',
      deals: '28,318 deals',
      breadth: 'Positive (1.24x - 26 Gainers / 21 Decliners)'
    },
    topGainers: [
      { ticker: 'SEPLAT', name: 'Seplat Energy Plc', close: '₦16,500.00', change: '+3.12%' },
      { ticker: 'STANBIC', name: 'Stanbic IBTC Holdings', close: '₦165.00', change: '+2.55%' },
      { ticker: 'FIDSON', name: 'Fidson Healthcare Plc', close: '₦91.80', change: '+9.94%' },
      { ticker: 'FIRSTHOLDCO', name: 'First HoldCo Plc', close: '₦105.15', change: '+2.09%' },
      { ticker: 'SUNUASSUR', name: 'SUNU Assurances Plc', close: '₦2.88', change: '+9.92%' }
    ],
    topLosers: [
      { ticker: 'INTBREW', name: 'International Breweries', close: '₦8.40', change: '-7.18%' },
      { ticker: 'TANTALIZER', name: 'Tantalizers Plc', close: '₦3.50', change: '-6.67%' },
      { ticker: 'HONYFLOUR', name: 'Honeywell Flour Mills', close: '₦31.40', change: '-4.85%' },
      { ticker: 'VITAFOAM', name: 'Vitafoam Nigeria Plc', close: '₦134.90', change: '-4.66%' },
      { ticker: 'UPDCREIT', name: 'UPDC Real Estate Investment', close: '₦19.30', change: '-3.74%' }
    ],
    moverDrivers: {
      gainers: [
        'SEPLAT (+3.12% to ₦16,500): Rebounded on global Brent crude resilience at $92.80/bbl and MPNU consolidation synergy.',
        'STANBIC (+2.55% to ₦165.00): Institutional accumulation ahead of year-end corporate asset management mandates.'
      ],
      losers: [
        'INTBREW (-7.18%) & HONYFLOUR (-4.85%): Profit taking across consumer goods counters.'
      ]
    },
    corporateDisclosures: [
      {
        entity: 'Champion Breweries (CHAMPION)',
        event: 'HoldCo Restructuring Scheme',
        details: 'Court-ordered meeting scheduled for proposed corporate re-organization into Champion Brands Plc with 1-for-1 share exchange.',
        timeline: 'Meeting Dec 3, 2026'
      },
      {
        entity: 'Livestock Feeds / UAC Nigeria',
        event: '₦19.5 Billion Divestment Execution',
        details: 'UAC Nigeria finalized divestment crossing 2.20 billion shares of Livestock Feeds on the NGX to Sunbeth.',
        timeline: 'Settled on Floor'
      }
    ],
    macroDrivers: [
      {
        indicator: 'Monetary Policy Rate (MPR)',
        level: '23.00%',
        variance: 'CBN Benchmark Rate',
        source: 'Central Bank of Nigeria'
      },
      {
        indicator: 'Parallel Market FX',
        level: '₦1,432.00 / $1.00',
        variance: 'Spread at ₦78 vs NFEM',
        source: 'Bureau de Change Surveys'
      }
    ],
    tacticalPlaybook: [
      '1. Follow institutional volume surges in energy and tier-1 banking.',
      '2. Accumulate high-quality dividend payers on pullbacks.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    leadArticle: `Floor liquidity surged dramatically on the Nigerian Exchange as heavy block crossings lifted total traded turnover by 244.6% to ₦78.66 billion. The All-Share Index snapped its consolidation to advance 0.20%, adding ₦328 billion in equities value.`,
    whatsappTeaser: `*PSA INVESTMENT • DAILY NGX PRE-MARKET INTELLIGENCE*\n📅 *Thursday, Nov 26, 2026 | Vol. LVI*\n• *ASI Snapshot:* 252,366.80 pts (+0.20%) | Turnover: ₦78.66 Billion\n• *Top Gainers:* SEPLAT (+3.12% to ₦16,500), STANBIC (+2.55%), FIDSON (+9.94%)\n• *Key Story:* UACN executes ₦19.5B block exit in Livestock Feeds.\n🔗 Read Full Briefing: https://psainvestment.com.ng/market-briefings/ngx-pre-market-briefing-2026-11-26?utm_source=whatsapp&utm_medium=social`,
    publishedAt: '2026-11-26T06:45:00Z'
  },
  {
    id: 'briefing-2026-11-13',
    slug: 'ngx-pre-market-briefing-2026-11-13',
    title: 'NGX Pre-Market Briefing: Block Crosses Lift Turnover 244% to ₦78.66B; ASI at 252k',
    date: '2026-11-13',
    volume: 'VOL. LIII',
    asiSnapshot: {
      asi: '252,366.80 pts',
      dayChange: '+0.20% (+505.56 pts)',
      marketCap: '₦163.86 Trillion',
      volume: '2.91 Billion units',
      value: '₦78.66 Billion',
      deals: '28,318 deals',
      breadth: 'Positive (1.24x - 26 Gainers / 21 Decliners)'
    },
    topGainers: [
      { ticker: 'FIDSON', name: 'Fidson Healthcare Plc', close: '₦91.80', change: '+9.94%' },
      { ticker: 'SUNUASSUR', name: 'SUNU Assurances Plc', close: '₦2.88', change: '+9.92%' },
      { ticker: 'CHAMPION', name: 'Champion Breweries Plc', close: '₦11.15', change: '+9.85%' },
      { ticker: 'CAVERTON', name: 'Caverton Offshore Support', close: '₦4.00', change: '+9.59%' },
      { ticker: 'FTGINSURE', name: 'FTG Insurance Plc', close: '₦1.51', change: '+9.42%' }
    ],
    topLosers: [
      { ticker: 'INTBREW', name: 'International Breweries', close: '₦8.40', change: '-7.18%' },
      { ticker: 'TANTALIZER', name: 'Tantalizers Plc', close: '₦3.50', change: '-6.67%' },
      { ticker: 'HONYFLOUR', name: 'Honeywell Flour Mills', close: '₦31.40', change: '-4.85%' },
      { ticker: 'VITAFOAM', name: 'Vitafoam Nigeria Plc', close: '₦134.90', change: '-4.66%' },
      { ticker: 'UPDCREIT', name: 'UPDC REIT', close: '₦19.30', change: '-3.74%' }
    ],
    corporateDisclosures: [
      {
        entity: 'Airtel Africa Plc',
        event: 'Dividend Qualification Day',
        details: 'Final qualification session for 2.6 cents per share interim dividend.',
        timeline: 'Register Closes Nov 16'
      }
    ],
    macroDrivers: [
      {
        indicator: 'Monetary Policy Rate',
        level: '23.00%',
        variance: 'Benchmark',
        source: 'CBN'
      }
    ],
    tacticalPlaybook: [
      '1. Institutional block momentum confirms aggressive accumulation in Seplat and Stanbic.',
      '2. Sovereign yields of 15.89%–17.44% anchor fixed income support.'
    ],
    leadArticle: `Trading on the Nigerian Exchange snapped a two-day slide with the All-Share Index advancing 0.20% to 252,366.80 points. Total floor liquidity surged 244.6% to ₦78.66 billion.`,
    whatsappTeaser: `*PSA INVESTMENT • DAILY NGX PRE-MARKET INTELLIGENCE*\n📅 *Friday, Nov 13, 2026 | Vol. LIII*\n• *ASI Snapshot:* 252,366.80 pts (+0.20%) | Turnover: ₦78.66 Billion\n• *Top Gainers:* FIDSON (+9.94%), SUNUASSUR (+9.92%), CHAMPION (+9.85%)\n• *Tactical Note:* Airtel Africa dividend qualification day.\n🔗 Read Full Briefing: https://psainvestment.com.ng/market-briefings/ngx-pre-market-briefing-2026-11-13?utm_source=whatsapp&utm_medium=social`,
    publishedAt: '2026-11-13T06:45:00Z'
  }
];
