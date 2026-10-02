import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Terms of Service & Evidence Retention',
  description: 'Statutory electronic reporting terms, veracity declarations, and legal responsibilities.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
            <Badge variant="cyan" className="mb-2">
              Legal Framework
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Terms of Service & Statutory Obligations
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Effective Date: October 2, 2026 • Governed under National Cybersecurity Directives.
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
                1. Veracity of Submitted Information
              </h2>
              <p>
                By submitting a complaint or evidence on EdSecure Hub, you declare that all statements of fact and digital artifacts provided are true, authentic, and unmodified to the best of your knowledge. Lodging knowingly fabricated or malicious complaints is a punishable criminal offense under federal penal law.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                2. Legal Admissibility of Digital Evidence
              </h2>
              <p>
                Artifacts uploaded through our guided workflow are stamped with intake timestamps and SHA-256 hashes for submission to competent law enforcement agencies and judicial magistrates. The platform maintains tamper-evident audit logs to verify evidence custody.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                3. Interbank Coordination & Beneficiary Freezes
              </h2>
              <p>
                While EdSecure Hub immediately routes complaint parameters to nodal banking freeze desks, recovery of stolen funds is subject to banking inter-clearing rules and the availability of unwithdrawn balance in beneficiary accounts. Filing a report does not guarantee immediate monetary refund.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                4. Authorized Officer Conduct
              </h2>
              <p>
                Authorized personnel utilizing the Cyber-Cell Ops Console are legally bound by official secrets acts and internal governance protocols. Accessing unauthorized complaint files or leaking victim records results in statutory revocation of credentials and criminal inquiry.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
