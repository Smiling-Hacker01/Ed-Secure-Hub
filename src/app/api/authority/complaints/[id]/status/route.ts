import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthoritySession } from '@/lib/auth/permissions';
import { statusUpdateSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';
import { eventBus } from '@/lib/events/event-bus';
import { ComplaintStatus } from '@/lib/db/types';

// Valid status transitions map
const VALID_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  SUBMITTED: ['UNDER_REVIEW', 'ASSIGNED', 'REJECTED'],
  UNDER_REVIEW: ['ASSIGNED', 'INVESTIGATION', 'REJECTED'],
  ASSIGNED: ['INVESTIGATION', 'ACTION_TAKEN', 'REJECTED'],
  INVESTIGATION: ['ACTION_TAKEN', 'RESOLVED', 'REJECTED'],
  ACTION_TAKEN: ['INVESTIGATION', 'RESOLVED', 'REJECTED'],
  RESOLVED: ['INVESTIGATION'], // Can reopen on new evidence
  REJECTED: ['UNDER_REVIEW'], // Can appeal or reconsider
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthoritySession();
    const { id } = await params;
    const body = await req.json();

    const parsed = statusUpdateSchema.safeParse({ ...body, complaintId: id });
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Invalid status update payload.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { newStatus, reason, isPublic } = parsed.data;
    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      return errorResponse('NOT_FOUND', 'Target complaint not found.', 404);
    }

    const currentStatus = complaint.status;
    const allowed = VALID_TRANSITIONS[currentStatus];

    if (!allowed || !allowed.includes(newStatus)) {
      return errorResponse(
        'INVALID_STATE_TRANSITION',
        `Cannot transition status directly from ${currentStatus} to ${newStatus}. Permitted next stages: ${allowed ? allowed.join(', ') : 'None'}.`,
        422
      );
    }

    const officer = await db.findUserById(session.userId);
    if (!officer) {
      return errorResponse('UNAUTHORIZED', 'Operating authority user not found.', 401);
    }

    const result = await db.updateComplaintStatus({
      complaintId: id,
      newStatus,
      changedBy: officer,
      reason,
      isPublic,
    });

    // Publish event
    eventBus.publish({
      type: 'ComplaintStatusChanged',
      payload: {
        complaint: result.complaint,
        previousStatus: currentStatus,
        newStatus,
        reason,
      },
    });

    if (newStatus === 'RESOLVED') {
      eventBus.publish({
        type: 'ComplaintResolved',
        payload: {
          complaint: result.complaint,
          resolutionSummary: reason,
        },
      });
    }

    return successResponse({
      complaint: result.complaint,
      history: result.history,
      message: `Case status transitioned to ${newStatus}.`,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Status transition error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to update case status.', 500);
  }
}
