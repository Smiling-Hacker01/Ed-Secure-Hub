import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Shield, Lock, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About EdSecure Hub',
  description: 'National cybersecurity defense initiative and digital crime assistance platform.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.75rem, 3.5vw, 3.5rem)' }}>
            <Badge variant="cyan" className="mb-2">
              National Cyber Defense Initiative
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Defending Citizens & Securing Digital Trust
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              EdSecure Hub was founded to transform the chaotic, intimidating ordeal of digital fraud recovery into a structured, reliable, and legally admissible response framework.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2.5rem)', borderRadius: 'var(--radius-xl)', marginBottom: 'clamp(1.75rem, 3vw, 3rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', color: '#F8FAFC', marginBottom: '1rem' }}>
              The Operational Philosophy: Prevent. Detect. Report. Recover.
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              In modern cyber warfare and financial crime, speed dictates restitution. When victims are subjected to social engineering—such as reverse UPI QR code manipulation, SIM hijacking, or deceptive investment schemes—the first 120 minutes are paramount.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.8 }}>
              Old reporting channels are slow and often get lost between departments. EdSecure Hub makes it fast — your report goes directly to the right cyber-crime officer, and your bank is notified immediately to hold any suspicious transactions.
            </p>
          </div>

          {/* 3 Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
            <div className="card" style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1rem',
                }}
              >
                <Lock style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Chain of Custody
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Every digital artifact submitted is hashed on intake to ensure strict legal admissibility in courtroom proceedings and regulatory audits.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  marginBottom: '1rem',
                }}
              >
                <Shield style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Zero-Trust Privacy
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                We believe reporting harassment or fraud should never jeopardize victim safety. We provide full anonymous reporting with private tracking PINs.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: '1rem',
                }}
              >
                <Users style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Authority Collaboration
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Directly connects to verified cyber-cell commanders, providing case assignment, immutable audit trails, and interbank communications.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/report" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              <span>File an Official Incident Report</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
