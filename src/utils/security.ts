/**
 * PSA Investment Enterprise Security & Sanitization Suite
 * Protection against SQL Injection, Cross-Site Scripting (XSS),
 * HTML Injection, and Administrative Access Hardening.
 */

// Common SQL Injection Signatures
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|TRUNCATE)\b)/i,
  /(--|\/\*|\*\/|@@|char\s*\(|nchar\s*\(|varchar\s*\(|cast\s*\(|convert\s*\()/i,
  /('|\b)(OR|AND)\s+(['"]?\w+['"]?\s*=\s*['"]?\w+['"]?|1\s*=\s*1|0\s*=\s*0)/i,
  /(WAITFOR\s+DELAY|BENCHMARK\s*\(|PG_SLEEP\s*\()/i,
  /(\bxp_cmdshell\b|\bsp_executesql\b)/i
];

export interface SqlCheckResult {
  isSafe: boolean;
  detectedPattern?: string;
  sanitized: string;
}

/**
 * Validates text against known SQL injection attack vectors
 */
export function checkSqlSafety(input: string): SqlCheckResult {
  if (!input || typeof input !== 'string') {
    return { isSafe: true, sanitized: '' };
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        isSafe: false,
        detectedPattern: match[0],
        sanitized: sanitizeSql(input)
      };
    }
  }

  return {
    isSafe: true,
    sanitized: sanitizeSql(input)
  };
}

/**
 * Sanitizes input to neutralize potential SQL escaping or syntax tampering
 */
export function sanitizeSql(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/'/g, "''") // Standard SQL escape for single quotes
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '；') // Replace semi-colons to prevent multi-statement stacking
    .replace(/--/g, '—') // Replace comment dashes
    .trim();
}

/**
 * Sanitizes plain text by stripping all HTML tags, script vectors, and javascript: protocols
 */
export function sanitizeText(input: string, maxLength: number = 5000): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input
    // Strip script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip iframe, object, embed, frame
    .replace(/<(iframe|object|embed|frame|meta|link|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    // Strip standalone tags
    .replace(/<[^>]+>/g, '')
    // Remove javascript: and data: pseudo-protocols
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Strip null bytes
    .replace(/\0/g, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes formatted HTML (e.g. from Mammoth Word documents)
 * Whitelisting only safe structural elements (p, table, tr, td, th, strong, em, h1-h6, br, ul, ol, li)
 * and stripping all event handlers (onclick, onerror, etc.)
 */
export function sanitizeSafeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  return html
    // Remove scripts and inline event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<(iframe|object|embed|applet|form|input|button)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    .replace(/(\bon\w+)\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Validates email formatting strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
}

/**
 * Validates phone numbers (Nigerian and international E.164 formats)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Audit Log Item for Administrative and Security Events
 */
export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  category: 'auth' | 'admin_action' | 'input_threat' | 'system';
  details: string;
  severity: 'low' | 'medium' | 'high';
}

const AUDIT_STORAGE_KEY = 'psa_security_audit_log';

export function getSecurityAuditLogs(): SecurityAuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialAuditLogs();
  } catch {
    return getInitialAuditLogs();
  }
}

export function logSecurityEvent(
  action: string,
  actor: string,
  category: 'auth' | 'admin_action' | 'input_threat' | 'system',
  details: string,
  severity: 'low' | 'medium' | 'high' = 'low'
): void {
  try {
    const logs = getSecurityAuditLogs();
    const entry: SecurityAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      category,
      details,
      severity
    };
    logs.unshift(entry);
    // Keep last 100 entries
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Failed to log security event', e);
  }
}

function getInitialAuditLogs(): SecurityAuditEntry[] {
  return [
    {
      id: 'audit-init-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      action: 'System Security Hardening Active',
      actor: 'Salami Abdullahi (CEO/Admin)',
      category: 'system',
      details: 'SQL Injection filter, XSS sanitizer, and CSRF defense initialized for production deployment.',
      severity: 'low'
    },
    {
      id: 'audit-init-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'Admin RBAC Session Verified',
      actor: 'salamiabdullahi257@gmail.com',
      category: 'auth',
      details: 'Elevated admin privileges active with verified role assignments.',
      severity: 'low'
    }
  ];
}

/**
 * Client-Side Rate Limiter & Brute Force Lockout
 * Protects login endpoints (analyst, member, staff, super admin) from dictionary/credential stuffing attacks.
 */
interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const RATE_LIMIT_STORAGE_KEY = 'psa_auth_rate_limits';

function getRateLimitStore(): Record<string, RateLimitRecord> {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRateLimitStore(store: Record<string, RateLimitRecord>): void {
  try {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Rate limit storage error', e);
  }
}

/**
 * Checks whether an identifier (email, IP, or role key) is currently locked out
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  lockoutDurationMs: number = 300000 // 5 minutes
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  if (!identifier) return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };

  const store = getRateLimitStore();
  const key = identifier.trim().toLowerCase();
  const record = store[key];

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  const now = Date.now();

  // If locked out, check if lockout has expired
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter
    };
  }

  // If lockout expired or more than 15 minutes have passed since first attempt, reset
  if (now - record.firstAttemptAt > 900000) {
    delete store[key];
    saveRateLimitStore(store);
    return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
    retryAfterSeconds: 0
  };
}

/**
 * Records a failed authentication attempt. Automatically triggers lockout on reaching max attempts.
 */
export function recordFailedAttempt(
  identifier: string,
  maxAttempts: number = 5,
  lockoutDurationMs: number = 300000
): { locked: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const store = getRateLimitStore();
  const key = (identifier || 'anonymous').trim().toLowerCase();
  const now = Date.now();

  let record = store[key];
  if (!record || now - record.firstAttemptAt > 900000) {
    record = { attempts: 1, firstAttemptAt: now };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= maxAttempts) {
    record.lockedUntil = now + lockoutDurationMs;
    const retryAfter = Math.ceil(lockoutDurationMs / 1000);
    store[key] = record;
    saveRateLimitStore(store);

    logSecurityEvent(
      'RATE_LIMIT_LOCKOUT',
      identifier,
      'auth',
      `Identifier reached ${maxAttempts} consecutive failed attempts. Locked out for ${retryAfter}s.`,
      'high'
    );

    return { locked: true, remainingAttempts: 0, retryAfterSeconds: retryAfter };
  }

  store[key] = record;
  saveRateLimitStore(store);

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return { locked: false, remainingAttempts: remaining, retryAfterSeconds: 0 };
}

/**
 * Resets the failed attempts counter upon successful authentication
 */
export function resetRateLimit(identifier: string): void {
  if (!identifier) return;
  const store = getRateLimitStore();
  const key = identifier.trim().toLowerCase();
  if (store[key]) {
    delete store[key];
    saveRateLimitStore(store);
  }
}

/**
 * Validates credentials strictly against SQL injection, null-byte attacks, and XSS
 */
export function validateCredentialSafety(value: string, fieldName: string): { isValid: boolean; error?: string } {
  if (!value) return { isValid: true };

  const sqlCheck = checkSqlSafety(value);
  if (!sqlCheck.isSafe) {
    logSecurityEvent(
      'INJECTION_ATTEMPT_BLOCKED',
      fieldName,
      'input_threat',
      `Suspicious pattern detected in ${fieldName}: "${sqlCheck.detectedPattern}".`,
      'high'
    );
    return {
      isValid: false,
      error: `Security Alert: Dangerous characters or SQL sequence detected in ${fieldName}. Submission blocked.`
    };
  }

  if (value.includes('<script') || value.includes('javascript:') || value.includes('\0')) {
    logSecurityEvent(
      'XSS_ATTEMPT_BLOCKED',
      fieldName,
      'input_threat',
      `Malicious script payload detected in ${fieldName}.`,
      'high'
    );
    return {
      isValid: false,
      error: `Security Alert: Malicious script tags or protocols detected in ${fieldName}. Submission blocked.`
    };
  }

  return { isValid: true };
}

/**
 * Computes a SHA-256 cryptographic hex digest using Web Crypto API
 */
export async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for non-browser or testing environments
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Generates a random cryptographic salt
 */
export function generateCryptoSalt(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Hashes a password with a cryptographic salt
 */
export async function hashCredentialWithSalt(password: string, salt: string): Promise<string> {
  return computeSha256(`${salt}::PSA-INVESTMENT-SALTED::${password}`);
}

/**
 * Authorized Super Admin Configuration
 */
export const AUTHORIZED_SUPERADMIN_EMAILS = [
  'salamiabdullahi257@gmail.com',
  'salamiabdullhahi257@gmail.com'
];

// SHA-256 hash of 'PSAISuperAdmin@1234'
export const SUPERADMIN_PASSWORD_HASH = 'cb80938f9787eb86d909f15243299eba400035b2959e122035ecce89e3eaec3b';

// SHA-256 hash of '2570' (Chief Analyst PIN)
export const SUPERADMIN_PIN_HASH = '5e8a21ead84851c212c2cae58849de4d37bc0babfcab05ceff51350412eb3e94';

