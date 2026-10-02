import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserRole } from '../db/types';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'edsecure_hub_production_grade_secret_key_2026_very_secure';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const AUTH_COOKIE_NAME = 'edsecure_auth_session';

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  badgeNumber?: string;
  department?: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .setIssuer('edsecure-hub')
    .setAudience('edsecure-client')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'edsecure-hub',
      audience: 'edsecure-client',
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}
