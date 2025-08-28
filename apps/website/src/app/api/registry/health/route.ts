/**
 * Registry Health Check Route - Static Generation
 *
 * Simple health check endpoint for monitoring
 */

// Force static generation
export const dynamic = 'force-static';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: Math.floor(Date.now() / 1000), // Simple uptime in seconds
  };

  return Response.json(healthData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ...corsHeaders,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
