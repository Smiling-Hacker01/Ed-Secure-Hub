'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Lock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('victim@example.com');
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
        setError(json.error?.message || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      if (json.data?.user?.role === 'AUTHORITY' || json.data?.user?.role === 'ADMIN') {
        router.push('/authority/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Connection failure. Please verify your connection.');
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('CyberSecure@2026');
    setError(null);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: 'clamp(1.25rem, 5vw, 2.25rem)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                margin: '0 auto 1rem',
                boxShadow: '0 0 18px rgba(6, 182, 212, 0.35)',
              }}
            >
              <Lock style={{ width: '24px', height: '24px' }} />
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              Sign In to EdSecure
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Access your submitted incident complaints and security dashboard.
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
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
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
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Citizen Login Buttons */}
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '0.75rem', textAlign: 'center' }}>
              Demo Quick-Fill
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillDemo('victim@example.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              >
                David (Victim)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('citizen@example.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              >
                Alicia (Citizen)
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              Register securely
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
