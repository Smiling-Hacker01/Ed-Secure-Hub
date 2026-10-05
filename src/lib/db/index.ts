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

class DatabaseRepository {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadData();
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
    this.refreshStore();
    const user = this.store.users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    return user || null;
  }

  public async findUserById(id: string): Promise<User | null> {
    this.refreshStore();
    const user = this.store.users.find((u) => u.id === id);
    return user || null;
  }

  public async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
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
    return this.store.users;
  }

  // --- COMPLAINTS ---
  public async getComplaintById(id: string): Promise<Complaint | null> {
    const complaint = this.store.complaints.find((c) => c.id === id);
    return complaint || null;
  }

  public async getComplaintByReference(refId: string): Promise<Complaint | null> {
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
    return this.store.evidence.filter((e) => e.complaint_id === complaintId);
  }

  public async addEvidence(
    item: Omit<EvidenceItem, 'id' | 'created_at' | 'signed_url'>
  ): Promise<EvidenceItem> {
    // Generate secure simulated signed temporary URL token
    const token = crypto.randomUUID();
    const newEvidence: EvidenceItem = {
      ...item,
      id: crypto.randomUUID(),
      signed_url: `/api/complaints/${item.complaint_id}/evidence?token=${token}`,
      created_at: new Date().toISOString(),
    };
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
    return this.store.auditEvents
      .filter((e) => e.entity_type === entityType && e.entity_id === entityId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async listRecentAuditEvents(limit = 50): Promise<AuditEvent[]> {
    return this.store.auditEvents.slice(0, limit);
  }

  // --- BLOG / KNOWLEDGE ---
  public async getBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
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
    const post = this.store.blogPosts.find((p) => p.slug === slug);
    return post || null;
  }

  // --- CYBER STATIONS (Radar) ---
  public async getCyberStations(): Promise<CyberStation[]> {
    return SEED_CYBER_STATIONS;
  }

  // --- STATS / METRICS ---
  public async getAuthorityMetrics() {
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
