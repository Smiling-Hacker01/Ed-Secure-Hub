import { NextResponse } from 'next/server';
import { getSession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return successResponse({ user: null });
    }

    const user = await db.findUserById(session.userId);
    if (!user || !user.is_active) {
      const response = successResponse({ user: null });
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        badgeNumber: user.badge_number,
        department: user.department,
        mfaEnabled: Boolean(user.mfa_enabled),
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Session me error:', error);
    return errorResponse('INTERNAL_ERROR', 'Unable to retrieve user session.', 500);
  }
}
