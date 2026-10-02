import { requireAuthoritySession } from '@/lib/auth/permissions';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET() {
  try {
    await requireAuthoritySession();
    const metrics = await db.getAuthorityMetrics();
    return successResponse({ metrics });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Authority metrics error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve authority metrics.', 500);
  }
}
