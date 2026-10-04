'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime, formatCurrency, formatBytes } from '@/lib/utils/format';
import {
  FileText,
  ShieldCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Download,
  PhoneCall,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Complaint, EvidenceItem, ComplaintStatusHistory } from '@/lib/db/types';

export default function UserComplaintDetailPage({
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${id}`);
      const json = await res.json();
      if (!json.success) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        setError(json.error?.message || 'Complaint not found.');
      } else {
        setComplaint(json.data.complaint);
        setTimeline(json.data.timeline || []);
        setEvidence(json.data.evidence || []);
      }
    } catch {
      setError('Connection failure while loading complaint details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)' }}>
            <RefreshCw style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontWeight: 600 }}>Loading Incident Dossier...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !complaint) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 150px)', padding: '3.5rem 0' }}>
          <div className="container-narrow">
            <div className="alert alert-danger">
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              <span>{error || 'Complaint record unavailable.'}</span>
            </div>
            <Link href="/dashboard" className="btn btn-secondary">
              ← Return to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}
            >
              <ArrowLeft style={{ width: '15px', height: '15px' }} />
              <span>Back to My Dashboard</span>
            </Link>
          </div>

          {/* Dossier Header */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                    {complaint.reference_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {complaint.incident_type} • Platform: {complaint.platform_service}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Lodged: {formatDate(complaint.created_at)} ({formatRelativeTime(complaint.created_at)})
                </div>
              </div>

              {complaint.financial_loss > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Reported Loss
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F87171' }}>
                    {complaint.currency} {complaint.financial_loss.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Resolution Alert if resolved */}
            {complaint.status === 'RESOLVED' && complaint.resolution_summary && (
              <div className="alert alert-success" style={{ marginBottom: 0 }}>
                <CheckCircle2 style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <div>
                  <strong>Official Case Closure Notice:</strong> {complaint.resolution_summary}
                </div>
              </div>
            )}
          </div>

          {/* Narrative Statement */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '1rem' }}>
              Incident Summary & Narrative
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
              {complaint.description}
            </p>
          </div>

          {/* Evidence Vault */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '1rem' }}>
              Attached Digital Evidence ({evidence.length})
            </h3>
            {evidence.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No external evidence documents submitted with this incident.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC' }}>
                        {item.original_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        Verified • {formatBytes(item.size_bytes)}
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Simulating safe download: ${item.original_name}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Public Timeline */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>
              Investigation Status Timeline
            </h3>
            <div className="timeline">
              {timeline.map((event, idx) => (
                <div key={event.id || idx} className="timeline-item">
                  <div className={`timeline-dot ${idx === timeline.length - 1 ? 'active' : 'completed'}`} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                        {event.new_status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {formatDate(event.created_at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {event.change_reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
