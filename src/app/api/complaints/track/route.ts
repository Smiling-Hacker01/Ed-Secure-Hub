import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { trackComplaintSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = trackComplaintSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Invalid Reference ID or PIN format. Reference IDs follow format ED-YYYY-XXXXX.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { referenceId, pin } = parsed.data;
    const complaint = await db.getComplaintByReference(referenceId);

    if (!complaint) {
      return errorResponse(
        'COMPLAINT_NOT_FOUND',
        'No incident record found matching this Reference ID. Please verify the ID sent in your confirmation receipt.',
        404
      );
    }

    // Verify PIN against tracking pin hash or stored raw_pin
    let isPinValid = false;
    if (complaint.raw_pin && complaint.raw_pin === pin) {
      isPinValid = true;
    } else {
      isPinValid = await bcrypt.compare(pin, complaint.tracking_pin_hash);
    }

    if (!isPinValid) {
      return errorResponse(
        'INVALID_PIN',
        'The security PIN entered does not match this complaint record.',
        401
      );
    }

    // Retrieve public timeline events only
    const timeline = await db.getStatusHistory(complaint.id, true);

    // Build public tracking payload
    const trackingData = {
      referenceId: complaint.reference_id,
      incidentType: complaint.incident_type,
      incidentDate: complaint.incident_date,
      platformService: complaint.platform_service,
      status: complaint.status,
      priority: complaint.priority,
      createdAt: complaint.created_at,
      updatedAt: complaint.updated_at,
      resolutionSummary: complaint.status === 'RESOLVED' ? complaint.resolution_summary : null,
      timeline: timeline.map((item) => ({
        id: item.id,
        status: item.new_status,
        update: item.change_reason,
        timestamp: item.created_at,
      })),
      nextSteps: getNextStepsAdvisory(complaint.status, complaint.incident_type),
    };

    return successResponse(trackingData);
  } catch (error) {
    console.error('Track complaint error:', error);
    return errorResponse(
      'INTERNAL_ERROR',
      'Unable to track complaint at this time. Please check your network connection and try again.',
      500
    );
  }
}

function getNextStepsAdvisory(status: string, incidentType: string): string[] {
  switch (status) {
    case 'SUBMITTED':
      return [
        'Preserve all relevant communication logs and avoid deleting chat threads.',
        'If financial fraud occurred within the last 2 hours, call the national cyber helpline at 1930 immediately.',
        'Our intake officers are reviewing your submission to verify jurisdiction and prioritize threat level.',
      ];
    case 'UNDER_REVIEW':
      return [
        'An intake triage officer is evaluating technical evidence and threat indicators.',
        'Ensure the contact phone number provided remains reachable in case additional verification is required.',
      ];
    case 'ASSIGNED':
      return [
        'Your case has been formally assigned to a specialized cyber cell investigation unit.',
        'Formal inquiry letters and digital preservation requests are being prepared for relevant platform providers.',
      ];
    case 'INVESTIGATION':
      return [
        'Active forensic investigation is in progress with coordinating financial institutions and service nodes.',
        'Do not engage directly with the suspect or attempt private negotiations.',
      ];
    case 'ACTION_TAKEN':
      return [
        'Regulatory or legal intervention has been executed (e.g., beneficiary wallet freeze, domain takedown notice).',
        'Official case documentation is being updated for legal proceedings.',
      ];
    case 'RESOLVED':
      return [
        'The investigation has concluded and formal closure notes have been submitted.',
        'You can download your certified incident closure certificate or contact your bank with this case reference.',
      ];
    default:
      return ['Maintain situational awareness and monitor your accounts for unauthorized activity.'];
  }
}
