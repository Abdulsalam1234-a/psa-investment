/**
 * PSA Investment - Secure Cloud Database Proxy
 * POST /api/database
 * GET /api/database?table=...
 * 
 * Supports both Google Cloud Firestore (Firebase Spark Plan) and Supabase Edge REST
 */

const ALLOWED_TABLES = new Set([
  'briefings',
  'dossiers',
  'chronicles',
  'members',
  'events',
  'event_registrations',
  'site_settings',
  'security_audit_logs',
  'psa_briefings',
  'psa_dossiers',
  'psa_chronicles',
  'psa_members',
  'psa_events',
  'psa_event_registrations',
  'psa_site_settings',
  'psa_security_audit_logs'
]);

function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        fields[key] = { integerValue: String(val) };
      } else {
        fields[key] = { doubleValue: val };
      }
    } else if (typeof val === 'string') {
      fields[key] = { stringValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map((v) => {
            if (v === null || v === undefined) return { nullValue: null };
            if (typeof v === 'boolean') return { booleanValue: v };
            if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
            if (typeof v === 'string') return { stringValue: v };
            if (typeof v === 'object') return { mapValue: { fields: toFirestoreFields(v) } };
            return { stringValue: String(v) };
          })
        }
      };
    } else if (typeof val === 'object') {
      fields[key] = { mapValue: { fields: toFirestoreFields(val) } };
    }
  }
  return fields;
}

function fromFirestoreDocument(doc: any): any {
  if (!doc || !doc.fields) return doc;
  const result: Record<string, any> = {};
  for (const [key, valObj] of Object.entries(doc.fields as Record<string, any>)) {
    if ('stringValue' in valObj) result[key] = valObj.stringValue;
    else if ('integerValue' in valObj) result[key] = parseInt(valObj.integerValue, 10);
    else if ('doubleValue' in valObj) result[key] = parseFloat(valObj.doubleValue);
    else if ('booleanValue' in valObj) result[key] = valObj.booleanValue;
    else if ('nullValue' in valObj) result[key] = null;
    else if ('arrayValue' in valObj) {
      result[key] = (valObj.arrayValue?.values || []).map((item: any) => {
        if ('stringValue' in item) return item.stringValue;
        if ('integerValue' in item) return parseInt(item.integerValue, 10);
        if ('doubleValue' in item) return parseFloat(item.doubleValue);
        if ('booleanValue' in item) return item.booleanValue;
        if ('nullValue' in item) return null;
        if ('mapValue' in item) return fromFirestoreDocument({ fields: item.mapValue?.fields || {} });
        return item;
      });
    } else if ('mapValue' in valObj) {
      result[key] = fromFirestoreDocument({ fields: valObj.mapValue?.fields || {} });
    }
  }
  return result;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const provider = (req.query?.provider || req.body?.provider || '').toLowerCase();

  // Firebase Environment Keys
  const fbProject = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || req.body?.firebaseProjectId;
  const fbApiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || req.body?.apiKey;

  // Supabase Environment Keys
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const isFirebase = provider === 'firebase' || (Boolean(fbProject && fbApiKey) && !supabaseUrl);

  // Fallback when neither cloud service is configured
  if (isFirebase && (!fbProject || !fbApiKey)) {
    return res.status(200).json({
      status: 'fallback',
      message: 'Firebase Firestore credentials not configured in server environment; client fallback active.',
      data: null
    });
  }

  if (!isFirebase && (!supabaseUrl || !supabaseKey)) {
    return res.status(200).json({
      status: 'fallback',
      message: 'Cloud Database credentials not configured in server environment; client fallback active.',
      data: null
    });
  }

  // ==========================================
  // 1. GET: Fetch table records safely
  // ==========================================
  if (req.method === 'GET') {
    const rawTable = req.query?.table as string;
    if (!rawTable || !ALLOWED_TABLES.has(rawTable)) {
      return res.status(400).json({ error: 'Invalid or unauthorized table name specified.' });
    }
    const cleanTable = rawTable.replace(/^psa_/, '');

    // 1A. Firebase Firestore GET
    if (isFirebase) {
      try {
        const targetEndpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(fbProject)}/databases/(default)/documents/${encodeURIComponent(cleanTable)}?key=${encodeURIComponent(fbApiKey)}`;
        const fbRes = await fetch(targetEndpoint);
        if (!fbRes.ok) {
          return res.status(fbRes.status).json({
            error: `Firestore query failed: ${fbRes.statusText}`
          });
        }
        const json = await fbRes.json();
        const docs = Array.isArray(json.documents)
          ? json.documents.map((d: any) => fromFirestoreDocument(d))
          : [];
        return res.status(200).json({ success: true, table: cleanTable, count: docs.length, data: docs });
      } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Firestore proxy error' });
      }
    }

    // 1B. Supabase GET
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const selectQuery = req.query?.select || '*';
      const orderQuery = req.query?.order ? `&order=${encodeURIComponent(req.query.order)}` : '';
      const limitQuery = req.query?.limit ? `&limit=${Number(req.query.limit)}` : '';

      const targetEndpoint = `${cleanUrl}/rest/v1/${rawTable}?select=${encodeURIComponent(selectQuery)}${orderQuery}${limitQuery}`;

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
      return res.status(200).json({ success: true, table: rawTable, count: data.length, data });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Database proxy connection error' });
    }
  }

  // ==========================================
  // 2. POST: Insert or upsert records
  // ==========================================
  if (req.method === 'POST') {
    const { table: rawTable, records, resolution = 'merge-duplicates' } = req.body || {};

    if (!rawTable || !ALLOWED_TABLES.has(rawTable)) {
      return res.status(400).json({ error: 'Invalid or unauthorized table name specified.' });
    }

    if (!records) {
      return res.status(400).json({ error: 'Missing records payload for database insertion.' });
    }

    const payload = Array.isArray(records) ? records : [records];
    const cleanTable = rawTable.replace(/^psa_/, '');

    // 2A. Firebase Firestore POST / PATCH
    if (isFirebase) {
      try {
        let syncedCount = 0;
        for (const item of payload) {
          const docId = item.id || item.slug || item.uid || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const docEndpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(fbProject)}/databases/(default)/documents/${encodeURIComponent(cleanTable)}/${encodeURIComponent(docId)}?key=${encodeURIComponent(fbApiKey)}`;
          const fields = toFirestoreFields(item);
          const patchRes = await fetch(docEndpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields })
          });
          if (patchRes.ok) syncedCount++;
        }
        return res.status(200).json({ success: true, table: cleanTable, insertedCount: syncedCount });
      } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Firestore proxy write error' });
      }
    }

    // 2B. Supabase POST
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const targetEndpoint = `${cleanUrl}/rest/v1/${rawTable}`;

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
        table: rawTable,
        insertedCount: payload.length
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Database proxy write error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
