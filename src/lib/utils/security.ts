import { NextResponse } from 'next/server';
import crypto from 'crypto';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    }
  );
}

export function calculateHash(buffer: Buffer | string): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateEvidenceFile(file: { name: string; size: number; type: string }): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds 10MB size limit.' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported file format. Only JPEG, PNG, WEBP, and PDF documents are permitted for digital chain of custody.',
    };
  }
  return { valid: true };
}
