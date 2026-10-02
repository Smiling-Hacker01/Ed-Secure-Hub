'use client';

import React from 'react';
import { Shield, Clock, TrendingUp, Landmark } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function StatsBanner() {
  const stats = [
    {
      label: 'Average Review Time',
      value: 'Under 15 Mins',
      desc: 'Quick initial review by intake officers',
      icon: Clock,
      color: '#06B6D4',
      sparkline: 'M0,18 Q15,6 30,12 T60,4',
      badge: 'Fast Response',
    },
    {
      label: 'Stolen Funds Frozen',
      value: '₹42Cr+',
      desc: 'Held in banks before suspects could withdraw',
      icon: TrendingUp,
      color: '#10B981',
      sparkline: 'M0,20 Q20,15 40,8 T60,2',
      badge: 'Interbank Network',
    },
    {
      label: 'Connected Cyber Cells',
      value: '240+ Stations',
      desc: 'Direct links to police precincts nationwide',
      icon: Landmark,
      color: '#38BDF8',
      sparkline: 'M0,16 Q18,12 36,9 T60,4',
      badge: 'All Jurisdictions',
    },
    {
      label: 'Official Public Service',
      value: '100% Free',
      desc: 'Zero charges to file, track, or get help',
      icon: Shield,
      color: '#F59E0B',
      sparkline: 'M0,10 Q20,10 40,10 T60,10',
      badge: 'Citizen Protection',
    },
  ];

  const gridRef = useScrollReveal('.reveal-on-scroll') as React.RefObject<HTMLDivElement>;

  return (
    <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0', backgroundColor: '#060911', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            const delayClass = `reveal-delay-${idx + 1}` as const;
            return (
              <div
                key={s.label}
                className={`reveal-on-scroll ${delayClass}`}
                style={{
                  padding: '1.25rem 1.35rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${s.color}15`,
                      border: `1px solid ${s.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: '18px', height: '18px' }} />
                  </div>

                  {/* Mini visual SVG sparkline */}
                  <div style={{ width: '56px', height: '22px' }}>
                    <svg viewBox="0 0 60 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path
                        d={s.sparkline}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: s.color,
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: `${s.color}15`,
                      }}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
