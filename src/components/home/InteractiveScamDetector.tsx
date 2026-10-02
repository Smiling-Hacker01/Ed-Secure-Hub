'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface ThreatPattern {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  riskLevel: string;
  color: string;
  triggerSignals: string[];
  protocol: string[];
}

const THREAT_PATTERNS: ThreatPattern[] = [
  {
    id: 'digital-arrest',
    name: 'Fake Police Video Call (Digital Arrest)',
    category: 'Extortion Scam',
    riskScore: 98,
    riskLevel: 'Extreme Scam Risk',
    color: '#EF4444',
    triggerSignals: [
      'Caller claims your Aadhaar or phone is linked to a major criminal case.',
      'Demands you stay on Skype/WhatsApp video call and tells you not to tell family.',
      'Asks you to transfer money to a "Supreme Court verification account".',
    ],
    protocol: [
      'Hang up immediately: Police and judges NEVER conduct trials or make arrests over video calls.',
      'Never transfer money: There is no such thing as a "police verification" bank account.',
      'Call the 1930 helpline right away if you shared bank details or made a transfer.',
    ],
  },
  {
    id: 'upi-collect',
    name: 'Fake UPI QR Code or "Collect Request"',
    category: 'Online Buying & Selling Scam',
    riskScore: 95,
    riskLevel: 'Definite Scam',
    color: '#F59E0B',
    triggerSignals: [
      'Buyer asks you to scan a QR code to "receive" advance payment.',
      'Screen asks for your 4-digit or 6-digit UPI PIN to "accept" money.',
      'Caller claims they mistakenly sent extra money and asks you to pay it back.',
    ],
    protocol: [
      'Remember: You NEVER enter your UPI PIN to receive money. UPI PIN is only for paying out.',
      'Decline any unexpected "Collect Requests" on PhonePe, Google Pay, or Paytm.',
      'Block the caller and report the transaction on EdSecure Hub.',
    ],
  },
  {
    id: 'apk-malware',
    name: 'Electricity / Courier APK File on SMS',
    category: 'Malicious App Scam',
    riskScore: 92,
    riskLevel: 'High Risk Malware',
    color: '#8B5CF6',
    triggerSignals: [
      'Message warns your electricity will be cut off tonight unless you update your bill.',
      'Asks you to download an app ending in ".apk" from WhatsApp or a strange website.',
      'App asks for permission to read your text messages and control your screen.',
    ],
    protocol: [
      'Turn on Airplane Mode immediately to stop the app from sending your OTPs to scammers.',
      'Uninstall the app from Settings, or take the phone to a verified technician.',
      'Change your bank passwords from a different phone or computer right away.',
    ],
  },
  {
    id: 'telegram-job',
    name: 'Work-From-Home "Review & Like" Tasks',
    category: 'Task Investment Scam',
    riskScore: 89,
    riskLevel: 'Known Job Scam',
    color: '#3B82F6',
    triggerSignals: [
      'Promised $50 to $200 a day just for liking YouTube videos or rating hotels.',
      'They give you a small real payout ($10) early on to gain your trust.',
      'Then they demand you deposit $500 or more to unlock "VIP withdrawal".',
    ],
    protocol: [
      'Stop communicating: Real companies never ask you to pay money to get a job.',
      'Do not put in more money: Any balance shown on their fake website cannot be withdrawn.',
      'Take screenshots of chats, payment receipts, and bank account numbers for your police report.',
    ],
  },
];

export function InteractiveScamDetector() {
  const [selectedPattern, setSelectedPattern] = useState<ThreatPattern>(THREAT_PATTERNS[0]);

  const score = selectedPattern.riskScore;
  const radius = 70;
  const arcLength = Math.PI * radius;
  const dashOffset = arcLength - (score / 100) * arcLength;

  return (
    <section style={{ padding: 'clamp(2.5rem, 5vw, 4.25rem) 0', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(1.75rem, 3.5vw, 2.5rem)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.65rem',
            }}
          >
            <HelpCircle style={{ width: '13px', height: '13px' }} />
            <span>Scam Checker</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', color: '#F8FAFC', marginBottom: '0.5rem' }}>
            Not Sure If It’s a Scam? Check Here
          </h2>
          <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 0.975rem)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tap the situation that matches your experience to see if it’s a known fraud tactic and what you should do right now.
          </p>
        </div>

        {/* Friendly Scenario Selector Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'nowrap',
            marginBottom: '2rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none',
          }}
        >
          {THREAT_PATTERNS.map((p) => {
            const isSelected = selectedPattern.id === p.id;
            // Shorter labels for mobile
            const shortLabels: Record<string, string> = {
              'digital-arrest': 'Fake Police Call',
              'upi-collect': 'UPI / QR Scam',
              'apk-malware': 'Malware APK',
              'telegram-job': 'Job Scam',
            };
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPattern(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? `1px solid ${p.color}` : '1px solid var(--border-subtle)',
                  color: isSelected ? '#F8FAFC' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 0 15px ${p.color}20` : 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span>{shortLabels[p.id] || p.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Risk & Steps Dashboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Risk Gauge & Red Flags */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              borderRadius: 'var(--radius-xl)',
              border: `1px solid ${selectedPattern.color}35`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              background: `radial-gradient(circle at 50% 30%, ${selectedPattern.color}12 0%, rgba(13, 21, 38, 0.95) 75%)`,
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: selectedPattern.color }}>
                {selectedPattern.category}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: `${selectedPattern.color}20`,
                  color: selectedPattern.color,
                  fontWeight: 800,
                }}
              >
                {selectedPattern.riskLevel}
              </span>
            </div>

            {/* Radial Speedometer Gauge */}
            <div style={{ position: 'relative', width: '200px', height: '120px', margin: '1rem auto 0.25rem' }}>
              <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path
                  d="M 10 80 A 70 70 0 0 1 150 80"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 80 A 70 70 0 0 1 150 80"
                  fill="none"
                  stroke={selectedPattern.color}
                  strokeWidth="14"
                  strokeDasharray={`${arcLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: selectedPattern.color, lineHeight: 1 }}>
                  {selectedPattern.riskScore}%
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Scam Match Score
                </span>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', width: '100%' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '0.25rem' }}>
                {selectedPattern.name}
              </h3>
            </div>

            {/* Warning Signs Checklist */}
            <div
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(7, 10, 18, 0.6)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Common Warning Signs:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {selectedPattern.triggerSignals.map((sig, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertTriangle style={{ width: '13px', height: '13px', color: selectedPattern.color, flexShrink: 0, marginTop: '2px' }} />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Clear Plain-English Instructions */}
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#10B981' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#10B981', letterSpacing: '0.04em' }}>
                  What You Should Do Right Now
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.25rem' }}>
                Immediate Safety Steps
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {selectedPattern.protocol.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.5, margin: 0 }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href={`/report?type=${encodeURIComponent(selectedPattern.name)}`}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                <ShieldAlert style={{ width: '16px', height: '16px' }} />
                <span>Report This Incident to Authorities</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', padding: '0 0.25rem' }}>
                <span>Free & Confidential Filing</span>
                <Link href="/fraud-prevention" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                  Browse All Scam Types
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
