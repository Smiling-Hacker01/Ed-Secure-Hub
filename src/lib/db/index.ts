import fs from 'fs';
import path from 'path';
import {
  User,
  Complaint,
  EvidenceItem,
  ComplaintStatusHistory,
  InternalNote,
  AuditEvent,
  BlogPost,
  CyberStation,
  NotificationItem,
  ComplaintStatus,
  IncidentPriority,
  NoteVisibility,
} from './types';
import {
  SEED_USERS,
  SEED_COMPLAINTS,
  SEED_EVIDENCE,
  SEED_STATUS_HISTORY,
  SEED_INTERNAL_NOTES,
  SEED_AUDIT_EVENTS,
  SEED_BLOG_POSTS,
  SEED_CYBER_STATIONS,
} from './seed-data';
import { queryPostgres, withPostgresTransaction } from './postgres';

interface DatabaseStore {
  users: User[];
  complaints: Complaint[];
  evidence: EvidenceItem[];
  statusHistory: ComplaintStatusHistory[];
  internalNotes: InternalNote[];
  auditEvents: AuditEvent[];
  blogPosts: BlogPost[];
  cyberStations: CyberStation[];
  notifications: NotificationItem[];
}

// Storage persistence file path
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'edsecure_store.json');

const emptyStore = (): DatabaseStore => ({
  users: [], complaints: [], evidence: [], statusHistory: [], internalNotes: [],
  auditEvents: [], blogPosts: [], cyberStations: [], notifications: [],
});

const toIso = (value: unknown): string => new Date(String(value)).toISOString();

function mapComplaint(row: Record<string, unknown>): Complaint {
  return {
    id: String(row.id), reference_id: String(row.reference_id),
    user_id: row.user_id == null ? null : String(row.user_id),
    tracking_pin_hash: String(row.tracking_pin_hash),
    incident_type: String(row.incident_type), incident_date: toIso(row.incident_date),
    platform_service: String(row.platform_service), description: String(row.description),
    financial_loss: Number(row.financial_loss || 0), currency: String(row.currency || 'USD'),
    suspect_contact: row.suspect_contact == null ? undefined : String(row.suspect_contact),
    suspect_identifier: row.suspect_identifier == null ? undefined : String(row.suspect_identifier),
    victim_name: String(row.victim_name), victim_email: String(row.victim_email),
    victim_phone: String(row.victim_phone),
    victim_state: row.victim_state == null ? undefined : String(row.victim_state),
    victim_city: row.victim_city == null ? undefined : String(row.victim_city),
    is_anonymous: Boolean(row.is_anonymous), status: row.status as ComplaintStatus,
    priority: row.priority as IncidentPriority,
    assigned_to: row.assigned_to == null ? null : String(row.assigned_to),
    assigned_officer_name: row.assigned_officer_name == null ? undefined : String(row.assigned_officer_name),
    assigned_at: row.assigned_at == null ? null : toIso(row.assigned_at),
    resolution_summary: row.resolution_summary == null ? null : String(row.resolution_summary),
    closed_at: row.closed_at == null ? null : toIso(row.closed_at),
    created_at: toIso(row.created_at), updated_at: toIso(row.updated_at),
  };
}

function mapEvidence(row: Record<string, unknown>): EvidenceItem {
  return {
    id: String(row.id), complaint_id: String(row.complaint_id),
    file_name: String(row.file_name), original_name: String(row.original_name),
    mime_type: String(row.mime_type), size_bytes: Number(row.size_bytes),
    storage_path: String(row.storage_path), sha256_hash: String(row.sha256_hash),
    uploaded_by: row.uploaded_by == null ? undefined : String(row.uploaded_by),
    notes: row.notes == null ? undefined : String(row.notes),
    is_verified: Boolean(row.is_verified), signed_url: row.signed_url == null ? undefined : String(row.signed_url),
    created_at: toIso(row.created_at),
  };
}

function mapStatusHistory(row: Record<string, unknown>): ComplaintStatusHistory {
  return {
    id: String(row.id), complaint_id: String(row.complaint_id),
    previous_status: row.previous_status == null ? undefined : row.previous_status as ComplaintStatus,
    new_status: row.new_status as ComplaintStatus,
    changed_by_name: row.changed_by_name == null ? undefined : String(row.changed_by_name),
    changed_by_id: row.changed_by == null ? undefined : String(row.changed_by),
    change_reason: row.change_reason == null ? undefined : String(row.change_reason),
    is_public: Boolean(row.is_public), created_at: toIso(row.created_at),
  };
}

function mapInternalNote(row: Record<string, unknown>): InternalNote {
  return {
    id: String(row.id), complaint_id: String(row.complaint_id), author_id: String(row.author_id),
    author_name: String(row.author_name || ''),
    author_badge: row.author_badge == null ? undefined : String(row.author_badge),
    note: String(row.note), visibility: row.visibility as NoteVisibility, created_at: toIso(row.created_at),
  };
}

function mapAuditEvent(row: Record<string, unknown>): AuditEvent {
  return {
    id: String(row.id), entity_type: String(row.entity_type), entity_id: String(row.entity_id),
    actor_id: row.actor_id == null ? undefined : String(row.actor_id),
    actor_name: row.actor_name == null ? undefined : String(row.actor_name),
    actor_role: row.actor_role == null ? undefined : row.actor_role as User['role'],
    action: String(row.action),
    old_state: row.old_state as Record<string, unknown> | null | undefined,
    new_state: row.new_state as Record<string, unknown> | null | undefined,
    ip_address: row.ip_address == null ? undefined : String(row.ip_address),
    user_agent: row.user_agent == null ? undefined : String(row.user_agent), created_at: toIso(row.created_at),
  };
}

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), summary: String(row.summary),
    content: String(row.content), category: String(row.category), author_name: String(row.author_name),
    author_role: String(row.author_role), reading_time_minutes: Number(row.reading_time_minutes),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [], is_featured: Boolean(row.is_featured),
    view_count: Number(row.view_count), published_at: toIso(row.published_at), created_at: toIso(row.created_at),
  };
}

function mapCyberStation(row: Record<string, unknown>): CyberStation {
  return {
    id: String(row.id), station_name: String(row.station_name), jurisdiction: String(row.jurisdiction),
    state: String(row.state), address: String(row.address), helpline: String(row.helpline),
    officer_in_charge: row.officer_in_charge == null ? undefined : String(row.officer_in_charge),
    latitude: Number(row.latitude), longitude: Number(row.longitude), is_24_7: Boolean(row.is_24_7),
  };
}

function mapNotification(row: Record<string, unknown>): NotificationItem {
  return {
    id: String(row.id), user_id: String(row.user_id),
    complaint_id: row.complaint_id == null ? undefined : String(row.complaint_id),
    title: String(row.title), message: String(row.message), type: String(row.type),
    is_read: Boolean(row.is_read), created_at: toIso(row.created_at),
  };
}

class DatabaseRepository {
  private store: DatabaseStore;
  private readonly usesPostgres = Boolean(process.env.DATABASE_URL);

  constructor() {
    this.store = this.usesPostgres ? emptyStore() : this.loadData();
  }

  private loadData(): DatabaseStore {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const hasIndianStations = parsed.cyberStations && parsed.cyberStations.some((s: { state?: string }) => s.state === 'Delhi' || s.state === 'Maharashtra');
        return {
          users: parsed.users || [...SEED_USERS],
          complaints: parsed.complaints || [...SEED_COMPLAINTS],
          evidence: parsed.evidence || [...SEED_EVIDENCE],
          statusHistory: parsed.statusHistory || [...SEED_STATUS_HISTORY],
          internalNotes: parsed.internalNotes || [...SEED_INTERNAL_NOTES],
          auditEvents: parsed.auditEvents || [...SEED_AUDIT_EVENTS],
          blogPosts: parsed.blogPosts || [...SEED_BLOG_POSTS],
          cyberStations: hasIndianStations ? parsed.cyberStations : [...SEED_CYBER_STATIONS],
          notifications: parsed.notifications || [],
        };
      }
    } catch (err) {
      console.warn('Could not read existing store file, initializing with seeds:', err);
    }

    const initialStore: DatabaseStore = {
      users: [...SEED_USERS],
      complaints: [...SEED_COMPLAINTS],
      evidence: [...SEED_EVIDENCE],
      statusHistory: [...SEED_STATUS_HISTORY],
      internalNotes: [...SEED_INTERNAL_NOTES],
      auditEvents: [...SEED_AUDIT_EVENTS],
      blogPosts: [...SEED_BLOG_POSTS],
      cyberStations: [...SEED_CYBER_STATIONS],
      notifications: [],
    };
    this.saveData(initialStore);
    return initialStore;
  }

  private saveData(dataToSave?: DatabaseStore): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.store, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not persist database store:', err);
    }
  }

  // Re-reads from disk — used in dev so newly-injected users are found without restart
  private refreshStore(): void {
    if (process.env.NODE_ENV !== 'production') {
      try {
        if (fs.existsSync(DATA_FILE)) {
          const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
          if (parsed.users) this.store.users = parsed.users;
        }
      } catch { /* ignore */ }
    }
  }

  // --- USERS ---
  public async findUserByEmail(email: string): Promise<User | null> {
    if (process.env.DATABASE_URL) {
      const result = await queryPostgres(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
        [email.trim()]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      return row ? this.mapPostgresUser(row) : null;
    }

    this.refreshStore();
    const user = this.store.users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    return user || null;
  }

  public async findUserById(id: string): Promise<User | null> {
    if (process.env.DATABASE_URL) {
      const result = await queryPostgres('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      return row ? this.mapPostgresUser(row) : null;
    }

    this.refreshStore();
    const user = this.store.users.find((u) => u.id === id);
    return user || null;
  }

  public async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    if (process.env.DATABASE_URL) {
      const result = await queryPostgres(
        `INSERT INTO users (
          email, password_hash, full_name, phone, role, badge_number, department,
          is_active, mfa_enabled
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          userData.email.trim().toLowerCase(),
          userData.password_hash,
          userData.full_name,
          userData.phone || null,
          userData.role,
          userData.badge_number || null,
          userData.department || null,
          userData.is_active,
          userData.mfa_enabled ?? false,
        ]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      if (!row) throw new Error('PostgreSQL did not return the created user.');
      return this.mapPostgresUser(row);
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.store.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public async listUsers(): Promise<User[]> {
    if (process.env.DATABASE_URL) {
      const result = await queryPostgres('SELECT * FROM users ORDER BY created_at DESC');
      return (result?.rows || []).map((row) =>
        this.mapPostgresUser(row as Record<string, unknown>)
      );
    }
    return this.store.users;
  }

  public async addNotification(
    item: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>
  ): Promise<NotificationItem> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        `INSERT INTO notifications (user_id, complaint_id, title, message, type)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [item.user_id, item.complaint_id || null, item.title, item.message, item.type]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      if (!row) throw new Error('PostgreSQL did not return the notification.');
      return mapNotification(row);
    }
    const notification: NotificationItem = {
      ...item, id: crypto.randomUUID(), is_read: false, created_at: new Date().toISOString(),
    };
    this.store.notifications.unshift(notification);
    this.saveData();
    return notification;
  }

  public async listNotifications(userId: string): Promise<NotificationItem[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]
      );
      return (result?.rows || []).map((row) => mapNotification(row as Record<string, unknown>));
    }
    return this.store.notifications.filter((item) => item.user_id === userId);
  }

  public async markNotificationRead(id: string, userId: string): Promise<boolean> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      return Boolean(result?.rowCount);
    }
    const item = this.store.notifications.find((notification) => notification.id === id && notification.user_id === userId);
    if (!item) return false;
    item.is_read = true;
    this.saveData();
    return true;
  }

  private mapPostgresUser(row: Record<string, unknown>): User {
    return {
      id: String(row.id),
      email: String(row.email),
      password_hash: String(row.password_hash),
      full_name: String(row.full_name),
      phone: row.phone == null ? undefined : String(row.phone),
      role: row.role as User['role'],
      badge_number: row.badge_number == null ? undefined : String(row.badge_number),
      department: row.department == null ? undefined : String(row.department),
      is_active: Boolean(row.is_active),
      mfa_enabled: Boolean(row.mfa_enabled),
      created_at: new Date(String(row.created_at)).toISOString(),
      updated_at: new Date(String(row.updated_at)).toISOString(),
    };
  }

  // --- COMPLAINTS ---
  public async getComplaintById(id: string): Promise<Complaint | null> {
    if (this.usesPostgres) {
      const result = await queryPostgres('SELECT * FROM complaints WHERE id = $1', [id]);
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      return row ? mapComplaint(row) : null;
    }
    const complaint = this.store.complaints.find((c) => c.id === id);
    return complaint || null;
  }

  public async getComplaintByReference(refId: string): Promise<Complaint | null> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT * FROM complaints WHERE UPPER(reference_id) = UPPER($1) LIMIT 1', [refId.trim()]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      return row ? mapComplaint(row) : null;
    }
    const complaint = this.store.complaints.find(
      (c) => c.reference_id.toUpperCase().trim() === refId.toUpperCase().trim()
    );
    return complaint || null;
  }

  public async listComplaints(params?: {
    userId?: string;
    status?: string;
    priority?: string;
    incidentType?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ complaints: Complaint[]; total: number }> {
    if (this.usesPostgres) {
      const clauses: string[] = [];
      const values: unknown[] = [];
      const add = (clause: (index: number) => string, value: unknown) => {
        values.push(value);
        clauses.push(clause(values.length));
      };
      if (params?.userId) add((i) => `user_id = $${i}`, params.userId);
      if (params?.status && params.status !== 'ALL') add((i) => `status = $${i}`, params.status);
      if (params?.priority && params.priority !== 'ALL') add((i) => `priority = $${i}`, params.priority);
      if (params?.incidentType && params.incidentType !== 'ALL') {
        add((i) => `incident_type ILIKE $${i}`, `%${params.incidentType}%`);
      }
      if (params?.search?.trim()) {
        add((i) => `(reference_id ILIKE $${i} OR victim_name ILIKE $${i} OR victim_email ILIKE $${i} OR description ILIKE $${i} OR platform_service ILIKE $${i} OR suspect_contact ILIKE $${i})`, `%${params.search.trim()}%`);
      }
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const count = await queryPostgres(`SELECT COUNT(*)::int AS total FROM complaints ${where}`, values);
      const limit = Math.min(Math.max(params?.limit ?? 50, 1), 200);
      const offset = Math.max(params?.offset ?? 0, 0);
      const pageValues = [...values, limit, offset];
      const result = await queryPostgres(
        `SELECT * FROM complaints ${where} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        pageValues
      );
      return {
        complaints: (result?.rows || []).map((row) => mapComplaint(row as Record<string, unknown>)),
        total: Number(count?.rows[0]?.total || 0),
      };
    }

    let result = [...this.store.complaints];

    if (params?.userId) {
      result = result.filter((c) => c.user_id === params.userId);
    }

    if (params?.status && params.status !== 'ALL') {
      result = result.filter((c) => c.status === params.status);
    }

    if (params?.priority && params.priority !== 'ALL') {
      result = result.filter((c) => c.priority === params.priority);
    }

    if (params?.incidentType && params.incidentType !== 'ALL') {
      result = result.filter((c) =>
        c.incident_type.toLowerCase().includes(params.incidentType!.toLowerCase())
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.reference_id.toLowerCase().includes(q) ||
          c.victim_name.toLowerCase().includes(q) ||
          c.victim_email.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.platform_service.toLowerCase().includes(q) ||
          (c.suspect_contact && c.suspect_contact.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const total = result.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    const paged = result.slice(offset, offset + limit);

    return { complaints: paged, total };
  }

  public async createComplaint(
    complaintData: Omit<Complaint, 'id' | 'reference_id' | 'status' | 'created_at' | 'updated_at'> & {
      raw_pin: string;
      pin_hash: string;
    }
  ): Promise<Complaint> {
    if (this.usesPostgres) {
      const referenceId = `ED-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const id = crypto.randomUUID();
      return withPostgresTransaction(async (client) => {
        const inserted = await client.query(
          `INSERT INTO complaints (
            id, reference_id, user_id, tracking_pin_hash, incident_type, incident_date,
            platform_service, description, financial_loss, currency, suspect_contact,
            suspect_identifier, victim_name, victim_email, victim_phone, victim_state,
            victim_city, is_anonymous, status, priority
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'SUBMITTED',$19)
          RETURNING *`,
          [
            id, referenceId, complaintData.user_id || null, complaintData.pin_hash,
            complaintData.incident_type, complaintData.incident_date, complaintData.platform_service,
            complaintData.description, complaintData.financial_loss || 0, complaintData.currency || 'USD',
            complaintData.suspect_contact || null, complaintData.suspect_identifier || null,
            complaintData.victim_name, complaintData.victim_email, complaintData.victim_phone,
            complaintData.victim_state || null, complaintData.victim_city || null,
            Boolean(complaintData.is_anonymous), complaintData.priority || 'MEDIUM',
          ]
        );
        const complaint = mapComplaint(inserted.rows[0] as Record<string, unknown>);
        await client.query(
          `INSERT INTO complaint_status_history
            (complaint_id, new_status, changed_by_name, change_reason, is_public)
           VALUES ($1, 'SUBMITTED', $2, $3, TRUE)`,
          [id, complaintData.is_anonymous ? 'Anonymous Citizen' : complaintData.victim_name,
            'Digital incident complaint submitted via secure portal.']
        );
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_name, action, new_state)
           VALUES ('COMPLAINT', $1, $2, 'COMPLAINT_SUBMITTED', $3::jsonb)`,
          [id, complaintData.victim_name, JSON.stringify({
            reference_id: referenceId, status: 'SUBMITTED', priority: complaint.priority,
          })]
        );
        return complaint;
      });
    }

    const dateStr = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const reference_id = `ED-${dateStr}-${randomSuffix}`;

    const newComplaint: Complaint = {
      id: crypto.randomUUID(),
      reference_id,
      user_id: complaintData.user_id || null,
      tracking_pin_hash: complaintData.pin_hash,
      raw_pin: complaintData.raw_pin,
      incident_type: complaintData.incident_type,
      incident_date: complaintData.incident_date,
      platform_service: complaintData.platform_service,
      description: complaintData.description,
      financial_loss: complaintData.financial_loss || 0,
      currency: complaintData.currency || 'USD',
      suspect_contact: complaintData.suspect_contact,
      suspect_identifier: complaintData.suspect_identifier,
      victim_name: complaintData.victim_name,
      victim_email: complaintData.victim_email,
      victim_phone: complaintData.victim_phone,
      victim_state: complaintData.victim_state,
      victim_city: complaintData.victim_city,
      is_anonymous: Boolean(complaintData.is_anonymous),
      status: 'SUBMITTED',
      priority: complaintData.priority || 'MEDIUM',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.store.complaints.unshift(newComplaint);

    // Record initial status history
    const initialHistory: ComplaintStatusHistory = {
      id: crypto.randomUUID(),
      complaint_id: newComplaint.id,
      new_status: 'SUBMITTED',
      changed_by_name: complaintData.is_anonymous ? 'Anonymous Citizen' : complaintData.victim_name,
      change_reason: 'Digital incident complaint submitted via secure portal.',
      is_public: true,
      created_at: new Date().toISOString(),
    };
    this.store.statusHistory.push(initialHistory);

    // Log audit event
    await this.logAuditEvent({
      entity_type: 'COMPLAINT',
      entity_id: newComplaint.id,
      actor_name: complaintData.victim_name,
      action: 'COMPLAINT_SUBMITTED',
      new_state: {
        reference_id,
        status: 'SUBMITTED',
        priority: newComplaint.priority,
      },
    });

    this.saveData();
    return newComplaint;
  }

  public async updateComplaintStatus(params: {
    complaintId: string;
    newStatus: ComplaintStatus;
    changedBy: User;
    reason?: string;
    isPublic?: boolean;
  }): Promise<{ complaint: Complaint; history: ComplaintStatusHistory }> {
    if (this.usesPostgres) {
      return withPostgresTransaction(async (client) => {
        const currentResult = await client.query('SELECT * FROM complaints WHERE id = $1 FOR UPDATE', [params.complaintId]);
        if (!currentResult.rowCount) throw new Error('Complaint not found.');
        const current = mapComplaint(currentResult.rows[0] as Record<string, unknown>);
        const now = new Date().toISOString();
        const closed = params.newStatus === 'RESOLVED' || params.newStatus === 'REJECTED';
        const updatedResult = await client.query(
          `UPDATE complaints SET status = $2,
             closed_at = CASE WHEN $3 THEN $4 ELSE closed_at END,
             resolution_summary = CASE WHEN $5 THEN $6 ELSE resolution_summary END,
             updated_at = $4
           WHERE id = $1 RETURNING *`,
          [params.complaintId, params.newStatus, closed, now, closed && Boolean(params.reason), params.reason || null]
        );
        const complaint = mapComplaint(updatedResult.rows[0] as Record<string, unknown>);
        const historyResult = await client.query(
          `INSERT INTO complaint_status_history
            (complaint_id, previous_status, new_status, changed_by, changed_by_name, change_reason, is_public)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [params.complaintId, current.status, params.newStatus, params.changedBy.id,
            `${params.changedBy.full_name} (${params.changedBy.role})`,
            params.reason || `Status updated to ${params.newStatus}`, params.isPublic ?? true]
        );
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_id, actor_name, actor_role, action, old_state, new_state)
           VALUES ('COMPLAINT',$1,$2,$3,$4,'STATUS_CHANGED',$5::jsonb,$6::jsonb)`,
          [params.complaintId, params.changedBy.id, params.changedBy.full_name, params.changedBy.role,
            JSON.stringify({ status: current.status }),
            JSON.stringify({ status: params.newStatus, reason: params.reason })]
        );
        return { complaint, history: mapStatusHistory(historyResult.rows[0] as Record<string, unknown>) };
      });
    }

    const complaint = await this.getComplaintById(params.complaintId);
    if (!complaint) {
      throw new Error('Complaint not found.');
    }

    const previousStatus = complaint.status;
    complaint.status = params.newStatus;
    complaint.updated_at = new Date().toISOString();

    if (params.newStatus === 'RESOLVED' || params.newStatus === 'REJECTED') {
      complaint.closed_at = new Date().toISOString();
      if (params.reason) {
        complaint.resolution_summary = params.reason;
      }
    }

    const history: ComplaintStatusHistory = {
      id: crypto.randomUUID(),
      complaint_id: complaint.id,
      previous_status: previousStatus,
      new_status: params.newStatus,
      changed_by_name: `${params.changedBy.full_name} (${params.changedBy.role})`,
      changed_by_id: params.changedBy.id,
      change_reason: params.reason || `Status updated to ${params.newStatus}`,
      is_public: params.isPublic !== undefined ? params.isPublic : true,
      created_at: new Date().toISOString(),
    };

    this.store.statusHistory.push(history);

    // Audit
    await this.logAuditEvent({
      entity_type: 'COMPLAINT',
      entity_id: complaint.id,
      actor_id: params.changedBy.id,
      actor_name: params.changedBy.full_name,
      actor_role: params.changedBy.role,
      action: 'STATUS_CHANGED',
      old_state: { status: previousStatus },
      new_state: { status: params.newStatus, reason: params.reason },
    });

    this.saveData();
    return { complaint, history };
  }

  public async assignComplaint(params: {
    complaintId: string;
    assigneeId: string;
    actor: User;
  }): Promise<Complaint> {
    if (this.usesPostgres) {
      return withPostgresTransaction(async (client) => {
        const complaintResult = await client.query('SELECT * FROM complaints WHERE id = $1 FOR UPDATE', [params.complaintId]);
        if (!complaintResult.rowCount) throw new Error('Complaint not found.');
        const current = mapComplaint(complaintResult.rows[0] as Record<string, unknown>);
        const assigneeResult = await client.query('SELECT * FROM users WHERE id = $1', [params.assigneeId]);
        if (!assigneeResult.rowCount) throw new Error('Assignee officer not found.');
        const assignee = this.mapPostgresUser(assigneeResult.rows[0] as Record<string, unknown>);
        const nextStatus = current.status === 'SUBMITTED' || current.status === 'UNDER_REVIEW'
          ? 'ASSIGNED' : current.status;
        const updated = await client.query(
          `UPDATE complaints SET assigned_to = $2, assigned_officer_name = $3,
             assigned_at = CURRENT_TIMESTAMP, status = $4, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1 RETURNING *`,
          [params.complaintId, assignee.id, assignee.full_name, nextStatus]
        );
        const complaint = mapComplaint(updated.rows[0] as Record<string, unknown>);
        await client.query(
          `INSERT INTO complaint_status_history
            (complaint_id, previous_status, new_status, changed_by, changed_by_name, change_reason, is_public)
           VALUES ($1,$2,$3,$4,$5,$6,TRUE)`,
          [params.complaintId, current.status, nextStatus, params.actor.id, params.actor.full_name,
            `Case assigned to ${assignee.full_name} (${assignee.department || 'Cyber Division'})`]
        );
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_id, actor_name, actor_role, action, old_state, new_state)
           VALUES ('COMPLAINT',$1,$2,$3,$4,'CASE_ASSIGNED',$5::jsonb,$6::jsonb)`,
          [params.complaintId, params.actor.id, params.actor.full_name, params.actor.role,
            JSON.stringify({ assigned_to: current.assigned_to }),
            JSON.stringify({ assigned_to: assignee.id, officer: assignee.full_name })]
        );
        return complaint;
      });
    }

    const complaint = await this.getComplaintById(params.complaintId);
    if (!complaint) throw new Error('Complaint not found.');

    const assignee = await this.findUserById(params.assigneeId);
    if (!assignee) throw new Error('Assignee officer not found.');

    const prevAssigned = complaint.assigned_to;
    complaint.assigned_to = assignee.id;
    complaint.assigned_officer_name = assignee.full_name;
    complaint.assigned_at = new Date().toISOString();
    complaint.updated_at = new Date().toISOString();

    if (complaint.status === 'SUBMITTED' || complaint.status === 'UNDER_REVIEW') {
      complaint.status = 'ASSIGNED';
    }

    const history: ComplaintStatusHistory = {
      id: crypto.randomUUID(),
      complaint_id: complaint.id,
      previous_status: prevAssigned ? complaint.status : undefined,
      new_status: complaint.status,
      changed_by_name: params.actor.full_name,
      changed_by_id: params.actor.id,
      change_reason: `Case assigned to ${assignee.full_name} (${assignee.department || 'Cyber Division'})`,
      is_public: true,
      created_at: new Date().toISOString(),
    };
    this.store.statusHistory.push(history);

    await this.logAuditEvent({
      entity_type: 'COMPLAINT',
      entity_id: complaint.id,
      actor_id: params.actor.id,
      actor_name: params.actor.full_name,
      actor_role: params.actor.role,
      action: 'CASE_ASSIGNED',
      old_state: { assigned_to: prevAssigned },
      new_state: { assigned_to: assignee.id, officer: assignee.full_name },
    });

    this.saveData();
    return complaint;
  }

  public async updateComplaintPriority(params: {
    complaintId: string;
    priority: IncidentPriority;
    actor: User;
  }): Promise<Complaint> {
    if (this.usesPostgres) {
      return withPostgresTransaction(async (client) => {
        const currentResult = await client.query('SELECT * FROM complaints WHERE id = $1 FOR UPDATE', [params.complaintId]);
        if (!currentResult.rowCount) throw new Error('Complaint not found.');
        const current = mapComplaint(currentResult.rows[0] as Record<string, unknown>);
        const updated = await client.query(
          'UPDATE complaints SET priority = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
          [params.complaintId, params.priority]
        );
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_id, actor_name, actor_role, action, old_state, new_state)
           VALUES ('COMPLAINT',$1,$2,$3,$4,'PRIORITY_CHANGED',$5::jsonb,$6::jsonb)`,
          [params.complaintId, params.actor.id, params.actor.full_name, params.actor.role,
            JSON.stringify({ priority: current.priority }), JSON.stringify({ priority: params.priority })]
        );
        return mapComplaint(updated.rows[0] as Record<string, unknown>);
      });
    }

    const complaint = await this.getComplaintById(params.complaintId);
    if (!complaint) throw new Error('Complaint not found.');

    const oldPriority = complaint.priority;
    complaint.priority = params.priority;
    complaint.updated_at = new Date().toISOString();

    await this.logAuditEvent({
      entity_type: 'COMPLAINT',
      entity_id: complaint.id,
      actor_id: params.actor.id,
      actor_name: params.actor.full_name,
      actor_role: params.actor.role,
      action: 'PRIORITY_CHANGED',
      old_state: { priority: oldPriority },
      new_state: { priority: params.priority },
    });

    this.saveData();
    return complaint;
  }

  // --- EVIDENCE ---
  public async getEvidenceByComplaintId(complaintId: string): Promise<EvidenceItem[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        `SELECT id, complaint_id, file_name, original_name, mime_type, size_bytes,
          storage_path, sha256_hash, uploaded_by, notes, is_verified, signed_url, created_at
         FROM evidence WHERE complaint_id = $1 ORDER BY created_at ASC`,
        [complaintId]
      );
      return (result?.rows || []).map((row) => mapEvidence(row as Record<string, unknown>));
    }
    return this.store.evidence.filter((e) => e.complaint_id === complaintId);
  }

  public async getEvidenceFile(complaintId: string, evidenceId: string): Promise<{
    file_data: Buffer;
    original_name: string;
    mime_type: string;
  } | null> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT file_data, original_name, mime_type FROM evidence WHERE complaint_id = $1 AND id = $2',
        [complaintId, evidenceId]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      if (!row?.file_data) return null;
      const fileData = row.file_data;
      return {
        file_data: Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData as Uint8Array),
        original_name: String(row.original_name), mime_type: String(row.mime_type),
      };
    }
    const item = this.store.evidence.find((entry) => entry.id === evidenceId && entry.complaint_id === complaintId);
    if (!item?.file_data) return null;
    const stored = item.file_data as unknown as Buffer | { data?: number[] };
    const bytes = Buffer.isBuffer(stored) ? stored : Buffer.from(stored.data || []);
    return { file_data: bytes, original_name: item.original_name, mime_type: item.mime_type };
  }

  public async addEvidence(
    item: Omit<EvidenceItem, 'id' | 'created_at' | 'signed_url'>
  ): Promise<EvidenceItem> {
    const newEvidence: EvidenceItem = {
      ...item,
      id: crypto.randomUUID(),
      signed_url: '',
      created_at: new Date().toISOString(),
    };
    newEvidence.signed_url = `/api/complaints/${item.complaint_id}/evidence?fileId=${newEvidence.id}`;
    if (this.usesPostgres) {
      return withPostgresTransaction(async (client) => {
        const result = await client.query(
          `INSERT INTO evidence (
            id, complaint_id, file_name, original_name, mime_type, size_bytes,
            storage_path, sha256_hash, uploaded_by, notes, is_verified, signed_url, file_data
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          RETURNING id, complaint_id, file_name, original_name, mime_type, size_bytes,
            storage_path, sha256_hash, uploaded_by, notes, is_verified, signed_url, created_at`,
          [newEvidence.id, item.complaint_id, item.file_name, item.original_name, item.mime_type,
            item.size_bytes, item.storage_path, item.sha256_hash, item.uploaded_by || null,
            item.notes || null, item.is_verified, newEvidence.signed_url, item.file_data || null]
        );
        const saved = mapEvidence(result.rows[0] as Record<string, unknown>);
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_name, action, new_state)
           VALUES ('EVIDENCE',$1,'System Vault','EVIDENCE_INGESTED',$2::jsonb)`,
          [saved.id, JSON.stringify({ file_name: item.file_name, size_bytes: item.size_bytes,
            mime_type: item.mime_type, hash: item.sha256_hash })]
        );
        return saved;
      });
    }
    this.store.evidence.push(newEvidence);

    await this.logAuditEvent({
      entity_type: 'EVIDENCE',
      entity_id: newEvidence.id,
      actor_name: 'System Vault',
      action: 'EVIDENCE_INGESTED',
      new_state: {
        file_name: item.file_name,
        size_bytes: item.size_bytes,
        mime_type: item.mime_type,
        hash: item.sha256_hash,
      },
    });

    this.saveData();
    return newEvidence;
  }

  // --- STATUS HISTORY ---
  public async getStatusHistory(complaintId: string, publicOnly = false): Promise<ComplaintStatusHistory[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        `SELECT * FROM complaint_status_history WHERE complaint_id = $1
          ${publicOnly ? 'AND is_public = TRUE' : ''} ORDER BY created_at ASC`,
        [complaintId]
      );
      return (result?.rows || []).map((row) => mapStatusHistory(row as Record<string, unknown>));
    }
    let list = this.store.statusHistory.filter((h) => h.complaint_id === complaintId);
    if (publicOnly) {
      list = list.filter((h) => h.is_public);
    }
    return list.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  // --- INTERNAL NOTES ---
  public async getInternalNotes(complaintId: string): Promise<InternalNote[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT * FROM internal_notes WHERE complaint_id = $1 ORDER BY created_at DESC', [complaintId]
      );
      return (result?.rows || []).map((row) => mapInternalNote(row as Record<string, unknown>));
    }
    return this.store.internalNotes
      .filter((n) => n.complaint_id === complaintId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async addInternalNote(params: {
    complaintId: string;
    author: User;
    note: string;
    visibility?: NoteVisibility;
  }): Promise<InternalNote> {
    if (this.usesPostgres) {
      return withPostgresTransaction(async (client) => {
        const result = await client.query(
          `INSERT INTO internal_notes (complaint_id, author_id, author_name, author_badge, note, visibility)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
          [params.complaintId, params.author.id, params.author.full_name,
            params.author.badge_number || null, params.note, params.visibility || 'INTERNAL']
        );
        const note = mapInternalNote(result.rows[0] as Record<string, unknown>);
        await client.query(
          `INSERT INTO audit_events (entity_type, entity_id, actor_id, actor_name, actor_role, action, new_state)
           VALUES ('INTERNAL_NOTE',$1,$2,$3,$4,'NOTE_ADDED',$5::jsonb)`,
          [note.id, params.author.id, params.author.full_name, params.author.role,
            JSON.stringify({ complaint_id: params.complaintId, visibility: note.visibility })]
        );
        return note;
      });
    }

    const newNote: InternalNote = {
      id: crypto.randomUUID(),
      complaint_id: params.complaintId,
      author_id: params.author.id,
      author_name: params.author.full_name,
      author_badge: params.author.badge_number,
      note: params.note,
      visibility: params.visibility || 'INTERNAL',
      created_at: new Date().toISOString(),
    };
    this.store.internalNotes.unshift(newNote);

    await this.logAuditEvent({
      entity_type: 'INTERNAL_NOTE',
      entity_id: newNote.id,
      actor_id: params.author.id,
      actor_name: params.author.full_name,
      actor_role: params.author.role,
      action: 'NOTE_ADDED',
      new_state: { complaint_id: params.complaintId, visibility: newNote.visibility },
    });

    this.saveData();
    return newNote;
  }

  // --- AUDIT EVENTS ---
  public async logAuditEvent(event: Omit<AuditEvent, 'id' | 'created_at'>): Promise<AuditEvent> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        `INSERT INTO audit_events (
          entity_type, entity_id, actor_id, actor_name, actor_role, action,
          old_state, new_state, ip_address, user_agent
        ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10) RETURNING *`,
        [event.entity_type, event.entity_id, event.actor_id || null, event.actor_name || null,
          event.actor_role || null, event.action,
          event.old_state == null ? null : JSON.stringify(event.old_state),
          event.new_state == null ? null : JSON.stringify(event.new_state),
          event.ip_address || null, event.user_agent || null]
      );
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      if (!row) throw new Error('PostgreSQL did not return the audit event.');
      return mapAuditEvent(row);
    }

    const newEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.store.auditEvents.unshift(newEvent);
    // Keep max 2000 events in memory
    if (this.store.auditEvents.length > 2000) {
      this.store.auditEvents = this.store.auditEvents.slice(0, 2000);
    }
    this.saveData();
    return newEvent;
  }

  public async getAuditEventsByEntity(entityType: string, entityId: string): Promise<AuditEvent[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT * FROM audit_events WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
        [entityType, entityId]
      );
      return (result?.rows || []).map((row) => mapAuditEvent(row as Record<string, unknown>));
    }
    return this.store.auditEvents
      .filter((e) => e.entity_type === entityType && e.entity_id === entityId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async listRecentAuditEvents(limit = 50): Promise<AuditEvent[]> {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        'SELECT * FROM audit_events ORDER BY created_at DESC LIMIT $1',
        [Math.min(Math.max(limit, 1), 500)]
      );
      return (result?.rows || []).map((row) => mapAuditEvent(row as Record<string, unknown>));
    }
    return this.store.auditEvents.slice(0, limit);
  }

  // --- BLOG / KNOWLEDGE ---
  public async getBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
    if (this.usesPostgres) {
      await this.ensureKnowledgeSeeds();
      const values: unknown[] = [];
      const clauses: string[] = [];
      if (category && category !== 'ALL') {
        values.push(category);
        clauses.push(`LOWER(category) = LOWER($${values.length})`);
      }
      if (search?.trim()) {
        values.push(`%${search.trim()}%`);
        clauses.push(`(title ILIKE $${values.length} OR summary ILIKE $${values.length} OR content ILIKE $${values.length} OR array_to_string(tags, ' ') ILIKE $${values.length})`);
      }
      const result = await queryPostgres(
        `SELECT * FROM blog_posts ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''} ORDER BY published_at DESC`,
        values
      );
      return (result?.rows || []).map((row) => mapBlogPost(row as Record<string, unknown>));
    }

    let posts = [...this.store.blogPosts];
    if (category && category !== 'ALL') {
      posts = posts.filter(
        (p) => p.category.toLowerCase().trim() === category.toLowerCase().trim()
      );
    }
    if (search) {
      const q = search.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return posts.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }

  public async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (this.usesPostgres) {
      await this.ensureKnowledgeSeeds();
      const result = await queryPostgres('SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1', [slug]);
      const row = result?.rows[0] as Record<string, unknown> | undefined;
      return row ? mapBlogPost(row) : null;
    }
    const post = this.store.blogPosts.find((p) => p.slug === slug);
    return post || null;
  }

  // --- CYBER STATIONS (Radar) ---
  public async getCyberStations(): Promise<CyberStation[]> {
    if (this.usesPostgres) {
      const existing = await queryPostgres('SELECT COUNT(*)::int AS total FROM cyber_stations');
      if (Number(existing?.rows[0]?.total || 0) === 0) {
        for (const station of SEED_CYBER_STATIONS) {
          await queryPostgres(
            `INSERT INTO cyber_stations (
              id, station_name, jurisdiction, state, address, helpline,
              officer_in_charge, latitude, longitude, is_24_7
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
            [station.id, station.station_name, station.jurisdiction, station.state, station.address,
              station.helpline, station.officer_in_charge || null, station.latitude,
              station.longitude, station.is_24_7]
          );
        }
      }
      const result = await queryPostgres('SELECT * FROM cyber_stations ORDER BY state, station_name');
      return (result?.rows || []).map((row) => mapCyberStation(row as Record<string, unknown>));
    }
    return SEED_CYBER_STATIONS;
  }

  private async ensureKnowledgeSeeds(): Promise<void> {
    const existing = await queryPostgres('SELECT COUNT(*)::int AS total FROM blog_posts');
    if (Number(existing?.rows[0]?.total || 0) > 0) return;
    for (const post of SEED_BLOG_POSTS) {
      await queryPostgres(
        `INSERT INTO blog_posts (
          id, slug, title, summary, content, category, author_name, author_role,
          reading_time_minutes, tags, is_featured, view_count, published_at, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (slug) DO NOTHING`,
        [post.id, post.slug, post.title, post.summary, post.content, post.category, post.author_name,
          post.author_role, post.reading_time_minutes, post.tags, post.is_featured, post.view_count,
          post.published_at, post.created_at]
      );
    }
  }

  // --- STATS / METRICS ---
  public async getAuthorityMetrics() {
    if (this.usesPostgres) {
      const result = await queryPostgres(
        `SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'SUBMITTED')::int AS "newComplaints",
          COUNT(*) FILTER (WHERE status = 'UNDER_REVIEW')::int AS "underReview",
          COUNT(*) FILTER (WHERE status = 'ASSIGNED')::int AS assigned,
          COUNT(*) FILTER (WHERE status = 'INVESTIGATION')::int AS investigating,
          COUNT(*) FILTER (WHERE status = 'ACTION_TAKEN')::int AS "actionTaken",
          COUNT(*) FILTER (WHERE status = 'RESOLVED')::int AS resolved,
          COUNT(*) FILTER (WHERE priority = 'CRITICAL')::int AS "criticalPriority",
          COUNT(*) FILTER (WHERE priority = 'HIGH')::int AS "highPriority",
          COALESCE(SUM(financial_loss), 0)::float8 AS "totalFinancialLoss"
         FROM complaints`
      );
      const row = result?.rows[0] || {};
      return {
        total: Number(row.total || 0), newComplaints: Number(row.newComplaints || 0),
        underReview: Number(row.underReview || 0), assigned: Number(row.assigned || 0),
        investigating: Number(row.investigating || 0), actionTaken: Number(row.actionTaken || 0),
        resolved: Number(row.resolved || 0), criticalPriority: Number(row.criticalPriority || 0),
        highPriority: Number(row.highPriority || 0), totalFinancialLoss: Number(row.totalFinancialLoss || 0),
      };
    }

    const complaints = this.store.complaints;
    return {
      total: complaints.length,
      newComplaints: complaints.filter((c) => c.status === 'SUBMITTED').length,
      underReview: complaints.filter((c) => c.status === 'UNDER_REVIEW').length,
      assigned: complaints.filter((c) => c.status === 'ASSIGNED').length,
      investigating: complaints.filter((c) => c.status === 'INVESTIGATION').length,
      actionTaken: complaints.filter((c) => c.status === 'ACTION_TAKEN').length,
      resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
      criticalPriority: complaints.filter((c) => c.priority === 'CRITICAL').length,
      highPriority: complaints.filter((c) => c.priority === 'HIGH').length,
      totalFinancialLoss: complaints.reduce((sum, c) => sum + (c.financial_loss || 0), 0),
    };
  }
}

// Global Singleton for Next.js hot reload safety
const globalForDb = global as unknown as { edsecureDbRepository?: DatabaseRepository };

export const db = globalForDb.edsecureDbRepository || new DatabaseRepository();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.edsecureDbRepository = db;
}
