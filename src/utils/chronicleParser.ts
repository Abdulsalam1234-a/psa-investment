import { ChronicleEdition, MarketBarometer, StockMover, BellwetherItem, MacroBenchmark } from '../types';

export function parseRawChronicle(rawText: string): Partial<ChronicleEdition> {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract volume
  const volumeMatch = rawText.match(/VOL\.?\s*([A-Z0-9]+)/i);
  const volume = volumeMatch ? `VOL. ${volumeMatch[1].toUpperCase()}` : 'VOL. SPECIAL';

  // Extract date
  const dateMatch = rawText.match(/\|\s*([A-Z]+,\s+[A-Z]+\s+\d{1,2},\s+\d{4})/i) ||
                    rawText.match(/([A-Z]+,\s+[A-Z]+\s+\d{1,2},\s+\d{4})/i);
  const editionDate = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Extract time
  const timeMatch = rawText.match(/(\d{1,2}:\d{2}\s*(?:WAT|AM|PM))/i);
  const briefingTime = timeMatch ? timeMatch[1] : '07:00 WAT';

  // Look for Headline: usually lines after the masthead metadata
  let headline = 'NGX Pre-Market Daily Intelligence Briefing';
  let subheadline = 'Institutional market barometers, price movements, and strategic tactical execution.';
  let leadArticle = '';

  // Scan for headline
  const headlineIdx = lines.findIndex(l => 
    !l.includes('PSA INVESTMENT') && 
    !l.includes('THE PSA FINANCIAL') && 
    !l.includes('Verified Pre-Market') && 
    !l.startsWith('|') && 
    l.length > 25 &&
    !l.startsWith('TABLE')
  );

  if (headlineIdx !== -1) {
    // If there is an assessment header (e.g. "NGX WEEKLY CLOSE & PRE-MARKET ASSESSMENT"), check next line
    if (lines[headlineIdx].includes('&') || lines[headlineIdx].length < 50) {
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
  const table1Match = rawText.match(/TABLE 1[\s\S]*?(?=OFFICIAL PRICE|TOP GAINERS|BLUE-CHIP|$)/i);
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
  
  const gainersLosersSection = rawText.match(/TOP GAINERS & LOSERS[\s\S]*?(?=BLUE-CHIP|MACROECONOMIC|$)/i);
  if (gainersLosersSection) {
    const glLines = gainersLosersSection[0].split('\n');
    for (const line of glLines) {
      if (line.includes('|') && !line.includes('Top 5 Gainers') && !line.includes('Close') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 6) {
          // Format: Top 5 Gainers | Close | % Change | Top 5 Losers | Close | % Change
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
        // Bullet style
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

  // Parse Bellwethers
  const bellwethers: BellwetherItem[] = [];
  const bellwethersMatch = rawText.match(/BLUE-CHIP BELLWETHERS[\s\S]*?(?=MACROECONOMIC|TACTICAL|$)/i);
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
            turnover: parts[2],
            signal: parts[3],
            notes: parts[4] || ''
          });
        }
      }
    }
  }

  // Parse Macro Benchmarks
  const macroBenchmarks: MacroBenchmark[] = [];
  const macroMatch = rawText.match(/MACROECONOMIC[\s\S]*?(?=TACTICAL|The PSA Financial|$)/i);
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
            source: parts[3] || 'CBN / Survey'
          });
        }
      }
    }
  }

  // Parse Tactical Playbook
  const tacticalPlaybook: string[] = [];
  const tacticalMatch = rawText.match(/TACTICAL PRE-MARKET PLAYBOOK[\s\S]*?(?=The PSA Financial|$)/i);
  if (tacticalMatch) {
    const tText = tacticalMatch[0];
    const points = tText.split(/(?=\d\.\s)/).map(p => p.trim()).filter(p => /^\d\.\s/.test(p));
    if (points.length > 0) {
      points.forEach(p => tacticalPlaybook.push(p.replace(/^\d\.\s*/, '')));
    } else {
      // Fallback
      tacticalPlaybook.push(tText.replace(/TACTICAL PRE-MARKET PLAYBOOK[^\n]*\n?/, '').trim());
    }
  }

  return {
    title: 'THE PSA FINANCIAL CHRONICLE',
    subtitle: 'Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts',
    volume,
    editionDate,
    briefingTime,
    headline,
    subheadline,
    leadArticle: leadArticle || subheadline,
    marketBarometers: marketBarometers.length > 0 ? marketBarometers : [
      { metric: 'NGX All-Share Index (ASI)', fridayClose: '248,363.55 pts', thursdayClose: '248,042.50 pts', change: '+0.13%', source: 'NGX Official' }
    ],
    topGainers,
    topLosers,
    bellwethers,
    macroBenchmarks,
    tacticalPlaybook,
    rawText
  };
}
