/**
 * PSA Investment - Secure Cloud Database Proxy
 * POST /api/database
 * GET /api/database?table=...
 */

const ALLOWED_TABLES = new Set([
  'briefings',
  'dossiers',
  'chronicles',
  'members',
  'events',
  'event_registrations',
  'site_settings',
  'security_audit_logs'
]);

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      status: 'fallback',
      message: 'Cloud Database credentials not configured in server environment; client fallback active.',
      data: null
    });
  }

  const cleanUrl = supabaseUrl.replace(/\/+$/, '');

  // 1. GET: Fetch table records safely
  if (req.method === 'GET') {
    const table = req.query?.table as string;
    if (!table || !ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: 'Invalid or unauthorized table name specified.' });
    }

    try {
      const selectQuery = req.query?.select || '*';
      const orderQuery = req.query?.order ? `&order=${encodeURIComponent(req.query.order)}` : '';
      const limitQuery = req.query?.limit ? `&limit=${Number(req.query.limit)}` : '';

      const targetEndpoint = `${cleanUrl}/rest/v1/${table}?select=${encodeURIComponent(selectQuery)}${orderQuery}${limitQuery}`;

      const response = await fetch(targetEndpoint, {
        method: 'GET',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Database query failed: ${response.statusText}`
        });
      }

      const data = await response.json();
      return res.status(200).json({ success: true, table, count: data.length, data });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Database proxy connection error' });
    }
  }

  // 2. POST: Insert or upsert records
  if (req.method === 'POST') {
    const { table, records, resolution = 'merge-duplicates' } = req.body || {};

    if (!table || !ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: 'Invalid or unauthorized table name specified.' });
    }

    if (!records) {
      return res.status(400).json({ error: 'Missing records payload for database insertion.' });
    }

    try {
      const targetEndpoint = `${cleanUrl}/rest/v1/${table}`;
      const payload = Array.isArray(records) ? records : [records];

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: resolution === 'merge-duplicates' ? 'resolution=merge-duplicates' : 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({
          error: `Database write rejected: ${text || response.statusText}`
        });
      }

      return res.status(200).json({
        success: true,
        table,
        insertedCount: payload.length
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Database proxy write error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
