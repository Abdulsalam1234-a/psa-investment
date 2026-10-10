import { ServiceItem, ResearchReport, LearningVideo, Member, StorageFile, DownloadLog, NewsletterSubscriber } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'research-advisory',
    title: 'Investment Research and Advisory',
    slug: 'investment-research-and-advisory',
    shortDescription: 'Institutional-grade equity research covering NGX-listed corporations, macroeconomic trends, and capital structure advisory.',
    fullDescription: 'We deliver comprehensive fundamental equity analysis on companies listed on the Nigerian Exchange (NGX). Our coverage spans tier-1 financial institutions, telecommunications, fast-moving consumer goods (FMCG), and energy operators. We utilize rigorous discounted cash flow (DCF), economic value added (EVA), and peer relative multiples tailored to African emerging markets.',
    icon: 'LineChart',
    order: 1,
    highlights: [
      'Valuation models with local risk premiums and inflation adjustments',
      'Earnings previews, result breakdowns, and dividend forecasts',
      'Bespoke institutional advisory for family offices and asset managers',
      'Independent coverage free from sell-side broker biases'
    ]
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    slug: 'portfolio-management',
    shortDescription: 'Tailored asset allocation frameworks designed to safeguard capital and generate superior risk-adjusted real returns.',
    fullDescription: 'Our portfolio management advisory focuses on long-term compound wealth creation. By balancing high-dividend NGX equities, high-yield sovereign instruments, and defensive assets, we help clients systematically beat inflation and currency depreciation.',
    icon: 'PieChart',
    order: 2,
    highlights: [
      'Defensive core portfolios with tactical equity satellite tilts',
      'Dynamic dividend reinvestment strategies (DRIP)',
      'Quarterly rebalancing and continuous downside risk monitoring',
      'Transparent tracking and benchmark-relative performance attribution'
    ]
  },
  {
    id: 'sme-solar-paas',
    title: 'SME Funding and Solar Power-as-a-Service',
    slug: 'sme-funding-solar-power-as-a-service',
    shortDescription: 'Structured financing and clean energy transition solutions for mid-market Nigerian commercial enterprises.',
    fullDescription: 'High energy tariffs and erratic grid supply represent one of the heaviest overhead burdens on Nigerian SMEs. We structure innovative Solar Power-as-a-Service (PaaS) and working capital interventions that convert erratic diesel expenditure into predictable, lower operating costs with zero upfront capital expenditure.',
    icon: 'SunMedium',
    order: 3,
    highlights: [
      'Zero-capex commercial and industrial solar installations',
      'Performance-based monthly kilowatt-hour power purchase contracts',
      'Blended mezzanine and debt advisory for capital expenditure expansion',
      'Tangible operational cost savings of 25% to 40% against generator diesel'
    ]
  },
  {
    id: 'real-estate',
    title: 'Real Estate Investments',
    slug: 'real-estate-investments',
    shortDescription: 'High-yielding commercial and residential asset origination with robust legal title verification and cashflow viability.',
    fullDescription: 'We identify and underwrite prime real estate opportunities across high-velocity growth corridors in Lagos, Abuja, and key commercial hubs. Our focus is strictly centered on properties with verifiable land titles, high rental yields, and strong capital appreciation potential.',
    icon: 'Building2',
    order: 4,
    highlights: [
      'Comprehensive title search and legal encumbrance validation',
      'Cashflow-underwritten residential developments and commercial logistics assets',
      'Joint-venture structuring between landowners and reputable developers',
      'Asset management and long-term lease negotiations'
    ]
  },
  {
    id: 'financial-modeling',
    title: 'Financial Modeling and Training',
    slug: 'financial-modeling-and-training',
    shortDescription: 'Hands-on executive workshops and dynamic 3-statement financial modeling for analysts, founders, and finance teams.',
    fullDescription: 'Our practical training equips financial professionals, corporate executives, and emerging investors with master-level modeling capabilities. Learn to build interactive three-statement operating models, dynamic scenario managers, debt schedules, and sensitivity tables from scratch.',
    icon: 'GraduationCap',
    order: 5,
    highlights: [
      'Dynamic 3-statement financial modeling in Excel and modern analytics platforms',
      'Discounted cash flow, LBO, and project finance masterclasses',
      'Corporate valuation for Nigerian mergers and capital raises',
      'Mentorship and practical equity research report drafting'
    ]
  },
  {
    id: 'psa-lens',
    title: 'PSA Lens',
    slug: 'psa-lens',
    shortDescription: 'Free multimedia financial intelligence, high-impact video breakdowns, and digestible market literacy for all investors.',
    fullDescription: 'PSA Lens is our open-access media channel providing clear, data-backed insights on YouTube, TikTok, and social platforms. We dissect complex financial disclosures, monetary policies, and dividend disclosures into actionable investor knowledge.',
    icon: 'Video',
    order: 6,
    highlights: [
      'Bi-weekly video breakdowns of NGX corporate earnings',
      'Demystifying dividend dates, qualification dates, and closure of registers',
      'Central Bank of Nigeria monetary policy commentary and treasury rate trends',
      'Direct engagement and community question-and-answer sessions'
    ]
  }
];

export const INITIAL_REPORTS: ResearchReport[] = [
  {
    id: 'ngx-banking-recapitalization-2026',
    title: 'NGX Banking Sector Outlook: Recapitalization Dynamics and Tier-1 ROE Projections',
    summary: 'An exhaustive assessment of the ongoing Central Bank of Nigeria capital verification exercise, analyzing capital adequacy ratios, rights issues, and sustainable dividend yields for FUGAZ institutions.',
    body: `## Executive Overview

The Nigerian banking landscape is currently undergoing its most transformative structural recapitalization since the historic 2004 Soludo banking consolidation. With the Central Bank of Nigeria (CBN) mandating minimum capital benchmarks of ₦500 billion for international commercial banks, ₦200 billion for national institutions, and ₦50 billion for regional banks, institutions have engaged in aggressive equity raises, rights issues, and GDR offerings.

### Key Macro and Sector Drivers

1. **Net Interest Margin (NIM) Expansion:** Sustained hawkish policy stance with the Monetary Policy Rate (MPR) elevated has widened spreads between prime lending assets and average deposit costs.
2. **FX Revaluation Reserves and Capital Quality:** CBN circulars prohibiting the utilization of unrealized foreign exchange gains for dividend distributions have forced banks to bolster core Tier-1 tangible equity through fresh capital injections.
3. **Credit Risk and Asset Quality:** Non-performing loans (NPLs) remain closely monitored as domestic corporates adjust to higher energy inputs and currency devaluation. However, tier-1 institutions maintain robust provisioning coverage exceeding 140%.

### Valuation & Stance

| Bank Ticker | Current P/E | P/B Multiple | Target Price (₦) | Stance |
| :--- | :--- | :--- | :--- | :--- |
| **GTCO** | 3.8x | 0.85x | ₦68.00 | **Strong Buy** |
| **ZENITHBANK** | 3.4x | 0.78x | ₦54.00 | **Buy** |
| **ACCESSCORP** | 2.6x | 0.52x | ₦32.50 | **Buy** |
| **UBA** | 3.1x | 0.69x | ₦42.00 | **Buy** |
| **FBNH** | 3.9x | 0.61x | ₦38.00 | **Hold** |

### Analyst Verdict

We maintain an **Overweight** stance on the banking sector. Institutions with established retail deposit franchises, high fee-and-commission non-interest revenue streams, and Pan-African diversification are primed to deliver exceptional return on average equity (ROAE) above 28% over the medium term.`,
    category: 'Market Report',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    access: 'public',
    status: 'published',
    author: 'Salami Abdullahi',
    readTime: '6 min read',
    downloadCount: 142,
    viewsCount: 1280,
    ticker: 'NGX: BANKING',
    targetPrice: 'Sector Overweight',
    recommendation: 'Buy',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'seplat-deepwater-gas-valuation-2026',
    title: 'Seplat Energy (NGX: SEPLAT): Deepwater Gas Monetization and Cash Flow Sensitivity Note',
    summary: 'Exclusive institutional DCF valuation modeling the integrated impact of the MPNU shallow-water asset consolidation, domestic gas supply obligations, and dollar-denominated dividend sustainability.',
    body: `## Confidential Analyst Memo: PSA Analyst Circle

**Investment Recommendation:** Strong Buy  
**Current Market Price:** ₦3,950.00  
**12-Month Base Target Price:** ₦5,850.00 (+48.1% upside)  
**Target Dividend Yield (USD pegged):** 11.2%  

### Investment Thesis

Seplat Energy represents the premier pure-play indigenous energy producer listed on both the Nigerian Exchange (NGX) and the London Stock Exchange (LSE). The consolidation of shallow-water offshore assets immediately elevates working-interest production above 130,000 boepd while drastically reducing per-barrel operating expenditures through infrastructure synergy.

### Financial Modeling Highlights

- **Domestic Gas Pricing Realization:** Long-term take-or-pay gas agreements indexed between $2.20 and $2.80 per Mscf shield operating cash flows from volatile Brent spot fluctuations.
- **ANOH Gas Plant Ramp:** The full commercial commissioning of the 300 MMscfd ANOH gas processing facility injects over $110 million in incremental annualized EBITDA.
- **Capital Structure and Deleveraging:** Net debt to EBITDA is modeled to compress from 1.4x to 0.6x within 18 months, unlocking significant surplus free cash flow for enhanced special dividend distributions.

### Downside Risks & Mitigants

1. **Pipeline Evacuation Disruptions:** Mitigated by multi-pipeline alternative routes including the Amukpe-Escravos Pipeline (AEP) deep underground route.
2. **Crude Oil Price Volatility:** Hedging programs cover 60% of forecast liquids output with put options at a $65/bbl strike.`,
    category: 'Equity Valuation',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    access: 'premium',
    status: 'published',
    author: 'Salami Abdullahi',
    readTime: '12 min read',
    downloadCount: 88,
    viewsCount: 640,
    ticker: 'SEPLAT',
    targetPrice: '₦5,850.00',
    recommendation: 'Strong Buy',
    createdAt: '2026-09-22T08:30:00Z',
    updatedAt: '2026-09-22T08:30:00Z'
  }
];

export const INITIAL_VIDEOS: LearningVideo[] = [
  {
    id: 'psa-lens-dividend-analysis',
    title: 'PSA Lens: How to Analyze NGX Dividend Stocks and Beat Inflation in Nigeria',
    description: 'Learn the exact mathematical framework we use at PSA Investment to evaluate dividend yield, payout ratios, free cash flow coverage, and qualification dates on the Nigerian Exchange.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    topicTag: 'Dividend Investing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    status: 'published',
    clicksToYouTube: 342,
    duration: '14:20',
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-09-18T14:00:00Z'
  },
  {
    id: 'psa-lens-reading-annual-reports',
    title: 'PSA Lens: How to Read an NGX Annual Report in 45 Minutes (Step-by-Step Guide)',
    description: 'Stop getting overwhelmed by 300-page corporate financial statements. Here is the fast track to extracting balance sheet red flags, auditor emphasis of matter, and related party disclosures.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    topicTag: 'Financial Statements',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    status: 'published',
    clicksToYouTube: 198,
    duration: '18:45',
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    uid: 'sample-pending-member-1',
    fullName: 'Babatunde Adeleke',
    email: 'babatunde.adeleke@example.com',
    phone: '+234 803 123 4567',
    membershipTier: 'standard',
    status: 'pending',
    referralCode: 'PSA-BAB941',
    referredBy: 'PSA-ABD001',
    referralCount: 0,
    appliedAt: '2026-09-29T14:20:00Z',
    notes: 'Equity research enthusiast interested in industrial commodities and tier-1 banking.',
    createdAt: '2026-09-29T14:20:00Z',
    updatedAt: '2026-09-29T14:20:00Z'
  },
  {
    uid: 'sample-active-member-2',
    fullName: 'Chidinma Okonkwo',
    email: 'chidinma.o@example.com',
    phone: '+234 812 987 6543',
    membershipTier: 'standard',
    status: 'active',
    referralCode: 'PSA-CHI882',
    referredBy: 'PSA-ABD001',
    referralCount: 4,
    appliedAt: '2026-09-10T09:15:00Z',
    approvedAt: '2026-09-11T16:00:00Z',
    notes: 'Active member participating in weekly market valuation notes.',
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-11T16:00:00Z'
  }
];

export const INITIAL_STORAGE_FILES: StorageFile[] = [
  {
    id: 'file-1',
    name: 'NGX-Banking-Recapitalization-Analysis-2026.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    sizeBytes: 2450000,
    uploadedAt: '2026-09-15T10:00:00Z',
    uploadedBy: 'Salami Abdullahi'
  },
  {
    id: 'file-2',
    name: 'SEPLAT-Institutional-DCF-Valuation-Memo.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    sizeBytes: 3820000,
    uploadedAt: '2026-09-22T08:30:00Z',
    uploadedBy: 'Salami Abdullahi'
  },
  {
    id: 'file-3',
    name: 'Banking-Sector-Recapitalization-Cover.jpg',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    sizeBytes: 420000,
    uploadedAt: '2026-09-15T09:45:00Z',
    uploadedBy: 'Salami Abdullahi'
  }
];

export const INITIAL_DOWNLOAD_LOGS: DownloadLog[] = [
  {
    id: 'download-seed-1',
    memberId: 'sample-active-member-2',
    memberEmail: 'chidinma.o@example.com',
    reportId: 'seplat-deepwater-gas-valuation-2026',
    fileId: 'pdf-seplat-deepwater-gas-valuation-2026',
    reportTitle: 'Seplat Energy (NGX: SEPLAT): Deepwater Gas Monetization and Cash Flow Sensitivity Note',
    timestamp: '2026-10-08T12:00:00.000Z'
  },
  {
    id: 'download-seed-2',
    memberId: 'sample-active-member-2',
    memberEmail: 'chidinma.o@example.com',
    reportId: 'ngx-banking-recapitalization-2026',
    fileId: 'pdf-ngx-banking-recapitalization-2026',
    reportTitle: 'NGX Banking Sector Outlook: Recapitalization Dynamics and Tier-1 ROE Projections',
    timestamp: '2026-10-06T09:30:00.000Z'
  }
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-femi_adeyemi_invest_ng',
    email: 'femi.adeyemi@invest.ng',
    fullName: 'Femi Adeyemi',
    subscribedAt: '2026-09-24T14:20:00Z',
    status: 'active',
    source: 'member_portal',
    preferences: ['Weekly Research Notes', 'Banking Recapitalization']
  },
  {
    id: 'sub-amina_danladi_capital_ng',
    email: 'amina.danladi@capital.ng',
    fullName: 'Amina Danladi',
    subscribedAt: '2026-09-27T09:15:00Z',
    status: 'active',
    source: 'member_portal',
    preferences: ['Energy & Oil Gas', 'Dividend Analysis']
  }
];
