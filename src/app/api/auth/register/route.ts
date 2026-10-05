import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Registration validation failed. Please check required fields.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { email, password, fullName, phone } = parsed.data;

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return errorResponse(
        'EMAIL_ALREADY_REGISTERED',
        'An account with this email address already exists.',
        409
      );
    }

    // Hash password securely
    const password_hash = await hashPassword(password);

    const newUser = await db.createUser({
      email,
      password_hash,
      full_name: fullName,
      phone: phone || undefined,
      role: 'USER',
      is_active: true,
      mfa_enabled: false,
    });

    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      role: newUser.role,
      badgeNumber: newUser.badge_number,
      department: newUser.department,
    });

    const response = successResponse(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          badgeNumber: newUser.badge_number,
          department: newUser.department,
        },
        token,
      },
      201
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(
      'INTERNAL_ERROR',
      'Failed to register account. Please try again later.',
      500
    );
  }
}
