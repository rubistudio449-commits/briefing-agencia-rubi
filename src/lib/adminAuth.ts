import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'rubi_admin';
const SESSION_DAYS = 7;

/** Web Crypto em vez de `node:crypto`: funciona igual em Node e no Edge. */
async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return Buffer.from(signature).toString('base64url');
}

const secret = () => process.env.ADMIN_PASSWORD ?? '';

export const adminEnabled = () => secret().length > 0;

/** Comparação em tempo constante, para não vazar o segredo pelo tempo de resposta. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expiresAt);
  return `${payload}.${await hmac(payload, secret())}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !adminEnabled()) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = await hmac(payload, secret());
  if (!safeEqual(signature, expected)) return false;

  return Number(payload) > Date.now();
}

export function checkPassword(candidate: string): boolean {
  return adminEnabled() && safeEqual(candidate, secret());
}

/** Usado pelo layout protegido do painel. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
