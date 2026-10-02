'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthorityNavbar } from '@/components/layout/AuthorityNavbar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/format';
import {
  FileText,
  AlertTriangle,
  Clock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Shield,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Complaint } from '@/lib/db/types';

export default function AuthorityDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Check auth
      const meRes = await fetch('/api/auth/me');
      const meJson = await meRes.json();
      if (!meJson.success || !meJson.data?.user) {
        router.push('/authority/login');
        return;
      }
      if (meJson.data.user.role !== 'AUTHORITY' && meJson.data.user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      setUser(meJson.data.user);

      // Fetch complaints & metrics
      const compRes = await fetch('/api/authority/complaints?limit=8');
      const compJson = await compRes.json();
      if (compJson.success) {
        setRecentComplaints(compJson.data.complaints);
        setMetrics(compJson.data.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070A12' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)' }}>
          <RefreshCw style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } }` }} />
          <span style={{ fontWeight: 600 }}>Loading Command Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC' }}>
      <AuthorityNavbar
        officerName={user?.fullName}
        badgeNumber={user?.badgeNumber}
        department={user?.department}
        role={user?.role}
      />

      <main style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) 0 clamp(2.5rem, 4vw, 4rem)' }}>
        <div className="container">
          {/* Dashboard Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cybercrime Directorate Incident Operations
                </span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: '#10B981' }}>Live Triage Stream</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: '#F8FAFC', margin: 0 }}>
                Operations Dashboard
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Refresh Data</span>
              </button>
              <Link href="/authority/complaints" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <FileText style={{ width: '15px', height: '15px' }} />
                <span>View Full Queue ({metrics?.total || 0})</span>
              </Link>
            </div>
          </div>

          {/* Metrics 4-Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* 1. Total Complaints */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Lodged Cases
                </span>
                <FileText style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC' }}>
                {metrics?.total || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Across all state jurisdictions
              </div>
            </div>

            {/* 2. New Intake */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Pending Triage / New
                </span>
                <Clock style={{ width: '18px', height: '18px', color: '#F59E0B' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>
                {metrics?.newComplaints || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Requires intake assessment
              </div>
            </div>

            {/* 3. Under Active Investigation */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #38BDF8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  In Investigation / Action
                </span>
                <Shield style={{ width: '18px', height: '18px', color: '#38BDF8' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8' }}>
                {(metrics?.investigating || 0) + (metrics?.actionTaken || 0) + (metrics?.assigned || 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Assigned to specialized cyber squads
              </div>
            </div>

            {/* 4. Total Financial Exposure */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Financial Fraud Value
                </span>
                <DollarSign style={{ width: '18px', height: '18px', color: '#EF4444' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F87171' }}>
                {formatCurrency(metrics?.totalFinancialLoss || 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Subject to freeze requisitions
              </div>
            </div>
          </div>

          {/* High Priority & Critical Action Watchlist Banner */}
          {metrics?.criticalPriority > 0 && (
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <AlertTriangle style={{ width: '22px', height: '22px', color: 'var(--danger)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                    {metrics.criticalPriority} Critical Priority Incident(s) Flagged for Escalation
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#FECACA' }}>
                    SIM swap takeovers or immediate wire-drain threats requiring immediate carrier freeze.
                  </div>
                </div>
              </div>
              <Link
                href="/authority/complaints?priority=CRITICAL"
                className="btn btn-danger btn-sm"
              >
                Inspect Critical Incidents
              </Link>
            </div>
          )}

          {/* Recent Queue Table */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', margin: 0 }}>
                  Active Complaint Queue
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>
                  Recent digital complaints received through national intake portals.
                </p>
              </div>

              <Link href="/authority/complaints" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <span>Open Full Queue</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Reference ID</th>
                    <th>Incident Type</th>
                    <th>Complainant / Victim</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Squad / Officer</th>
                    <th>Filed</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {c.reference_id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{c.incident_type}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{c.platform_service}</div>
                      </td>
                      <td>
                        <div style={{ color: '#F8FAFC' }}>{c.victim_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          {c.victim_city ? `${c.victim_city}, ${c.victim_state || ''}` : 'Location unlisted'}
                        </div>
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: c.assigned_officer_name ? '#F8FAFC' : 'var(--text-dim)' }}>
                          {c.assigned_officer_name || 'Unassigned (Triage)'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {formatRelativeTime(c.created_at)}
                      </td>
                      <td>
                        <Link
                          href={`/authority/complaints/${c.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Inspect File
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
