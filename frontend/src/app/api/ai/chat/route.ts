import { NextResponse } from 'next/server';
import { CatalogGatewayEngine } from '@/lib/gateway/catalog-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, session_id, history = [], mode = 'customer' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message parameter is required.' }, { status: 400 });
    }

    const result = await CatalogGatewayEngine.processQuery({
      message,
      session_id,
      history,
      mode
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[AI Chat Route Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal AI Chat Error' },
      { status: 500 }
    );
  }
}
