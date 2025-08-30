import { getCloudflareContext } from '@opennextjs/cloudflare';
import { type NextRequest, NextResponse } from 'next/server';

interface CloudflareEnv {
  RAFTERS_INTEL: KVNamespace;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'test';
  const key = 'kv-test-key';

  try {
    // Access KV namespace via OpenNext Cloudflare context
    const { env } = getCloudflareContext();
    const kvNamespace = env.RAFTERS_INTEL;
    console.log('KV Namespace type:', typeof kvNamespace);
    console.log('KV Namespace available:', !!kvNamespace);
    console.log('KV Namespace keys:', kvNamespace ? Object.keys(kvNamespace) : 'N/A');

    if (!kvNamespace) {
      return NextResponse.json(
        {
          error: 'KV namespace not available',
          env: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (action === 'write') {
      // Write test data
      const testData = {
        message: 'KV test data',
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
      };

      await kvNamespace.put(key, JSON.stringify(testData));
      console.log('Written to KV:', key, testData);

      return NextResponse.json({
        action: 'write',
        key,
        data: testData,
        success: true,
      });
    }

    if (action === 'read') {
      // Read test data
      const cachedData = await kvNamespace.get(key);
      console.log('Read from KV:', key, cachedData ? 'found' : 'not found');

      if (cachedData) {
        return NextResponse.json({
          action: 'read',
          key,
          data: JSON.parse(cachedData),
          success: true,
          found: true,
        });
      }
      return NextResponse.json({
        action: 'read',
        key,
        success: true,
        found: false,
        message: 'No data found',
      });
    }

    // Default: show status
    return NextResponse.json({
      kvAvailable: !!kvNamespace,
      instructions: {
        write: '?action=write',
        read: '?action=read',
      },
    });
  } catch (error) {
    console.error('KV test error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
