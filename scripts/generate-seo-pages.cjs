/**
 * PSA Investment (PSAI) — Static Pre-Rendering & Technical SEO Script
 * Generates:
 * 1. 1200x630 Vector Open Graph Cards (public/og and dist/og)
 * 2. Pre-rendered HTML pages with JSON-LD, SEO meta tags, and semantic HTML for all routes
 * 3. Distribution artifacts (sitemap.xml, robots.txt, llms.txt)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_OG_DIR = path.join(DIST_DIR, 'og');
const PUBLIC_OG_DIR = path.join(PUBLIC_DIR, 'og');

const BASE_URL = 'https://psainvestment.com';

// Ensure OG directories exist
[DIST_OG_DIR, PUBLIC_OG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -------------------------------------------------------------
// 1. OPEN GRAPH SVG GENERATOR (1200x630, #0A1F44 Navy, #C9A84C Gold)
// -------------------------------------------------------------
function generateOgSvg({
  title,
  subtitle = 'Institutional Equity Research & NGX Intelligence',
  ticker = '',
  rating = '',
  targetPrice = '',
  upside = '',
  badge = 'RESEARCH DOSSIER'
}) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeTicker = escapeHtml(ticker);
  const safeRating = escapeHtml(rating);
  const safeTarget = escapeHtml(targetPrice);
  const safeUpside = escapeHtml(upside);
  const safeBadge = escapeHtml(badge);

  // Split title if long
  const words = safeTitle.split(' ');
  let line1 = words.slice(0, 6).join(' ');
  let line2 = words.slice(6, 13).join(' ');
  if (words.length > 13) line2 += '...';

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1F44"/>
      <stop offset="60%" stop-color="#07152F"/>
      <stop offset="100%" stop-color="#040C1D"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E5C365"/>
      <stop offset="50%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#A68735"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Top Accent Gold Bar -->
  <rect x="0" y="0" width="1200" height="10" fill="url(#goldGrad)"/>

  <!-- Background Grid Subtle Texture -->
  <g opacity="0.04" stroke="#FFFFFF" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Brand Watermark Symbol -->
  <circle cx="1080" cy="140" r="120" fill="none" stroke="#C9A84C" stroke-width="2" opacity="0.08"/>
  <circle cx="1080" cy="140" r="70" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.06"/>

  <!-- Brand Header -->
  <g transform="translate(80, 80)">
    <!-- Gold emblem -->
    <rect x="0" y="0" width="36" height="36" rx="8" fill="url(#goldGrad)"/>
    <text x="18" y="24" font-family="'Playfair Display', Georgia, serif" font-size="18" font-weight="bold" fill="#0A1F44" text-anchor="middle">P</text>
    
    <text x="50" y="25" font-family="'Inter', -apple-system, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="2">PSA INVESTMENT</text>
    <text x="240" y="25" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="600" fill="#C9A84C" letter-spacing="1.5">| PSAI RESEARCH</text>

    <!-- Badge Tag -->
    <rect x="850" y="-2" width="190" height="32" rx="16" fill="#1E293B" stroke="#334155" stroke-width="1"/>
    <text x="945" y="19" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-weight="700" fill="#C9A84C" text-anchor="middle" letter-spacing="1">${safeBadge}</text>
  </g>

  <!-- Content Box -->
  <g transform="translate(80, 180)">
    ${safeTicker ? `
    <!-- Ticker and Rating Badges -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="130" height="36" rx="6" fill="#1E293B" stroke="#C9A84C" stroke-width="1.5"/>
      <text x="65" y="23" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="800" fill="#C9A84C" text-anchor="middle">NGX: ${safeTicker}</text>
      
      <rect x="145" y="0" width="120" height="36" rx="6" fill="#059669" />
      <text x="205" y="23" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="800" fill="#FFFFFF" text-anchor="middle">${safeRating}</text>
    </g>
    ` : ''}

    <!-- Main Headline -->
    <text x="0" y="${safeTicker ? '85' : '40'}" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="bold" fill="#FFFFFF">
      ${line1}
    </text>
    ${line2 ? `
    <text x="0" y="${safeTicker ? '140' : '95'}" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="bold" fill="#E2E8F0">
      ${line2}
    </text>` : ''}

    <!-- Subtitle -->
    <text x="0" y="${safeTicker ? (line2 ? '195' : '145') : (line2 ? '150' : '100')}" font-family="'Inter', -apple-system, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">
      ${safeSubtitle}
    </text>

    ${safeTarget ? `
    <!-- Financial Metrics Panel -->
    <g transform="translate(0, ${line2 ? '225' : '185'})">
      <rect x="0" y="0" width="700" height="74" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
      
      <text x="30" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="1">12-MO TARGET PRICE</text>
      <text x="30" y="56" font-family="'Playfair Display', serif" font-size="24" font-weight="bold" fill="#FFFFFF">${safeTarget}</text>
      
      <line x1="260" y1="15" x2="260" y2="60" stroke="#334155" stroke-width="1"/>
      
      <text x="290" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="1">PROJECTED UPSIDE</text>
      <text x="290" y="56" font-family="'Playfair Display', serif" font-size="24" font-weight="bold" fill="#10B981">${safeUpside}</text>
      
      <line x1="490" y1="15" x2="490" y2="60" stroke="#334155" stroke-width="1"/>

      <text x="520" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="1">METHODOLOGY</text>
      <text x="520" y="56" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#C9A84C">DCF + P/B</text>
    </g>
    ` : ''}
  </g>

  <!-- Footer Information -->
  <g transform="translate(80, 570)">
    <line x1="0" y1="-25" x2="1040" y2="-25" stroke="#334155" stroke-width="1"/>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#C9A84C">Directed by Salami Abdullahi A.</text>
    <text x="250" y="5" font-family="'Inter', sans-serif" font-size="14" font-weight="400" fill="#64748B">• Founder &amp; Chief Analyst, PSA Investment</text>
    
    <text x="1040" y="5" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="end">psainvestment.com</text>
  </g>
</svg>`;
}

// Write generated SVG to both public and dist
function saveOgSvg(filename, svgContent) {
  fs.writeFileSync(path.join(PUBLIC_OG_DIR, filename), svgContent, 'utf-8');
  fs.writeFileSync(path.join(DIST_OG_DIR, filename), svgContent, 'utf-8');
}

// Generate all standard OG cards
console.log('Generating Open Graph 1200x630 cards...');
saveOgSvg('default.svg', generateOgSvg({
  title: 'Institutional Nigerian Equity Research & Capital Advisory',
  subtitle: 'Independent NGX company valuation, banking recapitalization, and daily intelligence',
  badge: 'INSTITUTIONAL PORTAL'
}));

saveOgSvg('research.svg', generateOgSvg({
  title: 'Nigerian Exchange (NGX) Equity Research & Valuation Dossiers',
  subtitle: 'DCF valuation models, banking stress-tests, and dividend sustainability metrics',
  badge: 'EQUITY RESEARCH'
}));

saveOgSvg('market-briefings.svg', generateOgSvg({
  title: 'Daily NGX Pre-Market Intelligence Briefing (07:00 WAT)',
  subtitle: 'ASI performance, top gainers & losers, corporate disclosures, and macro benchmarks',
  badge: 'DAILY INTELLIGENCE'
}));

saveOgSvg('gtco.svg', generateOgSvg({
  title: 'Guaranty Trust Holding Company (GTCO): FY2026 Valuation Dossier',
  subtitle: 'Low-cost deposit moat, HabariPay scale, and post-recapitalization market share expansion',
  ticker: 'GTCO',
  rating: 'BUY',
  targetPrice: '₦158.00',
  upside: '+32.6%',
  badge: 'BANKING DOSSIER'
}));

saveOgSvg('zenithbank.svg', generateOgSvg({
  title: 'Zenith Bank Plc: Recapitalization & Tier-1 Capital Adequacy Model',
  subtitle: 'Corporate credit franchise, trade finance leadership, and resilient dividend payouts',
  ticker: 'ZENITHBANK',
  rating: 'ACCUMULATE',
  targetPrice: '₦58.50',
  upside: '+26.1%',
  badge: 'BANKING DOSSIER'
}));

saveOgSvg('seplat.svg', generateOgSvg({
  title: 'Seplat Energy Plc: ANOH Gas Processing & Free Cash Flow Accretion',
  subtitle: 'Domestic gas commercialization, deepwater divestment integration, and high dollar dividend yield',
  ticker: 'SEPLAT',
  rating: 'BUY',
  targetPrice: '₦5,200.00',
  upside: '+34.7%',
  badge: 'ENERGY DOSSIER'
}));

saveOgSvg('mtnn.svg', generateOgSvg({
  title: 'MTN Nigeria Communications Plc: Tariff Deregulation & 5G Growth',
  subtitle: 'Network traffic surge, mobile money (MoMo) scaling, and FX debt turnaround',
  ticker: 'MTNN',
  rating: 'BUY',
  targetPrice: '₦285.00',
  upside: '+39.0%',
  badge: 'TELECOMS DOSSIER'
}));

saveOgSvg('dangcem.svg', generateOgSvg({
  title: 'Dangote Cement Plc: Pan-African Export Capacity & Margin Defense',
  subtitle: 'Alternative fuel substitution, infrastructure demand, and pricing dominance',
  ticker: 'DANGCEM',
  rating: 'ACCUMULATE',
  targetPrice: '₦760.00',
  upside: '+16.0%',
  badge: 'INDUSTRIAL DOSSIER'
}));

saveOgSvg('presco.svg', generateOgSvg({
  title: 'Presco Plc: Crude Palm Oil Yield Expansion & Land Acquisition',
  subtitle: 'Import substitution tailwinds, biosecurity advantage, and export parity cash flows',
  ticker: 'PRESCO',
  rating: 'BUY',
  targetPrice: '₦620.00',
  upside: '+27.8%',
  badge: 'AGRIBUSINESS DOSSIER'
}));

saveOgSvg('briefing-latest.svg', generateOgSvg({
  title: 'NGX Pre-Market Intelligence Briefing — Vol. LVIII',
  subtitle: 'ASI crosses 104,000 pts milestone | Banking liquidity surge & corporate actions',
  badge: '07:00 WAT BRIEFING'
}));

console.log('✓ Open Graph SVG cards generated successfully.');

// -------------------------------------------------------------
// 2. DOSSIERS & BRIEFINGS DEFINITIONS FOR PRE-RENDERING
// -------------------------------------------------------------
const DOSSIERS = [
  {
    slug: 'gtco-holdings-fy2026-valuation-dossier',
    ogImage: '/og/gtco.svg',
    title: 'Guaranty Trust Holding Company (GTCO): FY2026 Valuation & Dividend Analysis',
    companyName: 'Guaranty Trust Holding Company Plc',
    ticker: 'GTCO',
    sector: 'Banking',
    convictionRating: 'BUY',
    currentPrice: '₦119.20',
    targetPrice: '₦158.00',
    upsidePercent: '+32.6%',
    multiples: {
      pe: '3.8x',
      pb: '0.85x',
      dividendYield: '10.7%',
      roe: '29.4%',
      marketCap: '₦3.51 Trillion'
    },
    metaTitle: 'GTCO Valuation & Dividend Analysis (2026) | Target ₦158.00 | PSA Investment',
    metaDescription: 'Institutional equity research and DCF valuation of Guaranty Trust Holding Company (NGX: GTCO). Target price ₦158.00, P/E 3.8x, and 10.7% dividend yield.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦119.20', peer: '₦68.40', assessment: 'Trading at 32.6% discount to discounted cash flow fair value.' },
      { metric: 'Trailing P/E Ratio', current: '3.8x', peer: '5.2x', assessment: 'Attractive multiple backed by top-quartile fee and commission earnings.' },
      { metric: 'Price-to-Book (P/B)', current: '0.85x', peer: '0.94x', assessment: 'Deep tangible asset discount relative to Tier-1 capital adequacy of 24.1%.' },
      { metric: 'Dividend Yield (%)', current: '10.7%', peer: '8.4%', assessment: 'Superior cash flow coverage and historical 10-year payout consistency.' },
      { metric: 'Return on Equity (ROE)', current: '29.4%', peer: '22.8%', assessment: 'Industry-leading ROE driven by 68% low-cost CASA deposit franchise.' },
      { metric: 'Market Capitalization', current: '₦3.51 Trillion', peer: '₦2.10 Trillion', assessment: 'Second-largest financial services capitalization on the Nigerian Exchange.' }
    ],
    executiveSummary: 'Guaranty Trust Holding Company Plc (NGX: GTCO) remains the standard for operational efficiency, non-funded revenue resilience, and cost containment in West African banking. As the Central Bank of Nigeria recapitalization deadline approaches, GTCO has already satisfied statutory equity thresholds with surplus capital buffer, positioning the franchise to gain market share without punitive equity dilution.',
    investmentThesis: 'We maintain our strong BUY recommendation on GTCO with a 12-month base target price of ₦158.00 (+32.6% upside). GTCO combines an impenetrable low-cost deposit moat (68.4% CASA) with accelerating non-interest revenue streams from HabariPay (Squad), asset management, and pensions. Unlike peers reliant on unsustainable FX translation windfalls, GTCO core operating pre-tax margin exceeds 54%, supporting a projected 10.7% dividend yield.'
  },
  {
    slug: 'zenith-bank-recapitalization-equity-dossier',
    ogImage: '/og/zenithbank.svg',
    title: 'Zenith Bank Plc: Recapitalization, Tier-1 Capital Adequacy & Valuation Model',
    companyName: 'Zenith Bank Plc',
    ticker: 'ZENITHBANK',
    sector: 'Banking',
    convictionRating: 'ACCUMULATE',
    currentPrice: '₦46.40',
    targetPrice: '₦58.50',
    upsidePercent: '+26.1%',
    multiples: {
      pe: '3.2x',
      pb: '0.72x',
      dividendYield: '9.8%',
      roe: '26.8%',
      marketCap: '₦1.46 Trillion'
    },
    metaTitle: 'Zenith Bank Recapitalization Model & Valuation (2026) | PSA Investment',
    metaDescription: 'Institutional research report on Zenith Bank Plc (NGX: ZENITHBANK). Recapitalization compliance, Tier-1 capital ratios, and target price ₦58.50.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦46.40', peer: '₦68.40', assessment: 'Trading at 26.1% discount to sum-of-the-parts and Gordon Growth target.' },
      { metric: 'Trailing P/E Ratio', current: '3.2x', peer: '5.2x', assessment: 'Lowest multiple among Nigerian Tier-1 peers with dividend coverage over 4.2x.' },
      { metric: 'Price-to-Book (P/B)', current: '0.72x', peer: '0.94x', assessment: 'Substantial discount to tangible book value per share of ₦64.40.' },
      { metric: 'Dividend Yield (%)', current: '9.8%', peer: '8.4%', assessment: 'Sustained full-year dividend of ₦4.55 per share with consistent interim payout.' },
      { metric: 'Return on Equity (ROE)', current: '26.8%', peer: '22.8%', assessment: 'High-quality ROE propelled by institutional corporate lending and trade finance fees.' },
      { metric: 'Market Capitalization', current: '₦1.46 Trillion', peer: '₦2.10 Trillion', assessment: 'Dominant liquidity leader on the NGX banking sub-sector.' }
    ],
    executiveSummary: 'Zenith Bank Plc (NGX: ZENITHBANK) stands as Nigeria largest commercial bank by total assets and shareholder equity. With the bank international banking license recapitalization successfully executed via combined rights issue and public offer, Zenith Bank has fortified its Tier-1 capital adequacy to 25.8%, insulating the institution from sovereign macroeconomic volatility.',
    investmentThesis: 'We issue an ACCUMULATE rating on Zenith Bank with a 12-month target price of ₦58.50 (+26.1% upside). Zenith unparalleled corporate relationships, dominant market share in offshore trade finance (over 28% of all letters of credit in Nigeria), and conservative risk provisioning create an asymmetric risk/reward opportunity.'
  },
  {
    slug: 'seplat-energy-anoh-gas-valuation-dossier',
    ogImage: '/og/seplat.svg',
    title: 'Seplat Energy Plc: ANOH Gas Commercialization & Free Cash Flow Accretion',
    companyName: 'Seplat Energy Plc',
    ticker: 'SEPLAT',
    sector: 'Oil & Gas',
    convictionRating: 'BUY',
    currentPrice: '₦3,860.00',
    targetPrice: '₦5,200.00',
    upsidePercent: '+34.7%',
    multiples: {
      pe: '6.4x',
      pb: '1.45x',
      dividendYield: '8.2%',
      roe: '24.1%',
      marketCap: '₦2.27 Trillion'
    },
    metaTitle: 'Seplat Energy (SEPLAT) Equity Research: ANOH Gas & Valuation | PSA Investment',
    metaDescription: 'Detailed equity dossier on Seplat Energy Plc (NGX: SEPLAT). ANOH gas project cash flows, dollar-denominated dividend yield, and fair value ₦5,200.00.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦3,860.00', peer: '₦2,400.00', assessment: 'Premium dual-listed equity trading below discounted NAV of producing assets.' },
      { metric: 'Trailing P/E Ratio', current: '6.4x', peer: '8.9x', assessment: 'Discounted multiple reflecting historical onshore security perception rather than actual offshore/gas cash flow.' },
      { metric: 'Price-to-Book (P/B)', current: '1.45x', peer: '1.70x', assessment: 'Asset-rich balance sheet with low net debt-to-EBITDA of 0.8x.' },
      { metric: 'Dividend Yield (%)', current: '8.2%', peer: '5.1%', assessment: 'Quarterly US Dollar declared dividends converted at official NAFEM rate provide FX hedge.' },
      { metric: 'Return on Equity (ROE)', current: '24.1%', peer: '18.5%', assessment: 'Driven by high-margin commercial gas contracts indexed to US Dollars.' },
      { metric: 'Market Capitalization', current: '₦2.27 Trillion', peer: '₦1.10 Trillion', assessment: 'Largest indigenous energy explorer and producer listed on NGX and LSE.' }
    ],
    executiveSummary: 'Seplat Energy Plc (NGX: SEPLAT, LSE: SEPL) is transitioning into an integrated domestic gas and offshore liquids powerhouse. The commissioning of the 300 MMscfd ANOH Gas Processing Plant alongside the strategic closure of the Mobil Producing Nigeria Unlimited (MPNU) shallow-water portfolio acquisition transforms Seplat into Nigeria highest-yielding energy producer.',
    investmentThesis: 'We reiterate a high-conviction BUY on Seplat Energy with a 12-month target price of ₦5,200.00 (+34.7% upside). Seplat provides institutional portfolios with the definitive hedge against Naira depreciation, declaring quarterly dividends in hard US Dollars while benefiting from domestic industrial demand for processed natural gas.'
  },
  {
    slug: 'mtn-nigeria-telecoms-infrastructure-dossier',
    ogImage: '/og/mtnn.svg',
    title: 'MTN Nigeria Communications Plc: Tariff Deregulation, 5G Capex & FX Turnaround',
    companyName: 'MTN Nigeria Communications Plc',
    ticker: 'MTNN',
    sector: 'Telecoms',
    convictionRating: 'BUY',
    currentPrice: '₦205.00',
    targetPrice: '₦285.00',
    upsidePercent: '+39.0%',
    multiples: {
      pe: '11.8x',
      pb: '3.10x',
      dividendYield: '6.8%',
      roe: '31.5%',
      marketCap: '₦4.32 Trillion'
    },
    metaTitle: 'MTN Nigeria (MTNN) Equity Dossier & Valuation Model | PSA Investment',
    metaDescription: 'Institutional research report on MTN Nigeria (NGX: MTNN). Tariff adjustments, tower contract restructuring, and 12-month price target ₦285.00.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦205.00', peer: '₦175.00', assessment: 'Depressed by prior FX lease provisions, creating prime inflection entry.' },
      { metric: 'Trailing P/E Ratio', current: '11.8x', peer: '14.5x', assessment: 'Forward earnings normalization pushes forward P/E down to 6.9x.' },
      { metric: 'Price-to-Book (P/B)', current: '3.10x', peer: '4.20x', assessment: 'Reflects accounting equity recovery as negative retained earnings clear.' },
      { metric: 'Dividend Yield (%)', current: '6.8%', peer: '4.2%', assessment: 'Projected resumption of historical 80% free cash flow dividend payout.' },
      { metric: 'Return on Equity (ROE)', current: '31.5%', peer: '24.0%', assessment: 'Underlying operating ROE insulated by digital and fintech transaction growth.' },
      { metric: 'Market Capitalization', current: '₦4.32 Trillion', peer: '₦2.80 Trillion', assessment: 'Second-largest enterprise on the entire Nigerian capital market.' }
    ],
    executiveSummary: 'MTN Nigeria Communications Plc (NGX: MTNN) has navigated the worst of the 2024–2025 foreign exchange translation storm. With tower lease contracts renegotiated with IHS Towers and ATC to cap FX exposure, coupled with Nigerian Communications Commission regulatory tariff adjustments, MTNN is poised for the most rapid earnings inflection on the NGX.',
    investmentThesis: 'We upgrade MTN Nigeria to BUY with a target price of ₦285.00 (+39.0% upside). Voice and data traffic volumes continue to compound at over 28% year-on-year, while MoMo PSB active wallets have surpassed 6 million users. Free cash flow generation will rebound swiftly, clearing negative equity and restoring dividend distributions.'
  },
  {
    slug: 'dangote-cement-industrial-growth-dossier',
    ogImage: '/og/dangcem.svg',
    title: 'Dangote Cement Plc: Pan-African Export Capacity, Pricing Power & Margin Defense',
    companyName: 'Dangote Cement Plc',
    ticker: 'DANGCEM',
    sector: 'Industrial Goods',
    convictionRating: 'ACCUMULATE',
    currentPrice: '₦655.00',
    targetPrice: '₦760.00',
    upsidePercent: '+16.0%',
    multiples: {
      pe: '13.2x',
      pb: '4.10x',
      dividendYield: '5.2%',
      roe: '34.2%',
      marketCap: '₦11.16 Trillion'
    },
    metaTitle: 'Dangote Cement (DANGCEM) Valuation Dossier | Target ₦760 | PSA Investment',
    metaDescription: 'Institutional equity research on Dangote Cement Plc (NGX: DANGCEM). Infrastructure demand, alternative fuels, and target price ₦760.00.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦655.00', peer: '₦420.00', assessment: 'Reflects supreme scale and unrivaled domestic logistics network.' },
      { metric: 'Trailing P/E Ratio', current: '13.2x', peer: '16.4x', assessment: 'In line with emerging market cement peers, backed by 52% EBITDA margins.' },
      { metric: 'Price-to-Book (P/B)', current: '4.10x', peer: '3.80x', assessment: 'Supported by high ROE and pristine replacement cost of 52.0Mta capacity.' },
      { metric: 'Dividend Yield (%)', current: '5.2%', peer: '3.9%', assessment: 'Consistent annual cash payout backed by strong operating cash flows.' },
      { metric: 'Return on Equity (ROE)', current: '34.2%', peer: '21.5%', assessment: 'Benchmark profitability across Sub-Saharan manufacturing.' },
      { metric: 'Market Capitalization', current: '₦11.16 Trillion', peer: '₦4.50 Trillion', assessment: 'Largest industrial heavyweight listed on the Nigerian Exchange.' }
    ],
    executiveSummary: 'Dangote Cement Plc (NGX: DANGCEM) commands over 60% of Nigeria domestic cement capacity across its Obajana, Ibese, and Gboko plants. The company aggressive transition to alternative fuel sources (biomass, CNG, and locally sourced coal) has successfully mitigated energy cost inflation, preserving industry-leading EBITDA margins of 51.8%.',
    investmentThesis: 'We maintain an ACCUMULATE rating on Dangote Cement with a 12-month target price of ₦760.00 (+16.0% upside). Federal Government highway concrete paving initiatives, pan-African clinker exports, and ongoing share buyback programs provide strong valuation support.'
  },
  {
    slug: 'presco-plantation-agriculture-expansion-dossier',
    ogImage: '/og/presco.svg',
    title: 'Presco Plc: Crude Palm Oil Yield Expansion, Land Acquisition & Export Parity',
    companyName: 'Presco Plc',
    ticker: 'PRESCO',
    sector: 'Agriculture',
    convictionRating: 'BUY',
    currentPrice: '₦485.00',
    targetPrice: '₦620.00',
    upsidePercent: '+27.8%',
    multiples: {
      pe: '5.9x',
      pb: '2.40x',
      dividendYield: '7.8%',
      roe: '38.5%',
      marketCap: '₦485.00 Billion'
    },
    metaTitle: 'Presco Plc (PRESCO) Equity Research: Palm Oil Valuation | PSA Investment',
    metaDescription: 'Fundamental equity analysis and DCF valuation of Presco Plc (NGX: PRESCO). Target price ₦620.00, ROE 38.5%, and crude palm oil export parity economics.',
    valuationRows: [
      { metric: 'Current Share Price (NGX)', current: '₦485.00', peer: '₦310.00', assessment: 'Strong upward trajectory propelled by global vegetable oil supply deficits.' },
      { metric: 'Trailing P/E Ratio', current: '5.9x', peer: '9.2x', assessment: 'Exceptionally low valuation for an agribusiness generating 44% net margins.' },
      { metric: 'Price-to-Book (P/B)', current: '2.40x', peer: '2.80x', assessment: 'Biological asset fair value appreciation provides substantial book protection.' },
      { metric: 'Dividend Yield (%)', current: '7.8%', peer: '4.5%', assessment: 'Generous cash returns backed by pristine free cash conversion.' },
      { metric: 'Return on Equity (ROE)', current: '38.5%', peer: '22.0%', assessment: 'Top-tier capital efficiency supported by vertically integrated oil palm refineries.' },
      { metric: 'Market Capitalization', current: '₦485.00 Billion', peer: '₦210.00 Billion', assessment: 'Leading agribusiness company by market value on the Nigerian Exchange.' }
    ],
    executiveSummary: 'Presco Plc (NGX: PRESCO) is West Africa premier fully integrated oil palm producer. Operating over 43,000 hectares of cultivated oil palm estates, Presco benefits from natural import substitution dynamics in Nigeria, where industrial demand for refined olein and stearin outstrips domestic supply by over 600,000 metric tonnes annually.',
    investmentThesis: 'We rate Presco a strong BUY with a 12-month target price of ₦620.00 (+27.8% upside). With local crude palm oil prices benchmarked to international CIF Rotterdam prices, Presco captures global commodity upside without international exchange rate friction, returning substantial cash dividends to shareholders.'
  }
];

const BRIEFINGS = [
  {
    slug: 'ngx-pre-market-briefing-2026-11-27',
    ogImage: '/og/briefing-latest.svg',
    volume: 'VOL. LVIII',
    date: '2026-11-27',
    title: 'NGX Pre-Market Intelligence: ASI Crosses 104,200 pts; Tier-1 Banking Recapitalization Liquidity Surge',
    metaTitle: 'NGX Pre-Market Intelligence Briefing (Nov 27, 2026) | PSA Investment',
    metaDescription: 'Daily Nigerian Exchange pre-market intelligence for Nov 27, 2026. ASI 104,215.30 pts (+0.42%), Top Gainers, Losers, and banking recapitalization liquidity analysis.',
    asi: '104,215.30 pts',
    asiChange: '+0.42%',
    asiYtd: '+39.4%',
    marketCap: '₦63.48 Trillion',
    leadArticle: 'The Nigerian Exchange extended its historic bullish run on Thursday, propelled by institutional buying across Tier-1 banking leaders GTCO and Zenith Bank, alongside renewed foreign portfolio interest in Seplat Energy. Trading turnover surpassed ₦14.2 billion, signaling robust liquidity as institutional funds position ahead of the December portfolio rebalancing.',
    macroHighlights: [
      { metric: 'NAFEM Official FX Rate', value: '₦1,648.50 / $1', change: '-₦4.20' },
      { metric: 'Parallel Market FX Rate', value: '₦1,695.00 / $1', change: 'Stable' },
      { metric: 'Brent Crude Oil', value: '$74.80 / bbl', change: '+1.2%' },
      { metric: 'CBN Monetary Policy Rate (MPR)', value: '27.25%', change: 'Unchanged' }
    ],
    topGainers: [
      { ticker: 'GTCO', name: 'Guaranty Trust Holding Co', close: '₦119.20', change: '+4.8%' },
      { ticker: 'SEPLAT', name: 'Seplat Energy Plc', close: '₦3,860.00', change: '+3.9%' },
      { ticker: 'PRESCO', name: 'Presco Plc', close: '₦485.00', change: '+3.5%' },
      { ticker: 'ZENITHBANK', name: 'Zenith Bank Plc', close: '₦46.40', change: '+2.9%' },
      { ticker: 'OANDO', name: 'Oando Plc', close: '₦88.50', change: '+2.4%' }
    ],
    topLosers: [
      { ticker: 'FBNH', name: 'First Holdco Plc', close: '₦28.20', change: '-3.1%' },
      { ticker: 'UBA', name: 'United Bank for Africa', close: '₦34.50', change: '-2.2%' },
      { ticker: 'TRANSCORP', name: 'Transnational Corp', close: '₦12.40', change: '-1.8%' },
      { ticker: 'CONOIL', name: 'Conoil Plc', close: '₦215.00', change: '-1.4%' },
      { ticker: 'WAPCO', name: 'Lafarge Africa Plc', close: '₦54.00', change: '-0.9%' }
    ]
  },
  {
    slug: 'ngx-pre-market-briefing-2026-11-26',
    ogImage: '/og/market-briefings.svg',
    volume: 'VOL. LVII',
    date: '2026-11-26',
    title: 'NGX Pre-Market Intelligence: CBN MPC Rate Hold Reaction; MTNN Leads Infrastructure Rebound',
    metaTitle: 'NGX Pre-Market Intelligence Briefing (Nov 26, 2026) | PSA Investment',
    metaDescription: 'Daily NGX market briefing for Nov 26, 2026. ASI 103,780.12 pts (+0.28%), MTN Nigeria rebound, and macro commentary directed by Salami Abdullahi.',
    asi: '103,780.12 pts',
    asiChange: '+0.28%',
    asiYtd: '+38.8%',
    marketCap: '₦63.15 Trillion',
    leadArticle: 'Domestic equities sustained constructive breadth following the Central Bank of Nigeria Monetary Policy Committee unanimous decision to hold the benchmark interest rate at 27.25%. Fixed income yields compressed marginally, prompting equity allocations to high-dividend industrial and telecommunications bellwethers.',
    macroHighlights: [
      { metric: 'NAFEM Official FX Rate', value: '₦1,652.70 / $1', change: '+₦2.10' },
      { metric: 'Parallel Market FX Rate', value: '₦1,695.00 / $1', change: 'Stable' },
      { metric: 'Brent Crude Oil', value: '$73.90 / bbl', change: '-0.8%' },
      { metric: 'CBN Monetary Policy Rate (MPR)', value: '27.25%', change: 'Unchanged' }
    ],
    topGainers: [
      { ticker: 'MTNN', name: 'MTN Nigeria Comms', close: '₦205.00', change: '+5.1%' },
      { ticker: 'DANGCEM', name: 'Dangote Cement Plc', close: '₦655.00', change: '+3.1%' },
      { ticker: 'ACCESSCORP', name: 'Access Holdings Plc', close: '₦24.10', change: '+2.8%' },
      { ticker: 'TOTAL', name: 'TotalEnergies Marketing', close: '₦680.00', change: '+2.5%' },
      { ticker: 'FLOURMILL', name: 'Flour Mills of Nigeria', close: '₦72.00', change: '+1.9%' }
    ],
    topLosers: [
      { ticker: 'FIDELITYBK', name: 'Fidelity Bank Plc', close: '₦16.20', change: '-2.4%' },
      { ticker: 'STANBIC', name: 'Stanbic IBTC Holdings', close: '₦61.50', change: '-1.9%' },
      { ticker: 'UNILEVER', name: 'Unilever Nigeria Plc', close: '₦22.00', change: '-1.5%' },
      { ticker: 'GUINNESS', name: 'Guinness Nigeria Plc', close: '₦68.00', change: '-1.2%' },
      { ticker: 'DANGSUGAR', name: 'Dangote Sugar Refinery', close: '₦38.50', change: '-0.8%' }
    ]
  },
  {
    slug: 'ngx-pre-market-briefing-2026-11-13',
    ogImage: '/og/market-briefings.svg',
    volume: 'VOL. LIII',
    date: '2026-11-13',
    title: 'NGX Pre-Market Intelligence: Banking Recapitalization Rights Issues Absorb Foreign Inflows',
    metaTitle: 'NGX Pre-Market Intelligence Briefing (Nov 13, 2026) | PSA Investment',
    metaDescription: 'Official PSA Daily Market Briefing for Nov 13, 2026. Banking rights issues, ASI 102,940.50 pts, and institutional trading analysis.',
    asi: '102,940.50 pts',
    asiChange: '+0.35%',
    asiYtd: '+37.6%',
    marketCap: '₦62.60 Trillion',
    leadArticle: 'The Nigerian capital market absorbed over ₦450 billion in new banking recapitalization issuances during the week with zero discount to secondary market trading. Foreign institutional participation via NAFEM liquidity windows climbed to a 24-month high, underscoring international confidence in commercial bank capital resilience.',
    macroHighlights: [
      { metric: 'NAFEM Official FX Rate', value: '₦1,660.00 / $1', change: '-₦5.50' },
      { metric: 'Parallel Market FX Rate', value: '₦1,700.00 / $1', change: 'Stable' },
      { metric: 'Brent Crude Oil', value: '$72.40 / bbl', change: '+0.5%' },
      { metric: 'CBN Monetary Policy Rate (MPR)', value: '27.25%', change: 'Unchanged' }
    ],
    topGainers: [
      { ticker: 'ZENITHBANK', name: 'Zenith Bank Plc', close: '₦45.10', change: '+4.2%' },
      { ticker: 'GTCO', name: 'Guaranty Trust Holding Co', close: '₦113.80', change: '+3.8%' },
      { ticker: 'PRESCO', name: 'Presco Plc', close: '₦468.00', change: '+3.1%' },
      { ticker: 'CONOIL', name: 'Conoil Plc', close: '₦218.00', change: '+2.7%' },
      { ticker: 'WAPCO', name: 'Lafarge Africa Plc', close: '₦54.50', change: '+2.1%' }
    ],
    topLosers: [
      { ticker: 'NASCON', name: 'NASCON Allied Industries', close: '₦32.00', change: '-2.8%' },
      { ticker: 'CADBURY', name: 'Cadbury Nigeria Plc', close: '₦18.50', change: '-2.1%' },
      { ticker: 'STERLINGNG', name: 'Sterling Financial Holdings', close: '₦5.10', change: '-1.9%' },
      { ticker: 'FCMB', name: 'FCMB Group Plc', close: '₦9.20', change: '-1.4%' },
      { ticker: 'CUSTODIAN', name: 'Custodian Investment', close: '₦14.00', change: '-0.7%' }
    ]
  }
];

// Core pages metadata
const CORE_PAGES = [
  {
    route: '/research',
    title: 'Equity Research & Valuation Dossiers | Nigerian Exchange (NGX) | PSA Investment',
    description: 'Institutional Nigerian equity research dossiers, DCF valuation models, banking recapitalization stress-tests, and dividend sustainability metrics directed by Salami Abdullahi.',
    ogImage: '/og/research.svg',
    heading: 'Nigerian Exchange (NGX) Equity Research & Valuation Dossiers',
    subheading: 'Institutional-grade fundamental analysis, Discounted Cash Flow (DCF) valuation models, and banking recapitalization stress-testing directed by Chief Analyst Salami Abdullahi.'
  },
  {
    route: '/market-briefings',
    title: 'Daily NGX Pre-Market Intelligence Briefing (07:00 WAT) | PSA Investment',
    description: 'Comprehensive Nigerian Exchange (NGX) daily pre-market intelligence published every morning at 07:00 WAT. ASI snapshot, gainers/losers, corporate disclosures, and macro benchmarks.',
    ogImage: '/og/market-briefings.svg',
    heading: 'Daily NGX Pre-Market Intelligence Briefings',
    subheading: 'Published every trading day at 07:00 WAT before the opening bell. Independent coverage of the Nigerian Exchange (NGX) All-Share Index, banking liquidity, corporate earnings, and macro indicators.'
  },
  {
    route: '/about',
    title: 'About PSA Investment | Salami Abdullahi | Institutional Authority & E-E-A-T',
    description: 'PSA Investment is an independent Nigerian equity research, corporate valuation, and capital advisory firm founded by Salami Abdullahi (ABU First-Class Honours, IBM Data Analyst, FMVA Candidate).',
    ogImage: '/og/default.svg',
    heading: 'About PSA Investment (PSAI)',
    subheading: 'Independent Nigerian Equity Research, Corporate Valuation & Capital Advisory'
  },
  {
    route: '/services',
    title: 'Services & Advisory | Portfolio Advisory & Solar Finance | PSA Investment',
    description: 'Institutional investment advisory services: Equity Research & Valuation, Banking Recapitalization Analysis, Solar Power-as-a-Service Underwriting, and Executive Financial Modeling.',
    ogImage: '/og/default.svg',
    heading: 'Advisory & Capital Services',
    subheading: 'Rigorous valuation underwriting, equity intelligence, and structured energy financing.'
  },
  {
    route: '/chronicle',
    title: 'PSA Financial Chronicle & Transcripts | Institutional Archives | PSA Investment',
    description: 'Weekly financial chronicle, earnings call transcripts, and macroeconomic research digests covering the Nigerian capital markets.',
    ogImage: '/og/default.svg',
    heading: 'PSA Financial Chronicle & Transcripts',
    subheading: 'Comprehensive archival research, executive transcripts, and institutional digests.'
  },
  {
    route: '/events',
    title: 'Events & FMVA Masterclass | Executive Financial Education | PSA Investment',
    description: 'Professional executive masterclasses in Financial Modeling and Valuation Analysis (FMVA) and Nigerian capital market symposiums directed by Salami Abdullahi.',
    ogImage: '/og/default.svg',
    heading: 'Executive Education & Events',
    subheading: 'Hands-on 3-statement modeling, DCF valuation, and banking recapitalization masterclasses.'
  },
  {
    route: '/events/financial-modeling-valuation-analysis-masterclass-nov-2026',
    title: 'Financial Modeling & Valuation Analysis (FMVA) Masterclass Nov 28, 2026 | PSA Investment',
    description: 'Executive hands-on financial modeling masterclass covering dynamic 3-statement models, DCF valuation, and Nigerian banking recapitalization metrics directed by Salami Abdullahi.',
    ogImage: '/og/default.svg',
    heading: 'Financial Modeling & Valuation Analysis (FMVA) Executive Masterclass',
    subheading: 'Saturday, November 28, 2026 | 10:00 AM – 4:00 PM WAT | Virtual Interactive Session'
  },
  {
    route: '/analyst-circle',
    title: 'PSA Analyst Circle | Institutional Membership Tier | PSA Investment',
    description: 'Private research access for portfolio managers, corporate treasurers, and high-net-worth investors. Tear-sheets, private Q&A, and real-time research alerts.',
    ogImage: '/og/default.svg',
    heading: 'The PSA Analyst Circle',
    subheading: 'Exclusive institutional equity research, downloadable financial models, and strategic capital market insights.'
  },
  {
    route: '/videos',
    title: 'PSA Lens | Video Market Intelligence & YouTube Analysis | PSA Investment',
    description: 'Video-based Nigerian stock market commentary, company deep-dives, and financial intelligence from @psa_investment on YouTube.',
    ogImage: '/og/default.svg',
    heading: 'PSA Lens — Video Market Intelligence',
    subheading: 'Executive video analysis, earnings breakdowns, and macroeconomic commentary.'
  },
  {
    route: '/contact',
    title: 'Contact Advisory Desk | Lagos & Abuja, Nigeria | PSA Investment',
    description: 'Get in touch with the PSA Investment research desk and capital advisory team in Lagos and Abuja. Phone: +234 706 837 1292. Email: psainvestment.ng@gmail.com.',
    ogImage: '/og/default.svg',
    heading: 'Contact PSA Investment',
    subheading: 'Institutional Advisory Desk | Lagos & Abuja, Nigeria'
  },
  {
    route: '/admin/publish',
    title: 'Fast-Publishing CMS | 07:45 WAT Workflow | PSA Investment Admin',
    description: 'Protected fast-publishing portal for daily NGX pre-market briefings and monthly equity research dossiers.',
    ogImage: '/og/default.svg',
    heading: 'PSA Investment Fast-Publishing CMS',
    subheading: 'Publish-First, WhatsApp-Second Workflow for Pre-Market Intelligence'
  }
];

// -------------------------------------------------------------
// 3. HTML GENERATION ENGINE
// -------------------------------------------------------------
function buildDossierHtml(dossier) {
  const rowsHtml = dossier.valuationRows.map((r, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 12px 16px; font-weight: 600; color: #0A1F44;">${escapeHtml(r.metric)}</td>
      <td style="padding: 12px 16px; font-family: monospace; font-weight: 700; color: #C9A84C;">${escapeHtml(r.current)}</td>
      <td style="padding: 12px 16px; font-family: monospace; color: #64748B;">${escapeHtml(r.peer)}</td>
      <td style="padding: 12px 16px; color: #334155; font-size: 14px;">${escapeHtml(r.assessment)}</td>
    </tr>
  `).join('');

  return `
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px 16px; font-family: 'Inter', sans-serif; color: #1E293B;">
    <!-- Breadcrumb -->
    <nav style="font-size: 14px; margin-bottom: 20px; color: #64748B;">
      <a href="/" style="color: #0A1F44; text-decoration: none; font-weight: 600;">Home</a> &gt; 
      <a href="/research" style="color: #0A1F44; text-decoration: none; font-weight: 600;">Equity Research</a> &gt; 
      <span style="color: #C9A84C; font-weight: 700;">${escapeHtml(dossier.ticker)}</span>
    </nav>

    <!-- Header Banner -->
    <div style="background-color: #0A1F44; color: #FFFFFF; border-radius: 12px; padding: 36px 32px; margin-bottom: 32px; border-left: 6px solid #C9A84C; box-shadow: 0 10px 25px -5px rgba(10, 31, 68, 0.2);">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
        <div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <span style="background-color: rgba(201, 168, 76, 0.2); color: #C9A84C; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px;">NGX: ${escapeHtml(dossier.ticker)}</span>
            <span style="background-color: #1E293B; color: #E2E8F0; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px;">${escapeHtml(dossier.sector)}</span>
          </div>
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; line-height: 1.25; margin: 0 0 8px 0; color: #FFFFFF;">${escapeHtml(dossier.title)}</h1>
          <p style="margin: 0; color: #94A3B8; font-size: 16px;">${escapeHtml(dossier.companyName)}</p>
        </div>
        <div style="background-color: #07152F; border: 1px solid #1E293B; border-radius: 8px; padding: 16px 24px; text-align: right;">
          <div style="font-size: 12px; color: #94A3B8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Conviction Rating</div>
          <div style="font-size: 24px; font-weight: 800; color: #10B981; margin: 4px 0;">${escapeHtml(dossier.convictionRating)}</div>
          <div style="font-size: 13px; color: #CBD5E1;">Target: <strong style="color: #FFFFFF;">${escapeHtml(dossier.targetPrice)}</strong> (${escapeHtml(dossier.upsidePercent)})</div>
        </div>
      </div>

      <!-- Quick Multiples Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Current Price</div><div style="font-size: 18px; font-weight: 700; color: #FFFFFF;">${escapeHtml(dossier.currentPrice)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">P/E Ratio</div><div style="font-size: 18px; font-weight: 700; color: #C9A84C;">${escapeHtml(dossier.multiples.pe)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">P/B Ratio</div><div style="font-size: 18px; font-weight: 700; color: #C9A84C;">${escapeHtml(dossier.multiples.pb)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Dividend Yield</div><div style="font-size: 18px; font-weight: 700; color: #10B981;">${escapeHtml(dossier.multiples.dividendYield)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Return on Equity</div><div style="font-size: 18px; font-weight: 700; color: #FFFFFF;">${escapeHtml(dossier.multiples.roe)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Market Cap</div><div style="font-size: 18px; font-weight: 700; color: #FFFFFF;">${escapeHtml(dossier.multiples.marketCap)}</div></div>
      </div>
    </div>

    <!-- Section 1: Executive Summary & Thesis -->
    <section style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #0A1F44; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #C9A84C; display: inline-block; padding-bottom: 4px;">1. Executive Summary &amp; Investment Thesis</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 16px;">${escapeHtml(dossier.executiveSummary)}</p>
      <div style="background-color: #F8FAFC; border-left: 4px solid #0A1F44; padding: 16px 20px; border-radius: 4px; font-size: 15px; color: #1E293B; line-height: 1.6;">
        <strong>Analyst Core Thesis:</strong> ${escapeHtml(dossier.investmentThesis)}
      </div>
    </section>

    <!-- Section 2: Standardized Valuation Multiples Table -->
    <section style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #0A1F44; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #C9A84C; display: inline-block; padding-bottom: 4px;">2. Standardized Valuation Multiples &amp; Peer Comparison</h2>
      <p style="font-size: 14px; color: #64748B; margin-bottom: 20px;">Comparative fundamental metrics benchmarked against peer medians on the Nigerian Exchange (NGX) as of November 2026.</p>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background-color: #0A1F44; color: #FFFFFF;">
              <th style="padding: 14px 16px; font-weight: 700; letter-spacing: 0.5px;">Metric</th>
              <th style="padding: 14px 16px; font-weight: 700; letter-spacing: 0.5px;">Current Figure</th>
              <th style="padding: 14px 16px; font-weight: 700; letter-spacing: 0.5px;">Sector Peer Median</th>
              <th style="padding: 14px 16px; font-weight: 700; letter-spacing: 0.5px;">Analyst Assessment</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Conversion & Lead Capture Block -->
    <section style="background: linear-gradient(135deg, #0A1F44 0%, #07152F 100%); color: #FFFFFF; border-radius: 12px; padding: 36px; text-align: center; margin-bottom: 28px; border-top: 4px solid #C9A84C;">
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; margin: 0 0 12px 0;">Download Full 1-Page Valuation Tear-Sheet (PDF)</h3>
      <p style="font-size: 15px; color: #CBD5E1; max-width: 600px; margin: 0 auto 24px auto;">Access institutional discounted cash flow sensitivity tables, recapitalization scenarios, and quarterly earnings breakdown.</p>
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="/research/${dossier.slug}" style="display: inline-block; background-color: #C9A84C; color: #0A1F44; font-weight: 700; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px;">Download Tear-Sheet</a>
        <a href="/analyst-circle" style="display: inline-block; background-color: transparent; border: 1.5px solid #C9A84C; color: #C9A84C; font-weight: 600; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px;">Unlock Analyst Circle Access</a>
      </div>
    </section>

    <!-- Institutional Sign-Off Block -->
    <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 14px; color: #64748B;">
      <div>
        <strong style="color: #0A1F44;">Salami Abdullahi Adaviruku</strong> | Founder &amp; Chief Analyst, PSA Investment
        <div style="font-size: 13px; color: #94A3B8;">B.Sc. First-Class Honours (Ahmadu Bello University) • IBM Certified Data Analyst • FMVA Candidate</div>
      </div>
      <div>
        Published under institutional guidelines on <a href="https://psainvestment.com" style="color: #0A1F44; font-weight: 600; text-decoration: none;">psainvestment.com</a>
      </div>
    </div>
  </div>`;
}

function buildBriefingHtml(briefing) {
  const gainersHtml = briefing.topGainers.map((g, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #0A1F44;">${escapeHtml(g.ticker)}</td>
      <td style="padding: 10px 14px; color: #334155;">${escapeHtml(g.name)}</td>
      <td style="padding: 10px 14px; font-family: monospace; font-weight: 600;">${escapeHtml(g.close)}</td>
      <td style="padding: 10px 14px; font-family: monospace; font-weight: 700; color: #10B981;">${escapeHtml(g.change)}</td>
    </tr>
  `).join('');

  const losersHtml = briefing.topLosers.map((l, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #0A1F44;">${escapeHtml(l.ticker)}</td>
      <td style="padding: 10px 14px; color: #334155;">${escapeHtml(l.name)}</td>
      <td style="padding: 10px 14px; font-family: monospace; font-weight: 600;">${escapeHtml(l.close)}</td>
      <td style="padding: 10px 14px; font-family: monospace; font-weight: 700; color: #EF4444;">${escapeHtml(l.change)}</td>
    </tr>
  `).join('');

  const macroHtml = briefing.macroHighlights.map(m => `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px;">
      <div style="font-size: 12px; color: #64748B; margin-bottom: 4px; text-transform: uppercase;">${escapeHtml(m.metric)}</div>
      <div style="font-size: 18px; font-weight: 700; color: #0A1F44; font-family: monospace;">${escapeHtml(m.value)}</div>
      <div style="font-size: 12px; color: #C9A84C; font-weight: 600; margin-top: 2px;">${escapeHtml(m.change)}</div>
    </div>
  `).join('');

  return `
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px 16px; font-family: 'Inter', sans-serif; color: #1E293B;">
    <!-- Breadcrumb -->
    <nav style="font-size: 14px; margin-bottom: 20px; color: #64748B;">
      <a href="/" style="color: #0A1F44; text-decoration: none; font-weight: 600;">Home</a> &gt; 
      <a href="/market-briefings" style="color: #0A1F44; text-decoration: none; font-weight: 600;">Market Briefings</a> &gt; 
      <span style="color: #C9A84C; font-weight: 700;">${escapeHtml(briefing.date)}</span>
    </nav>

    <!-- Header Banner -->
    <div style="background-color: #0A1F44; color: #FFFFFF; border-radius: 12px; padding: 36px 32px; margin-bottom: 28px; border-left: 6px solid #C9A84C;">
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <span style="background-color: rgba(201, 168, 76, 0.2); color: #C9A84C; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px;">${escapeHtml(briefing.volume)}</span>
        <span style="background-color: #1E293B; color: #E2E8F0; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px;">07:00 WAT PRE-MARKET</span>
        <span style="background-color: #1E293B; color: #CBD5E1; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px;">${escapeHtml(briefing.date)}</span>
      </div>
      <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; line-height: 1.3; margin: 0 0 16px 0; color: #FFFFFF;">${escapeHtml(briefing.title)}</h1>
      <p style="margin: 0; color: #94A3B8; font-size: 15px;">Official daily pre-market intelligence and capital market overview directed by Salami Abdullahi.</p>

      <!-- ASI Summary Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">NGX All-Share Index</div><div style="font-size: 22px; font-weight: 800; color: #FFFFFF; font-family: monospace;">${escapeHtml(briefing.asi)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Daily Change</div><div style="font-size: 22px; font-weight: 800; color: #10B981; font-family: monospace;">${escapeHtml(briefing.asiChange)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">YTD Return</div><div style="font-size: 22px; font-weight: 800; color: #C9A84C; font-family: monospace;">${escapeHtml(briefing.asiYtd)}</div></div>
        <div><div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Market Cap</div><div style="font-size: 22px; font-weight: 800; color: #FFFFFF;">${escapeHtml(briefing.marketCap)}</div></div>
      </div>
    </div>

    <!-- Lead Editorial -->
    <section style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #0A1F44; margin-top: 0; margin-bottom: 14px;">Pre-Market Capital Analysis</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #334155; margin: 0;">${escapeHtml(briefing.leadArticle)}</p>
    </section>

    <!-- Macro Indicators Grid -->
    <section style="margin-bottom: 24px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #0A1F44; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Macroeconomic &amp; Monetary Benchmarks</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        ${macroHtml}
      </div>
    </section>

    <!-- Gainers & Losers Tables -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-bottom: 28px;">
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #10B981; margin: 0 0 14px 0;">Top 5 Gainers</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background-color: #F1F5F9; border-bottom: 1px solid #CBD5E1;">
              <th style="padding: 8px 12px;">Ticker</th>
              <th style="padding: 8px 12px;">Company</th>
              <th style="padding: 8px 12px;">Close</th>
              <th style="padding: 8px 12px;">Change</th>
            </tr>
          </thead>
          <tbody>${gainersHtml}</tbody>
        </table>
      </div>

      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #EF4444; margin: 0 0 14px 0;">Top 5 Losers</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background-color: #F1F5F9; border-bottom: 1px solid #CBD5E1;">
              <th style="padding: 8px 12px;">Ticker</th>
              <th style="padding: 8px 12px;">Company</th>
              <th style="padding: 8px 12px;">Close</th>
              <th style="padding: 8px 12px;">Change</th>
            </tr>
          </thead>
          <tbody>${losersHtml}</tbody>
        </table>
      </div>
    </div>

    <!-- WhatsApp Distribution Block -->
    <div style="background: #0A1F44; border-radius: 12px; padding: 24px 32px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <h4 style="margin: 0 0 4px 0; font-size: 18px; color: #C9A84C;">Join PSA WhatsApp Intelligence Channel</h4>
        <p style="margin: 0; font-size: 14px; color: #94A3B8;">Receive the 07:00 WAT pre-market bulletin and equity valuation dossiers directly on WhatsApp.</p>
      </div>
      <a href="https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R" target="_blank" rel="noopener noreferrer" style="background-color: #25D366; color: #FFFFFF; font-weight: 700; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">Connect on WhatsApp</a>
    </div>
  </div>`;
}

function buildIndexListHtml(page) {
  return `
  <div style="max-width: 1200px; margin: 0 auto; padding: 32px 16px; font-family: 'Inter', sans-serif; color: #1E293B;">
    <div style="background-color: #0A1F44; color: #FFFFFF; border-radius: 12px; padding: 40px 32px; margin-bottom: 32px; border-left: 6px solid #C9A84C;">
      <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 36px; margin: 0 0 12px 0;">${escapeHtml(page.heading)}</h1>
      <p style="margin: 0; font-size: 17px; color: #CBD5E1; max-width: 800px; line-height: 1.6;">${escapeHtml(page.subheading)}</p>
    </div>

    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px;">
      <p style="font-size: 16px; line-height: 1.7; color: #475569;">
        Access institutional research dossiers, financial model downloads, and daily pre-market intelligence for the Nigerian capital markets.
      </p>
      <div style="display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap;">
        <a href="/research" style="background: #0A1F44; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Browse Research Dossiers</a>
        <a href="/market-briefings" style="background: #C9A84C; color: #0A1F44; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700;">Daily Market Briefings</a>
        <a href="/events" style="border: 1px solid #CBD5E1; color: #0A1F44; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Upcoming Events &amp; FMVA</a>
      </div>
    </div>
  </div>`;
}

// -------------------------------------------------------------
// 4. MAIN BUILD PROCESS
// -------------------------------------------------------------
function preRenderPages() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Collect all pages to render
  const renderList = [];

  // 1. Core Pages
  CORE_PAGES.forEach(page => {
    renderList.push({
      route: page.route,
      title: page.title,
      description: page.description,
      ogImage: page.ogImage,
      type: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url: `${BASE_URL}${page.route}`,
        publisher: {
          '@type': 'FinancialService',
          name: 'PSA Investment',
          url: BASE_URL
        }
      },
      contentHtml: buildIndexListHtml(page)
    });
  });

  // 2. Dossiers
  DOSSIERS.forEach(dossier => {
    const route = `/research/${dossier.slug}`;
    renderList.push({
      route,
      title: dossier.metaTitle,
      description: dossier.metaDescription,
      ogImage: dossier.ogImage,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AnalysisNewsArticle',
        headline: dossier.title,
        description: dossier.metaDescription,
        url: `${BASE_URL}${route}`,
        image: `${BASE_URL}${dossier.ogImage}`,
        datePublished: '2026-11-20T08:00:00+01:00',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: 'Salami Abdullahi',
          jobTitle: 'Founder, CEO, COO, and Chief Analyst',
          url: `${BASE_URL}/about`
        },
        publisher: {
          '@type': 'FinancialService',
          name: 'PSA Investment',
          url: BASE_URL,
          logo: `${BASE_URL}/salami-abdullahi.jpg`
        },
        about: {
          '@type': 'Corporation',
          name: dossier.companyName,
          tickerSymbol: `NGX:${dossier.ticker}`
        }
      },
      contentHtml: buildDossierHtml(dossier)
    });
  });

  // 3. Daily Market Briefings
  BRIEFINGS.forEach(briefing => {
    const route = `/market-briefings/${briefing.slug}`;
    renderList.push({
      route,
      title: briefing.metaTitle,
      description: briefing.metaDescription,
      ogImage: briefing.ogImage,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AnalysisNewsArticle',
        headline: briefing.title,
        description: briefing.metaDescription,
        url: `${BASE_URL}${route}`,
        image: `${BASE_URL}${briefing.ogImage}`,
        datePublished: `${briefing.date}T07:00:00+01:00`,
        dateModified: `${briefing.date}T07:00:00+01:00`,
        author: {
          '@type': 'Person',
          name: 'Salami Abdullahi',
          jobTitle: 'Founder, CEO, COO, and Chief Analyst',
          url: `${BASE_URL}/about`
        },
        publisher: {
          '@type': 'FinancialService',
          name: 'PSA Investment',
          url: BASE_URL,
          logo: `${BASE_URL}/salami-abdullahi.jpg`
        }
      },
      contentHtml: buildBriefingHtml(briefing)
    });
  });

  console.log(`Pre-rendering ${renderList.length} pages for static crawlability...`);

  renderList.forEach(item => {
    const fullCanonicalUrl = `${BASE_URL}${item.route}`;
    const fullOgImageUrl = `${BASE_URL}${item.ogImage}`;

    let pageHtml = baseHtml;

    // Replace <title>
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(item.title)}</title>`);

    // Replace meta title & description
    pageHtml = pageHtml.replace(/<meta name="title" content=".*?" \/>/i, `<meta name="title" content="${escapeHtml(item.title)}" />`);
    pageHtml = pageHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(item.description)}" />`);

    // Replace canonical
    pageHtml = pageHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${fullCanonicalUrl}" />`);

    // Replace Open Graph meta
    pageHtml = pageHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${fullCanonicalUrl}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(item.title)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(item.description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${fullOgImageUrl}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:type" content=".*?" \/>/i, `<meta property="og:type" content="${item.type}" />`);

    // Replace Twitter meta
    pageHtml = pageHtml.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${fullCanonicalUrl}" />`);
    pageHtml = pageHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(item.title)}" />`);
    pageHtml = pageHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(item.description)}" />`);
    pageHtml = pageHtml.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${fullOgImageUrl}" />`);

    // Inject JSON-LD
    const jsonLdScript = `\n    <script type="application/ld+json">\n${JSON.stringify(item.jsonLd, null, 2)}\n    </script>`;
    pageHtml = pageHtml.replace('</head>', `${jsonLdScript}\n  </head>`);

    // Inject pre-rendered semantic HTML inside root div
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${item.contentHtml}</div>`);

    // Determine output file path
    const routePath = item.route.replace(/^\//, '');
    const outDir = path.join(DIST_DIR, routePath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, pageHtml, 'utf-8');
    console.log(`  ✓ Created ${path.relative(ROOT_DIR, outFile)}`);
  });

  // Copy sitemap.xml, robots.txt, llms.txt to dist if not present
  ['robots.txt', 'sitemap.xml', 'llms.txt'].forEach(file => {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${file} to dist/`);
    }
  });

  console.log('✓ All SEO pages and distribution artifacts pre-rendered successfully.');
}

// Execute pre-rendering
preRenderPages();
