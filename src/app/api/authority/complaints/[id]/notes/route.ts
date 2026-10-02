import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuthoritySession } from '@/lib/auth/permissions';
import { internalNoteSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthoritySession();
    const { id } = await params;
    const body = await req.json();

    const parsed = internalNoteSchema.safeParse({ ...body, complaintId: id });
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_FAILED',
        'Invalid internal note payload.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { note, visibility } = parsed.data;
    const officer = await db.findUserById(session.userId);
    if (!officer) {
      return errorResponse('UNAUTHORIZED', 'Operating officer not found.', 401);
    }

    const createdNote = await db.addInternalNote({
      complaintId: id,
      author: officer,
      note,
      visibility,
    });

    return successResponse({
      note: createdNote,
      message: 'Confidential internal note appended to case history.',
    }, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return errorResponse('FORBIDDEN', error.message, 403);
    }
    console.error('Add internal note error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to save internal note.', 500);
  }
}
