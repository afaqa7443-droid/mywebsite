import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'admin_session';

export function createSession(): string {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return token;
}

export function getSessionCookie(): string | undefined {
  return cookies().get(ADMIN_COOKIE)?.value;
}

export function setSessionCookie(value: string) {
  cookies().set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export function clearSessionCookie() {
  cookies().set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' });
}
