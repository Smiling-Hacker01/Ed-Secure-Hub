import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Authentication required.', 401);
    }

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      return errorResponse('NOT_FOUND', 'Incident complaint not found.', 404);
    }

    const isAuthority = session.role === 'AUTHORITY' || session.role === 'ADMIN';
    const isOwner = complaint.user_id === session.userId;

    if (!isAuthority && !isOwner) {
      return errorResponse('FORBIDDEN', 'You do not have permission to view this complaint.', 403);
    }

    const timeline = await db.getStatusHistory(complaint.id, !isAuthority);
    const evidence = await db.getEvidenceByComplaintId(complaint.id);

    // Filter sensitive fields for public users
    const sanitizedComplaint = {
      ...complaint,
      tracking_pin_hash: undefined,
      raw_pin: undefined,
    };

    return successResponse({
      complaint: sanitizedComplaint,
      timeline,
      evidence,
      isAuthority,
    });
  } catch (error) {
    console.error('Get complaint detail error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve complaint detail.', 500);
  }
}
