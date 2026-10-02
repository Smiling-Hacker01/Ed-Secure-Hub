'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export default function AuthorityLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('officer@cybercell.gov');
  const [password, setPassword] = useState('CyberSecure@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Authentication failed.');
        setLoading(false);
        return;
      }

      if (json.data?.user?.role !== 'AUTHORITY' && json.data?.user?.role !== 'ADMIN') {
        setError('Access Denied: Your account is a public citizen profile, not an authorized cyber-cell credential.');
        setLoading(false);
        return;
      }

      router.push('/authority/dashboard');
    } catch {
      setError('Connection failure. Please verify network access.');
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('CyberSecure@2026');
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05070D',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            }}
          >
            <ShieldCheck style={{ width: '28px', height: '28px', color: '#38BDF8' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
            Cyber-Cell Officer Console
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Restricted to authorized law enforcement and cybercrime investigators.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Official Department Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Officer Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            <Lock style={{ width: '16px', height: '16px' }} />
            <span>{loading ? 'Authenticating Clearance...' : 'Authenticate & Enter Console'}</span>
          </button>
        </form>

        {/* Demo Fast-Switch Buttons */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Demo Credentials
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setDemoAccount('officer@cybercell.gov')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center' }}
            >
              Officer Thorne (CC-4092)
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('admin@edsecure.gov')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center' }}
            >
              Director Vance (DIR-901)
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link href="/" style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            ← Return to Public Citizen Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
