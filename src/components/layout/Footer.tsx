import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#040711',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top subtle cyan accent highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 50%, transparent 100%)',
        }}
      />

      <div className="container" style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1rem clamp(3rem, 6vw, 5rem)' }}>
        {/* Emergency Hotline Alert Strip */}
        <div
          style={{
            padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.75rem)',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.75) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 300px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0,
              }}
            >
              <PhoneCall style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'clamp(0.88rem, 2vw, 0.98rem)', color: '#F8FAFC' }}>
                Victim of Active Online Fraud? Act Within 2 Hours
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.825rem)', color: '#FECACA' }}>
                Call national cyber helpline <strong>1930</strong> immediately to freeze bank & UPI transactions.
              </div>
            </div>
          </div>

          <a
            href="tel:1930"
            className="btn btn-danger btn-sm"
            style={{
              fontWeight: 700,
              padding: '0.65rem 1.3rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <PhoneCall style={{ width: '14px', height: '14px' }} />
            <span>Dial 1930 (Toll Free)</span>
          </a>
        </div>

        {/* Modern Multi-Column Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(1.75rem, 3.5vw, 3rem)',
            marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
          }}
        >
          {/* Brand & Mission Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
                }}
              >
                <Shield style={{ width: '19px', height: '19px', color: '#FFFFFF' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                EdSecure<span style={{ color: 'var(--accent-cyan)' }}>Hub</span>
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              National cyber assistance & incident management platform. Providing citizens with swift fraud reporting, digital evidence preservation, and direct liaison with cyber crime police units.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.35rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34D399',
                  width: 'fit-content',
                }}
              >
                <Lock style={{ width: '12px', height: '12px' }} />
                <span>256-Bit Encrypted Chain of Custody</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  color: '#38BDF8',
                  width: 'fit-content',
                }}
              >
                <ShieldCheck style={{ width: '12px', height: '12px' }} />
                <span>Indian IT Act Compliant Workflow</span>
              </div>
            </div>
          </div>

          {/* Column 1: Citizen Services */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Citizen Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { href: '/report', label: 'File Cybercrime Report' },
                { href: '/report/track', label: 'Track Existing Complaint' },
                { href: '/#safety-radar', label: 'Find Nearest Cyber Cell' },
                { href: '/fraud-prevention', label: 'Fraud Prevention Catalog' },
                { href: '/knowledge/documenting-evidence-for-cyber-cells', label: 'Evidence Preservation Guide' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover-cyan"
                  >
                    <ChevronRight style={{ width: '12px', height: '12px', color: 'var(--accent-cyan)', opacity: 0.7 }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Cyber Intelligence */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Fraud Intelligence
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { href: '/knowledge', label: 'Cyber Awareness Knowledge Base' },
                { href: '/knowledge/instant-payment-upi-fraud-playbook', label: 'UPI & Payment Scams Guide' },
                { href: '/knowledge/anatomy-of-sim-swap-fraud-prevention', label: 'SIM Swap & OTP Hijacking' },
                { href: '/knowledge/fake-customer-support-call-center-tactics', label: 'Fake Call Center Operations' },
                { href: '/security', label: 'Architecture & Security Standard' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover-cyan"
                  >
                    <ChevronRight style={{ width: '12px', height: '12px', color: 'var(--accent-cyan)', opacity: 0.7 }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Authority & Governance */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Authority & Governance
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { href: '/authority/login', label: 'Cyber Police Officer Portal' },
                { href: '/about', label: 'About EdSecure Hub' },
                { href: '/privacy', label: 'Privacy & Data Protection' },
                { href: '/terms', label: 'Evidence Retention Terms' },
                { href: '/contact', label: 'Nodal Officer Directory' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover-cyan"
                  >
                    <ChevronRight style={{ width: '12px', height: '12px', color: 'var(--accent-cyan)', opacity: 0.7 }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Safe-Area clearance */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} EdSecure Hub. All rights reserved.</span>
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span style={{ color: 'var(--text-muted)' }}>National Cyber Safety Initiative</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#38BDF8', fontWeight: 600 }}>Prevent. Detect. Report. Recover.</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-dim)',
              }}
            >
              v2.4.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
