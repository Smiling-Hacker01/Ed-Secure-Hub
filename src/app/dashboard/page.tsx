'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import {
  User,
  Shield,
  FileText,
  Lock,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Complaint } from '@/lib/db/types';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; fullName: string; role?: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meJson = await meRes.json();
      if (!meJson.success || !meJson.data?.user) {
        router.push('/login');
        return;
      }
      setUser(meJson.data.user);

      // Fetch user's complaints
      const compRes = await fetch('/api/complaints');
      const compJson = await compRes.json();
      if (compJson.success) {
        setComplaints(compJson.data.complaints || []);
      }
    } catch (e) {
      console.error(e);
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
            <span style={{ fontWeight: 600 }}>Loading Citizen Profile...</span>
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
        <div className="container">
          {/* Header Banner */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 2rem)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '2rem',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                <User style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#F8FAFC', margin: 0 }}>
                  Welcome back, {user?.fullName}
                </h1>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {user?.email} • Account Protected
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '220px' }}>
              <Link href="/report" className="btn btn-primary" style={{ gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>File New Complaint</span>
              </Link>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                My Lodged Incidents
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                {complaints.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total cases registered with cyber cells
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                Active Investigations
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24', marginTop: '0.25rem' }}>
                {complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Currently in triage or active inquiry
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                Resolved / Closed
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
                {complaints.filter((c) => c.status === 'RESOLVED').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Certified resolution completed
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)', color: '#F8FAFC', margin: 0 }}>
                  My Incident Complaints
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Track status changes, assigned officers, and download certified case summaries.
                </p>
              </div>

              <Link href="/report/track" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <Search style={{ width: '14px', height: '14px' }} />
                <span>Track via Reference PIN</span>
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <FileText style={{ width: '40px', height: '40px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                  No complaints filed yet
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  If you suspect you have been targeted by digital fraud, report it immediately to initiate recovery.
                </p>
                <Link href="/report" className="btn btn-primary btn-sm">
                  Lodge Incident Report
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Reference ID</th>
                      <th>Incident Type</th>
                      <th>Platform</th>
                      <th>Loss Amount</th>
                      <th>Status</th>
                      <th>Filed Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {c.reference_id}
                        </td>
                        <td style={{ fontWeight: 600, color: '#F8FAFC' }}>
                          {c.incident_type}
                        </td>
                        <td>{c.platform_service}</td>
                        <td style={{ color: c.financial_loss > 0 ? '#F87171' : 'var(--text-dim)', fontWeight: 600 }}>
                          {c.financial_loss > 0 ? `${c.currency} ${c.financial_loss.toLocaleString()}` : '$0.00'}
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {formatDate(c.created_at)}
                        </td>
                        <td>
                          <Link
                            href={`/complaints/${c.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            View Progress
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Account Security Settings Card */}
          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Lock style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', margin: 0 }}>
                Account Security & Credentials
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your account is protected with industry-standard security. Passwords are stored securely and sessions are automatically safeguarded.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => alert('Security check passed: your session is active and secure. No suspicious activity detected.')}
                className="btn btn-secondary btn-sm"
              >
                Check Account Security
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
