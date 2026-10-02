import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthoritySession } from '@/lib/auth/permissions';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthoritySession();
    const { id } = await params;

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      return errorResponse('NOT_FOUND', 'Case complaint not found.', 404);
    }

    const timeline = await db.getStatusHistory(complaint.id, false); // All timeline updates
    const evidence = await db.getEvidenceByComplaintId(complaint.id);
    const internalNotes = await db.getInternalNotes(complaint.id);
    const auditEvents = await db.getAuditEventsByEntity('COMPLAINT', complaint.id);
    const officers = (await db.listUsers()).filter(
      (u) => u.role === 'AUTHORITY' || u.role === 'ADMIN'
    ).map((u) => ({
      id: u.id,
      fullName: u.full_name,
      badgeNumber: u.badge_number,
      department: u.department,
    }));

    return successResponse({
      complaint,
      timeline,
      evidence,
      internalNotes,
      auditEvents,
      officers,
      currentOfficer: {
        id: session.userId,
        fullName: session.fullName,
        role: session.role,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Authority complaint detail error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve case file.', 500);
  }
}
