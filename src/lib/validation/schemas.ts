import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'AUTHORITY', 'ADMIN']).default('USER'),
  badgeNumber: z.string().optional(),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const complaintSubmissionSchema = z.object({
  incidentType: z.string().min(2, 'Please select an incident type'),
  incidentDate: z.string().min(4, 'Incident date and time is required'),
  platformService: z.string().min(2, 'Platform or service involved is required'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  financialLoss: z.coerce.number().min(0).default(0),
  currency: z.string().default('USD'),
  suspectContact: z.string().optional(),
  suspectIdentifier: z.string().optional(),
  
  // Victim Information
  victimName: z.string().min(2, 'Name is required'),
  victimEmail: z.string().email('Valid contact email is required'),
  victimPhone: z.string().min(7, 'Contact phone number is required'),
  victimState: z.string().optional(),
  victimCity: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
});

export const trackComplaintSchema = z.object({
  referenceId: z
    .string()
    .min(5, 'Reference ID is required')
    .regex(/^ED-\d{4}-\d{4,6}$/i, 'Reference ID format should be ED-YYYY-XXXXX'),
  pin: z.string().min(4, 'Access PIN is required').max(8),
});

export const statusUpdateSchema = z.object({
  complaintId: z.string().uuid('Invalid complaint ID format'),
  newStatus: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'ASSIGNED',
    'INVESTIGATION',
    'ACTION_TAKEN',
    'RESOLVED',
    'REJECTED',
  ]),
  reason: z.string().min(5, 'A rationale or summary is required for status changes'),
  isPublic: z.boolean().default(true),
});

export const assignOfficerSchema = z.object({
  complaintId: z.string().uuid('Invalid complaint ID format'),
  assigneeId: z.string().uuid('Invalid assignee ID format'),
});

export const priorityUpdateSchema = z.object({
  complaintId: z.string().uuid('Invalid complaint ID format'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const internalNoteSchema = z.object({
  complaintId: z.string().uuid('Invalid complaint ID format'),
  note: z.string().min(5, 'Note content must be at least 5 characters'),
  visibility: z.enum(['INTERNAL', 'AUTHORITY_ONLY', 'PUBLIC_UPDATE']).default('INTERNAL'),
});
