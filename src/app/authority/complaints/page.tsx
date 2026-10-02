'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthorityNavbar } from '@/components/layout/AuthorityNavbar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime } from '@/lib/utils/format';
import {
  Search,
  Filter,
  RefreshCw,
  FileText,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Complaint } from '@/lib/db/types';

function ComplaintsQueueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'ALL');
  const [incidentType, setIncidentType] = useState('ALL');

  useEffect(() => {
    loadComplaints();
  }, [status, priority, incidentType]);

  const loadComplaints = async () => {
    setLoading(true);
    try {
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

      // Build query string
      const params = new URLSearchParams();
      if (status !== 'ALL') params.set('status', status);
      if (priority !== 'ALL') params.set('priority', priority);
      if (incidentType !== 'ALL') params.set('incidentType', incidentType);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/authority/complaints?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setComplaints(json.data.complaints);
        setTotal(json.data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadComplaints();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC' }}>
      <AuthorityNavbar
        officerName={user?.fullName}
        badgeNumber={user?.badgeNumber}
        department={user?.department}
        role={user?.role}
      />

      <main style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Law Enforcement Incident Registry
                </span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{total} Matching Records</span>
              </div>
              <h1 style={{ fontSize: '2rem', color: '#F8FAFC', margin: 0 }}>
                Complaint Triage & Case Queue
              </h1>
            </div>

            <button onClick={loadComplaints} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              {/* Search Box */}
              <form onSubmit={handleSearchSubmit} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Search Incidents</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search Reference ID, Complainant, Platform, Suspect info..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Search style={{ width: '16px', height: '16px', color: 'var(--text-dim)', position: 'absolute', left: '12px', top: '14px' }} />
                </div>
              </form>

              {/* Status Filter */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Case Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">Submitted (New)</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="INVESTIGATION">Investigation</option>
                  <option value="ACTION_TAKEN">Action Taken</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Incident Type */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="form-select"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Financial">Financial Fraud</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Identity">Identity Theft / SIM</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Account">Account Takeover</option>
                </select>
              </div>

              {/* Filter Submit */}
              <button
                type="button"
                onClick={loadComplaints}
                className="btn btn-primary"
                style={{ height: '42px', gap: '0.4rem' }}
              >
                <Filter style={{ width: '15px', height: '15px' }} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Loading incident registry...
              </div>
            ) : complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <FileText style={{ width: '36px', height: '36px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                  No complaints match current filters
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try resetting the filter criteria or search keyword to view the complete queue.
                </p>
                <button
                  onClick={() => {
                    setStatus('ALL');
                    setPriority('ALL');
                    setIncidentType('ALL');
                    setSearch('');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Incident Type</th>
                      <th>Complainant</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned Officer</th>
                      <th>Submitted Date</th>
                      <th>Last Update</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {c.reference_id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{c.incident_type}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{c.platform_service}</div>
                        </td>
                        <td>
                          <div style={{ color: '#F8FAFC' }}>
                            {c.is_anonymous ? 'Anonymous Citizen' : c.victim_name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {c.victim_phone}
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
                            {c.assigned_officer_name || 'Unassigned'}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {formatDate(c.created_at)}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {formatRelativeTime(c.updated_at)}
                        </td>
                        <td>
                          <Link
                            href={`/authority/complaints/${c.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            Inspect Dossier
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthorityComplaintsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC', padding: '3rem', textAlign: 'center' }}>Loading queue...</div>}>
      <ComplaintsQueueContent />
    </Suspense>
  );
}
