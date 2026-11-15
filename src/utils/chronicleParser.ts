import {
  ChronicleEdition,
  MarketBarometer,
  StockMover,
  BellwetherItem,
  MacroBenchmark,
  CorporateActionItem
} from '../types';
import { sanitizeText, sanitizeSafeHtml } from './security';

export function parseRawChronicle(rawText: string, htmlContent?: string): Partial<ChronicleEdition> {
  const cleanRaw = sanitizeText(rawText, 50000);
  const lines = cleanRaw.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract volume
  const volumeMatch = cleanRaw.match(/VOL\.?\s*([A-Z0-9]+)/i);
  const volume = volumeMatch ? `VOL. ${volumeMatch[1].toUpperCase()}` : 'VOL. LIII';

  // Extract date
  const dateMatch = cleanRaw.match(/\|\s*([A-Z]+,\s+[A-Z]+\s+\d{1,2},\s+\d{4})/i) ||
                    cleanRaw.match(/([A-Z]+,\s+[A-Z]+\s+\d{1,2},\s+\d{4})/i);
  const editionDate = dateMatch ? dateMatch[1] : 'Friday, November 13, 2026';

  // Extract time
  const timeMatch = cleanRaw.match(/(\d{1,2}:\d{2}\s*(?:WAT|AM|PM))/i);
  const briefingTime = timeMatch ? timeMatch[1] : '07:00 WAT';

  // Look for Headline: usually lines after the masthead metadata
  let headline = 'NGX Rebounds ₦328.26 Billion to ₦163.86 Trillion as ASI Gains 0.20% to 252,366.80';
  let subheadline = 'Seplat Energy (+3.12%), First HoldCo (+2.09%), and Stanbic IBTC (+2.55%) snap slide; turnover lifts 244.6% to ₦78.66B.';
  let leadArticle = '';

  // Scan for headline
  const headlineIdx = lines.findIndex(l => 
    !l.includes('PSA INVESTMENT') && 
    !l.includes('THE PSA FINANCIAL') && 
    !l.includes('Enhanced Pre-Market') && 
    !l.includes('Verified Pre-Market') && 
    !l.startsWith('|') && 
    l.length > 25 &&
    !l.startsWith('TABLE') &&
    !l.startsWith('Official Market')
  );

  if (headlineIdx !== -1) {
    if (lines[headlineIdx].includes('&') || lines[headlineIdx].length < 60) {
      if (headlineIdx + 1 < lines.length && !lines[headlineIdx + 1].startsWith('|')) {
        headline = lines[headlineIdx + 1];
        if (headlineIdx + 2 < lines.length && !lines[headlineIdx + 2].startsWith('|')) {
          subheadline = lines[headlineIdx + 2];
        }
      } else {
        headline = lines[headlineIdx];
      }
    } else {
      headline = lines[headlineIdx];
      if (headlineIdx + 1 < lines.length && !lines[headlineIdx + 1].startsWith('|')) {
        subheadline = lines[headlineIdx + 1];
      }
    }
  }

  // Scan lead article (lines with LAGOS or desks)
  const lagosIdx = lines.findIndex(l => l.includes('LAGOS') || l.includes('PSA INVESTMENT DESK'));
  if (lagosIdx !== -1) {
    leadArticle = lines[lagosIdx];
  }

  // Parse Market Barometers from Table 1
  const marketBarometers: MarketBarometer[] = [];
  const table1Match = cleanRaw.match(/TABLE 1[\s\S]*?(?=OFFICIAL PRICE|TOP GAINERS|BLUE-CHIP|$)/i);
  if (table1Match) {
    const tableLines = table1Match[0].split('\n');
    for (const line of tableLines) {
      if (line.includes('|') && !line.includes('Official Market Barometer') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 4) {
          marketBarometers.push({
            metric: parts[0],
            fridayClose: parts[1],
            thursdayClose: parts[2],
            change: parts[3],
            source: parts[4] || 'NGX Official'
          });
        }
      }
    }
  }

  // Parse Top Gainers & Losers
  const topGainers: StockMover[] = [];
  const topLosers: StockMover[] = [];
  
  const gainersLosersSection = cleanRaw.match(/TOP GAINERS & LOSERS[\s\S]*?(?=BLUE-CHIP|MACROECONOMIC|CORPORATE|$)/i);
  if (gainersLosersSection) {
    const glLines = gainersLosersSection[0].split('\n');
    for (const line of glLines) {
      if (line.includes('|') && !line.includes('Top 5 Gainers') && !line.includes('Close') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 6) {
          const gTickerMatch = parts[0].match(/\(([^)]+)\)/);
          const gTicker = gTickerMatch ? gTickerMatch[1] : parts[0].split(' ')[0];
          topGainers.push({
            ticker: gTicker,
            name: parts[0].replace(/\([^)]+\)/, '').trim(),
            close: parts[1],
            change: parts[2]
          });

          const lTickerMatch = parts[3].match(/\(([^)]+)\)/);
          const lTicker = lTickerMatch ? lTickerMatch[1] : parts[3].split(' ')[0];
          topLosers.push({
            ticker: lTicker,
            name: parts[3].replace(/\([^)]+\)/, '').trim(),
            close: parts[4],
            change: parts[5]
          });
        }
      } else if (line.startsWith('-') || line.startsWith('•')) {
        const match = line.match(/[-•]\s*(.*?)\s*\((.*?)\):\s*(.*?)\s*\((.*?)\)/);
        if (match) {
          const isGainer = match[4].includes('+');
          const mover = {
            ticker: match[2],
            name: match[1].trim(),
            close: match[3],
            change: match[4]
          };
          if (isGainer) topGainers.push(mover);
          else topLosers.push(mover);
        }
      }
    }
  }

  // Parse Fundamental Drivers (Gainer Drivers & Loser Drivers)
  const gainerDrivers: string[] = [];
  const loserDrivers: string[] = [];
  const driversMatch = cleanRaw.match(/Top Gainer Fundamental[\s\S]*?(?=BLUE-CHIP|CORPORATE|MACROECONOMIC|$)/i);
  if (driversMatch) {
    const text = driversMatch[0];
    const parts = text.split(/Top Loser Fundamental/i);
    if (parts.length >= 2) {
      const gBullets = parts[0].split(/[•\n]/).map(s => s.trim()).filter(s => s.length > 10 && !s.includes('Fundamental'));
      gBullets.forEach(b => gainerDrivers.push(b));

      const lBullets = parts[1].split(/[•\n]/).map(s => s.trim()).filter(s => s.length > 10 && !s.includes('Fundamental'));
      lBullets.forEach(b => loserDrivers.push(b));
    }
  }

  // Parse Bellwethers
  const bellwethers: BellwetherItem[] = [];
  const bellwethersMatch = cleanRaw.match(/BLUE-CHIP BELLWETHERS[\s\S]*?(?=CORPORATE|MACROECONOMIC|TACTICAL|$)/i);
  if (bellwethersMatch) {
    const bLines = bellwethersMatch[0].split('\n');
    for (const line of bLines) {
      if (line.includes('|') && !line.includes('Ticker / Counter') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 4) {
          const tickerMatch = parts[0].match(/\(([^)]+)\)/) || [null, parts[0]];
          bellwethers.push({
            ticker: tickerMatch[1] || parts[0],
            close: parts[1],
            turnover: parts[2] || parts[3],
            signal: parts[3] || 'Active Flow',
            notes: parts[4] || ''
          });
        }
      }
    }
  }

  // Parse Corporate Actions
  const corporateActions: CorporateActionItem[] = [];
  const corpMatch = cleanRaw.match(/CORPORATE ACTIONS[\s\S]*?(?=MACROECONOMIC|TACTICAL|The PSA Financial|$)/i);
  if (corpMatch) {
    const cLines = corpMatch[0].split('\n');
    for (const line of cLines) {
      if (line.includes('|') && !line.includes('Entity / Counter') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 3) {
          corporateActions.push({
            entity: parts[0],
            event: parts[1],
            details: parts[2],
            timeline: parts[3] || 'Regulatory Timeline'
          });
        }
      }
    }
  }

  // Parse Macro Benchmarks
  const macroBenchmarks: MacroBenchmark[] = [];
  const macroMatch = cleanRaw.match(/MACROECONOMIC[\s\S]*?(?=TACTICAL|The PSA Financial|$)/i);
  if (macroMatch) {
    const mLines = macroMatch[0].split('\n');
    for (const line of mLines) {
      if (line.includes('|') && !line.includes('Macro Benchmark') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 3) {
          macroBenchmarks.push({
            indicator: parts[0],
            level: parts[1],
            variance: parts[2],
            source: parts[3] || 'CBN / Regulatory Authority'
          });
        }
      }
    }
  }

  // Parse Tactical Playbook
  const tacticalPlaybook: string[] = [];
  const tacticalMatch = cleanRaw.match(/TACTICAL PRE-MARKET PLAYBOOK[\s\S]*?(?=The PSA Financial|$)/i);
  if (tacticalMatch) {
    const tText = tacticalMatch[0];
    const points = tText.split(/(?=\d\.\s)/).map(p => p.trim()).filter(p => /^\d\.\s/.test(p));
    if (points.length > 0) {
      points.forEach(p => tacticalPlaybook.push(p.replace(/^\d\.\s*/, '')));
    } else {
      tacticalPlaybook.push(tText.replace(/TACTICAL PRE-MARKET PLAYBOOK[^\n]*\n?/, '').trim());
    }
  }

  return {
    title: 'THE PSA FINANCIAL CHRONICLE',
    subtitle: 'Enhanced Pre-Market Intelligence: Verified Institutional Block Flow, Corporate Actions & Strategic Trade Setups',
    volume,
    editionDate,
    briefingTime,
    headline,
    subheadline,
    leadArticle: leadArticle || subheadline,
    marketBarometers: marketBarometers.length > 0 ? marketBarometers : [
      { metric: 'NGX All-Share Index (ASI)', fridayClose: '252,366.80 pts', thursdayClose: '251,861.24 pts', change: '+0.20%', source: 'NGX DOPL' }
    ],
    topGainers,
    topLosers,
    gainerDrivers: gainerDrivers.length > 0 ? gainerDrivers : undefined,
    loserDrivers: loserDrivers.length > 0 ? loserDrivers : undefined,
    bellwethers,
    corporateActions: corporateActions.length > 0 ? corporateActions : undefined,
    macroBenchmarks,
    tacticalPlaybook,
    formattedHtml: htmlContent ? sanitizeSafeHtml(htmlContent) : undefined,
    rawText: cleanRaw
  };
}
