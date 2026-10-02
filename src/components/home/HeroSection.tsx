'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Search, CheckCircle2, Shield, PhoneCall } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 0 clamp(2rem, 4vw, 3.5rem)',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Clear, Focused Human Guidance */}
          <div>
            {/* Friendly Status Tag */}
            <div
              className="hero-motion-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                color: '#38BDF8',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              <Shield style={{ width: '13px', height: '13px', color: '#06B6D4' }} />
              <span>Official Cyber Crime Assistance Platform</span>
            </div>

            <h1
              className="hero-motion-1"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '0.75rem',
                color: '#F8FAFC',
              }}
            >
              Targeted by an Online Scam? <br />
              <span className="text-gradient-cyan">We're Here to Help.</span>
            </h1>

            <p
              className="hero-motion-2"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: '1.5rem',
                maxWidth: '480px',
              }}
            >
              Report cyber fraud and get prompt assistance with law enforcement, frozen funds, and next steps.
            </p>

            {/* Clear Primary & Secondary CTAs */}
            <div
              className="hero-motion-3"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              <Link
                href="/report"
                className="btn btn-primary btn-lg"
                style={{
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <ShieldCheck style={{ width: '18px', height: '18px' }} />
                <span>Report a Cybercrime</span>
                <ArrowRight className="btn-arrow-icon" style={{ width: '16px', height: '16px' }} />
              </Link>

              <Link
                href="/report/track"
                className="btn btn-secondary btn-lg"
                style={{
                  gap: '0.45rem',
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Search style={{ width: '15px', height: '15px' }} />
                <span>Track Your Complaint</span>
              </Link>
            </div>

            {/* Compact, Subtle Trust Indicator Row */}
            <div
              className="hero-motion-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.6rem, 1.8vw, 1rem)',
                flexWrap: 'wrap',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />
                <span>100% Free</span>
              </div>
              <span style={{ color: 'var(--border-medium)', fontSize: '0.75rem' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />
                <span>Private & Confidential</span>
              </div>
              <span style={{ color: 'var(--border-medium)', fontSize: '0.75rem' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />
                <span>Immediate 1930 Integration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Impact Panel */}
          <div className="hero-motion-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 10, 18, 0.97) 100%)',
              }}
            >
              {/* Panel Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)' }}>
                  Platform Impact
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} /> Live
                </span>
              </div>

              {/* 2×2 stat grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {[
                  { value: '₹42Cr+', label: 'Funds Frozen', color: '#10B981', icon: '🛡️' },
                  { value: '14 min', label: 'Avg. Response', color: '#06B6D4', icon: '⚡' },
                  { value: '240+', label: 'Cyber Cells', color: '#38BDF8', icon: '🏛️' },
                  { value: '100%', label: 'Free Service', color: '#F59E0B', icon: '✓' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: `${stat.color}0D`,
                      border: `1px solid ${stat.color}25`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{stat.icon}</div>
                    <div style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', fontWeight: 800, color: '#F8FAFC', lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 4-step progress visual — clean icons and concise labels */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  What happens after you report
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[
                    { icon: '📋', label: 'Log Complaint', done: true },
                    { icon: '🔑', label: 'Get Case ID', done: true },
                    { icon: '👮', label: 'Cyber Cell', active: true },
                    { icon: '🏦', label: 'Bank Freeze', done: false },
                  ].map((step, i, arr) => (
                    <React.Fragment key={step.label}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: step.done ? '#10B981' : step.active ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.07)',
                          color: step.done ? '#06131f' : step.active ? '#030712' : '#94A3B8',
                          fontWeight: 700,
                          border: step.active ? '2px solid var(--accent-cyan)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: step.done ? '0.9rem' : '1rem',
                          boxShadow: step.active ? '0 0 12px rgba(6,182,212,0.4)' : 'none',
                        }}>
                          {step.done ? '✓' : step.icon}
                        </div>
                        <span style={{ fontSize: '0.62rem', color: step.done ? '#34D399' : step.active ? '#38BDF8' : 'var(--text-dim)', textAlign: 'center', lineHeight: 1.2 }}>
                          {step.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ height: '2px', flex: 0.4, background: i < 1 ? '#10B981' : 'rgba(255,255,255,0.1)', marginBottom: '1.2rem' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Emergency Helpline Strip */}
              <a
                href="tel:1930"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <PhoneCall style={{ width: '15px', height: '15px', color: '#EF4444', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#FECACA', fontWeight: 600 }}>
                    Lost money? Call <strong>1930</strong> — national cyber helpline
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Act within 2 hrs to freeze fraudulent transfers</div>
                </div>
                <ArrowRight style={{ width: '13px', height: '13px', color: '#EF4444', flexShrink: 0 }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
