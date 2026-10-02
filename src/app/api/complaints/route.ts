import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { complaintSubmissionSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';
import { eventBus } from '@/lib/events/event-bus';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = complaintSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Please review the complaint form for missing or invalid fields.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const session = await getSession();
    if (!session || !session.userId) {
      return errorResponse(
        'AUTHENTICATION_REQUIRED',
        'You must be signed in to lodge an official cybercrime complaint. Please sign in or create an account to proceed.',
        401
      );
    }

    const data = parsed.data;

    // Generate 4-digit secure tracking PIN
    const rawPin = Math.floor(1000 + Math.random() * 9000).toString();
    const pinHash = await bcrypt.hash(rawPin, 10);

    const complaint = await db.createComplaint({
      user_id: session.userId,
      raw_pin: rawPin,
      pin_hash: pinHash,
      tracking_pin_hash: pinHash,
      incident_type: data.incidentType,
      incident_date: data.incidentDate,
      platform_service: data.platformService,
      description: data.description,
      financial_loss: data.financialLoss || 0,
      currency: data.currency || 'INR',
      suspect_contact: data.suspectContact,
      suspect_identifier: data.suspectIdentifier,
      victim_name: data.isAnonymous ? 'Anonymous Citizen' : data.victimName,
      victim_email: data.victimEmail,
      victim_phone: data.victimPhone,
      victim_state: data.victimState,
      victim_city: data.victimCity,
      is_anonymous: data.isAnonymous,
      priority: data.priority || 'MEDIUM',
    });

    // Publish domain event
    eventBus.publish({
      type: 'ComplaintSubmitted',
      payload: {
        complaint,
        rawPin,
      },
    });

    return successResponse(
      {
        complaintId: complaint.id,
        referenceId: complaint.reference_id,
        rawPin: rawPin,
        status: complaint.status,
        createdAt: complaint.created_at,
        message: 'Your incident complaint has been logged and assigned to the digital triage queue.',
      },
      201
    );
  } catch (error) {
    console.error('Complaint submission error:', error);
    return errorResponse(
      'SUBMISSION_FAILED',
      'We could not submit your complaint right now. Your data has not been lost. Please try again.',
      500
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Authentication required to view complaint history.', 401);
    }

    const { complaints } = await db.listComplaints({
      userId: session.userId,
    });

    return successResponse({ complaints });
  } catch (error) {
    console.error('List complaints error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve complaints.', 500);
  }
}
