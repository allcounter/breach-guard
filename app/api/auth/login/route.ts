import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

/** Timing-safe string comparison. */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Create an HMAC-signed auth token.
 * Format: `timestamp.signature` — the signature binds the token to the secret
 * without storing the secret in the cookie.
 */
function createAuthToken(secret: string): string {
  const payload = Date.now().toString();
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verify an HMAC-signed auth token.
 * Recomputes the HMAC from the payload and compares with timing-safe equality.
 */
export function verifyAuthToken(token: string, secret: string): boolean {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!payload || !signature) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!process.env.SITE_PASSWORD || !safeCompare(password, process.env.SITE_PASSWORD)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = createAuthToken(process.env.SITE_PASSWORD);
  const response = NextResponse.json({ ok: true });
  response.cookies.set('site_auth', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return response;
}
