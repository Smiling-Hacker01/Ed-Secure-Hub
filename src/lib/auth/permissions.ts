import { UserRole } from '../db/types';
import { getSession, SessionPayload } from './session';

export class AuthorizationError extends Error {
  constructor(message = 'Access Denied: You lack permissions for this resource.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export async function requireUserSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthorizationError('Authentication required. Please log in.');
  }
  return session;
}

export async function requireAuthoritySession(): Promise<SessionPayload> {
  const session = await requireUserSession();
  if (session.role !== 'AUTHORITY' && session.role !== 'ADMIN') {
    throw new AuthorizationError('Restricted Access: Cyber-Cell Authority credential required.');
  }
  return session;
}

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await requireUserSession();
  if (session.role !== 'ADMIN') {
    throw new AuthorizationError('Restricted Access: System Administrator clearance required.');
  }
  return session;
}

export function hasRole(currentRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(currentRole);
}
