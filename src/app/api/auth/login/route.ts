import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Invalid login credentials provided.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { email, password } = parsed.data;
    const user = await db.findUserByEmail(email);

    if (!user) {
      return errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    if (!user.is_active) {
      return errorResponse('ACCOUNT_SUSPENDED', 'This account has been deactivated.', 403);
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      badgeNumber: user.badge_number,
      department: user.department,
    });

    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        badgeNumber: user.badge_number,
        department: user.department,
      },
      token,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred during authentication.', 500);
  }
}
