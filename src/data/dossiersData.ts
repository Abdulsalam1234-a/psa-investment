import { EquityDossier } from '../types';

export const INITIAL_EQUITY_DOSSIERS: EquityDossier[] = [
  {
    id: 'dossier-gtco-fy2026',
    slug: 'gtco-holdings-fy2026-valuation-dossier',
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
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦119.20',
        sectorPeerAverage: '₦68.40',
        analystAssessment: 'Trading at 32.6% discount to discounted cash flow fair value.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '3.8x',
        sectorPeerAverage: '5.2x',
        analystAssessment: 'Attractive multiple backed by top-quartile fee and commission earnings.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '0.85x',
        sectorPeerAverage: '0.94x',
        analystAssessment: 'Deep tangible asset discount relative to Tier-1 capital adequacy of 24.1%.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '10.7%',
        sectorPeerAverage: '8.4%',
        analystAssessment: 'Superior cash flow coverage and historical 10-year payout consistency.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '29.4%',
        sectorPeerAverage: '22.8%',
        analystAssessment: 'Industry-leading ROE driven by 68% low-cost CASA deposit franchise.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦3.51 Trillion',
        sectorPeerAverage: '₦2.10 Trillion',
        analystAssessment: 'Second-largest financial services capitalization on the Nigerian Exchange.'
      }
    ],
    executiveSummary: 'Guaranty Trust Holding Company Plc (NGX: GTCO) remains the standard for operational efficiency, non-funded revenue resilience, and cost containment in West African banking. As the Central Bank of Nigeria recapitalization deadline approaches, GTCO has already satisfied statutory equity thresholds with surplus capital buffer, positioning the franchise to gain market share without punitive equity dilution.',
    investmentThesis: 'We maintain our strong BUY recommendation on GTCO with a 12-month base target price of ₦158.00 (+32.6% upside). GTCO combines an impenetrable low-cost deposit moat (68.4% CASA) with accelerating non-interest revenue streams from HabariPay (Squad), asset management, and pensions. Unlike peers reliant on unsustainable FX translation windfalls, GTCO core operating pre-tax margin exceeds 54%, supporting a projected 10.7% dividend yield.',
    businessOverview: `Guaranty Trust Holding Company Plc operates as a diversified financial services holding company with primary banking operations in Nigeria, West Africa, East Africa, and the United Kingdom. Its non-banking verticals include payment processing (Squad / HabariPay), fund management (Guaranty Trust Fund Managers), pension administration (Guaranty Trust Pension Managers), and specialized SME capital advisory.\n\nThe group serves over 34 million retail and commercial customers, supported by digital banking infrastructure that processes over ₦38 trillion in annualized digital transaction volume. Its retail deposit model delivers the lowest cost of funds in the Nigerian banking ecosystem at 2.9%, providing enduring structural advantages during hawkish interest rate regimes.`,
    financialDiagnostics: `GTCO reported gross earnings of ₦1.18 trillion for the trailing twelve months, representing a 78.4% year-on-year surge supported by prime loan expansion and investment security yields. Net Interest Margin (NIM) widened by 190 bps to 9.2%, while Cost-to-Income Ratio (CIR) remained benchmarked at 34.2%, well below the industry peer average of 58.6%.\n\nAsset quality metrics remain conservative: Non-Performing Loans (NPL) ratio stood at 3.9%, well under the CBN prudential ceiling of 5.0%, backed by an NPL coverage ratio of 168.4%. Capital Adequacy Ratio (CAR) settled at 24.1%, providing ample regulatory headroom above the 15.0% international bank requirement.`,
    catalystsAndRisks: `**Key Upside Catalysts:**\n- Full operational scale of HabariPay payment merchant acquisition, driving merchant transaction fees.\n- Expansion into East African regional trade corridors, providing hard-currency revenue diversification.\n- Early recapitalization compliance, enabling opportunistic bolt-on acquisitions of mid-tier loan portfolios.\n\n**Downside Risks & Mitigations:**\n- Regulatory increases in Cash Reserve Ratio (CRR) debits sterilizing interest-bearing liquid assets.\n- Macroeconomic inflation pressuring retail borrower disposable income and debt servicing ability. Mitigated by GTCO strict collateral underwriting and corporate credit concentration limits.`,
    valuationAndPriceTarget: `Our 12-month target price of ₦158.00 is derived using an equally weighted combination of a 5-year Discounted Cash Flow (DCF) model and Gordon Growth Return on Equity (ROE) / P/B relative framework.\n\nOur DCF model assumes an equity cost of capital of 23.5% (incorporating a Nigerian sovereign risk premium of 8.5% and equity beta of 1.15), a terminal growth rate of 6.0%, and normalized 5-year compound earnings growth of 18.2%. The Gordon Growth P/B model implies a justified P/B multiple of 1.12x against forecast FY2026 tangible book value per share of ₦141.20, pointing to strong valuation re-rating.`,
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *GTCO Holdings Plc (NGX: GTCO)*\n• Rating: *BUY* | Target Price: *₦158.00* (+32.6% Upside)\n• Multiples: P/E 3.8x | P/B 0.85x | Div Yield 10.7% | ROE 29.4%\n• Recapitalization surplus confirmed; HabariPay & low-cost deposit moat drive multi-year re-rating.\n🔗 Full Dossier & Model: https://psainvestment.com/research/gtco-holdings-fy2026-valuation-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'GTCO Valuation & Dividend Analysis (2026) | PSA Investment',
    metaDescription: 'Institutional equity research and DCF valuation of Guaranty Trust Holding Company (NGX: GTCO). Target price ₦158.00, P/E 3.8x, and 10.7% dividend yield.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-20T08:00:00Z',
    updatedAt: '2026-11-26T14:30:00Z'
  },
  {
    id: 'dossier-zenith-fy2026',
    slug: 'zenith-bank-recapitalization-equity-dossier',
    title: 'Zenith Bank Plc: Recapitalization Scale, Corporate Moat & Capital Distribution',
    companyName: 'Zenith Bank Plc',
    ticker: 'ZENITHBANK',
    sector: 'Banking',
    convictionRating: 'BUY',
    currentPrice: '₦116.00',
    targetPrice: '₦150.00',
    upsidePercent: '+29.3%',
    multiples: {
      pe: '3.4x',
      pb: '0.78x',
      dividendYield: '11.2%',
      roe: '28.1%',
      marketCap: '₦3.64 Trillion'
    },
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦116.00',
        sectorPeerAverage: '₦68.40',
        analystAssessment: 'Substantial undervaluation given market-leading tier-1 assets exceeding ₦24 trillion.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '3.4x',
        sectorPeerAverage: '5.2x',
        analystAssessment: 'P/E discount reflects investor hesitation on rights issue dilution, presenting an entry window.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '0.78x',
        sectorPeerAverage: '0.94x',
        analystAssessment: 'Trading below tangible book value despite record net income expansion.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '11.2%',
        sectorPeerAverage: '8.4%',
        analystAssessment: 'Benchmark dividend payout for dividend-growth institutional portfolios.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '28.1%',
        sectorPeerAverage: '22.8%',
        analystAssessment: 'Consistently sustained above 25% across multiple macroeconomic cycles.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦3.64 Trillion',
        sectorPeerAverage: '₦2.10 Trillion',
        analystAssessment: 'Largest asset base among Nigerian Exchange financial sector listings.'
      }
    ],
    executiveSummary: 'Zenith Bank Plc continues to dominate corporate banking, trade finance, and treasury operations in Nigeria. The bank recapitalization exercise has solidified its international status, providing an unassailable capital fortress that allows it to underwrite multibillion-naira infrastructure and energy transactions across West Africa.',
    investmentThesis: 'We reiterate a BUY rating with a 12-month price target of ₦150.00 (+29.3% upside). Zenith Bank possesses the deepest corporate relationships on the NGX, capturing over 28% of all national trade settlement transactions. With its HoldCo structure nearing final operational authorization, cross-selling across asset management, pensions, and digital commerce will expand return on assets.',
    businessOverview: `Zenith Bank Plc is Nigeria's largest financial institution by total assets and shareholders' funds. Operating subsidiaries in the UK, Ghana, Sierra Leone, The Gambia, and representative offices in China and the UAE, the group specializes in corporate banking, trade finance, foreign exchange clearing, and syndicated loan underwriting.\n\nThe bank serves leading multinationals, state governments, and high-net-worth individuals, maintaining an asset base exceeding ₦24 trillion.`,
    financialDiagnostics: `Operating income expanded 64.2% year-on-year, propelled by a 112% expansion in interest income from sovereign treasuries and prime corporate overdraft facilities. Cost of risk stabilized at 2.4%, with loan loss coverage surpassing 155%.\n\nGross loans and advances reached ₦7.8 trillion, supported by strong risk-mitigated underwriting in export manufacturing and oil & gas logistics.`,
    catalystsAndRisks: `**Key Catalysts:** Final HoldCo regulatory approvals, monetization of non-banking subsidiaries, and accelerated special dividend payouts once rights issues complete.\n\n**Risks:** Macro volatility and FX policy recalibration. Mitigated by large offshore liquid asset holdings and conservative provisioning.`,
    valuationAndPriceTarget: `Derived from a 5-year multi-stage DCF and dividend discount model (DDM), our ₦150.00 target assumes a sustainable ROE of 28.0% and terminal growth rate of 6.5%.`,
    coverImage: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *Zenith Bank Plc (NGX: ZENITHBANK)*\n• Rating: *BUY* | Target Price: *₦150.00* (+29.3% Upside)\n• Multiples: P/E 3.4x | P/B 0.78x | Div Yield 11.2% | ROE 28.1%\n• Capital fortress of ₦24T+ assets and trade finance supremacy solidify dividend upside.\n🔗 Full Dossier & Model: https://psainvestment.com/research/zenith-bank-recapitalization-equity-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'Zenith Bank Valuation & Recapitalization Dossier | PSA Investment',
    metaDescription: 'In-depth equity research and fundamental valuation of Zenith Bank Plc (NGX: ZENITHBANK). Target price ₦150.00 with 11.2% dividend yield.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-18T08:00:00Z',
    updatedAt: '2026-11-26T12:00:00Z'
  },
  {
    id: 'dossier-seplat-fy2026',
    slug: 'seplat-energy-anoh-gas-valuation-dossier',
    title: 'Seplat Energy Plc: ANOH Gas Monetization & Dollar Cash Flow Dominance',
    companyName: 'Seplat Energy Plc',
    ticker: 'SEPLAT',
    sector: 'Oil & Gas',
    convictionRating: 'BUY',
    currentPrice: '₦16,500.00',
    targetPrice: '₦22,000.00',
    upsidePercent: '+33.3%',
    multiples: {
      pe: '6.8x',
      pb: '1.45x',
      dividendYield: '9.8%',
      roe: '22.5%',
      marketCap: '₦9.71 Trillion'
    },
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦16,500.00',
        sectorPeerAverage: '₦8,200.00',
        analystAssessment: 'Heaviest market capitalisation among Nigerian indigenous upstream energy listings.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '6.8x',
        sectorPeerAverage: '9.4x',
        analystAssessment: 'Significant discount relative to international upstream peers trading at 10.5x+.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '1.45x',
        sectorPeerAverage: '1.82x',
        analystAssessment: 'Substantial asset backing supported by proven 2P reserves of over 500 million boe.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '9.8%',
        sectorPeerAverage: '5.6%',
        analystAssessment: 'Core US-dollar quarterly dividend distributions provide hard currency yield protection.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '22.5%',
        sectorPeerAverage: '16.4%',
        analystAssessment: 'Supported by low operating lifting cost per barrel and long-term domestic gas contracts.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦9.71 Trillion',
        sectorPeerAverage: '₦3.40 Trillion',
        analystAssessment: 'Dual-listed powerhouse on NGX and LSE driving sovereign energy security.'
      }
    ],
    executiveSummary: 'Seplat Energy Plc (NGX: SEPLAT, LSE: SEPL) represents the premier upstream energy equity listed in Nigeria. With the landmark consolidation of Mobil Producing Nigeria Unlimited (MPNU) shallow-water assets and commercial gas processing via the 300 MMscfd ANOH project, Seplat cash flow generation is unmatched on the exchange.',
    investmentThesis: 'We maintain our BUY recommendation with a target price of ₦22,000.00 (+33.3% upside). Seplat delivers a structural natural hedge against naira volatility through its USD-denominated dividend framework (paying quarterly dividends), while domestic gas off-take contracts guarantee steady cash receipts independent of global Brent volatility.',
    businessOverview: `Seplat Energy is Nigeria's foremost independent oil and gas producer. Its portfolio covers high-yield onshore and shallow-water concessions in the Niger Delta, including OMLs 4, 38, 41, 53, and 55, alongside gas processing terminals that feed over 30% of Nigeria's thermal electricity grid.`,
    financialDiagnostics: `Working interest production averaged 132,000 boepd post-asset consolidation. Free cash flow conversion exceeded 42% of revenue, enabling rapid deleveraging and special dividend distributions.`,
    catalystsAndRisks: `**Catalysts:** Full commercial gas throughput at ANOH, additional gas sales agreements, and increased crude evacuation via underground pipelines.\n\n**Risks:** Oil theft and pipeline vandalism, mitigated by the underground Amukpe-Escravos Pipeline route.`,
    valuationAndPriceTarget: `Discounted Cash Flow (DCF) net asset valuation (NAV) yields a fair equity value of ₦22,000.00 using an $80/bbl long-term Brent oil forecast and 14.5% weighted average cost of capital.`,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *Seplat Energy Plc (NGX: SEPLAT)*\n• Rating: *BUY* | Target Price: *₦22,000.00* (+33.3% Upside)\n• Multiples: P/E 6.8x | P/B 1.45x | Div Yield 9.8% (USD) | ROE 22.5%\n• MPNU asset integration & ANOH gas plant ramp drive premier FX cash flow on NGX.\n🔗 Full Dossier & Model: https://psainvestment.com/research/seplat-energy-anoh-gas-valuation-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'Seplat Energy Valuation & ANOH Gas Analysis | PSA Investment',
    metaDescription: 'Detailed institutional equity research on Seplat Energy Plc (NGX: SEPLAT). Target price ₦22,000.00, dollar-denominated dividend yield, and cash flow analysis.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-25T11:00:00Z'
  },
  {
    id: 'dossier-mtnn-fy2026',
    slug: 'mtn-nigeria-telecoms-infrastructure-dossier',
    title: 'MTN Nigeria Communications: Data Monetization & Turnaround Valuation',
    companyName: 'MTN Nigeria Communications Plc',
    ticker: 'MTNN',
    sector: 'Telecoms',
    convictionRating: 'ACCUMULATE',
    currentPrice: '₦837.00',
    targetPrice: '₦1,050.00',
    upsidePercent: '+25.4%',
    multiples: {
      pe: '11.2x',
      pb: '3.20x',
      dividendYield: '7.4%',
      roe: '35.2%',
      marketCap: '₦17.53 Trillion'
    },
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦837.00',
        sectorPeerAverage: '₦420.00',
        analystAssessment: 'Leading digital communications infrastructure counter in Sub-Saharan Africa.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '11.2x',
        sectorPeerAverage: '14.5x',
        analystAssessment: 'Multiple compressing as FX losses abate and tariff adjustments take effect.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '3.20x',
        sectorPeerAverage: '3.80x',
        analystAssessment: 'High book multiple reflecting asset-light digital service network scale.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '7.4%',
        sectorPeerAverage: '4.8%',
        analystAssessment: 'Restoration of full dividend payout ratio anticipated following balance sheet healing.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '35.2%',
        sectorPeerAverage: '24.0%',
        analystAssessment: 'Superlative operating leverage across data, enterprise fiber, and fintech.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦17.53 Trillion',
        sectorPeerAverage: '₦8.90 Trillion',
        analystAssessment: 'Consistently ranks among top-3 corporate market capitalizations on the exchange.'
      }
    ],
    executiveSummary: 'MTN Nigeria Communications Plc is the digital backbone of the Nigerian economy. With over 82 million active subscribers, 45 million data users, and burgeoning MoMo payment services, the company is rapidly emerging from past FX headwinds as tower lease renegotiations and data tariff optimization restore operating margins.',
    investmentThesis: 'We rate MTNN an ACCUMULATE with a 12-month target price of ₦1,050.00 (+25.4% upside). Data traffic expansion exceeding 40% annually combined with regulatory clarity on telecom tariff rationalization will drive significant EBITDA recovery and dividend normalization.',
    businessOverview: `MTN Nigeria holds the dominant share of Nigerian voice, broadband data, 5G enterprise infrastructure, and mobile money corridors. Its 5G network covers over 35% of key commercial metropolitan zones.`,
    financialDiagnostics: `Service revenue exceeded ₦2.8 trillion, with mobile data revenue accounting for over 48% of total top-line growth. Free cash flow generation recovered strongly to ₦480 billion.`,
    catalystsAndRisks: `**Catalysts:** Telecom tariff upward revision approval, renegotiation of tower contract currency indices, and MoMo PSB expansion.\n\n**Risks:** High energy diesel costs for rural base stations, mitigated by transition to solar and hybrid battery installations.`,
    valuationAndPriceTarget: `Our ₦1,050.00 target price uses an EV/EBITDA multiple of 6.2x applied to forecast FY2026 EBITDA of ₦1.45 trillion.`,
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *MTN Nigeria (NGX: MTNN)*\n• Rating: *ACCUMULATE* | Target Price: *₦1,050.00* (+25.4% Upside)\n• Multiples: P/E 11.2x | P/B 3.2x | Div Yield 7.4% | ROE 35.2%\n• Data traffic boom (+40%) and tower lease restructuring underpin margin recovery.\n🔗 Full Dossier & Model: https://psainvestment.com/research/mtn-nigeria-telecoms-infrastructure-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'MTN Nigeria Equity Valuation & Data Growth | PSA Investment',
    metaDescription: 'Institutional equity research on MTN Nigeria Communications (NGX: MTNN). Target price ₦1,050.00 with data monetization and balance sheet turnaround.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-10T08:00:00Z',
    updatedAt: '2026-11-24T09:00:00Z'
  },
  {
    id: 'dossier-dangcem-fy2026',
    slug: 'dangote-cement-industrial-growth-dossier',
    title: 'Dangote Cement Plc: Pan-African Export Capacity & Domestic Infrastructure Demand',
    companyName: 'Dangote Cement Plc',
    ticker: 'DANGCEM',
    sector: 'Industrial Goods',
    convictionRating: 'HOLD',
    currentPrice: '₦1,469.90',
    targetPrice: '₦1,580.00',
    upsidePercent: '+7.5%',
    multiples: {
      pe: '15.8x',
      pb: '3.90x',
      dividendYield: '5.2%',
      roe: '24.6%',
      marketCap: '₦25.05 Trillion'
    },
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦1,469.90',
        sectorPeerAverage: '₦340.00',
        analystAssessment: 'Industrial bellwether and largest single listing by equity market cap on the NGX.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '15.8x',
        sectorPeerAverage: '12.4x',
        analystAssessment: 'Trades at a quality premium reflecting unassailable 52 million MT production capacity.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '3.90x',
        sectorPeerAverage: '2.80x',
        analystAssessment: 'Reflects extensive proprietary limestone quarries and manufacturing plants.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '5.2%',
        sectorPeerAverage: '4.9%',
        analystAssessment: 'Reliable cash dividend payout supported by high domestic pricing power.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '24.6%',
        sectorPeerAverage: '18.2%',
        analystAssessment: 'Sustained by energy substitution with alternative local fuels and compressed natural gas.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦25.05 Trillion',
        sectorPeerAverage: '₦9.50 Trillion',
        analystAssessment: 'Cornerstone index weighting representing over 15% of the NGX All-Share Index.'
      }
    ],
    executiveSummary: 'Dangote Cement Plc is Sub-Saharan Africa largest cement producer with 52.0Mta capacity across 10 countries. While long-term infrastructure demand across West and Central Africa is compelling, current valuation levels reflect fair market value.',
    investmentThesis: 'We maintain a HOLD stance with a target price of ₦1,580.00 (+7.5% upside). While the company boasts stellar EBITDA margins (>45%) and domestic price inelasticity, current multiples leave modest margin of safety for aggressive new capital deployment.',
    businessOverview: `Dangote Cement operates integrated plants in Nigeria (Obajana, Ibese, Gboko) and clinker grinding terminals across Cameroon, Congo, Ethiopia, Ghana, Senegal, Sierra Leone, South Africa, Tanzania, and Zambia.`,
    financialDiagnostics: `Revenue rose 58.1% to ₦3.24 trillion, with domestic Nigerian operations delivering 64% of total group EBITDA. Alternative fuel usage reached 42% in key Nigerian kilns, cushioning gas cost spikes.`,
    catalystsAndRisks: `**Catalysts:** Major federal road infrastructure concrete paving mandates and export sea clinker terminals.\n\n**Risks:** Fuel cost pressures and currency restrictions in African subsidiaries.`,
    valuationAndPriceTarget: `Our DCF valuation sets a price target of ₦1,580.00 assuming a WACC of 21.0% and terminal growth of 5.5%.`,
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *Dangote Cement Plc (NGX: DANGCEM)*\n• Rating: *HOLD* | Target Price: *₦1,580.00* (+7.5% Upside)\n• Multiples: P/E 15.8x | P/B 3.9x | Div Yield 5.2% | ROE 24.6%\n• Massive 52Mta capacity & infrastructure moat balanced by fair market valuation.\n🔗 Full Dossier & Model: https://psainvestment.com/research/dangote-cement-industrial-growth-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'Dangote Cement Valuation & Pan-African Capacity | PSA Investment',
    metaDescription: 'Institutional equity research on Dangote Cement Plc (NGX: DANGCEM). Valuation assessment, multiples, and target price analysis.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-05T08:00:00Z',
    updatedAt: '2026-11-20T10:00:00Z'
  },
  {
    id: 'dossier-presco-fy2026',
    slug: 'presco-plantation-agriculture-expansion-dossier',
    title: 'Presco Plc: Crude Palm Oil Pricing Power & Plantation Estate Expansion',
    companyName: 'Presco Plc',
    ticker: 'PRESCO',
    sector: 'Agriculture',
    convictionRating: 'BUY',
    currentPrice: '₦620.00',
    targetPrice: '₦810.00',
    upsidePercent: '+30.6%',
    multiples: {
      pe: '7.2x',
      pb: '2.10x',
      dividendYield: '8.5%',
      roe: '31.8%',
      marketCap: '₦620.00 Billion'
    },
    valuationTable: [
      {
        metric: 'Current Share Price (NGX)',
        currentFigure: '₦620.00',
        sectorPeerAverage: '₦280.00',
        analystAssessment: 'Dominant integrated oil palm producer enjoying high local import substitution margins.'
      },
      {
        metric: 'Trailing P/E Ratio',
        currentFigure: '7.2x',
        sectorPeerAverage: '10.8x',
        analystAssessment: 'Deeply discounted relative to domestic food and industrial raw material demand.'
      },
      {
        metric: 'Price-to-Book (P/B)',
        currentFigure: '2.10x',
        sectorPeerAverage: '2.45x',
        analystAssessment: 'Solid backing from fully matured biological oil palm plantation assets.'
      },
      {
        metric: 'Dividend Yield (%)',
        currentFigure: '8.5%',
        sectorPeerAverage: '6.1%',
        analystAssessment: 'Strong free cash flow conversion translated into substantial interim and final payouts.'
      },
      {
        metric: 'Return on Equity (ROE)',
        currentFigure: '31.8%',
        sectorPeerAverage: '21.5%',
        analystAssessment: 'Exceptional agricultural return achieved through vertical refining and fractionation.'
      },
      {
        metric: 'Market Capitalization',
        currentFigure: '₦620.00 Billion',
        sectorPeerAverage: '₦310.00 Billion',
        analystAssessment: 'Largest agricultural sector equity capitalization on the Nigerian Exchange.'
      }
    ],
    executiveSummary: 'Presco Plc is the premier integrated agro-industrial oil palm producer in Nigeria. High domestic demand for refined specialty fats (vegetable oil, olein, stearin) combined with tariff protection on palm oil imports ensures structural pricing power and superior operating margins.',
    investmentThesis: 'We maintain a BUY recommendation on Presco with a target price of ₦810.00 (+30.6% upside). Acquisition synergies from the consolidation of the SNL oil palm estates and expanding refinery capacity position Presco to deliver sustained double-digit earnings growth and robust dividends.',
    businessOverview: `Presco owns over 43,000 hectares of cultivated oil palm estates, modern palm oil extraction mills, and edible oil refining plants in Edo and Delta States. Its corporate clients include major FMCG food manufacturers and pharmaceutical companies across West Africa.`,
    financialDiagnostics: `Gross revenue rose 71.3% year-on-year to ₦142 billion on higher CPO volumes and favorable local realization prices. Operating margin widened to 44.5%.`,
    catalystsAndRisks: `**Catalysts:** Increased yields from young replanted estates and further expansion in specialty vegetable fats.\n\n**Risks:** Weather anomalies and biological asset yield fluctuations, mitigated by drip irrigation investments.`,
    valuationAndPriceTarget: `Discounted cash flow model with an equity hurdle rate of 22.0% yields a fair value estimate of ₦810.00 per share.`,
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    tearSheetPdfUrl: '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
    whatsappTeaser: `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *Presco Plc (NGX: PRESCO)*\n• Rating: *BUY* | Target Price: *₦810.00* (+30.6% Upside)\n• Multiples: P/E 7.2x | P/B 2.1x | Div Yield 8.5% | ROE 31.8%\n• Unmatched crude palm oil pricing power & plantation expansion drive agricultural re-rating.\n🔗 Full Dossier & Model: https://psainvestment.com/research/presco-plantation-agriculture-expansion-dossier?utm_source=whatsapp&utm_medium=social`,
    metaTitle: 'Presco Valuation & Palm Oil Agriculture Dossier | PSA Investment',
    metaDescription: 'Institutional research on Presco Plc (NGX: PRESCO). Valuation multiples, biological asset scale, and target price ₦810.00.',
    author: 'Salami Abdullahi A.',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-18T14:00:00Z'
  }
];
