/**
 * PSA Investment - Health Check & System Status Serverless Function
 * GET /api/health
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json');

  const timestamp = new Date().toISOString();

  return res.status(200).json({
    status: 'healthy',
    service: 'PSA Investment Production API',
    canonicalDomain: 'https://psainvestment.com',
    timestamp,
    environment: process.env.NODE_ENV || 'production',
    database: {
      provider: process.env.VITE_SUPABASE_URL ? 'supabase_postgresql' : 'active_persistent_edge',
      configured: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
    }
  });
}
