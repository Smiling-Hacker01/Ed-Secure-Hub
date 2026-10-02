'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ChevronRight, ShieldAlert, Zap } from 'lucide-react';

const ALERTS = [
  { text: 'SPIKE ALERT: Surge in fake electricity bill disconnection APK malware via SMS reported across 14 states.', tag: 'MALWARE' },
  { text: 'HIGH PRIORITY: Digital arrest extortion scam targeting senior citizens using fake Supreme Court & CBI letterheads.', tag: 'EXTORTION' },
  { text: 'UPI ADVISORY: Erroneous credit QR code refund fraud active on online classified marketplaces.', tag: 'BANKING' },
  { text: 'URGENT: Interbank beneficiary freeze rate reaches 82% when filed within the golden 2-hour window.', tag: 'STATISTICS' },
];

export function LiveThreatTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % ALERTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const alert = ALERTS[currentIdx];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(13, 21, 38, 0.9) 50%, rgba(6, 182, 212, 0.15) 100%)',
        borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
        padding: '0.45rem 1rem',
        fontSize: '0.8rem',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 8px #EF4444',
                animation: 'pulse-subtle 1.5s infinite',
              }}
            />
            <span style={{ fontWeight: 800, color: '#FCA5A5', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Live Threat Advisory
            </span>
          </div>

          <span
            style={{
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#FECACA',
              fontSize: '0.65rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {alert.tag}
          </span>

          <span
            key={currentIdx}
            style={{
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'opacity 0.3s ease',
            }}
          >
            {alert.text}
          </span>
        </div>

        <Link
          href="/report"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            color: 'var(--accent-cyan)',
            fontWeight: 600,
            fontSize: '0.75rem',
            flexShrink: 0,
          }}
        >
          <span>Report Incident</span>
          <ChevronRight style={{ width: '13px', height: '13px' }} />
        </Link>
      </div>
    </div>
  );
}
