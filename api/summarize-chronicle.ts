/**
 * PSA Investment - Server-Side Gemini LLM Processing Endpoint
 * POST /api/summarize-chronicle
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in the server environment. Set GEMINI_API_KEY in your hosting dashboard.'
    });
  }

  const { prompt, chronicleText } = req.body || {};

  if (!prompt && !chronicleText) {
    return res.status(400).json({ error: 'Missing prompt or chronicle text payload.' });
  }

  const effectivePrompt = prompt || `You are the Lead Financial Analyst at PSA Investment. Summarize the following daily Nigerian capital market chronicle into an institutional 07:00 WAT pre-market intelligence report with ASI snapshot, top gainers, top losers, and macro benchmarks:\n\n${chronicleText}`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: effectivePrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `Gemini API error: ${errText || response.statusText}`
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({
      success: true,
      text: candidateText,
      model: 'gemini-1.5-flash'
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || 'Server processing error during chronicle summarization'
    });
  }
}
