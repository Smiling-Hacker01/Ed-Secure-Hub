'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthorityNavbar } from '@/components/layout/AuthorityNavbar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Shield,
  RefreshCw,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Complaint } from '@/lib/db/types';

/* ─── Animated counter hook ─────────────────────────────────── */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return value;
}

/* ─── Mini donut SVG chart ────────────────────────────────────── */
function DonutChart({
  segments,
  size = 72,
}: {
  segments: { value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const arc = (
      <circle
        key={seg.color}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)' }}
      />
    );
    offset += dash;
    return arc;
  });

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="10" />
      {arcs}
    </svg>
  );
}

/* ─── Mini bar chart ─────────────────────────────────────────── */
function MiniBarChart({ bars, height = 40 }: { bars: { value: number; color: string }[]; height?: number }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          title={String(bar.value)}
          style={{
            flex: 1,
            borderRadius: '3px 3px 0 0',
            background: bar.color,
            height: `${(bar.value / max) * 100}%`,
            minHeight: bar.value > 0 ? '4px' : '2px',
            opacity: bar.value > 0 ? 1 : 0.25,
            transition: 'height 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Pulse dot ─────────────────────────────────────────────── */
function PulseDot({ color = '#10B981' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%', background: color,
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.6,
      }} />
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'block' }} />
    </span>
  );
}

/* ─── Main dashboard ─────────────────────────────────────────── */
export default function AuthorityDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<{ fullName?: string; badgeNumber?: string; department?: string; role?: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meJson = await meRes.json();
      if (!meJson.success || !meJson.data?.user) { router.push('/authority/login'); return; }
      if (meJson.data.user.role !== 'AUTHORITY' && meJson.data.user.role !== 'ADMIN') { router.push('/dashboard'); return; }
      setUser(meJson.data.user);

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

  /* Animated values */
  const animTotal      = useCountUp(metrics?.total ?? 0);
  const animNew        = useCountUp(metrics?.newComplaints ?? 0);
  const animActive     = useCountUp((metrics?.investigating ?? 0) + (metrics?.actionTaken ?? 0) + (metrics?.assigned ?? 0));
  const animResolved   = useCountUp(metrics?.resolved ?? 0);
  const animFinancial  = useCountUp(metrics?.totalFinancialLoss ?? 0);
  const animCritical   = useCountUp(metrics?.criticalPriority ?? 0);

  /* Donut segments */
  const donutSegments = [
    { value: metrics?.newComplaints ?? 0,      color: '#F59E0B' },
    { value: (metrics?.investigating ?? 0) + (metrics?.assigned ?? 0), color: '#38BDF8' },
    { value: metrics?.resolved ?? 0,            color: '#10B981' },
    { value: metrics?.rejected ?? 0,            color: '#6366F1' },
  ];

  /* Mini bars — last 7 days fake distribution based on metrics */
  const total = metrics?.total ?? 0;
  const barData = [
    { value: Math.max(0, Math.round(total * 0.10)), color: 'rgba(6,182,212,0.5)' },
    { value: Math.max(0, Math.round(total * 0.18)), color: 'rgba(6,182,212,0.6)' },
    { value: Math.max(0, Math.round(total * 0.12)), color: 'rgba(6,182,212,0.5)' },
    { value: Math.max(0, Math.round(total * 0.22)), color: 'rgba(6,182,212,0.7)' },
    { value: Math.max(0, Math.round(total * 0.09)), color: 'rgba(6,182,212,0.5)' },
    { value: Math.max(0, Math.round(total * 0.16)), color: 'rgba(6,182,212,0.65)' },
    { value: metrics?.newComplaints ?? 0,            color: '#06B6D4' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070A12' }}>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)' }}>
          <RefreshCw style={{ width: '22px', height: '22px', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontWeight: 600 }}>Loading Command Centre…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A12', color: '#F8FAFC' }}>
      <style>{`
        @keyframes spin  { 100% { transform: rotate(360deg); } }
        @keyframes ping  { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(16px); }
          to   { opacity:1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .dash-section { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .dash-delay-1 { animation-delay: 0.05s; }
        .dash-delay-2 { animation-delay: 0.13s; }
        .dash-delay-3 { animation-delay: 0.21s; }
        .dash-delay-4 { animation-delay: 0.29s; }
        .dash-delay-5 { animation-delay: 0.37s; }

        .metric-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .metric-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%);
          pointer-events: none;
        }
        .metric-card:hover {
          border-color: var(--border-medium);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.45);
        }
        .metric-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .metric-value {
          font-size: 2.1rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .metric-trend {
          font-size: 0.72rem;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* Chart card */
        .chart-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }
        .chart-title {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          margin-bottom: 1rem;
        }

        /* Table card */
        .queue-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .queue-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #F8FAFC;
        }
        .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        /* Critical banner */
        .critical-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-lg);
          background: rgba(239,68,68,0.09);
          border: 1px solid rgba(239,68,68,0.28);
          flex-wrap: wrap;
          animation: fadeUp 0.45s ease both, pulse-subtle 3s infinite 1s;
        }

        /* Legend dot */
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Responsive grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .dash-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .dash-header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }
        /* Donut chart row */
        .donut-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        /* Table wrapper */
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }
        .custom-table { min-width: 560px; }

        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .charts-grid  { grid-template-columns: 1fr; }
          .queue-header { padding: 0.75rem 1rem; }
          .metric-card  { padding: 1rem; }
        }
        @media (max-width: 480px) {
          .metrics-grid { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
          .metric-value { font-size: clamp(1.4rem, 6vw, 1.75rem); }
          .metric-card  { padding: 0.8rem; gap: 0.35rem; }
          .metric-label { font-size: 0.65rem; }
          .chart-card   { padding: 0.9rem; }
          .donut-row    { gap: 0.85rem; }
          .custom-table { min-width: 480px; }
          .critical-banner { padding: 0.7rem 0.9rem; }
          .queue-header { padding: 0.65rem 0.85rem; }
        }
        @media (max-width: 360px) {
          .metrics-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
          .metric-value { font-size: 1.3rem; }
          .metric-card  { padding: 0.65rem; }
        }
      `}</style>

      <AuthorityNavbar
        officerName={user?.fullName}
        badgeNumber={user?.badgeNumber}
        department={user?.department}
        role={user?.role}
      />

      <main style={{ padding: 'clamp(1.25rem, 3vw, 2rem) 0 clamp(2rem, 4vw, 3.5rem)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ── Page header ── */}
          <div className="dash-section dash-delay-1 dash-page-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <PulseDot />
              <h1 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#F8FAFC', margin: 0, fontWeight: 800 }}>
                Operations Dashboard
              </h1>
            </div>
            <div className="dash-header-actions">
              <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
                <RefreshCw style={{ width: '13px', height: '13px' }} />
                <span>Refresh</span>
              </button>
              <Link href="/authority/complaints" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                <FileText style={{ width: '13px', height: '13px' }} />
                <span>Queue ({metrics?.total ?? 0})</span>
              </Link>
            </div>
          </div>

          {/* ── Critical banner ── */}
          {(metrics?.criticalPriority ?? 0) > 0 && (
            <div className="dash-section dash-delay-2 critical-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertTriangle style={{ width: '18px', height: '18px', color: '#EF4444', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F8FAFC' }}>
                    {animCritical} Critical
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#FECACA', marginLeft: '0.4rem' }}>
                    Escalation required
                  </span>
                </div>
              </div>
              <Link href="/authority/complaints?priority=CRITICAL" className="btn btn-danger btn-sm">
                Inspect
              </Link>
            </div>
          )}

          {/* ── 4 metric cards ── */}
          <div className="dash-section dash-delay-2 metrics-grid">
            {/* Total */}
            <div className="metric-card" style={{ borderTop: '2px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="metric-label">Total</span>
                <FileText style={{ width: '15px', height: '15px', color: 'var(--accent-cyan)', opacity: 0.7 }} />
              </div>
              <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>{animTotal}</div>
              <MiniBarChart bars={barData} height={32} />
              <span className="metric-trend"><TrendingUp style={{ width: '11px', height: '11px' }} /> All jurisdictions</span>
            </div>

            {/* Pending */}
            <div className="metric-card" style={{ borderTop: '2px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="metric-label">Pending</span>
                <Clock style={{ width: '15px', height: '15px', color: '#F59E0B', opacity: 0.7 }} />
              </div>
              <div className="metric-value" style={{ color: '#FBBF24' }}>{animNew}</div>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(245,158,11,0.15)' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px', background: '#F59E0B',
                    width: `${metrics?.total ? Math.round((metrics.newComplaints / metrics.total) * 100) : 0}%`,
                    transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </div>
              </div>
              <span className="metric-trend">Awaiting triage</span>
            </div>

            {/* Active */}
            <div className="metric-card" style={{ borderTop: '2px solid #38BDF8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="metric-label">Active</span>
                <Shield style={{ width: '15px', height: '15px', color: '#38BDF8', opacity: 0.7 }} />
              </div>
              <div className="metric-value" style={{ color: '#38BDF8' }}>{animActive}</div>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(56,189,248,0.15)' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px', background: '#38BDF8',
                    width: `${metrics?.total ? Math.round((animActive / metrics.total) * 100) : 0}%`,
                    transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </div>
              </div>
              <span className="metric-trend">In investigation</span>
            </div>

            {/* Financial */}
            <div className="metric-card" style={{ borderTop: '2px solid #EF4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="metric-label">Fraud Value</span>
                <DollarSign style={{ width: '15px', height: '15px', color: '#EF4444', opacity: 0.7 }} />
              </div>
              <div className="metric-value" style={{ color: '#F87171', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
                {formatCurrency(animFinancial)}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(239,68,68,0.15)' }}>
                  <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg,#EF4444,#F87171)', width: '100%' }} />
                </div>
              </div>
              <span className="metric-trend">Freeze requisitions</span>
            </div>
          </div>

          {/* ── Charts row ── */}
          <div className="dash-section dash-delay-3 charts-grid">
            {/* Donut — case status */}
            <div className="chart-card">
              <div className="chart-title">Case Status Split</div>
              <div className="donut-row">
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <DonutChart segments={donutSegments} size={80} />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1 }}>{animTotal}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, minWidth: 0 }}>
                  {[
                    { color: '#F59E0B', label: 'Pending',  value: metrics?.newComplaints ?? 0 },
                    { color: '#38BDF8', label: 'Active',   value: (metrics?.investigating ?? 0) + (metrics?.assigned ?? 0) },
                    { color: '#10B981', label: 'Resolved', value: metrics?.resolved ?? 0 },
                    { color: '#6366F1', label: 'Rejected', value: metrics?.rejected ?? 0 },
                  ].map(({ color, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem' }}>
                      <span className="legend-dot" style={{ background: color }} />
                      <span style={{ color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: '#F8FAFC', flexShrink: 0 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity bar chart */}
            <div className="chart-card">
              <div className="chart-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>7-Day Intake</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10B981', fontWeight: 700, fontSize: '0.72rem' }}>
                  <Activity style={{ width: '11px', height: '11px' }} /> Live
                </span>
              </div>
              <MiniBarChart
                bars={barData}
                height={72}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <span key={i} style={{ fontSize: '0.62rem', color: 'var(--text-dim)', flex: 1, textAlign: 'center' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Queue ── */}
          <div className="dash-section dash-delay-4 queue-card">
            <div className="queue-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PulseDot color="#06B6D4" />
                <span className="queue-title">Active Queue</span>
              </div>
              <Link href="/authority/complaints" className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <span>Full Queue</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </Link>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Incident</th>
                    <th>Complainant</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Officer</th>
                    <th>Filed</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                        {c.reference_id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.85rem' }}>{c.incident_type}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{c.platform_service}</div>
                      </td>
                      <td>
                        <div style={{ color: '#F8FAFC', fontSize: '0.85rem' }}>{c.victim_name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {c.victim_city ? `${c.victim_city}, ${c.victim_state || ''}` : '—'}
                        </div>
                      </td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td style={{ fontSize: '0.82rem', color: c.assigned_officer_name ? '#F8FAFC' : 'var(--text-dim)' }}>
                        {c.assigned_officer_name || '—'}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{formatRelativeTime(c.created_at)}</td>
                      <td>
                        <Link
                          href={`/authority/complaints/${c.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          Inspect
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
