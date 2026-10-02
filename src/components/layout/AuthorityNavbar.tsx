'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ShieldAlert, FileText, BarChart3, LogOut, ExternalLink, UserCheck } from 'lucide-react';

interface AuthorityNavbarProps {
  officerName?: string;
  badgeNumber?: string;
  department?: string;
  role?: string;
}

export function AuthorityNavbar({
  officerName = 'Duty Officer',
  badgeNumber = 'CC-4092',
  department = 'Cyber Crime Division',
  role = 'AUTHORITY',
}: AuthorityNavbarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0A0F1D',
        borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div
        className="container"
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck style={{ width: '20px', height: '20px', color: '#38BDF8' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', color: '#F8FAFC' }}>
                CYBER-CELL <span style={{ color: 'var(--accent-cyan)' }}>OPS COMMAND</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#F87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                RESTRICTED
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
              Authorized Law Enforcement & Forensic Gateway
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/authority/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: pathname === '/authority/dashboard' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: pathname === '/authority/dashboard' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: pathname === '/authority/dashboard' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
            }}
          >
            <BarChart3 style={{ width: '16px', height: '16px' }} />
            <span>Overview</span>
          </Link>
          <Link
            href="/authority/complaints"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: pathname.startsWith('/authority/complaints') ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: pathname.startsWith('/authority/complaints') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: pathname.startsWith('/authority/complaints') ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
            }}
          >
            <FileText style={{ width: '16px', height: '16px' }} />
            <span>Case Queue</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
            }}
          >
            <span>Public Site</span>
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </Link>
        </nav>

        {/* Officer Profile Badge & Signout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <UserCheck style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>
                {officerName}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {badgeNumber} • {department}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            title="Log out of Authority Console"
          >
            <LogOut style={{ width: '15px', height: '15px' }} />
            <span className="hide-on-mobile">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
