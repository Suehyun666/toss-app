import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_JAVA_SERVER_URL ?? 'http://localhost:8081';

/**
 * 클라이언트 → Next.js → Java 백엔드 프록시
 *
 * POST /api/proxy
 * Body: { path: string, method: string, body?: object }
 */
export async function POST(req: NextRequest) {
  const { path, method = 'GET', body } = await req.json();

  const url = `${BACKEND_BASE}${path}`;

  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  try {
    const upstream = await fetch(url, init);
    const text = await upstream.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[proxy] 백엔드 요청 실패:', err);
    return NextResponse.json({ message: '백엔드 서버에 연결할 수 없습니다.' }, { status: 502 });
  }
}
