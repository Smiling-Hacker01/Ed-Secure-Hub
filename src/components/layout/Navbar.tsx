'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, PhoneCall, User, Menu, X, ArrowRight, LogOut, ChevronRight } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'AUTHORITY' | 'ADMIN';
  badgeNumber?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthorityPage = pathname.startsWith('/authority');
  if (isAuthorityPage) {
    return null; // Handled by AuthorityNavbar
  }

  const navLinks = [
    { name: 'Report Cybercrime', href: '/report' },
    { name: 'Track Complaint', href: '/report/track' },
    { name: 'Safety & Awareness', href: '/fraud-prevention' },
    { name: 'Resources', href: '/knowledge' },
    { name: 'About', href: '/about' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Report Cybercrime', href: '/report' },
    { name: 'Track Complaint', href: '/report/track' },
    { name: 'Safety & Awareness', href: '/fraud-prevention' },
    { name: 'Resources', href: '/knowledge' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(7, 10, 18, 0.94)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
        }}
      >
        <div
          className="container"
          style={{
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* 1. Brand Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)',
                flexShrink: 0,
              }}
            >
              <Shield style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                letterSpacing: '-0.02em',
                color: '#F8FAFC',
                whiteSpace: 'nowrap',
              }}
            >
              EdSecure<span style={{ color: 'var(--accent-cyan)' }}>Hub</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#38BDF8' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Desktop Utility Group */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Subtle Vertical Separator */}
            <div
              style={{
                width: '1px',
                height: '22px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                margin: '0 0.15rem',
              }}
            />

            {/* 24/7 Helpline Pill */}
            <a
              href="tel:1930"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#FCA5A5',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
              title="National Cyber Crime Emergency Helpline (24/7 Toll-Free)"
            >
              <PhoneCall style={{ width: '13px', height: '13px', color: '#EF4444' }} />
              <span>Helpline: 1930</span>
            </a>

            {/* User Account / Auth (Desktop) */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Link
                  href={user.role === 'USER' ? '/dashboard' : '/authority/dashboard'}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  <User style={{ width: '14px', height: '14px' }} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  title="Sign Out"
                  style={{ padding: '0.45rem' }}
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Log In
              </Link>
            )}

            {/* Primary Action CTA (Desktop) */}
            <Link
              href="/report"
              className="btn btn-primary"
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>Report Now</span>
              <ArrowRight className="btn-arrow-icon" style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* 4. Mobile Controls (Only visible on screens < 768px) */}
          <div className="hide-on-desktop" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
            {/* Quick Emergency Call Icon Button on Mobile */}
            <a
              href="tel:1930"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                minHeight: '38px',
              }}
              title="Call Cyber Helpline 1930"
            >
              <PhoneCall style={{ width: '13px', height: '13px', color: '#EF4444' }} />
              <span>1930</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.45rem 0.65rem',
                minHeight: '38px',
                minWidth: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
              aria-label="Open navigation menu"
            >
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* 5. Mobile Full-Screen Standalone Navigation Portal */}
      {mounted && mobileMenuOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="animate-drawer"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100dvh',
            backgroundColor: '#070A12',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Standalone Header bar inside portal */}
          <div
            style={{
              height: '68px',
              padding: '0 clamp(1rem, 3.5vw, 1.5rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
              backgroundColor: '#070A12',
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)',
                }}
              >
                <Shield style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                  color: '#F8FAFC',
                }}
              >
                EdSecure<span style={{ color: 'var(--accent-cyan)' }}>Hub</span>
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <a
                href="tel:1930"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  minHeight: '38px',
                }}
                title="Call Cyber Helpline 1930"
              >
                <PhoneCall style={{ width: '13px', height: '13px', color: '#EF4444' }} />
                <span>1930</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{
                  minHeight: '38px',
                  minWidth: '38px',
                  padding: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                }}
                aria-label="Close navigation menu"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

          {/* Clean, spacious navigation list */}
          <div
            style={{
              flex: 1,
              padding: '1.25rem clamp(1.25rem, 4vw, 2rem) 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.75rem',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 0.35rem',
                      fontSize: '1.05rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#38BDF8' : 'var(--text-primary)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      textDecoration: 'none',
                      minHeight: '50px',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronRight
                      style={{
                        width: '16px',
                        height: '16px',
                        opacity: isActive ? 1 : 0.3,
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Actions & Account area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  minHeight: '48px',
                }}
              >
                <Shield style={{ width: '18px', height: '18px' }} />
                <span>Report a Cybercrime</span>
                <ArrowRight className="btn-arrow-icon" style={{ width: '16px', height: '16px' }} />
              </Link>

              {/* Direct Callout Pill */}
              <a
                href="tel:1930"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#FECACA',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  minHeight: '44px',
                }}
              >
                <PhoneCall style={{ width: '15px', height: '15px', color: '#EF4444' }} />
                <span>24/7 Helpline: Dial 1930</span>
              </a>

              {user ? (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <Link
                    href={user.role === 'USER' ? '/dashboard' : '/authority/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', minHeight: '44px' }}
                  >
                    <User style={{ width: '15px', height: '15px' }} />
                    <span>Dashboard ({user.fullName.split(' ')[0]})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost"
                    style={{ minHeight: '44px', border: '1px solid var(--border-subtle)', padding: '0 1rem' }}
                  >
                    <LogOut style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', minHeight: '44px', fontSize: '0.925rem' }}
                >
                  <span>Sign In to Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
