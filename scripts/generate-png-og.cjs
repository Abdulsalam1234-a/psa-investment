/**
 * PSA Investment (PSAI) - 1200x630 High-Resolution Open Graph PNG Generator
 * Generates true raster PNG images for WhatsApp, LinkedIn, X (Twitter), and Facebook
 * Built using native Node.js zlib without external heavy C++ dependencies.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_OG_DIR = path.join(ROOT_DIR, 'public', 'og');
const DIST_OG_DIR = path.join(ROOT_DIR, 'dist', 'og');

[PUBLIC_OG_DIR, DIST_OG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, getPixel) {
  const rowBytes = width * 3 + 1;
  const raw = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 3;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 6 });
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 2; // Color type 2: Truecolor RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Brand Colors
const NAVY_TOP = [10, 31, 68];      // #0A1F44
const NAVY_BOTTOM = [4, 12, 29];    // #040C1D
const GOLD = [201, 168, 76];        // #C9A84C
const GOLD_LIGHT = [229, 195, 101]; // #E5C365
const EMERALD = [16, 185, 129];     // #10B981
const CARD_BG = [15, 23, 42];       // #0F172A
const SLATE_BORDER = [51, 65, 85];  // #334155

// Color interpolation
function interpolate(c1, c2, factor) {
  const f = Math.max(0, Math.min(1, factor));
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f)
  ];
}

// Standard Render Card Function
function renderCardImage(config) {
  const { accent = 'gold', hasMetrics = false } = config;

  return createPng(1200, 630, (x, y, w, h) => {
    // 1. Top Gold Accent Bar (12px)
    if (y < 12) {
      const goldProgress = x / w;
      return interpolate(GOLD_LIGHT, GOLD, goldProgress);
    }

    // 2. Bottom Border Line (2px)
    if (y >= h - 2) {
      return GOLD;
    }

    // 3. Left & Right Frame Borders (2px)
    if (x < 2 || x >= w - 2) {
      return GOLD;
    }

    // 4. Subtle Architectural Gridlines
    if (y % 100 === 0 && y > 50 && y < 580) {
      return [18, 42, 85];
    }
    if (x % 200 === 0 && x > 50 && x < 1150) {
      return [18, 42, 85];
    }

    // 5. Gold Emblem Badge at (80, 70) to (124, 114)
    if (x >= 80 && x <= 124 && y >= 70 && y <= 114) {
      if (x === 80 || x === 124 || y === 70 || y === 114) {
        return GOLD_LIGHT;
      }
      return GOLD;
    }

    // 6. Ticker Badge (if ticker present) at (80, 180) to (220, 222)
    if (config.ticker && x >= 80 && x <= 220 && y >= 170 && y <= 212) {
      if (x === 80 || x === 220 || y === 170 || y === 212) {
        return GOLD;
      }
      return CARD_BG;
    }

    // 7. Rating Badge (BUY / ACCUMULATE) at (230, 170) to (350, 212)
    if (config.rating && x >= 230 && x <= 350 && y >= 170 && y <= 212) {
      return EMERALD;
    }

    // 8. Financial Metrics Panel at (80, 390) to (820, 475)
    if (hasMetrics && x >= 80 && x <= 820 && y >= 390 && y <= 475) {
      if (x === 80 || x === 820 || y === 390 || y === 475) {
        return SLATE_BORDER;
      }
      if (x === 330 || x === 580) {
        return SLATE_BORDER;
      }
      return CARD_BG;
    }

    // 9. Watermark Ring at cx=1060, cy=150, r=110
    const dx = x - 1060;
    const dy = y - 150;
    const distSq = dx * dx + dy * dy;
    if (distSq >= 108 * 108 && distSq <= 112 * 112) {
      return [35, 60, 105];
    }
    if (distSq >= 68 * 68 && distSq <= 72 * 72) {
      return [35, 60, 105];
    }

    // 10. Background Gradient (Deep Navy to Slate Night)
    const vertFactor = (y - 12) / (h - 14);
    return interpolate(NAVY_TOP, NAVY_BOTTOM, vertFactor);
  });
}

const CARDS = [
  { name: 'default.png', accent: 'gold', hasMetrics: false },
  { name: 'research.png', accent: 'gold', hasMetrics: false },
  { name: 'market-briefings.png', accent: 'emerald', hasMetrics: false },
  { name: 'fmva-bootcamp.png', ticker: 'FMVA MASTERCLASS', rating: 'NOV 28', hasMetrics: true },
  { name: 'gtco.png', ticker: 'GTCO', rating: 'BUY', hasMetrics: true },
  { name: 'zenithbank.png', ticker: 'ZENITHBANK', rating: 'ACCUMULATE', hasMetrics: true },
  { name: 'seplat.png', ticker: 'SEPLAT', rating: 'BUY', hasMetrics: true },
  { name: 'mtnn.png', ticker: 'MTNN', rating: 'BUY', hasMetrics: true },
  { name: 'dangcem.png', ticker: 'DANGCEM', rating: 'ACCUMULATE', hasMetrics: true },
  { name: 'presco.png', ticker: 'PRESCO', rating: 'BUY', hasMetrics: true },
  { name: 'briefing-latest.png', ticker: 'NGX: ASI', rating: 'BULLISH', hasMetrics: true }
];

console.log('Generating 1200x630 Raster PNG Open Graph Cards...');
CARDS.forEach(card => {
  const pngBuffer = renderCardImage(card);
  fs.writeFileSync(path.join(PUBLIC_OG_DIR, card.name), pngBuffer);
  fs.writeFileSync(path.join(DIST_OG_DIR, card.name), pngBuffer);
  console.log(`  ✓ Generated ${card.name} (${pngBuffer.length} bytes)`);
});
console.log('✓ All 1200x630 Open Graph PNG cards generated successfully.');
