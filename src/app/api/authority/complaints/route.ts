import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthoritySession } from '@/lib/auth/permissions';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET(req: NextRequest) {
  try {
    await requireAuthoritySession();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const incidentType = searchParams.get('incidentType') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { complaints, total } = await db.listComplaints({
      status,
      priority,
      incidentType,
      search,
      limit,
      offset,
    });

    const metrics = await db.getAuthorityMetrics();

    return successResponse({
      complaints,
      total,
      limit,
      offset,
      metrics,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Authority complaints list error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve authority case queue.', 500);
  }
}
