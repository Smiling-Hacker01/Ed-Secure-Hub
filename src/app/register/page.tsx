'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Registration failed.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Network communication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '480px',
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
                background: 'linear-gradient(135deg, #10B981 0%, #0284C7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                margin: '0 auto 1rem',
                boxShadow: '0 0 18px rgba(16, 185, 129, 0.35)',
              }}
            >
              <ShieldCheck style={{ width: '26px', height: '26px' }} />
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              Create Citizen Account
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Maintain verified complaint records and direct investigator communication.
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
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                placeholder="e.g. David Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                required
              />
            </div>

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
              <label className="form-label">Mobile Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <span className="form-helper">Requires at least 8 characters with numbers and uppercase letters.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Registering Account...' : 'Register Secure Profile'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
