import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthoritySession } from '@/lib/auth/permissions';
import { assignOfficerSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';
import { eventBus } from '@/lib/events/event-bus';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthoritySession();
    const { id } = await params;
    const body = await req.json();

    const parsed = assignOfficerSchema.safeParse({ ...body, complaintId: id });
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Invalid assignment payload.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { assigneeId } = parsed.data;
    const officer = await db.findUserById(session.userId);
    if (!officer) {
      return errorResponse('UNAUTHORIZED', 'Operating authority user not found.', 401);
    }

    const updatedComplaint = await db.assignComplaint({
      complaintId: id,
      assigneeId,
      actor: officer,
    });

    eventBus.publish({
      type: 'ComplaintAssigned',
      payload: {
        complaint: updatedComplaint,
        officerId: assigneeId,
        officerName: updatedComplaint.assigned_officer_name || 'Assigned Officer',
      },
    });

    return successResponse({
      complaint: updatedComplaint,
      message: `Case assigned to ${updatedComplaint.assigned_officer_name}.`,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Assign case error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to assign case.', 500);
  }
}
