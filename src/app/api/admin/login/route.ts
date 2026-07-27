import { NextResponse } from 'next/server';

import { SESSION_COOKIE, adminEnabled, checkPassword, createSessionToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: 'Painel não configurado. Defina ADMIN_PASSWORD no ambiente.' },
      { status: 501 },
    );
  }

  const form = await request.formData();
  const password = String(form.get('senha') ?? '');

  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL('/admin/login?erro=1', request.url), 303);
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
