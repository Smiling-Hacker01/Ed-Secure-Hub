'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  BarChart3,
  LogOut,
  ExternalLink,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';

interface AuthorityNavbarProps {
  officerName?: string;
  badgeNumber?: string;
  department?: string;
  role?: string;
}

export function AuthorityNavbar({
  officerName = 'Duty Officer',
  badgeNumber = 'CC-4092',
  department = 'Financial Cyber Fraud Division',
  role = 'AUTHORITY',
}: AuthorityNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { href: '/authority/dashboard', icon: BarChart3, label: 'Overview' },
    { href: '/authority/complaints', icon: FileText, label: 'Case Queue' },
  ];

  const isActive = (href: string) =>
    href === '/authority/dashboard'
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @keyframes navFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .authority-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(7, 10, 18, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(6, 182, 212, 0.18);
          box-shadow: 0 4px 24px rgba(0,0,0,0.55);
          animation: navFadeIn 0.4s ease both;
        }
        .authority-navbar .nav-inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        /* Brand */
        .authority-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
          text-decoration: none;
        }
        .authority-brand-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0284C7 0%, #1E3A8A 100%);
          border: 1px solid rgba(56,189,248,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .authority-brand-text {
          display: flex;
          flex-direction: column;
          gap: 0px;
          line-height: 1;
        }
        .authority-brand-title {
          font-weight: 800;
          font-size: 0.92rem;
          color: #F8FAFC;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .authority-brand-title span { color: var(--accent-cyan); }
        .authority-brand-sub {
          display: none;
        }
        /* Restricted badge */
        .restricted-badge {
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(239,68,68,0.18);
          color: #F87171;
          border: 1px solid rgba(239,68,68,0.4);
          font-weight: 800;
          letter-spacing: 0.07em;
          flex-shrink: 0;
        }
        /* Desktop nav tabs */
        .authority-nav-tabs {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .authority-nav-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all 0.18s ease;
          text-decoration: none;
          color: var(--text-muted);
          position: relative;
        }
        .authority-nav-tab[title]:hover::after {
          content: attr(title);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15,23,42,0.97);
          color: #F8FAFC;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          border: 1px solid var(--border-medium);
          pointer-events: none;
          z-index: 100;
        }
        .authority-nav-tab:hover {
          color: var(--accent-cyan);
          background: rgba(6,182,212,0.07);
        }
        .authority-nav-tab.active {
          color: var(--accent-cyan);
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.28);
        }
        .authority-nav-tab-icon {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }
        /* External link */
        .authority-ext-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: var(--text-dim);
          text-decoration: none;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all 0.18s ease;
          position: relative;
        }
        .authority-ext-link:hover { color: var(--text-muted); background: rgba(6,182,212,0.07); }
        .authority-ext-link[title]:hover::after {
          content: attr(title);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15,23,42,0.97);
          color: #F8FAFC;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          border: 1px solid var(--border-medium);
          pointer-events: none;
          z-index: 100;
        }
        /* Officer chip */
        .officer-chip {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.3rem 0.7rem 0.3rem 0.4rem;
          border-radius: var(--radius-md);
          background: rgba(15,23,42,0.8);
          border: 1px solid var(--border-subtle);
        }
        .officer-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(6,182,212,0.15);
          border: 1px solid rgba(6,182,212,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          flex-shrink: 0;
        }
        .officer-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.1;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .officer-badge {
          font-size: 0.62rem;
          color: var(--text-dim);
          white-space: nowrap;
        }
        /* Signout btn */
        .signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.4rem 0.7rem;
          border-radius: var(--radius-md);
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.22);
          color: #F87171;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .signout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
        }
        /* Hamburger */
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: rgba(13,21,38,0.8);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          flex-shrink: 0;
        }
        /* Mobile drawer */
        .authority-mobile-drawer {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid rgba(6,182,212,0.12);
          background: rgba(7,10,18,0.97);
          animation: drawerSlideFade 0.2s ease both;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(6,182,212,0.1);
          color: var(--accent-cyan);
          border-color: rgba(6,182,212,0.25);
        }
        .mobile-officer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: 0.25rem;
        }
        /* Responsive breakpoint */
        @media (max-width: 768px) {
          .authority-nav-tabs { display: none; }
          .authority-ext-link  { display: none; }
          .officer-chip        { display: none; }
          .hamburger-btn       { display: flex; }
          .authority-mobile-drawer.open { display: flex; }
          .authority-brand-sub { display: none; }
        }
        @media (max-width: 480px) {
          .authority-brand-title { font-size: 0.82rem; }
        }
      `}</style>

      <header className="authority-navbar">
        <div className="container">
          <div className="nav-inner">
            {/* Brand */}
            <Link href="/authority/dashboard" className="authority-brand">
              <div className="authority-brand-icon">
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#38BDF8' }} />
              </div>
              <div className="authority-brand-text">
                <span className="authority-brand-title">
                  CYBER-CELL <span>OPS</span>
                </span>
                <span className="authority-brand-sub">Law Enforcement Gateway</span>
              </div>
            </Link>

            {/* Restricted badge - icon only on mobile, text on desktop */}
            <span className="restricted-badge" style={{ fontSize: '0.58rem', padding: '2px 5px' }}>R</span>

            {/* Desktop nav */}
            <nav className="authority-nav-tabs">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={`authority-nav-tab${isActive(href) ? ' active' : ''}`}
                >
                  <Icon style={{ width: '17px', height: '17px' }} />
                </Link>
              ))}
              <Link href="/" target="_blank" title="Public Site" className="authority-ext-link">
                <ExternalLink style={{ width: '15px', height: '15px' }} />
              </Link>
            </nav>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              {/* Officer chip — desktop only */}
              <div className="officer-chip">
                <div className="officer-avatar">
                  <UserCheck style={{ width: '14px', height: '14px' }} />
                </div>
                <div>
                  <div className="officer-name">{officerName}</div>
                  <div className="officer-badge">{badgeNumber}</div>
                </div>
              </div>

              {/* Sign out */}
              <button className="signout-btn" onClick={handleLogout} title="Sign out">
                <LogOut style={{ width: '14px', height: '14px' }} />
                <span className="hide-on-mobile">Sign Out</span>
              </button>

              {/* Hamburger */}
              <button className="hamburger-btn" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
                {mobileOpen
                  ? <X style={{ width: '18px', height: '18px' }} />
                  : <Menu style={{ width: '18px', height: '18px' }} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`authority-mobile-drawer${mobileOpen ? ' open' : ''}`}>
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-link${isActive(href) ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          ))}
          <Link href="/" target="_blank" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <ExternalLink style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>Public Site</span>
          </Link>

          {/* Officer row */}
          <div className="mobile-officer-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="officer-avatar" style={{ width: '32px', height: '32px' }}>
                <UserCheck style={{ width: '15px', height: '15px' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>{officerName}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{badgeNumber} · {department}</div>
              </div>
            </div>
            <button className="signout-btn" onClick={handleLogout}>
              <LogOut style={{ width: '14px', height: '14px' }} />
              Sign Out
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
