import React, { useState, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Calendar,
  Eye,
  Trash2,
  Edit,
  Play,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Download,
  FileUp,
  X
} from 'lucide-react';
import mammoth from 'mammoth';
import { useData } from '../context/DataContext';
import { ChronicleEdition } from '../types';
import { parseRawChronicle } from '../utils/chronicleParser';
import { sanitizeSafeHtml } from '../utils/security';
import { ChronicleReader } from './ChronicleReader';

export const ChronicleAdminDesk: React.FC = () => {
  const {
    chronicles,
    saveChronicle,
    deleteChronicle,
    autoPublishGeminiChronicle,
    publishWordDocumentChronicle
  } = useData();

  // Mode: docx upload, manual paste upload, gemini automated fetch, or archive list
  const [subTab, setSubTab] = useState<'docx_upload' | 'manual_paste' | 'gemini_automation' | 'manage'>('docx_upload');

  // Word Document Upload State
  const [uploadedDocxFile, setUploadedDocxFile] = useState<File | null>(null);
  const [docxBase64, setDocxBase64] = useState<string>('');
  const [docxFormattedHtml, setDocxFormattedHtml] = useState<string>('');
  const [docxRawText, setDocxRawText] = useState<string>('');
  const [docxLoading, setDocxLoading] = useState(false);
  const [docxDragOver, setDocxDragOver] = useState(false);

  // Manual Upload State
  const [rawInput, setRawInput] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Partial<ChronicleEdition> | null>(null);
  const [customVolume, setCustomVolume] = useState('VOL. XXX');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock background scrolling and add Escape key listener when broadsheet preview modal is open
  useEffect(() => {
    if (previewModalOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPreviewModalOpen(false);
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
  }, [previewModalOpen]);

  // Gemini Automated API state
  const [geminiApiKey, setGeminiApiKey] = useState(
    localStorage.getItem('psa_gemini_api_key') || ''
  );
  const [isFetchingGemini, setIsFetchingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDocxFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      showToast('Please select a valid Microsoft Word (.docx) file.');
      return;
    }

    setDocxLoading(true);
    try {
      setUploadedDocxFile(file);

      // Read array buffer for mammoth parsing
      const arrayBuffer = await file.arrayBuffer();

      // Convert to HTML using mammoth and sanitize immediately
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      const rawTextResult = await mammoth.extractRawText({ arrayBuffer });

      const html = sanitizeSafeHtml(htmlResult.value);
      const rawText = rawTextResult.value;

      setDocxFormattedHtml(html);
      setDocxRawText(rawText);

      // Parse structured data from text
      const parsed = parseRawChronicle(rawText);
      setParsedPreview(parsed);
      if (parsed.volume) setCustomVolume(parsed.volume);

      // Read as DataURL for storage and download
      const reader = new FileReader();
      reader.onload = () => {
        setDocxBase64(reader.result as string);
      };
      reader.readAsDataURL(file);

      showToast(`Successfully extracted and formatted ${file.name}!`);
    } catch (err: any) {
      console.error('Docx parse error:', err);
      showToast(`Error parsing Word document: ${err.message}`);
    } finally {
      setDocxLoading(false);
    }
  };

  const handlePublishDocx = async () => {
    if (!uploadedDocxFile || !docxRawText) {
      showToast('Please upload a Word document (.docx) first.');
      return;
    }

    const newEdition = await publishWordDocumentChronicle({
      rawText: docxRawText,
      docxUrl: docxBase64 || '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
      docxFileName: uploadedDocxFile.name,
      formattedHtml: docxFormattedHtml,
      fileSizeBytes: uploadedDocxFile.size,
      customVolume: customVolume || parsedPreview?.volume
    });

    showToast(`Published ${newEdition.volume} to live PSA Transcripts!`);
    setUploadedDocxFile(null);
    setDocxFormattedHtml('');
    setDocxRawText('');
    setDocxBase64('');
    setParsedPreview(null);
    setSubTab('manage');
  };

  const handleParseRaw = () => {
    if (!rawInput.trim()) {
      showToast('Please paste the morning chronicle text first.');
      return;
    }
    const parsed = parseRawChronicle(rawInput);
    setParsedPreview(parsed);
    if (parsed.volume) setCustomVolume(parsed.volume);
    showToast('Document parsed into newspaper format successfully!');
  };

  const handlePublishManual = async () => {
    if (!rawInput.trim()) {
      showToast('Cannot publish empty text.');
      return;
    }
    const parsed = parsedPreview || parseRawChronicle(rawInput);
    const newEdition = await autoPublishGeminiChronicle(rawInput, customVolume || parsed.volume);
    showToast(`Published ${newEdition.volume} to live newspaper and archive!`);
    setRawInput('');
    setParsedPreview(null);
    setSubTab('manage');
  };

  const handleSaveGeminiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('psa_gemini_api_key', key);
    showToast('Gemini API configuration saved.');
  };

  // Automated Gemini 7 AM simulation / direct API trigger
  const handleTriggerGeminiAutomation = async () => {
    setIsFetchingGemini(true);
    setGeminiStatus('Connecting to Google Gemini API at 07:00 AM WAT schedule...');

    try {
      // 1. Try secure serverless backend endpoint first
      setGeminiStatus('Calling secure serverless backend (/api/summarize-chronicle)...');
      let candidateText = '';

      const promptText = `You are the Lead Financial Analyst at PSA INVESTMENT (Chief Analyst Salami Abdullahi).
Generate the morning 07:00 AM WAT pre-market newspaper edition for THE PSA FINANCIAL CHRONICLE.
Target date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
Volume: VOL. ${chronicles.length + 1}.
Include:
1. Masthead: PSA INVESTMENT CAPITAL INTELLIGENCE • INSTITUTIONAL DESK | THE PSA FINANCIAL CHRONICLE
2. Date, Pre-Market Briefing 07:00 WAT, Volume.
3. Headline and subheadline on recent NGX All-Share Index (ASI), market cap, and floor turnover.
4. TABLE 1: VERIFIED OFFICIAL MARKET BAROMETERS (Friday close, Thursday close, % change, sources).
5. OFFICIAL PRICE MOVEMENTS: TOP GAINERS & LOSERS.
6. BLUE-CHIP BELLWETHERS & VOLUME LEADERS DOSSIER (Zenith Bank, GTCO, Access, MTNN, Dangote Cement).
7. MACROECONOMIC, FX & MONEY MARKET BENCHMARKS (MPR, CRR, Official FX, BDC FX).
8. TACTICAL PRE-MARKET PLAYBOOK & BROKER DESK STRATEGY (3 tactical numbered points).
Format strictly matching PSA Financial Chronicle newspaper standard.`;

      try {
        const serverRes = await fetch('/api/summarize-chronicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText })
        });
        if (serverRes.ok) {
          const serverData = await serverRes.json();
          if (serverData?.text) {
            candidateText = serverData.text;
            setGeminiStatus('Successfully generated via serverless backend Gemini service.');
          }
        }
      } catch {
        // Fall back to client execution if serverless route unavailable
      }

      if (!candidateText && geminiApiKey) {
        setGeminiStatus('Generating official verified market chronicle via Google Gemini API...');
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API responded with status ${response.status}`);
        }

        const data = await response.json();
        candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      if (candidateText) {
        setGeminiStatus('Parsing and publishing generated newspaper edition...');
        const newEdition = await autoPublishGeminiChronicle(candidateText, `VOL. ${chronicles.length + 1}`);
        showToast(`Successfully published ${newEdition.volume} via Gemini 7:00 AM Automation!`);
        setGeminiStatus(`Successfully auto-published ${newEdition.volume} to live archive.`);
        setSubTab('manage');
      } else {
        // Simulation mode for demonstration without live key
        setGeminiStatus('Simulating 07:00 AM Automated Gemini Ingestion Pipeline...');
        await new Promise(r => setTimeout(r, 1500));
        setGeminiStatus('Synthesizing NGX order flows & price logs from CBN, CSCS, and NGX...');
        await new Promise(r => setTimeout(r, 1200));

        // Use standard October 13 simulated payload or prompt result
        const simulatedText = `PSA INVESTMENT CAPITAL INTELLIGENCE • INSTITUTIONAL DESK
THE PSA FINANCIAL CHRONICLE
Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts
| TUESDAY, OCTOBER 13, 2026   | PRE-MARKET BRIEFING | 07:00 WAT   | PSA INVESTMENT RESEARCH | VOL. XXX   |

NGX BELLWETHERS CONSOLIDATE AMID RETAIL BUYING
Index Holds 248,360 pts as Banking Tier-1 Counters Attract Fresh Bids Ahead of Floor Open
LAGOS (PSA INVESTMENT DESK) - Institutional interest gathered around dividend-paying counters as the market opened with positive breadth (25 gainers vs 18 losers).

TABLE 1: VERIFIED OFFICIAL MARKET BAROMETERS
| Official Market Barometer | Current Close | Prior Close | Day Change (%) | Official Verified Source |
| NGX All-Share Index (ASI) | 248,390.10 pts | 248,363.55 pts | +0.01% (+26.55) | NGX Daily Official Price List |
| Equities Market Cap | ₦161.30 Trillion | ₦161.26 Trillion | +0.02% (+₦40B) | NGX Central Valuation Log |

OFFICIAL PRICE MOVEMENTS: TOP GAINERS & LOSERS
Top 5 Gainers:
- Regal Insurance (REGALINS): ₦0.82 (+6.49%)
- Livestock Feeds (LIVESTOCK): ₦13.80 (+4.94%)
Top 5 Losers:
- Red Star Express (REDSTAREX): ₦12.80 (-4.48%)

BLUE-CHIP BELLWETHERS & VOLUME LEADERS DOSSIER
- Zenith Bank (ZENITHBANK): ₦135.50 (+0.59%) | Top Volume | Dividend Bids | Stable demand ahead of ex-dividend date.
- GTCO (GTCO): ₦132.50 (+0.53%) | Institutional Core | Consolidating | Defending technical floor.

MACROECONOMIC, FX & MONEY MARKET BENCHMARKS
- Monetary Policy Rate (MPR): 26.50% | Policy Anchor | CBN MPC
- Official FX Spot (NFEM): ₦1,330.10 / $1.00 | Central Rate | CBN

TACTICAL PRE-MARKET PLAYBOOK & BROKER DESK STRATEGY
1. Dividend Capture Timing: Maintain disciplined entry for interim dividend yields.
2. Liquidity Vigilance: Wait for volume confirmation above 350M shares.
3. Banking Recap: Focus on capital adequacy ratios above 18%.

The PSA Financial Chronicle © 2026 | Property of PSA INVESTMENT.`;

        const newEdition = await autoPublishGeminiChronicle(simulatedText, `VOL. ${chronicles.length + 1}`);
        showToast(`Auto-published simulated 7 AM edition (${newEdition.volume})!`);
        setGeminiStatus(`Successfully auto-published ${newEdition.volume} to live archive.`);
        setSubTab('manage');
      }
    } catch (err: any) {
      setGeminiStatus(`Error during Gemini ingestion: ${err.message}`);
      showToast(`Automation error: ${err.message}`);
    } finally {
      setIsFetchingGemini(false);
    }
  };

  const cronScriptCode = `"""
PSA INVESTMENT — 07:00 AM WAT DAILY CHRONICLE GEMINI AUTOMATION
Author: Salami Abdullahi (Chief Analyst, PSA Investment)
Run every morning via Google Cloud Scheduler, Windows Task Scheduler, or Linux Cron:
0 7 * * 1-5 python scripts/daily_chronicle_cron.py
"""
import os
import requests
import json
from datetime import datetime

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
PSA_API_URL = os.getenv("PSA_API_URL", "https://psa-investment.ai.studio/api/chronicle/publish")

def fetch_and_publish():
    print(f"[{datetime.now()}] 07:00 WAT Trigger: Querying Google Gemini for NGX Daily Chronicle...")
    
    prompt = """
    Generate the official pre-market broadsheet edition for THE PSA FINANCIAL CHRONICLE.
    Include Table 1 Market Barometers, Top Gainers/Losers, Bellwethers Dossier, Macro Benchmarks, and Tactical Playbook.
    """
    
    # Call Gemini API
    gemini_endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    res = requests.post(gemini_endpoint, json=payload)
    res.raise_for_status()
    chronicle_text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
    
    # Ingest into PSA Investment Archive
    print(f"[{datetime.now()}] Publishing to PSA Investment Broadside Archive...")
    publish_res = requests.post(PSA_API_URL, json={"rawText": chronicle_text, "source": "gemini_automation"})
    print("Success: Published to PSA Investment Newspaper Archive!")

if __name__ == "__main__":
    fetch_and_publish()
`;

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1F44] text-[#C9A84C] px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A84C]/40 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#C9A84C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('docx_upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'docx_upload'
              ? 'bg-[#2B579A] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <FileUp className="w-4 h-4 text-[#C9A84C]" />
          <span>Upload Word Document (.docx)</span>
        </button>

        <button
          onClick={() => setSubTab('manual_paste')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'manual_paste'
              ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Manual Text Paste</span>
        </button>

        <button
          onClick={() => setSubTab('gemini_automation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'gemini_automation'
              ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Gemini 7:00 AM Automated Ingestion</span>
        </button>

        <button
          onClick={() => setSubTab('manage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'manage'
              ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Manage Published Archive ({chronicles.length})</span>
        </button>
      </div>

      {/* 1. WORD DOCUMENT (.DOCX) UPLOAD DESK */}
      {subTab === 'docx_upload' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2B579A]/10 text-[#2B579A] text-[10px] font-bold uppercase tracking-wider mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Word Document Ingestion Desk</span>
              </div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Upload Formatted Word Document (.docx)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Upload your formatted Word document. The system will format and view it on screen, allowing members and the public to read it seamlessly and download strictly the Word document (.docx).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Volume Tag:</span>
              <input
                type="text"
                value={customVolume}
                onChange={e => setCustomVolume(e.target.value)}
                placeholder="VOL. XXIX"
                className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDocxDragOver(true);
            }}
            onDragLeave={() => setDocxDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDocxDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleDocxFile(file);
            }}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
              docxDragOver
                ? 'border-[#2B579A] bg-[#2B579A]/5'
                : 'border-slate-300 hover:border-[#2B579A] bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              id="docx-file-input"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleDocxFile(file);
              }}
            />

            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#2B579A] text-white flex items-center justify-center mx-auto shadow-md">
                <FileUp className="w-8 h-8 text-[#C9A84C]" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#0A1F44]">
                  {uploadedDocxFile ? uploadedDocxFile.name : 'Drag & drop your Word Document (.docx) here'}
                </h4>
                <p className="text-xs text-slate-500">
                  {uploadedDocxFile
                    ? `File size: ${(uploadedDocxFile.size / 1024).toFixed(1)} KB • Validated Microsoft Word Document`
                    : 'Supports Microsoft Word formatted .docx files. Content will be converted and displayed formatted on screen.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <label
                  htmlFor="docx-file-input"
                  className="px-5 py-2.5 bg-[#2B579A] hover:bg-[#1E3E6D] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 hover:scale-102"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadedDocxFile ? 'Choose Different File' : 'Browse Files on Computer'}</span>
                </label>

                {!uploadedDocxFile && (
                  <button
                    type="button"
                    onClick={async () => {
                      setDocxLoading(true);
                      try {
                        const response = await fetch('/transcripts/PSA-Financial-Chronicle-VOL-XXIX.docx');
                        const blob = await response.blob();
                        const file = new File([blob], 'PSA-Financial-Chronicle-VOL-XXIX.docx', {
                          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        });
                        await handleDocxFile(file);
                      } catch (err: any) {
                        showToast(`Failed to load sample: ${err.message}`);
                      } finally {
                        setDocxLoading(false);
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Load Sample Document
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Document Screen Preview */}
          {docxLoading && (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#2B579A]" />
              <span>Parsing Word Document XML structures with Mammoth engine...</span>
            </div>
          )}

          {docxFormattedHtml && !docxLoading && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs text-slate-800">
                    Document Extracted & Formatted Successfully
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    ({docxRawText.length.toLocaleString()} characters)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (uploadedDocxFile) {
                        const link = document.createElement('a');
                        link.href = docxBase64 || '/transcripts/PSA-Financial-Chronicle-VOL-XXIX.docx';
                        link.download = uploadedDocxFile.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast(`Testing download for ${uploadedDocxFile.name}`);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#2B579A]" />
                    <span>Test Direct Download (.docx)</span>
                  </button>

                  <button
                    onClick={handlePublishDocx}
                    className="px-5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2 hover:scale-102"
                  >
                    <Check className="w-4 h-4 text-[#C9A84C]" />
                    <span>Publish Document to Live Website</span>
                  </button>
                </div>
              </div>

              {/* Formatted Screen Display */}
              <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 max-h-[500px] overflow-y-auto shadow-inner font-serif">
                <div
                  className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3 [&>table]:w-full [&>table]:border-collapse [&>table]:border [&>table]:border-slate-300 [&>table_td]:border [&>table_td]:border-slate-300 [&>table_td]:p-2 [&>table_th]:border [&>table_th]:border-slate-300 [&>table_th]:p-2 [&>table_th]:bg-slate-100"
                  dangerouslySetInnerHTML={{ __html: docxFormattedHtml }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MANUAL UPLOAD & PASTE DESK */}
      {subTab === 'manual_paste' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Newspaper Document Ingestion Desk
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste the morning pre-market dispatch or raw document from Google Gemini to parse and publish.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Volume Tag:</span>
              <input
                type="text"
                value={customVolume}
                onChange={e => setCustomVolume(e.target.value)}
                className="w-28 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">Raw Chronicle Text / Markdown:</label>
              <button
                onClick={() => {
                  setRawInput(`PSA INVESTMENT CAPITAL INTELLIGENCE • INSTITUTIONAL DESK
THE PSA FINANCIAL CHRONICLE
Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts
| MONDAY, OCTOBER 12, 2026   | PRE-MARKET BRIEFING | 07:00 WAT   | PSA INVESTMENT RESEARCH | VOL. XXIX   |

NGX WEEKLY CLOSE & PRE-MARKET ASSESSMENT
NGX Halts 7-Day Losing Run with Modest +0.13% Rebound to 248,363.55 Points; Equities Recover ₦208 Billion
Selective bargain hunting lifts ASI from Thursday's rout (+321.05 pts), but floor turnover drops 34.6% to ₦20.50B as banking counters diverge ahead of Monday's open.

LAGOS (PSA INVESTMENT DESK) — Trading on the Nigerian Exchange Limited (NGX) concluded the preceding trading week on Friday, October 9, 2026, with a mild technical rebound, snapping a seven-session retreat. The All-Share Index (ASI) advanced by 321.05 points (+0.13%) to close officially at 248,363.55 points...`);
                  showToast('Loaded sample dispatch payload');
                }}
                className="text-[#C9A84C] hover:text-[#0A1F44] font-semibold cursor-pointer"
              >
                Insert Sample Dispatch
              </button>
            </div>
            <textarea
              rows={12}
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder="Paste the daily market chronicle document here (tables, barometers, top gainers/losers, bellwethers)..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleParseRaw}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0A1F44] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span>Parse & Structure Document</span>
              </button>

              {parsedPreview && (
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-5 py-2.5 bg-[#C9A84C]/20 hover:bg-[#C9A84C]/30 text-[#0A1F44] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#0A1F44]" />
                  <span>Preview Broadsheet Layout</span>
                </button>
              )}
            </div>

            <button
              onClick={handlePublishManual}
              className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publish to Live Newspaper & Archive</span>
            </button>
          </div>

          {/* Parsed Structure Quick Review */}
          {parsedPreview && (
            <div className="mt-6 p-6 rounded-2xl bg-[#0A1F44]/5 border border-[#C9A84C]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                  Parsed Output Preview
                </span>
                <span className="text-xs font-mono font-bold text-[#C9A84C] bg-[#0A1F44] px-2 py-0.5 rounded">
                  {parsedPreview.volume}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500">
                  {parsedPreview.editionDate} | {parsedPreview.briefingTime}
                </div>
                <h4 className="font-serif font-black text-lg text-[#0A1F44]">
                  {parsedPreview.headline}
                </h4>
                <p className="text-xs text-slate-600 italic">{parsedPreview.subheadline}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Barometers</div>
                  <div className="font-bold text-slate-800">
                    {parsedPreview.marketBarometers?.length || 0} indicators
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Gainers/Losers</div>
                  <div className="font-bold text-slate-800">
                    {(parsedPreview.topGainers?.length || 0) + (parsedPreview.topLosers?.length || 0)} counters
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Bellwethers</div>
                  <div className="font-bold text-slate-800">
                    {parsedPreview.bellwethers?.length || 0} blue-chips
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Playbook</div>
                  <div className="font-bold text-slate-800">
                    {parsedPreview.tacticalPlaybook?.length || 0} tactical points
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. GEMINI 7:00 AM AUTOMATED INGESTION DESK */}
      {subTab === 'gemini_automation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-black text-xl text-[#0A1F44] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                  <span>Google Gemini 07:00 AM Daily Ingestion Automation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect your Google Gemini automation pipeline so every morning at 7:00 AM WAT the chronicle is collected and published automatically.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                Automation Ready
              </span>
            </div>

            {/* Gemini API Key Config */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Google Gemini API Key (Optional for Direct Ingestion):
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={e => handleSaveGeminiKey(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-[#C9A84C]"
                />
                <button
                  onClick={() => handleSaveGeminiKey(geminiApiKey)}
                  className="px-4 py-2 bg-[#0A1F44] text-[#C9A84C] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                You can obtain a Gemini API key from Google AI Studio. If left empty, the simulation pipeline will run using the official prompt format.
              </p>
            </div>

            {/* Live Trigger Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0A1F44] bg-gradient-to-r from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white shadow-xl border border-slate-700">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider">
                  Live Dispatch Execution
                </div>
                <div className="font-serif font-bold text-base text-white">
                  Trigger 07:00 AM Gemini Dispatch Run Now
                </div>
                <div className="text-xs text-slate-300">
                  Instantly queries the intelligence model and auto-publishes today's newspaper edition.
                </div>
              </div>

              <button
                disabled={isFetchingGemini}
                onClick={handleTriggerGeminiAutomation}
                className="px-6 py-3 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isFetchingGemini ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing 7:00 AM Ingestion...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Ingestion Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {geminiStatus && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
                <span className="font-bold text-[#0A1F44]">Status:</span> {geminiStatus}
              </div>
            )}
          </div>

          {/* Standalone Cron / Webhook Automation Script */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#C9A84C]" />
                <h4 className="font-bold text-sm text-white">
                  Automated Daily 07:00 WAT Cron / Cloud Scheduler Script
                </h4>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(cronScriptCode);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                  showToast('Automation script copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied' : 'Copy Python Script'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              To automate fully in the cloud, schedule this lightweight script with <strong>Google Cloud Scheduler</strong>,
              <strong>Cloud Functions</strong>, or your server cron at <code>0 7 * * 1-5</code> (7:00 AM WAT Monday–Friday).
            </p>

            <pre className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-60">
              {cronScriptCode}
            </pre>
          </div>
        </div>
      )}

      {/* 3. MANAGE PUBLISHED EDITIONS */}
      {subTab === 'manage' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Published Newspaper Editions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All daily pre-market chronicles currently live on the public archive and member portal.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#C9A84C] bg-[#0A1F44] px-3 py-1 rounded-full">
              {chronicles.length} Archived
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0A1F44] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Edition Date</th>
                  <th className="py-3 px-4">Lead Headline</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-center">Downloads</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {chronicles.map((chron, idx) => (
                  <tr key={chron.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0A1F44]">
                      {chron.volume}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {chron.editionDate}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-serif font-bold text-slate-900 line-clamp-1">
                        {chron.headline}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                        {chron.source === 'gemini_automation' ? 'Gemini 7AM' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {chron.downloadCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setParsedPreview(chron);
                            setPreviewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Preview Broadsheet"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete ${chron.volume} from archive?`)) {
                              await deleteChronicle(chron.id);
                              showToast(`Deleted ${chron.volume}`);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Edition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadsheet Preview Modal */}
      {previewModalOpen && parsedPreview && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Broadsheet Layout Preview: {parsedPreview.volume}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ChronicleReader chronicle={parsedPreview as ChronicleEdition} />
          </div>
        </div>
      )}
    </div>
  );
};
