'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, ShieldCheck, Lock, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function EmergencyActionArea() {
  const gridRef = useScrollReveal('.reveal-on-scroll') as React.RefObject<HTMLDivElement>;
  const actions = [
    {
      title: 'Call 1930 Helpline',
      tag: 'Critical (First 2 Hours)',
      desc: 'Call immediately to freeze fraudulent transfers before money is withdrawn.',
      icon: PhoneCall,
      href: 'tel:1930',
      actionText: 'Call 1930 Now',
      highlightColor: '#EF4444',
      badge: 'Immediate',
      isPhone: true,
    },
    {
      title: 'File an Official Complaint',
      tag: 'Takes 5 Minutes',
      desc: 'Submit fraud details to generate a verified case ID for police and banks.',
      icon: ShieldCheck,
      href: '/report',
      actionText: 'Report Incident',
      highlightColor: '#06B6D4',
      badge: 'Official Filing',
    },
    {
      title: 'Protect Your Accounts',
      tag: 'Simple Checklist',
      desc: 'Quick steps to secure passwords, lock UPI limits, and log out unknown devices.',
      icon: Lock,
      href: '/fraud-prevention',
      actionText: 'Safety Checklist',
      highlightColor: '#F59E0B',
      badge: 'Prevention',
    },
    {
      title: 'Track Your Complaint',
      tag: 'Real-Time Updates',
      desc: 'Check your investigation milestones and cyber-cell status updates.',
      icon: Search,
      href: '/report/track',
      actionText: 'Check Status',
      highlightColor: '#10B981',
      badge: 'Case Status',
    },
  ];

  return (
    <section
      style={{
        padding: 'clamp(2rem, 4vw, 3.25rem) 0',
        backgroundColor: 'rgba(13, 21, 38, 0.4)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Header Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.05em',
              }}
            >
              Immediate Assistance
            </span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)', color: '#F8FAFC', marginTop: '0.2rem' }}>
              What to Do If You&apos;ve Been Scammed
            </h2>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: 'clamp(0.72rem, 1.5vw, 0.825rem)',
              color: '#FCA5A5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle style={{ width: '14px', height: '14px', color: '#EF4444', flexShrink: 0 }} />
            <span>Act fast — freezes work best within 2 hours.</span>
          </div>
        </div>

        {/* 4 Action Cards Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {actions.map((act, idx) => {
            const Icon = act.icon;
            const delayClass = `reveal-delay-${idx + 1}` as const;
            return (
              <div
                key={act.title}
                className={`card reveal-on-scroll ${delayClass}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.65)',
                }}
              >
                {/* Accent line on top */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: act.highlightColor,
                  }}
                />

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${act.highlightColor}15`,
                        border: `1px solid ${act.highlightColor}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: act.highlightColor,
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: act.highlightColor,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${act.highlightColor}15`,
                      }}
                    >
                      {act.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: '#F8FAFC' }}>
                    {act.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {act.desc}
                  </p>
                </div>

                {act.isPhone ? (
                  <a
                    href={act.href}
                    className="btn btn-danger btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.65rem 1rem',
                    }}
                  >
                    <PhoneCall style={{ width: '14px', height: '14px' }} />
                    <span>{act.actionText}</span>
                  </a>
                ) : (
                  <Link
                    href={act.href}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.85rem',
                      padding: '0.65rem 1rem',
                    }}
                  >
                    <span>{act.actionText}</span>
                    <ArrowRight className="btn-arrow-icon" style={{ width: '14px', height: '14px' }} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
