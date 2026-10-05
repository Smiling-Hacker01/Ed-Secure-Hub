export type UserRole = 'USER' | 'AUTHORITY' | 'ADMIN';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'INVESTIGATION'
  | 'ACTION_TAKEN'
  | 'RESOLVED'
  | 'REJECTED';

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NoteVisibility = 'INTERNAL' | 'AUTHORITY_ONLY' | 'PUBLIC_UPDATE';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  badge_number?: string;
  department?: string;
  is_active: boolean;
  mfa_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  reference_id: string;
  user_id?: string | null;
  tracking_pin_hash: string; // Plaintext pin stored hashed or encrypted
  raw_pin?: string; // Only returned once upon creation to the submitter
  
  // Incident details
  incident_type: string;
  incident_date: string;
  platform_service: string;
  description: string;
  financial_loss: number;
  currency: string;
  suspect_contact?: string;
  suspect_identifier?: string;
  
  // Complainant / Victim
  victim_name: string;
  victim_email: string;
  victim_phone: string;
  victim_state?: string;
  victim_city?: string;
  is_anonymous: boolean;
  
  // Management
  status: ComplaintStatus;
  priority: IncidentPriority;
  assigned_to?: string | null;
  assigned_officer_name?: string;
  assigned_at?: string | null;
  resolution_summary?: string | null;
  closed_at?: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface EvidenceItem {
  id: string;
  complaint_id: string;
  file_name: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  sha256_hash: string;
  uploaded_by?: string;
  notes?: string;
  is_verified: boolean;
  signed_url?: string;
  /** Upload bytes for persistence; omitted from API responses. */
  file_data?: Buffer;
  created_at: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  previous_status?: ComplaintStatus;
  new_status: ComplaintStatus;
  changed_by_name?: string;
  changed_by_id?: string;
  change_reason?: string;
  is_public: boolean;
  created_at: string;
}

export interface InternalNote {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name: string;
  author_badge?: string;
  note: string;
  visibility: NoteVisibility;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  entity_type: string;
  entity_id: string;
  actor_id?: string;
  actor_name?: string;
  actor_role?: UserRole;
  action: string;
  old_state?: Record<string, unknown> | null;
  new_state?: Record<string, unknown> | null;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author_name: string;
  author_role: string;
  reading_time_minutes: number;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
}

export interface CyberStation {
  id: string;
  station_name: string;
  jurisdiction: string;
  state: string;
  address: string;
  helpline: string;
  officer_in_charge?: string;
  latitude: number;
  longitude: number;
  is_24_7: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  complaint_id?: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
