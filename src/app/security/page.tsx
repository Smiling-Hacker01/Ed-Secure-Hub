import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, KeyRound, Server, Eye, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Security Architecture & Trust Standards',
  description: 'Technical security controls, encryption protocols, and responsible disclosure policies.',
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.75rem, 3.5vw, 3.5rem)' }}>
            <Badge variant="cyan" className="mb-2">
              Platform Architecture & Assurance
            </Badge>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Built With High-Integrity Security Controls
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              As a cybercrime response platform, our technical standards reflect the highest zero-trust guidelines to ensure victim confidentiality and evidentiary integrity.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
            {/* 1. Evidence Ingestion & Cryptographic Chain */}
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <FileCheck style={{ width: '20px', height: '20px' }} />
                </div>
                <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', margin: 0 }}>
                  Cryptographic Evidence Preservation (SHA-256)
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '1rem' }}>
                When users upload screenshots, transaction receipts, or forensic chat exports, the ingestion engine immediately computes a SHA-256 cryptographic digest before persisting files to private encrypted object storage.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span>Prevents retroactive file alteration or evidence tampering.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span>Enforces private access URLs with temporary signed token verification.</span>
                </li>
              </ul>
            </div>

            {/* 2. Authentication & Authorization Gating */}
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <Lock style={{ width: '20px', height: '20px' }} />
                </div>
                <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', margin: 0 }}>
                  Role-Based Server-Side Authorization
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '1rem' }}>
                Authorization is strictly enforced in server-side API middleware rather than client-side routing.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span>Public citizens can only inspect their own lodged complaints.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span>Internal officer notes and investigator communications are permanently scrubbed from public tracking endpoints.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  <span>Authority console requires authenticated credentials with verified badge identifiers.</span>
                </li>
              </ul>
            </div>

            {/* 3. Tamper-Evident Audit Logging */}
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
                  <Server style={{ width: '20px', height: '20px' }} />
                </div>
                <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', margin: 0 }}>
                  Immutable Audit Trails
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.7 }}>
                Every status transition, assignment action, and evidence ingestion operation produces an immutable audit record containing actor identity, role, timestamp, IP address, and differential JSON snapshots. Normal public users cannot alter historical activity.
              </p>
            </div>
          </div>

          {/* Responsible Disclosure */}
          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
              Responsible Vulnerability Disclosure Program
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              We welcome coordinated security research from the global cybersecurity community. If you have identified a vulnerability or security flaw, please report it to our security engineering team directly at <strong>security@edsecure.gov</strong>.
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              We commit to acknowledging reports within 24 hours and never taking legal action against researchers operating in good faith.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
