'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthorityNavbar } from '@/components/layout/AuthorityNavbar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime, formatCurrency, formatBytes } from '@/lib/utils/format';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  User,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  MessageSquare,
  Shield,
  Send,
  Eye,
  Hash,
  Download,
  Activity,
  History,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import { Complaint, EvidenceItem, ComplaintStatusHistory, InternalNote, AuditEvent, ComplaintStatus, IncidentPriority } from '@/lib/db/types';

export default function AuthorityComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timeline, setTimeline] = useState<ComplaintStatusHistory[]>([]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [officers, setOfficers] = useState<{ id: string; fullName: string; badgeNumber?: string; department?: string }[]>([]);
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);

  // Action Modals State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('INVESTIGATION');
  const [statusReason, setStatusReason] = useState('');
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // New Note State
  const [newNoteText, setNewNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'INTERNAL' | 'AUTHORITY_ONLY'>('INTERNAL');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'EVIDENCE' | 'NOTES' | 'AUDIT'>('DETAILS');

  useEffect(() => {
    loadCaseFile();
  }, [id]);

  const loadCaseFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/authority/complaints/${id}`);
      const json = await res.json();

      if (!json.success) {
        if (res.status === 401 || res.status === 403) {
          router.push('/authority/login');
          return;
        }
        setError(json.error?.message || 'Failed to load case dossier.');
        setLoading(false);
        return;
      }

      setComplaint(json.data.complaint);
      setTimeline(json.data.timeline);
      setEvidence(json.data.evidence);
      setInternalNotes(json.data.internalNotes);
      setAuditEvents(json.data.auditEvents);
      setOfficers(json.data.officers);
      setCurrentOfficer(json.data.currentOfficer);
    } catch {
      setError('Connection failure while loading case dossier.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusReason.trim()) {
      setStatusError('A formal operational reason is required for status transitions.');
      return;
    }

    setStatusSubmitting(true);
    setStatusError(null);

    try {
      const res = await fetch(`/api/authority/complaints/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: targetStatus,
          reason: statusReason.trim(),
          isPublic: true,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setStatusError(json.error?.message || 'Status transition rejected.');
        setStatusSubmitting(false);
        return;
      }

      setStatusModalOpen(false);
      setStatusReason('');
      loadCaseFile();
    } catch {
      setStatusError('Network error executing transition.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignee) return;

    setAssignSubmitting(true);
    try {
      const res = await fetch(`/api/authority/complaints/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigneeId: selectedAssignee }),
      });

      const json = await res.json();
      if (json.success) {
        setAssignModalOpen(false);
        loadCaseFile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setNoteSubmitting(true);
    try {
      const res = await fetch(`/api/authority/complaints/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNoteText.trim(),
          visibility: noteVisibility,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNewNoteText('');
        loadCaseFile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNoteSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070A12', color: 'var(--accent-cyan)' }}>
        <RefreshCw style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '0.75rem', fontWeight: 600 }}>Loading Encrypted Case File...</span>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC', padding: '4rem 1.5rem' }}>
        <div className="container-narrow">
          <div className="alert alert-danger">
            <AlertOctagon style={{ width: '20px', height: '20px' }} />
            <span>{error || 'Case file not found.'}</span>
          </div>
          <Link href="/authority/complaints" className="btn btn-secondary">
            ← Return to Case Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC' }}>
      <AuthorityNavbar
        officerName={currentOfficer?.fullName}
        role={currentOfficer?.role}
      />

      <main style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Link
              href="/authority/complaints"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              <ArrowLeft style={{ width: '15px', height: '15px' }} />
              <span>Back to Case Queue</span>
            </Link>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              INTERNAL IDENTIFIER: {complaint.id}
            </span>
          </div>

          {/* Dossier Header Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '2rem',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.8rem', color: '#F8FAFC', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    {complaint.reference_id}
                  </h1>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {complaint.incident_type} • Platform: {complaint.platform_service}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  Lodged: {formatDate(complaint.created_at)} ({formatRelativeTime(complaint.created_at)})
                </div>
              </div>

              {/* Authority Actions Toolbar */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <UserCheck style={{ width: '15px', height: '15px' }} />
                  <span>{complaint.assigned_officer_name ? 'Reassign' : 'Assign Case'}</span>
                </button>

                <button
                  onClick={() => {
                    setStatusModalOpen(true);
                    setTargetStatus(
                      complaint.status === 'SUBMITTED' ? 'UNDER_REVIEW' :
                      complaint.status === 'UNDER_REVIEW' ? 'ASSIGNED' :
                      complaint.status === 'ASSIGNED' ? 'INVESTIGATION' :
                      complaint.status === 'INVESTIGATION' ? 'ACTION_TAKEN' : 'RESOLVED'
                    );
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Activity style={{ width: '15px', height: '15px' }} />
                  <span>Update Case Status</span>
                </button>
              </div>
            </div>

            {/* Assignment & Financial Snapshot strip */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                fontSize: '0.875rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Assigned Authority
                </span>
                <div style={{ fontWeight: 700, color: '#F8FAFC', marginTop: '0.2rem' }}>
                  {complaint.assigned_officer_name || 'Unassigned (In Triage Queue)'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Claimed Financial Loss
                </span>
                <div style={{ fontWeight: 700, color: complaint.financial_loss > 0 ? '#F87171' : '#F8FAFC', marginTop: '0.2rem' }}>
                  {complaint.financial_loss > 0 ? `${complaint.currency} ${complaint.financial_loss.toLocaleString()}` : 'None Reported'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Suspect Contact / Handle
                </span>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                  {complaint.suspect_contact || complaint.suspect_identifier || 'Unknown'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Digital Chain Evidence
                </span>
                <div style={{ fontWeight: 700, color: '#38BDF8', marginTop: '0.2rem' }}>
                  {evidence.length} Ingested File(s)
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-medium)', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('DETAILS')}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'DETAILS' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'DETAILS' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
              }}
            >
              Incident Dossier & Statement
            </button>
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'EVIDENCE' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'EVIDENCE' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
              }}
            >
              Evidence Vault ({evidence.length})
            </button>
            <button
              onClick={() => setActiveTab('NOTES')}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'NOTES' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'NOTES' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
              }}
            >
              Confidential Officer Notes ({internalNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'AUDIT' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'AUDIT' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
              }}
            >
              Audit Trail & Activity Log
            </button>
          </div>

          {/* ================= TAB 1: DETAILS ================= */}
          {activeTab === 'DETAILS' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
              {/* Narrative & Statement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '1rem' }}>
                    Incident Statement of Facts
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {complaint.description}
                  </p>
                </div>

                {/* Suspect Identifiers */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '1rem' }}>
                    Suspect & Platform Technical Coordinates
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Platform / Network
                      </span>
                      <div style={{ color: '#F8FAFC', fontWeight: 600, marginTop: '0.2rem' }}>
                        {complaint.platform_service}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Suspect Contact Channel
                      </span>
                      <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '0.2rem' }}>
                        {complaint.suspect_contact || 'None specified'}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Suspect Identifier / Wallet / Account / Domain
                      </span>
                      <div style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem' }}>
                        {complaint.suspect_identifier || 'None specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Complainant Profile (Unredacted Authority View) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', margin: 0 }}>
                      Complainant Record
                    </h3>
                    {complaint.is_anonymous && (
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 700 }}>
                        ANONYMOUS TO PUBLIC
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Full Legal Name</span>
                      <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem' }}>
                        {complaint.victim_name}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Verified Email</span>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        <a href={`mailto:${complaint.victim_email}`} style={{ color: 'var(--accent-cyan)' }}>
                          {complaint.victim_email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Phone Number</span>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        <a href={`tel:${complaint.victim_phone}`} style={{ color: 'var(--accent-cyan)' }}>
                          {complaint.victim_phone}
                        </a>
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Location / City</span>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {complaint.victim_city ? `${complaint.victim_city}, ${complaint.victim_state || ''}` : 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case Milestones Mini-Timeline */}
                <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#F8FAFC', marginBottom: '1rem' }}>
                    Status Milestones ({timeline.length})
                  </h4>
                  <div className="timeline">
                    {timeline.map((item) => (
                      <div key={item.id} className="timeline-item" style={{ paddingBottom: '1.25rem' }}>
                        <div className="timeline-dot active" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#F8FAFC' }}>
                            {item.new_status}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {formatRelativeTime(item.created_at)} • by {item.changed_by_name || 'System'}
                          </div>
                          {item.change_reason && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                              {item.change_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: EVIDENCE ================= */}
          {activeTab === 'EVIDENCE' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0 }}>
                    Digital Chain of Custody Vault
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                    All items are encrypted and validated with SHA-256 integrity checksums upon upload.
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700 }}>
                  EVIDENCE SEALED
                </span>
              </div>

              {evidence.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No digital evidence files lodged with this complaint.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {evidence.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {item.mime_type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {formatBytes(item.size_bytes)}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                          {item.original_name}
                        </div>
                        {item.notes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                            {item.notes}
                          </div>
                        )}
                        <div
                          style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(7, 10, 18, 0.8)',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-dim)',
                            wordBreak: 'break-all',
                            marginBottom: '1rem',
                          }}
                        >
                          SHA-256: {item.sha256_hash}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => alert(`Simulating secure download for: ${item.original_name} (Hash verified: ${item.sha256_hash.slice(0, 10)}...)`)}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                        >
                          <Download style={{ width: '14px', height: '14px' }} />
                          <span>Download Admissible Copy</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: INTERNAL NOTES ================= */}
          {activeTab === 'NOTES' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              {/* Notes Stream */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>
                  Officer Case Journal ({internalNotes.length})
                </h3>

                {internalNotes.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No confidential notes appended yet. Use the panel on the right to log investigation findings.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {internalNotes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC' }}>
                              {note.author_name}
                            </span>
                            {note.author_badge && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                                ({note.author_badge})
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {formatRelativeTime(note.created_at)}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                          {note.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Note Form */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <h4 style={{ fontSize: '1rem', color: '#F8FAFC', marginBottom: '1rem' }}>
                  Log Confidential Note
                </h4>
                <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Investigation Finding / Lead</label>
                    <textarea
                      rows={5}
                      placeholder="Enter internal details: exchange sub-poena status, beneficiary account freeze, suspect clustering notes..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="form-textarea"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Visibility</label>
                    <select
                      value={noteVisibility}
                      onChange={(e) => setNoteVisibility(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="INTERNAL">Internal Cyber Cell Squad</option>
                      <option value="AUTHORITY_ONLY">Supervisory Clearance Only</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={noteSubmitting || !newNoteText.trim()}
                    className="btn btn-primary"
                    style={{ gap: '0.4rem' }}
                  >
                    <Send style={{ width: '15px', height: '15px' }} />
                    <span>{noteSubmitting ? 'Logging...' : 'Save Note'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 4: AUDIT TRAIL ================= */}
          {activeTab === 'AUDIT' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0 }}>
                    Tamper-Evident System Audit Trail
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                    Immutable historical activity record documenting every change, actor identity, and network signature.
                  </p>
                </div>
                <Lock style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action Executed</th>
                      <th>Actor Identity</th>
                      <th>Role</th>
                      <th>IP Address</th>
                      <th>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditEvents.map((evt) => (
                      <tr key={evt.id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {formatDate(evt.created_at)}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                          {evt.action}
                        </td>
                        <td style={{ color: '#F8FAFC', fontSize: '0.85rem' }}>
                          {evt.actor_name || 'System Auto-Triage'}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {evt.actor_role || 'SYSTEM'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {evt.ip_address || '10.240.x.x'}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {evt.new_state ? JSON.stringify(evt.new_state) : 'State snapshot logged'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL: STATUS TRANSITION ================= */}
      {statusModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Transition Case Status
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Current Status: <strong>{complaint.status}</strong>. Every state change publishes an auditable event and alerts the complainant.
            </p>

            {statusError && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem' }}>
                <span style={{ fontSize: '0.85rem' }}>{statusError}</span>
              </div>
            )}

            <form onSubmit={handleStatusChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">New Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                  className="form-select"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="INVESTIGATION">Investigation Active</option>
                  <option value="ACTION_TAKEN">Action Taken (Freeze / Takedown)</option>
                  <option value="RESOLVED">Resolved / Closed</option>
                  <option value="REJECTED">Rejected / Unsubstantiated</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Official Transition Reason <span className="required">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Verified transaction UTR with beneficiary bank nodal officer. Formal freeze warrant dispatched."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="form-textarea"
                  required
                />
                <span className="form-helper">This summary will be visible on the public tracker for the victim.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusSubmitting}
                  className="btn btn-primary"
                >
                  {statusSubmitting ? 'Recording Transition...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ASSIGN OFFICER ================= */}
      {assignModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Assign Cybercrime Investigator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Select a specialized officer from the active cyber-cell roster.
            </p>

            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Available Officers</label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select an investigator...</option>
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.fullName} ({off.badgeNumber || 'Officer'}) — {off.department || 'Cyber Division'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting || !selectedAssignee}
                  className="btn btn-primary"
                >
                  {assignSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
