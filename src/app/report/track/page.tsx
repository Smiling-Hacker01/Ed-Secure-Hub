'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime } from '@/lib/utils/format';
import {
  Search,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  status: string;
  update: string;
  timestamp: string;
}

interface TrackingData {
  referenceId: string;
  incidentType: string;
  incidentDate: string;
  platformService: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  resolutionSummary?: string | null;
  timeline: TimelineEvent[];
  nextSteps: string[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [referenceId, setReferenceId] = useState(searchParams.get('ref') || '');
  const [pin, setPin] = useState(searchParams.get('pin') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrackingData | null>(null);

  useEffect(() => {
    const urlRef = searchParams.get('ref');
    const urlPin = searchParams.get('pin');
    if (urlRef && urlPin) {
      executeLookup(urlRef, urlPin);
    }
  }, [searchParams]);

  const executeLookup = async (ref: string, accessPin: string) => {
    if (!ref.trim() || !accessPin.trim()) {
      setError('Please provide both the Complaint Reference ID and your 4-digit PIN.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/complaints/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: ref.trim(), pin: accessPin.trim() }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'No record found with these credentials.');
        setData(null);
      } else {
        setData(json.data);
      }
    } catch {
      setError('Network communication failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(referenceId, pin);
  };

  const ALL_STAGES = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'INVESTIGATION', label: 'Investigation' },
    { key: 'ACTION_TAKEN', label: 'Action Taken' },
    { key: 'RESOLVED', label: 'Resolved / Closed' },
  ];

  const getStageIndex = (status: string) => {
    const idx = ALL_STAGES.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="container-narrow">
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Official Status Inquiry
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#F8FAFC', marginTop: '0.4rem', marginBottom: '0.75rem' }}>
          Track Cybercrime Complaint
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Enter your Reference ID (e.g. ED-2026-84920) and private tracking PIN to monitor live investigation progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2.5rem',
          border: '1px solid var(--border-medium)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Complaint Reference ID</label>
            <input
              type="text"
              placeholder="e.g. ED-2026-84920"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tracking PIN</label>
            <input
              type="password"
              maxLength={8}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ height: '44px', gap: '0.5rem', width: '100%', minHeight: '44px' }}
          >
            <Search style={{ width: '16px', height: '16px' }} />
            <span>{loading ? 'Searching...' : 'Track Case'}</span>
          </button>
        </form>

        {/* Demo Quick Lookup helper */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
          <span>Try sample cases:</span>
          <button
            onClick={() => {
              setReferenceId('ED-2026-84920');
              setPin('8492');
              executeLookup('ED-2026-84920', '8492');
            }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
          >
            ED-2026-84920 (Crypto Arbitrage)
          </button>
          <button
            onClick={() => {
              setReferenceId('ED-2026-31092');
              setPin('3109');
              executeLookup('ED-2026-31092', '3109');
            }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
          >
            ED-2026-31092 (SIM Swap)
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Case Details & Visual Milestone Stepper */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Case Summary Header */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                    {data.referenceId}
                  </span>
                  <StatusBadge status={data.status} />
                  <PriorityBadge priority={data.priority} />
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {data.incidentType} • {data.platformService}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <div>Filed: {formatDate(data.createdAt)}</div>
                <div>Last Status Change: {formatRelativeTime(data.updatedAt)}</div>
              </div>
            </div>

            {/* Visual Multi-Stage Progress Stepper */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ALL_STAGES.length}, 1fr)`, gap: '0.75rem', textAlign: 'center', minWidth: '540px' }}>
                {ALL_STAGES.map((stg, i) => {
                  const currentIdx = getStageIndex(data.status);
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? (isCurrent ? 'var(--accent-cyan)' : '#10B981') : 'var(--bg-tertiary)',
                          border: isDone ? '2px solid #FFFFFF' : '1px solid var(--border-medium)',
                          color: isDone ? '#FFFFFF' : 'var(--text-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          marginBottom: '0.5rem',
                          boxShadow: isCurrent ? '0 0 12px var(--accent-cyan)' : 'none',
                        }}
                      >
                        {isDone && !isCurrent ? <CheckCircle2 style={{ width: '16px', height: '16px' }} /> : i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? 'var(--accent-cyan)' : isDone ? '#F8FAFC' : 'var(--text-dim)',
                        }}
                      >
                        {stg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resolution Alert if resolved */}
          {data.status === 'RESOLVED' && data.resolutionSummary && (
            <div className="alert alert-success">
              <CheckCircle2 style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              <div>
                <strong>Formal Case Resolution:</strong> {data.resolutionSummary}
              </div>
            </div>
          )}

          {/* Timeline of Public Actions */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#F8FAFC' }}>
              Public Investigation Timeline
            </h3>

            <div className="timeline">
              {data.timeline.map((event, idx) => (
                <div key={event.id || idx} className="timeline-item">
                  <div className={`timeline-dot ${idx === data.timeline.length - 1 ? 'active' : 'completed'}`} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                        {event.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {formatDate(event.timestamp)} ({formatRelativeTime(event.timestamp)})
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {event.update}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Actions for Citizen */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 style={{ fontSize: '1rem', color: '#F8FAFC', marginBottom: '0.85rem' }}>
              Guidance for this Phase
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {data.nextSteps.map((step, idx) => (
                <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '3px' }} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: '3.5rem 0' }}>
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading tracking portal...</div>}>
          <TrackContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
