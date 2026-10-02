import { AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { successResponse } from '@/lib/utils/security';

export async function POST() {
  const response = successResponse({ message: 'Successfully logged out.' });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
