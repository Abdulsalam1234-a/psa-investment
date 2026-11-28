/**
 * PSA INVESTMENT - ZERO-COST PERSISTENT CLOUD DATABASE CLIENT
 * 
 * Architecture:
 * - Direct REST Client for Google Cloud Firestore (Firebase Free Spark Plan: 1GB, 50,000 reads/day)
 *   and Supabase (Perpetual Free PostgreSQL: 500MB, unlimited API calls)
 * - Seamless automatic fallback to high-reliability local storage when offline or prior to keys entry
 * - Bidirectional data synchronization for:
 *   - Members and Approvals
 *   - Financial Chronicles and Transcripts
 *   - Event Registrations and Custom Forms
 *   - Research Reports and Downloads
 *   - Site Settings and Branding Configurations
 */

export interface CloudDbConfig {
  provider: 'supabase' | 'firebase' | 'local_fallback';
  projectUrl: string; // e.g. https://xxxx.supabase.co or Firebase Project ID
  apiKey: string; // Supabase Anon Key or Firebase Web API Key
  firebaseProjectId?: string;
  firebaseAuthDomain?: string;
  firebaseStorageBucket?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

const CONFIG_KEY = 'psa_cloud_db_config';

export const getCloudDbConfig = (): CloudDbConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse cloud DB config:', e);
  }

  // Check for environment variables if injected by Vite
  const envFbProject = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '';
  const envFbKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY || '';
  const envFbAuthDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '';
  const envFbBucket = (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '';

  const envSupaUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envSupaKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envFbProject && envFbKey) {
    return {
      provider: 'firebase',
      projectUrl: envFbProject,
      apiKey: envFbKey,
      firebaseProjectId: envFbProject,
      firebaseAuthDomain: envFbAuthDomain,
      firebaseStorageBucket: envFbBucket,
      autoSync: true,
      lastSyncedAt: undefined
    };
  }

  if (envSupaUrl && envSupaKey) {
    return {
      provider: 'supabase',
      projectUrl: envSupaUrl,
      apiKey: envSupaKey,
      autoSync: true,
      lastSyncedAt: undefined
    };
  }

  return {
    provider: 'local_fallback',
    projectUrl: '',
    apiKey: '',
    autoSync: true,
    lastSyncedAt: undefined
  };
};

export const saveCloudDbConfig = (config: CloudDbConfig): void => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save cloud DB config:', e);
  }
};

/**
 * Maps a JavaScript object to a Cloud Firestore REST document fields representation
 */
export function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
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

/**
 * Maps a Cloud Firestore REST document representation back to a clean JavaScript object
 */
export function fromFirestoreDocument(doc: any): any {
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

/**
 * Test connectivity against Firebase Firestore or Supabase REST endpoint
 */
export const testCloudConnection = async (
  config: CloudDbConfig
): Promise<{ success: boolean; message: string; latencyMs: number }> => {
  const start = Date.now();
  if (config.provider === 'local_fallback') {
    return {
      success: true,
      message: 'Local Persistent Storage is currently active and healthy with zero latency.',
      latencyMs: 1
    };
  }

  // 1. Firebase Firestore Connectivity Test
  if (config.provider === 'firebase') {
    const projectId = (config.firebaseProjectId || config.projectUrl || '').trim();
    const apiKey = (config.apiKey || '').trim();
    if (!projectId || !apiKey) {
      return {
        success: false,
        message: 'Please provide both Firebase Project ID and Web API Key.',
        latencyMs: 0
      };
    }

    try {
      const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/briefings/probe-doc?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(endpoint, { method: 'GET' });
      const latencyMs = Date.now() - start;
      if (res.ok || res.status === 200 || res.status === 404) {
        return {
          success: true,
          message: `Successfully connected to Google Cloud Firestore (Spark Tier) for project '${projectId}'!`,
          latencyMs
        };
      } else {
        const text = await res.text();
        return {
          success: false,
          message: `Firebase returned status ${res.status}: ${text.slice(0, 160)}`,
          latencyMs
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Network connection to Google Cloud Firestore failed.',
        latencyMs: Date.now() - start
      };
    }
  }

  // 2. Supabase REST Connectivity Test
  if (!config.projectUrl || !config.apiKey) {
    return {
      success: false,
      message: 'Please provide both Supabase Project URL and Anon Key.',
      latencyMs: 0
    };
  }

  try {
    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`
      }
    });

    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 200 || res.status === 404) {
      return {
        success: true,
        message: `Successfully established TLS connection with Supabase Edge at ${cleanUrl}!`,
        latencyMs
      };
    } else {
      return {
        success: false,
        message: `Cloud server returned status ${res.status}: ${res.statusText}`,
        latencyMs
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network connection to cloud database failed.',
      latencyMs: Date.now() - start
    };
  }
};

/**
 * Sync a specific table/collection to the Cloud Database
 */
export const syncTableToCloud = async (
  tableName: string,
  records: any[]
): Promise<{ success: boolean; count: number; error?: string }> => {
  const config = getCloudDbConfig();

  // 1. Attempt secure serverless backend proxy first
  try {
    const apiRes = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: tableName,
        records,
        provider: config.provider,
        firebaseProjectId: config.firebaseProjectId || config.projectUrl,
        apiKey: config.apiKey
      })
    });
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json.success) {
        return { success: true, count: records.length };
      }
    }
  } catch {
    // Serverless proxy unavailable, proceed to direct client connection
  }

  if (config.provider === 'local_fallback') {
    return { success: true, count: records.length };
  }

  // 2. Client Firebase Sync
  if (config.provider === 'firebase') {
    const projectId = (config.firebaseProjectId || config.projectUrl || '').trim();
    const apiKey = (config.apiKey || '').trim();
    if (!projectId || !apiKey) return { success: true, count: records.length };

    try {
      let synced = 0;
      for (const item of records) {
        const docId = item.id || item.slug || item.uid || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const cleanCollection = tableName.replace(/^psa_/, '');
        const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(cleanCollection)}/${encodeURIComponent(docId)}?key=${encodeURIComponent(apiKey)}`;
        const fields = toFirestoreFields(item);
        const writeRes = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields })
        });
        if (writeRes.ok) synced++;
      }
      return { success: true, count: synced };
    } catch (e) {
      return { success: false, count: 0, error: e instanceof Error ? e.message : 'Firebase sync error' };
    }
  }

  // 3. Client Supabase Sync
  if (!config.projectUrl || !config.apiKey) {
    return { success: true, count: records.length };
  }

  try {
    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`,
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify(records)
    });

    if (res.ok) {
      return { success: true, count: records.length };
    } else {
      const text = await res.text();
      return { success: false, count: 0, error: text || `HTTP ${res.status}` };
    }
  } catch (e) {
    return {
      success: false,
      count: 0,
      error: e instanceof Error ? e.message : 'Unknown sync error'
    };
  }
};

/**
 * Fetch a table from the cloud database
 */
export const fetchTableFromCloud = async <T = any>(
  tableName: string
): Promise<T[] | null> => {
  const config = getCloudDbConfig();

  // 1. Attempt secure serverless backend proxy first
  try {
    const apiRes = await fetch(`/api/database?table=${encodeURIComponent(tableName)}&provider=${encodeURIComponent(config.provider)}`);
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data as T[];
      }
    }
  } catch {
    // Serverless proxy unavailable, proceed to client connection
  }

  if (config.provider === 'local_fallback') {
    return null;
  }

  // 2. Client Firebase Fetch
  if (config.provider === 'firebase') {
    const projectId = (config.firebaseProjectId || config.projectUrl || '').trim();
    const apiKey = (config.apiKey || '').trim();
    if (!projectId || !apiKey) return null;

    try {
      const cleanCollection = tableName.replace(/^psa_/, '');
      const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(cleanCollection)}?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.documents) && data.documents.length > 0) {
          return data.documents.map((d: any) => fromFirestoreDocument(d)) as T[];
        }
      }
      return null;
    } catch (e) {
      console.warn(`Firestore fetch error for ${tableName}:`, e);
      return null;
    }
  }

  // 3. Client Supabase Fetch
  if (!config.projectUrl || !config.apiKey) {
    return null;
  }

  try {
    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}?select=*`, {
      method: 'GET',
      headers: {
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as T[];
      }
    }
    return null;
  } catch (e) {
    console.warn(`Cloud fetch error for ${tableName}:`, e);
    return null;
  }
};

/**
 * Sync a single record (upsert) to the cloud database
 */
export const syncRecordToCloud = async (
  tableName: string,
  record: any
): Promise<boolean> => {
  const config = getCloudDbConfig();
  if (config.provider === 'local_fallback') {
    return true;
  }

  if (config.provider === 'firebase') {
    const projectId = (config.firebaseProjectId || config.projectUrl || '').trim();
    const apiKey = (config.apiKey || '').trim();
    if (!projectId || !apiKey) return true;

    try {
      const cleanCollection = tableName.replace(/^psa_/, '');
      const docId = record.id || record.slug || record.uid || `doc_${Date.now()}`;
      const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(cleanCollection)}/${encodeURIComponent(docId)}?key=${encodeURIComponent(apiKey)}`;
      const fields = toFirestoreFields(record);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  if (!config.projectUrl || !config.apiKey) {
    return true;
  }

  try {
    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`,
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch (e) {
    console.warn(`Cloud upsert error for ${tableName}:`, e);
    return false;
  }
};

/**
 * Delete a single record from the cloud database
 */
export const deleteRecordFromCloud = async (
  tableName: string,
  id: string
): Promise<boolean> => {
  const config = getCloudDbConfig();
  if (config.provider === 'local_fallback') {
    return true;
  }

  if (config.provider === 'firebase') {
    const projectId = (config.firebaseProjectId || config.projectUrl || '').trim();
    const apiKey = (config.apiKey || '').trim();
    if (!projectId || !apiKey) return true;

    try {
      const cleanCollection = tableName.replace(/^psa_/, '');
      const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(cleanCollection)}/${encodeURIComponent(id)}?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  if (!config.projectUrl || !config.apiKey) {
    return true;
  }

  try {
    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/${tableName}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`
      }
    });
    return res.ok;
  } catch (e) {
    console.warn(`Cloud delete error for ${tableName}:`, e);
    return false;
  }
};

/**
 * Generate complete JSON database snapshot for zero-data-loss export
 */
export const exportCompleteDatabaseJson = (): string => {
  const tables = [
    'psa_chronicles',
    'psa_members',
    'psa_reports',
    'psa_videos',
    'psa_events',
    'psa_event_registrations',
    'psa_announcements',
    'psa_staff_members',
    'psa_resource_comments',
    'psa_site_settings',
    'psa_google_ads_config'
  ];

  const bundle: Record<string, any> = {
    _exportedAt: new Date().toISOString(),
    _version: '2.5.0',
    _platform: 'PSA Investment Enterprise'
  };

  for (const table of tables) {
    try {
      const data = localStorage.getItem(table);
      bundle[table] = data ? JSON.parse(data) : [];
    } catch {
      bundle[table] = [];
    }
  }

  return JSON.stringify(bundle, null, 2);
};

/**
 * Import a full JSON snapshot into the application database
 */
export const importCompleteDatabaseJson = (jsonString: string): { success: boolean; importedTables: string[] } => {
  try {
    const bundle = JSON.parse(jsonString);
    const importedTables: string[] = [];

    for (const key of Object.keys(bundle)) {
      if (key.startsWith('psa_')) {
        localStorage.setItem(key, JSON.stringify(bundle[key]));
        importedTables.push(key);
      }
    }

    return { success: true, importedTables };
  } catch (e) {
    console.error('Import failed:', e);
    return { success: false, importedTables: [] };
  }
};
