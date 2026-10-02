'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FRAUD_CATALOG, FraudCategory } from '@/lib/fraud-catalog';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function FraudPreventionPage() {
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(FRAUD_CATALOG[0].id);

  const filtered = FRAUD_CATALOG.filter((cat) => {
    const matchesSeverity = selectedSeverity === 'ALL' || cat.severity === selectedSeverity;
    const matchesSearch =
      search.trim() === '' ||
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.tagline.toLowerCase().includes(search.toLowerCase()) ||
      cat.whatItIs.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(1.5rem, 3vw, 3rem)' }}>
            <Badge variant="cyan" className="mb-2">
              National Threat Prevention Catalog
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Cyber Fraud Prevention & Defense Playbooks
            </h1>
            <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Comprehensive operational blueprints detailing how malicious syndicates execute payment fraud, identity theft, and psychological extortion—and how you can neutralize them.
            </p>
          </div>

          {/* Search & Severity Filter Bar */}
          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto clamp(1.5rem, 3vw, 3rem)',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 260px)' }}>
              <input
                type="text"
                placeholder="Search threat categories, keywords, or deceptive tactics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', height: '46px' }}
              />
              <Search style={{ width: '18px', height: '18px', color: 'var(--text-dim)', position: 'absolute', left: '12px', top: '14px' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: 'auto' }}>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => {
                const isSelected = selectedSeverity === sev;
                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    style={{
                      padding: '0 0.85rem',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-cyan)' : 'var(--bg-card)',
                      color: isSelected ? '#000000' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      flex: '1 1 auto',
                      minWidth: '65px',
                    }}
                  >
                    {sev === 'ALL' ? 'All Threats' : sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Threat Cards Accordion Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '960px', margin: '0 auto' }}>
            {filtered.map((threat) => {
              const isExpanded = expandedId === threat.id;

              return (
                <div
                  key={threat.id}
                  className="glass-panel"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    border: isExpanded ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Card Header (Click to toggle) */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                    style={{
                      padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: threat.severity === 'CRITICAL' ? 'var(--danger-surface)' : 'rgba(6, 182, 212, 0.15)',
                          color: threat.severity === 'CRITICAL' ? 'var(--danger)' : 'var(--accent-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ShieldAlert style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: '#F8FAFC', margin: 0, wordBreak: 'break-word' }}>
                            {threat.name}
                          </h3>
                          <Badge variant={threat.severity === 'CRITICAL' ? 'red' : 'amber'}>
                            {threat.severity}
                          </Badge>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }}>
                          {threat.tagline}
                        </p>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                      {isExpanded ? (
                        <ChevronUp style={{ width: '20px', height: '20px', color: 'var(--accent-cyan)' }} />
                      ) : (
                        <ChevronDown style={{ width: '20px', height: '20px', color: 'var(--text-dim)' }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2rem)',
                        borderTop: '1px solid var(--border-subtle)',
                        backgroundColor: 'rgba(7, 10, 18, 0.7)',
                      }}
                    >
                      <div style={{ marginBottom: '1.75rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                          What It Is
                        </h4>
                        <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                          {threat.whatItIs}
                        </p>
                      </div>

                      {/* 2 Grid: Signs and Attacker Modus Operandi */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {/* Warning Signs */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <AlertTriangle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FECACA', textTransform: 'uppercase' }}>
                              Red Flag Indicators
                            </span>
                          </div>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
                            {threat.warningSigns.map((sign, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                <span style={{ color: '#EF4444', fontWeight: 800 }}>•</span>
                                <span>{sign}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Modus Operandi */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <ShieldAlert style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FEF3C7', textTransform: 'uppercase' }}>
                              How Attackers Operate
                            </span>
                          </div>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
                            {threat.howAttackersOperate.map((op, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                <span style={{ color: '#F59E0B', fontWeight: 800 }}>•</span>
                                <span>{op}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 2 Grid: Dos and Don'ts */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {/* What to do */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#A7F3D0', textTransform: 'uppercase' }}>
                              What Users Should Do
                            </span>
                          </div>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
                            {threat.whatToDo.map((todo, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                                <span>{todo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* What to avoid */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <XCircle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FECACA', textTransform: 'uppercase' }}>
                              What Users Should Avoid
                            </span>
                          </div>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
                            {threat.whatToAvoid.map((avoid, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                <XCircle style={{ width: '14px', height: '14px', color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                                <span>{avoid}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Report action CTA */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/report?type=${encodeURIComponent(threat.name)}`}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.45rem' }}
                        >
                          <ShieldCheck style={{ width: '15px', height: '15px' }} />
                          <span>Report an incident of this type</span>
                          <ArrowRight style={{ width: '14px', height: '14px' }} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
