import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { EmergencyActionArea } from '@/components/home/EmergencyActionArea';
import { StatsBanner } from '@/components/home/StatsBanner';
import { ThreatDistributionChart } from '@/components/home/ThreatDistributionChart';
import { IncidentVolumeGraph } from '@/components/home/IncidentVolumeGraph';
import { InteractiveScamDetector } from '@/components/home/InteractiveScamDetector';
import { IncidentMapSection } from '@/components/home/IncidentMapSection';
import { OperationalFramework } from '@/components/home/OperationalFramework';
import Link from 'next/link';
import { Shield, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero: Human, reassuring guidance + Live case resolution preview */}
        <HeroSection />

        {/* 2. Emergency 4-Step Action Checklist */}
        <EmergencyActionArea />

        {/* 3. Fast Stats & Verified Benchmarks */}
        <StatsBanner />

        {/* 4. Real-time Threat Intelligence & Charts (Simple human language) */}
        <section
          style={{
            padding: 'clamp(2.5rem, 5vw, 4.25rem) 0',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(6, 9, 17, 0.7)',
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(1.75rem, 3.5vw, 2.5rem)' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.05em',
                }}
              >
                Weekly Cyber Crime Trends
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', marginTop: '0.35rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                What Scammers Are Targeting Right Now
              </h2>
              <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 0.975rem)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real-time reports gathered across police cyber cells and banking intake networks to help you stay ahead.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                gap: '1.5rem',
              }}
            >
              <ThreatDistributionChart />
              <IncidentVolumeGraph />
            </div>
          </div>
        </section>

        {/* 5. Interactive Scam Risk Checker (Replaces text-heavy fraud grids) */}
        <InteractiveScamDetector />

        {/* 6. Four-Step Resolution Process */}
        <OperationalFramework />

        {/* 7. Nearby Cyber Crime Police Stations */}
        <IncidentMapSection />

        {/* 8. Lodge Complaint Final Reassuring Callout */}
        <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', position: 'relative' }}>
          <div className="container">
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(2rem, 5vw, 3.25rem) clamp(1.25rem, 4vw, 2.5rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto',
                background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, rgba(13, 21, 38, 0.95) 75%)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                }}
              >
                <ShieldCheck style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
              </div>

              <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.25rem)', marginBottom: '0.75rem', color: '#F8FAFC' }}>
                Need to Report an Online Scam?
              </h2>
              <p
                style={{
                  fontSize: 'clamp(0.925rem, 1.5vw, 1.05rem)',
                  color: 'var(--text-secondary)',
                  maxWidth: '540px',
                  margin: '0 auto 1.75rem',
                  lineHeight: 1.55,
                }}
              >
                Takes under 5 minutes. You will receive an official reference ID and secure 4-digit PIN to check officer progress anytime.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link href="/report" className="btn btn-primary btn-lg" style={{ gap: '0.5rem', padding: '0.8rem 1.5rem', fontSize: '0.925rem' }}>
                  <Shield style={{ width: '17px', height: '17px' }} />
                  <span>File a Complaint</span>
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
                <Link href="/report/track" className="btn btn-secondary btn-lg" style={{ padding: '0.8rem 1.5rem', fontSize: '0.925rem' }}>
                  <span>Track Existing Case</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
