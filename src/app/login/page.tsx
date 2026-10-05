'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Lock, AlertCircle, Bot, ChevronRight, UserCheck, AlertTriangle, HelpCircle, X } from 'lucide-react';

/* ─── Guide step types ─────────────────────────────────────── */
type Step = {
  bot: string;
  options?: { label: string; next: string }[];
  action?: 'register-citizen' | 'register-victim' | 'login' | 'report-anon';
};

const GUIDE_STEPS: Record<string, Step> = {
  start: {
    bot: "Hi! I'm your EdSecure guide. Were you directly targeted by cyber fraud or financial crime?",
    options: [
      { label: '✅ Yes — I lost money or was directly targeted', next: 'victim' },
      { label: '🔍 No — I want to report something or stay informed', next: 'citizen' },
      { label: '🔑 I already have an account', next: 'has-account' },
    ],
  },
  victim: {
    bot: "Register as a **Victim**. You get a tracked case file, an assigned investigator, and real-time status updates on your complaint.",
    options: [
      { label: '📋 Register as Victim', next: 'victim-go' },
      { label: '⚡ File anonymously (no account needed)', next: 'anon-report' },
    ],
  },
  'victim-go': {
    bot: "Great! On the registration form, choose **'Victim / Affected Person'** when prompted.",
    action: 'register-victim',
  },
  citizen: {
    bot: "Register as a **Citizen**. Report suspicious activity, submit tips, and monitor public safety alerts without being personally affected.",
    options: [
      { label: '🧑 Register as Citizen', next: 'citizen-go' },
      { label: '⚡ File anonymously (no account needed)', next: 'anon-report' },
    ],
  },
  'citizen-go': {
    bot: "Perfect! Choose **'Citizen / Concerned Individual'** on the registration page.",
    action: 'register-citizen',
  },
  'anon-report': {
    bot: "You can submit without an account. You'll receive a **4-digit PIN** to track your case anonymously at any time.",
    action: 'report-anon',
  },
  'has-account': {
    bot: "Sign in with your registered email and password below. Need help? Contact support.",
    action: 'login',
  },
};

/* ─── AI Guide widget ──────────────────────────────────────── */
function AIGuide() {
  const [step, setStep] = useState('start');
  const [history, setHistory] = useState<string[]>(['start']);
  const current = GUIDE_STEPS[step];

  const go = (next: string) => {
    setStep(next);
    setHistory((h) => [...h, next]);
  };
  const back = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  return (
    <div className="ai-guide-box">
      {/* Header bar */}
      <div className="ai-guide-header">
        <div className="ai-guide-avatar">
          <Bot style={{ width: 13, height: 13, color: '#fff' }} />
        </div>
        <span className="ai-guide-title">Registration Guide</span>
        <span className="ai-guide-badge">AI</span>
      </div>

      {/* Bot bubble */}
      <div className="ai-guide-body">
        <div className="ai-bubble" key={step}>
          {current.bot.split('**').map((part, i) =>
            i % 2 === 1
              ? <strong key={i} style={{ color: '#F8FAFC' }}>{part}</strong>
              : <span key={i}>{part}</span>
          )}
        </div>

        {/* Option buttons */}
        {current.options && (
          <div className="ai-options">
            {current.options.map((opt) => (
              <button key={opt.next} className="ai-option-btn" onClick={() => go(opt.next)}>
                <span>{opt.label}</span>
                <ChevronRight style={{ width: 13, height: 13, flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}

        {/* Action CTAs */}
        {current.action && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {current.action === 'register-victim' && (
              <Link href="/register" className="btn btn-primary btn-sm" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                <UserCheck style={{ width: 14, height: 14 }} /> Register as Victim
              </Link>
            )}
            {current.action === 'register-citizen' && (
              <Link href="/register" className="btn btn-primary btn-sm" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                <UserCheck style={{ width: 14, height: 14 }} /> Register as Citizen
              </Link>
            )}
            {current.action === 'report-anon' && (
              <Link href="/report" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                <AlertTriangle style={{ width: 14, height: 14 }} /> File Anonymous Report
              </Link>
            )}
            {current.action === 'login' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                ↓ Use the sign-in form below.
              </p>
            )}
            <button onClick={back} className="ai-back-btn">← Start over</button>
          </div>
        )}

        {current.options && history.length > 1 && (
          <button onClick={back} className="ai-back-btn" style={{ marginTop: '0.35rem' }}>← Back</button>
        )}
      </div>
    </div>
  );
}

/* ─── Login Page ──────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

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
      setError('Connection failure. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* All scoped responsive styles */}
      <style>{`
        @keyframes fadeUpGuide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }

        .login-main {
          min-height: calc(100vh - 150px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem);
        }
        .login-card {
          width: 100%;
          max-width: 460px;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          padding: clamp(1.25rem, 5vw, 2.25rem);
        }
        .login-icon-wrap {
          width: 48px; height: 48px; border-radius: 10px;
          background: linear-gradient(135deg, #06B6D4 0%, #2563EB 100%);
          display: flex; align-items: center; justify-content: center;
          color: #fff; margin: 0 auto 0.85rem;
          box-shadow: 0 0 18px rgba(6,182,212,0.35);
        }
        .login-heading { font-size: clamp(1.25rem, 4vw, 1.55rem); color: #F8FAFC; margin-bottom: 0.25rem; text-align: center; }
        .login-sub    { font-size: 0.82rem; color: var(--text-muted); margin: 0; text-align: center; }

        /* Guide toggle button */
        .guide-toggle {
          display: flex; align-items: center; gap: 0.45rem;
          width: 100%; padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: clamp(0.72rem, 2.5vw, 0.78rem);
          font-weight: 600; cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: 1.1rem;
        }
        .guide-toggle.open {
          background: rgba(6,182,212,0.08);
          border: 1px solid rgba(6,182,212,0.25);
          color: var(--accent-cyan);
        }
        .guide-toggle.closed {
          background: rgba(15,23,42,0.6);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
        }

        /* AI Guide box */
        .ai-guide-box {
          border: 1px solid rgba(6,182,212,0.22);
          border-radius: var(--radius-lg);
          background: rgba(7,10,18,0.85);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .ai-guide-header {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.55rem 0.85rem;
          background: rgba(6,182,212,0.07);
          border-bottom: 1px solid rgba(6,182,212,0.12);
        }
        .ai-guide-avatar {
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #06B6D4 0%, #2563EB 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ai-guide-title { font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan); }
        .ai-guide-badge {
          margin-left: auto; font-size: 0.58rem; padding: 2px 5px;
          border-radius: 4px; background: rgba(16,185,129,0.15);
          color: #34D399; border: 1px solid rgba(16,185,129,0.3); font-weight: 700;
          letter-spacing: 0.05em;
        }
        .ai-guide-body { padding: clamp(0.65rem, 3vw, 0.9rem); }

        /* Chat bubble */
        .ai-bubble {
          background: rgba(6,182,212,0.06);
          border: 1px solid rgba(6,182,212,0.12);
          border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
          padding: clamp(0.5rem, 2vw, 0.7rem) clamp(0.6rem, 2.5vw, 0.85rem);
          font-size: clamp(0.76rem, 2.5vw, 0.82rem);
          color: #CBD5E1; line-height: 1.55;
          margin-bottom: 0.75rem;
          animation: fadeUpGuide 0.22s ease both;
        }

        /* Option buttons */
        .ai-options { display: flex; flex-direction: column; gap: 0.4rem; }
        .ai-option-btn {
          display: flex; align-items: center; justify-content: space-between;
          padding: clamp(0.4rem, 2vw, 0.55rem) clamp(0.6rem, 2.5vw, 0.8rem);
          border-radius: var(--radius-md);
          background: rgba(15,23,42,0.8);
          border: 1px solid var(--border-medium);
          color: #CBD5E1;
          font-size: clamp(0.72rem, 2.5vw, 0.78rem);
          font-weight: 600; cursor: pointer; text-align: left;
          transition: all 0.15s ease;
          width: 100%;
        }
        .ai-option-btn:hover {
          border-color: rgba(6,182,212,0.4);
          color: #F8FAFC;
          background: rgba(6,182,212,0.06);
        }
        .ai-back-btn {
          background: none; border: none;
          color: var(--text-dim);
          font-size: 0.72rem; cursor: pointer;
          padding: 0.2rem 0; display: block;
          transition: color 0.15s;
        }
        .ai-back-btn:hover { color: var(--text-muted); }

        @media (max-width: 480px) {
          .login-card { border-radius: var(--radius-lg); }
          .ai-guide-box { border-radius: var(--radius-md); }
        }
      `}</style>

      <Navbar />
      <main className="login-main">
        <div className="login-card">
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="login-icon-wrap">
              <Lock style={{ width: 22, height: 22 }} />
            </div>
            <h1 className="login-heading">Sign In to EdSecure</h1>
            <p className="login-sub">Access your incident dashboard</p>
          </div>

          {/* Guide toggle */}
          <button
            onClick={() => setShowGuide((v) => !v)}
            className={`guide-toggle ${showGuide ? 'open' : 'closed'}`}
          >
            <HelpCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>
              {showGuide ? 'Hide guide' : 'Not sure if you need an account?'}
            </span>
            {showGuide && <X style={{ width: 13, height: 13, marginLeft: 'auto' }} />}
          </button>

          {/* AI guide */}
          {showGuide && <AIGuide />}

          {/* Error */}
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.1rem', padding: '0.7rem 0.9rem' }}>
              <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ fontSize: '0.83rem' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                autoComplete="email"
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
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.15rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
