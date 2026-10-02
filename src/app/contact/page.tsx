'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.75rem, 3.5vw, 3.5rem)' }}>
            <Badge variant="cyan" className="mb-2">
              National Emergency & Operations Directorate
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Contact EdSecure Directorate
            </h1>
            <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              For active cyber fraud, emergency interbank freeze requests, or administrative inquiries.
            </p>
          </div>

          {/* Emergency 1930 Callout */}
          <div
            style={{
              padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3.5vw, 2rem)',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid var(--danger-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: 'clamp(1.75rem, 3vw, 3rem)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 'min(100%, 260px)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--danger-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--danger)',
                  flexShrink: 0,
                }}
              >
                <PhoneCall style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#F8FAFC', wordBreak: 'break-word' }}>
                  24x7 Cyber Fraud Helpline: Dial 1930
                </div>
                <div style={{ fontSize: '0.825rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                  Report financial fraud within 2 hours to freeze recipient mule accounts.
                </div>
              </div>
            </div>

            <a href="tel:1930" className="btn btn-danger" style={{ minWidth: '130px', justifyContent: 'center' }}>
              Call 1930 Now
            </a>
          </div>

          {/* 2 Column: Details & Inquiry Form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
            {/* Headquarters details */}
            <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>
                Directorate Headquarters
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: '#F8FAFC' }}>Central Headquarters:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      EdSecure Cybercrime Directorate Command<br />
                      450 Federal Security Plaza, Suite 400<br />
                      New York, NY 10007
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Mail style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: '#F8FAFC' }}>Official Inquiries:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      support@edsecure.gov<br />
                      nodal.officer@edsecure.gov
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Shield style={{ width: '18px', height: '18px', color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: '#F8FAFC' }}>Public Grievance Officer:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Officer Anita Patel, ACP<br />
                      grievance-nodal@edsecure.gov
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1.25rem' }}>
                Send Administrative Inquiry
              </h3>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 style={{ width: '40px', height: '40px', color: '#10B981', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                    Inquiry Received
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Thank you. A duty officer will review your communication and respond within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Media inquiry, case follow-up"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Message</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', marginTop: '0.5rem' }}>
                    <Send style={{ width: '15px', height: '15px' }} />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
