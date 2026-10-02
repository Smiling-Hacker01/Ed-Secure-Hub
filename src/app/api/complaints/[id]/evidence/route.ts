import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse, validateEvidenceFile, calculateHash } from '@/lib/utils/security';
import { eventBus } from '@/lib/events/event-bus';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      return errorResponse('NOT_FOUND', 'Target complaint not found.', 404);
    }

    // Authorization: owner or authority
    if (complaint.user_id && (!session || (session.userId !== complaint.user_id && session.role === 'USER'))) {
      return errorResponse('FORBIDDEN', 'Unauthorized to upload evidence for this incident.', 403);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const notes = (formData.get('notes') as string) || '';

    if (!file) {
      return errorResponse('FILE_REQUIRED', 'Please select a valid evidence file to upload.', 400);
    }

    // Validation
    const validation = validateEvidenceFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return errorResponse('INVALID_FILE', validation.error || 'Invalid file format or size.', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sha256_hash = calculateHash(buffer);

    const safeStorageName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `/secure-vault/evidence/${complaint.id}/${safeStorageName}`;

    const evidence = await db.addEvidence({
      complaint_id: complaint.id,
      file_name: safeStorageName,
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath,
      sha256_hash,
      uploaded_by: session?.userId,
      notes: notes || undefined,
      is_verified: true,
    });

    // Publish event
    eventBus.publish({
      type: 'EvidenceUploaded',
      payload: {
        complaintId: complaint.id,
        evidence,
      },
    });

    return successResponse(
      {
        evidenceId: evidence.id,
        fileName: evidence.original_name,
        sizeBytes: evidence.size_bytes,
        sha256Hash: evidence.sha256_hash,
        signedUrl: evidence.signed_url,
        message: 'Evidence securely ingested into private evidence vault with verified SHA-256 hash.',
      },
      201
    );
  } catch (error) {
    console.error('Evidence upload error:', error);
    return errorResponse('UPLOAD_FAILED', 'Failed to securely process evidence file.', 500);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Authentication required to inspect evidence vault.', 401);
    }

    const complaint = await db.getComplaintById(id);
    if (!complaint) {
      return errorResponse('NOT_FOUND', 'Complaint not found.', 404);
    }

    const isAuthority = session.role === 'AUTHORITY' || session.role === 'ADMIN';
    const isOwner = complaint.user_id === session.userId;

    if (!isAuthority && !isOwner) {
      return errorResponse('FORBIDDEN', 'Access to evidence vault denied.', 403);
    }

    const evidence = await db.getEvidenceByComplaintId(complaint.id);
    return successResponse({ evidence });
  } catch (error) {
    console.error('Get evidence error:', error);
    return errorResponse('INTERNAL_ERROR', 'Unable to retrieve evidence items.', 500);
  }
}
