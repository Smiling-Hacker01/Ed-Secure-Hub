'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FRAUD_CATALOG, FraudCategory } from '@/lib/fraud-catalog';
import { AlertTriangle, ArrowRight, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function FraudGrid() {
  const [activeCategory, setActiveCategory] = useState<FraudCategory>(FRAUD_CATALOG[0]);

  return (
    <section style={{ padding: 'clamp(2.5rem, 5vw, 5rem) 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto clamp(1.75rem, 3.5vw, 3.5rem)' }}>
          <Badge variant="cyan" className="mb-2">
            Threat Intelligence Directory
          </Badge>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            Understand How Cybercriminals Operate
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Knowledge is your primary line of defense. Explore the operational methods, psychological manipulation tactics, and prevention protocols for prevalent digital threats.
          </p>
        </div>

        {/* Interactive Master-Detail Layout */}
        <div className="fraud-grid-layout">
          {/* Left Category Selector */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            {FRAUD_CATALOG.map((cat) => {
              const isSelected = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '1.1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#F8FAFC' : 'var(--text-secondary)' }}>
                      {cat.name}
                    </span>
                    <Badge variant={cat.severity === 'CRITICAL' ? 'red' : 'amber'}>
                      {cat.severity}
                    </Badge>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {cat.tagline}
                  </span>
                </button>
              );
            })}

            <Link
              href="/fraud-prevention"
              className="btn btn-outline btn-sm"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <span>View Full Prevention Catalog</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* Right Detailed Analysis Card */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2.25rem)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                  Threat Analysis
                </span>
                <h3 style={{ fontSize: '1.65rem', color: '#F8FAFC', marginTop: '0.2rem' }}>
                  {activeCategory.name}
                </h3>
              </div>
              <Badge variant={activeCategory.severity === 'CRITICAL' ? 'red' : 'amber'}>
                {activeCategory.severity} THREAT
              </Badge>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {activeCategory.whatItIs}
            </p>

            {/* Warning Signs & Modus Operandi Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Warning Signs */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <AlertTriangle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#FECACA' }}>
                    Key Warning Signs
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeCategory.warningSigns.map((sign, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#EF4444', fontWeight: 800 }}>•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How Attackers Operate */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ShieldAlert style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#FEF3C7' }}>
                    Modus Operandi (Attack Strategy)
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeCategory.howAttackersOperate.map((op, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#F59E0B', fontWeight: 800 }}>•</span>
                      <span>{op}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dos and Don'ts Two Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Do This */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#A7F3D0' }}>
                    Immediate Protective Actions
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeCategory.whatToDo.map((todo, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                      <span>{todo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid This */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <XCircle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#FECACA' }}>
                    Critical Pitfalls to Avoid
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeCategory.whatToAvoid.map((avoid, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <XCircle style={{ width: '14px', height: '14px', color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                      <span>{avoid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link href={`/report?type=${encodeURIComponent(activeCategory.name)}`} className="btn btn-primary btn-sm">
                <span>Report an incident of this type</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
