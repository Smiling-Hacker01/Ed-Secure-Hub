import { EventEmitter } from 'events';
import { Complaint, ComplaintStatus, EvidenceItem } from '../db/types';
import { enqueueJob } from '../queue/background-worker';

export type DomainEvent =
  | { type: 'ComplaintSubmitted'; payload: { complaint: Complaint; rawPin: string } }
  | { type: 'ComplaintAssigned'; payload: { complaint: Complaint; officerId: string; officerName: string } }
  | { type: 'ComplaintStatusChanged'; payload: { complaint: Complaint; previousStatus: ComplaintStatus; newStatus: ComplaintStatus; reason?: string } }
  | { type: 'EvidenceUploaded'; payload: { complaintId: string; evidence: EvidenceItem } }
  | { type: 'ComplaintResolved'; payload: { complaint: Complaint; resolutionSummary?: string } }
  | { type: 'NotificationRequested'; payload: { recipient: string; title: string; message: string; channel: 'EMAIL' | 'SMS' | 'IN_APP' } };

class DomainEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(30);
    this.registerCoreSubscribers();
  }

  public publish(event: DomainEvent) {
    console.log(`[EventBus] Publishing domain event: ${event.type}`, {
      timestamp: new Date().toISOString(),
    });
    this.emit(event.type, event.payload);
  }

  private registerCoreSubscribers() {
    // 1. ComplaintSubmitted
    this.on('ComplaintSubmitted', (payload) => {
      // Enqueue async email & notification job
      enqueueJob({
        type: 'SEND_SUBMISSION_CONFIRMATION',
        payload: {
          recipientEmail: payload.complaint.victim_email,
          referenceId: payload.complaint.reference_id,
          rawPin: payload.rawPin,
          incidentType: payload.complaint.incident_type,
        },
      });

      // Enqueue triage scanning
      enqueueJob({
        type: 'TRIAGE_COMPLAINT_RISK',
        payload: { complaintId: payload.complaint.id },
      });
    });

    // 2. ComplaintAssigned
    this.on('ComplaintAssigned', (payload) => {
      enqueueJob({
        type: 'NOTIFY_ASSIGNED_OFFICER',
        payload: {
          officerId: payload.officerId,
          complaintId: payload.complaint.id,
          referenceId: payload.complaint.reference_id,
        },
      });
    });

    // 3. ComplaintStatusChanged
    this.on('ComplaintStatusChanged', (payload) => {
      enqueueJob({
        type: 'SEND_STATUS_UPDATE_ALERT',
        payload: {
          recipientEmail: payload.complaint.victim_email,
          referenceId: payload.complaint.reference_id,
          previousStatus: payload.previousStatus,
          newStatus: payload.newStatus,
          reason: payload.reason,
        },
      });
    });

    // 4. EvidenceUploaded
    this.on('EvidenceUploaded', (payload) => {
      enqueueJob({
        type: 'PROCESS_AND_SCAN_EVIDENCE',
        payload: {
          evidenceId: payload.evidence.id,
          complaintId: payload.complaintId,
          hash: payload.evidence.sha256_hash,
        },
      });
    });

    // 5. ComplaintResolved
    this.on('ComplaintResolved', (payload) => {
      enqueueJob({
        type: 'SEND_CASE_CLOSURE_REPORT',
        payload: {
          complaintId: payload.complaint.id,
          recipientEmail: payload.complaint.victim_email,
          resolution: payload.resolutionSummary,
        },
      });
    });
  }
}

// Global Singleton
const globalForEvents = global as unknown as { edsecureEventBus?: DomainEventBus };
export const eventBus = globalForEvents.edsecureEventBus || new DomainEventBus();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.edsecureEventBus = eventBus;
}
