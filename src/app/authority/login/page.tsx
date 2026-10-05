'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export default function AuthorityLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        setError('Access denied — this portal is restricted to authorized law enforcement personnel only.');
        setLoading(false);
        return;
      }

      router.push('/authority/dashboard');
    } catch {
      setError('Connection failure. Please verify network access.');
      setLoading(false);
    }
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
        padding: 'clamp(1.5rem, 5vw, 2rem) clamp(1rem, 4vw, 1.5rem)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px', height: '52px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            }}
          >
            <ShieldCheck style={{ width: '26px', height: '26px', color: '#38BDF8' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
            Cyber-Cell Officer Console
          </h1>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            Restricted to authorized law enforcement personnel.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
            <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.84rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Official Email</label>
            <input
              type="email"
              placeholder="officer@department.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', gap: '0.5rem', marginTop: '0.25rem' }}
          >
            <Lock style={{ width: '15px', height: '15px' }} />
            <span>{loading ? 'Authenticating...' : 'Authenticate & Enter Console'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link href="/" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            ← Return to Public Citizen Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
