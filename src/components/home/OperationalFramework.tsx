'use client';

import React, { useState } from 'react';
import { FileText, KeyRound, Shield, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
  {
    step: '01',
    title: '1. Tell Us What Happened',
    tag: 'Step 1',
    icon: FileText,
    color: '#06B6D4',
    metric: 'Under 5 Mins',
    summary: 'Answer a few simple questions about the scam, what was lost, and attach any screenshots or transaction receipts.',
  },
  {
    step: '02',
    title: '2. Get Your Tracking PIN',
    tag: 'Step 2',
    icon: KeyRound,
    color: '#F59E0B',
    metric: 'Instant Reference ID',
    summary: 'Receive an official case reference and a secure 4-digit PIN so you can check updates anytime without needing a password.',
  },
  {
    step: '03',
    title: '3. Sent to Cyber Officers',
    tag: 'Step 3',
    icon: Shield,
    color: '#EF4444',
    metric: 'Direct Routing',
    summary: 'Your report and verified digital proof are routed directly to authorized police cyber cells in your jurisdiction.',
  },
  {
    step: '04',
    title: '4. Bank Holds & Updates',
    tag: 'Step 4',
    icon: CheckCircle2,
    color: '#10B981',
    metric: 'Account Freezes',
    summary: 'Coordination notices are sent to banks to freeze recipient accounts and assist in reversing unauthorized transactions.',
  },
];

export function OperationalFramework() {
  const [activeStep, setActiveStep] = useState(0);
  const gridRef = useScrollReveal('.reveal-on-scroll') as React.RefObject<HTMLDivElement>;

  return (
    <section
      style={{
        padding: 'clamp(2.5rem, 5vw, 4.25rem) 0',
        backgroundColor: '#070B14',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto clamp(1.75rem, 3.5vw, 2.75rem)' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.05em',
            }}
          >
            How EdSecure Hub Works
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', marginTop: '0.35rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
            From Report to Resolution in 4 Clear Steps
          </h2>
          <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 0.975rem)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            We take the confusion out of reporting cybercrime and make sure your complaint reaches the right hands.
          </p>
        </div>

        {/* 4 Clean Actionable Step Cards */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            const delayClass = `reveal-delay-${idx + 1}` as const;

            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`card reveal-on-scroll ${delayClass}`}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  border: isSelected ? `1px solid ${s.color}` : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(15, 23, 42, 0.85)' : 'rgba(13, 21, 38, 0.5)',
                  boxShadow: isSelected ? `0 0 20px ${s.color}20` : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: s.color,
                  }}
                />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: `${s.color}15`,
                        border: `1px solid ${s.color}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: s.color,
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: `${s.color}15`,
                        color: s.color,
                      }}
                    >
                      {s.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', marginBottom: '0.45rem' }}>
                    {s.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {s.summary}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ color: 'var(--text-dim)' }}>Expected:</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
