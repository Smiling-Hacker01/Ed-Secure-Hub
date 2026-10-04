'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface ThreatVector {
  id: string;
  name: string;
  share: number;
  color: string;
  weeklyTrend: string;
  avgLoss: string;
  keyRule: string;
}

const THREAT_DATA: ThreatVector[] = [
  { id: 'upi', name: 'Fake UPI & QR Code Scams', share: 38, color: '#06B6D4', weeklyTrend: '+14%', avgLoss: '$1,850', keyRule: 'You NEVER need to enter a UPI PIN to receive money.' },
  { id: 'impersonation', name: 'Fake Police Calls (Digital Arrest)', share: 24, color: '#EF4444', weeklyTrend: '+28%', avgLoss: '$8,400', keyRule: 'Police or CBI will NEVER arrest you or demand funds over video call.' },
  { id: 'phishing', name: 'Bill Disconnection SMS Links', share: 18, color: '#F59E0B', weeklyTrend: '+6%', avgLoss: '$920', keyRule: 'Never install APK files sent on WhatsApp or SMS.' },
  { id: 'crypto', name: 'Fake Work-From-Home Jobs', share: 13, color: '#8B5CF6', weeklyTrend: '-2%', avgLoss: '$4,200', keyRule: 'Any job that asks you to pay money to earn money is a scam.' },
  { id: 'identity', name: 'SIM Swap & OTP Redirection', share: 7, color: '#10B981', weeklyTrend: '+4%', avgLoss: '$1,200', keyRule: 'If your phone loses signal unexpectedly, contact your telecom provider immediately.' },
];

export function ThreatDistributionChart() {
  const [selected, setSelected] = useState<ThreatVector>(THREAT_DATA[0]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="glass-panel"
      style={{
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(7, 10, 18, 0.95) 100%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
              Public Safety Awareness
            </span>
          </div>
          <h3 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', color: '#F8FAFC', marginTop: '0.2rem' }}>
            Most Reported Scams This Week
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.725rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(6, 182, 212, 0.12)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            fontWeight: 600,
          }}
        >
          Updated Today
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        {/* SVG Donut Chart with Center Metric */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', width: '170px', height: '170px' }}>
            <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="18"
              />
              {THREAT_DATA.map((t, index) => {
                const strokeDasharray = `${(t.share / 100) * circumference} ${circumference}`;
                const accumulatedShare = THREAT_DATA.slice(0, index).reduce((total, item) => total + item.share, 0);
                const strokeDashoffset = -((accumulatedShare / 100) * circumference);
                const isSelected = selected.id === t.id;

                return (
                  <circle
                    key={t.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={isSelected ? '22' : '18'}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      filter: isSelected ? `drop-shadow(0 0 8px ${t.color})` : 'none',
                    }}
                    onClick={() => setSelected(t)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Metric */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: selected.color, lineHeight: 1 }}>
                {selected.share}%
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
                of All Reports
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.65rem' }}>
            Tap any scam type to view key warning rules
          </span>
        </div>

        {/* Breakdown List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {THREAT_DATA.map((t) => {
            const isSelected = selected.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                  border: isSelected ? `1px solid ${t.color}60` : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#F8FAFC' : 'var(--text-secondary)' }}>
                      {t.name}
                    </span>
                    <div style={{ width: '100px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.share * 2.5}%`, height: '100%', background: t.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC', minWidth: '32px', textAlign: 'right' }}>
                  {t.share}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scam Tip Box */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(7, 10, 18, 0.7)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}
      >
        <ShieldCheck style={{ width: '18px', height: '18px', color: selected.color, flexShrink: 0, marginTop: '2px' }} />
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selected.color, textTransform: 'uppercase' }}>
            Protection Tip for {selected.name}:
          </span>
          <p style={{ fontSize: '0.825rem', color: '#F8FAFC', margin: '2px 0 0', lineHeight: 1.45 }}>
            {selected.keyRule}
          </p>
        </div>
      </div>
    </div>
  );
}
