import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Lock, Shield, Eye, Database, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Data Protection',
  description: 'Evidence confidentiality, PII retention, and privacy-first location transparency policy.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
            <Badge variant="cyan" className="mb-2">
              Statutory Compliance
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Privacy & Data Protection Policy
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Last updated: October 2, 2026 • Enforced across all EdSecure Hub endpoints.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              lineHeight: 1.8,
              fontSize: '1rem',
              color: '#CBD5E1',
            }}
          >
            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                1. Principle of Data Minimization
              </h2>
              <p>
                EdSecure Hub collects exclusively the personal and forensic data strictly necessary to triage, corroborate, and investigate reported cybercrimes. We never sell, monetize, or transmit victim data to commercial third parties or advertising brokers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                2. Location Information & Explicit Consent
              </h2>
              <p>
                We do <strong>not</strong> track your continuous movements or monitor your GPS in the background. The Jurisdictional Safety Radar feature requests explicit one-time browser geolocation access solely to compute distance to the nearest physical cyber police station. You may revoke access or enter your municipality manually at any time.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                3. Evidence Ingestion & Cryptographic Chain of Custody
              </h2>
              <p>
                Digital evidence files uploaded to our private vault are immediately stamped with a SHA-256 integrity hash. Access to raw files is restricted to authorized cyber-cell investigators via temporary signed streaming tokens. Digital files are preserved in compliance with national statutory electronic evidence retention laws.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                4. Anonymous Reporting Protections
              </h2>
              <p>
                Citizens lodging harassment or sensitive whistleblower incident reports may choose the &quot;Submit Anonymously&quot; option. In anonymous mode, personal complainant names are permanently omitted from public-facing records, case summaries, and police FIR metadata.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                5. Data Protection Officer (DPO) Contact
              </h2>
              <p>
                If you wish to request verification, rectification, or deletion of personal data unrelated to an active criminal proceeding, contact our Data Protection Officer at:
                <br />
                <strong style={{ color: 'var(--accent-cyan)' }}>dpo@edsecure.gov</strong>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
