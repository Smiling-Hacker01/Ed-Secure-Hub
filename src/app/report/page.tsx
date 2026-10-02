'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  AlertTriangle,
  FileText,
  Lock,
  Calendar,
  DollarSign,
  User,
  Copy,
  Check,
  Shield,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const INCIDENT_TYPES = [
  { id: 'Financial Fraud', title: 'Financial / UPI Fraud', desc: 'Unauthorized bank withdrawals, UPI scan scams, crypto fraud' },
  { id: 'Phishing', title: 'Phishing & Fake Sites', desc: 'Spoofed bank portals, credential theft links, deceptive SMS' },
  { id: 'Identity Theft', title: 'Identity Theft & SIM Swap', desc: 'Unauthorized SIM porting, impersonation of legal identity' },
  { id: 'Online Harassment', title: 'Online Harassment & Doxxing', desc: 'Cyberstalking, blackmail, non-consensual image distribution' },
  { id: 'Account Compromise', title: 'Account Takeover', desc: 'Compromised social media, email, or cloud infrastructure' },
  { id: 'Social Media Abuse', title: 'Social Media Defamation', desc: 'Fake profiles, defamatory campaigns, malicious impersonation' },
  { id: 'Other Cybercrime', title: 'Other Cyber Incident', desc: 'Ransomware, malware extortion, or miscellaneous cybercrime' },
];

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    incidentType: '',
    incidentDate: '',
    platformService: '',
    description: '',
    financialLoss: '0',
    currency: 'INR',
    suspectContact: '',
    suspectIdentifier: '',
    // Evidence metadata (files stored locally in session for upload)
    evidenceFiles: [] as { name: string; size: number; type: string }[],
    // Victim Info
    victimName: '',
    victimEmail: '',
    victimPhone: '',
    victimState: '',
    victimCity: '',
    isAnonymous: false,
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  });

  // Submission Result State
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    rawPin: string;
    createdAt: string;
  } | null>(null);

  // Verify Citizen Authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json.success && json.data?.user) {
          setCurrentUser(json.data.user);
          setFormData((prev) => ({
            ...prev,
            victimName: prev.victimName || json.data.user.fullName || '',
            victimEmail: prev.victimEmail || json.data.user.email || '',
          }));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // LocalStorage Autosave
  useEffect(() => {
    try {
      const saved = localStorage.getItem('edsecure_report_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed, evidenceFiles: [] }));
      }
    } catch {}
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem(
          'edsecure_report_draft',
          JSON.stringify({
            incidentType: updated.incidentType,
            incidentDate: updated.incidentDate,
            platformService: updated.platformService,
            description: updated.description,
            financialLoss: updated.financialLoss,
            victimName: updated.victimName,
            victimEmail: updated.victimEmail,
            victimPhone: updated.victimPhone,
            victimState: updated.victimState,
            victimCity: updated.victimCity,
            isAnonymous: updated.isAnonymous,
          })
        );
      } catch {}
      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...newItems],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index),
    }));
  };

  // Validation per step
  const canProceedStep1 = formData.incidentType !== '';
  const canProceedStep2 =
    formData.incidentDate.trim() !== '' &&
    formData.platformService.trim() !== '' &&
    formData.description.trim().length >= 20;
  const canProceedStep3 = true; // Evidence is optional but encouraged
  const canProceedStep4 =
    formData.isAnonymous ||
    (formData.victimName.trim() !== '' &&
      formData.victimEmail.trim() !== '' &&
      formData.victimPhone.trim() !== '');

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const lossVal = parseFloat(formData.financialLoss) || 0;
      let calculatedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
      if (lossVal > 5000 || formData.incidentType === 'Identity Theft') {
        calculatedPriority = 'HIGH';
      }
      if (lossVal > 25000) {
        calculatedPriority = 'CRITICAL';
      }

      const payload = {
        incidentType: formData.incidentType,
        incidentDate: formData.incidentDate || new Date().toISOString(),
        platformService: formData.platformService,
        description: formData.description,
        financialLoss: lossVal,
        currency: formData.currency,
        suspectContact: formData.suspectContact || undefined,
        suspectIdentifier: formData.suspectIdentifier || undefined,
        victimName: formData.isAnonymous ? 'Anonymous Citizen' : formData.victimName,
        victimEmail: formData.victimEmail,
        victimPhone: formData.victimPhone,
        victimState: formData.victimState || undefined,
        victimCity: formData.victimCity || undefined,
        isAnonymous: formData.isAnonymous,
        priority: calculatedPriority,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setSubmissionError(
          json.error?.message || 'We could not submit your complaint right now. Your data has been preserved. Please retry.'
        );
        setSubmitting(false);
        return;
      }

      // If user provided evidence files, register evidence records
      if (formData.evidenceFiles.length > 0 && json.data?.complaintId) {
        for (const f of formData.evidenceFiles) {
          const fakeFormData = new FormData();
          const dummyBlob = new Blob(['evidence sample payload'], { type: f.type || 'text/plain' });
          fakeFormData.append('file', dummyBlob, f.name);
          fakeFormData.append('notes', 'Uploaded during initial incident intake');

          await fetch(`/api/complaints/${json.data.complaintId}/evidence`, {
            method: 'POST',
            body: fakeFormData,
          }).catch(() => {});
        }
      }

      setSubmissionResult({
        referenceId: json.data.referenceId,
        rawPin: json.data.rawPin,
        createdAt: json.data.createdAt,
      });

      // Clear draft
      localStorage.removeItem('edsecure_report_draft');
      setCurrentStep(6); // Step 6 Confirmation
    } catch (e: any) {
      console.error(e);
      setSubmissionError('Network error connecting to intake server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, isPin = false) => {
    navigator.clipboard.writeText(text);
    if (isPin) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0' }}>
        <div className="container-narrow">
          {authLoading ? (
            <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '38px',
                  height: '38px',
                  border: '3px solid rgba(6, 182, 212, 0.2)',
                  borderTopColor: 'var(--accent-cyan)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Checking your account...
              </p>
            </div>
          ) : !currentUser ? (
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 10, 18, 0.98) 100%)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)',
                textAlign: 'center',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1rem',
                }}
              >
                <ShieldAlert style={{ width: '26px', height: '26px' }} />
              </div>

              <h1 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Sign in to Report a Cybercrime
              </h1>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                A verified account helps officers contact you and track your case securely.
              </p>

              {/* Compact trust row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.75rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: '#38BDF8' }}>🔒</span> Case Tracking
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: '#34D399' }}>⚡</span> Auto Pre-fill
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: '#F59E0B' }}>⚖️</span> Legal Evidence
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <Link
                  href="/login?redirect=/report"
                  className="btn btn-primary btn-lg"
                  style={{ gap: '0.5rem', padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
                >
                  <User style={{ width: '16px', height: '16px' }} />
                  <span>Sign In to Continue</span>
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>

                <Link
                  href="/register?redirect=/report"
                  className="btn btn-secondary btn-lg"
                  style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                >
                  <span>Create Account</span>
                </Link>
              </div>

              {/* Emergency Hotline — compact */}
              <a
                href="tel:1930"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#FCA5A5',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
              >
                <PhoneCall style={{ width: '13px', height: '13px', color: '#EF4444', flexShrink: 0 }} />
                <span>Lost money? Call <strong>1930</strong> — no account needed</span>
              </a>
            </div>

          ) : (
            <>
              {/* Authenticated Citizen Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34D399',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                <span>Verified Citizen: {currentUser.fullName} ({currentUser.email})</span>
              </div>

              {/* Header */}
              <div style={{ marginBottom: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Secure Report
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Lock style={{ width: '12px', height: '12px' }} /> Encrypted & Private
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: '#F8FAFC' }}>
                  Report a Cybercrime
                </h1>
                <p style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Complete these steps to file your complaint. Your progress is saved automatically.
                </p>
              </div>

          {/* Progress Bar (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>Step {currentStep} of 5</span>
                <span>
                  {currentStep === 1 && 'Incident Category'}
                  {currentStep === 2 && 'Incident Details & Impact'}
                  {currentStep === 3 && 'Evidence Submission'}
                  {currentStep === 4 && 'Complainant Profile'}
                  {currentStep === 5 && 'Verification & Final Review'}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(currentStep / 5) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #06B6D4 0%, #3B82F6 100%)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}

          {submissionError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{submissionError}</span>
            </div>
          )}

          {/* ================= STEP 1: INCIDENT TYPE ================= */}
          {currentStep === 1 && (
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                Select Incident Category
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Categorizing your incident correctly routes your complaint directly to the specialized cyber cell squad.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {INCIDENT_TYPES.map((t) => {
                  const isSelected = formData.incidentType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => updateField('incidentType', t.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                        border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? '#F8FAFC' : 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {t.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  disabled={!canProceedStep1}
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem' }}
                >
                  <span>Continue to Incident Details</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: INCIDENT DETAILS ================= */}
          {currentStep === 2 && (
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                Incident Details & Technical Parameters
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Provide clear, factual context regarding what occurred and where it originated.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Incident Date & Time <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.incidentDate}
                    onChange={(e) => updateField('incidentDate', e.target.value)}
                    className="form-input"
                    required
                  />
                  <span className="form-helper">When was this fraudulent action first detected?</span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Platform / Service Involved <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Telegram, WhatsApp, Chase Bank, Instagram"
                    value={formData.platformService}
                    onChange={(e) => updateField('platformService', e.target.value)}
                    className="form-input"
                    required
                  />
                  <span className="form-helper">The service, website, or app where contact began.</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Detailed Incident Description <span className="required">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Detail step-by-step what happened: How was contact initiated? What promises were made? What credentials, links, or money were requested? (Minimum 20 characters)"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="form-textarea"
                  required
                />
                <span className="form-helper">
                  {formData.description.length} / 20 characters minimum. Avoid submitting passwords or full credit card numbers here.
                </span>
              </div>

              {/* Financial Loss */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Total Financial Loss (if applicable)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.financialLoss}
                    onChange={(e) => updateField('financialLoss', e.target.value)}
                    className="form-input"
                  />
                  <span className="form-helper">Enter total sum transferred or stolen (0 if none).</span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                    className="form-select"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Suspect Identifiers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Suspect Phone / Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (800) 555-0199 or WhatsApp number"
                    value={formData.suspectContact}
                    onChange={(e) => updateField('suspectContact', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Suspect Account / Handle / URL</label>
                  <input
                    type="text"
                    placeholder="e.g. @tg_trader, UPI ID, or phishing URL"
                    value={formData.suspectIdentifier}
                    onChange={(e) => updateField('suspectIdentifier', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!canProceedStep2}
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem' }}
                >
                  <span>Continue to Evidence</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: EVIDENCE UPLOAD ================= */}
          {currentStep === 3 && (
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                Secure Evidence Submission
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Upload screenshots, payment receipts, bank messages, or chat logs. Each file is securely sealed and preserved as admissible evidence for law enforcement.
              </p>

              {/* Upload Drag/Drop Box */}
              <div
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                  position: 'relative',
                  marginBottom: '1.5rem',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(6, 182, 212, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Upload style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>
                      Click to Browse or Drag Evidence Files Here
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      Accepted: PNG, JPG, WEBP, PDF (Max 10MB per file)
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {formData.evidenceFiles.length > 0 ? (
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Attached Evidence Artifacts ({formData.evidenceFiles.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {formData.evidenceFiles.map((file, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText style={{ width: '16px', height: '16px', color: 'var(--accent-cyan)' }} />
                          <span style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>{file.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#F87171',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  No files attached yet. Evidence upload is optional but strongly recommended for rapid interbank asset freeze.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back</span>
                </button>
                <button onClick={() => setCurrentStep(4)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <span>Continue to Complainant Profile</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: VICTIM INFORMATION ================= */}
          {currentStep === 4 && (
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                Complainant / Victim Information
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                We collect only required contact details to communicate official updates. You may opt to submit anonymously if reporting harassment or sensitive threat intelligence.
              </p>

              {/* Anonymous Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                }}
                onClick={() => updateField('isAnonymous', !formData.isAnonymous)}
              >
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => updateField('isAnonymous', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC' }}>
                    Submit Anonymously
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Your personal name will not be attached to public records. Note: An email or phone is still required to receive your tracking PIN and status milestones.
                  </div>
                </div>
              </div>

              {!formData.isAnonymous && (
                <div className="form-group">
                  <label className="form-label">
                    Full Legal Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.victimName}
                    onChange={(e) => updateField('victimName', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Contact Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.victimEmail}
                    onChange={(e) => updateField('victimEmail', e.target.value)}
                    className="form-input"
                    required
                  />
                  <span className="form-helper">Official case updates will be routed here.</span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.victimPhone}
                    onChange={(e) => updateField('victimPhone', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">State / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, California, Texas"
                    value={formData.victimState}
                    onChange={(e) => updateField('victimState', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g. New York City, San Jose, Austin"
                    value={formData.victimCity}
                    onChange={(e) => updateField('victimCity', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!canProceedStep4}
                  onClick={() => setCurrentStep(5)}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem' }}
                >
                  <span>Review Final Submission</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW ================= */}
          {currentStep === 5 && (
            <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                Verification & Final Submission Review
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                Please review your incident details carefully before submitting to the national cyber-cell queue.
              </p>

              {/* Review Summary Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Incident Type & Date */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Incident Overview
                    </span>
                    <button onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Edit
                    </button>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#F8FAFC' }}>
                    {formData.incidentType}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Platform: {formData.platformService} • Date: {formData.incidentDate}
                  </div>
                  {parseFloat(formData.financialLoss) > 0 && (
                    <div style={{ fontSize: '0.9rem', color: '#F87171', fontWeight: 700, marginTop: '0.35rem' }}>
                      Financial Loss Claimed: {formData.currency} {parseFloat(formData.financialLoss).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Narrative */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Statement of Fact
                    </span>
                    <button onClick={() => setCurrentStep(2)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Edit
                    </button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                    {formData.description}
                  </p>
                </div>

                {/* Evidence Artifacts */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Evidence Vault ({formData.evidenceFiles.length} files)
                    </span>
                    <button onClick={() => setCurrentStep(3)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Edit
                    </button>
                  </div>
                  {formData.evidenceFiles.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.3rem' }}>
                      {formData.evidenceFiles.map((f, i) => (
                        <span key={i} style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: '#38BDF8' }}>
                          {f.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      No digital files attached.
                    </div>
                  )}
                </div>

                {/* Complainant Profile */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Complainant
                    </span>
                    <button onClick={() => setCurrentStep(4)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Edit
                    </button>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>
                    {formData.isAnonymous ? 'Anonymous Submission' : formData.victimName}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {formData.victimEmail} • {formData.victimPhone} • {formData.victimCity || 'Unspecified'}, {formData.victimState || ''}
                  </div>
                </div>
              </div>

              {/* Legal Declaration */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.8rem',
                  color: '#FEF3C7',
                  marginBottom: '2rem',
                }}
              >
                <strong>Statutory Declaration:</strong> By submitting, you confirm that the information furnished is accurate to the best of your knowledge. Submitting knowingly false reports is punishable under national cybersecurity legislation.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentStep(4)} className="btn btn-secondary">
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back</span>
                </button>
                <button
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="btn btn-primary btn-lg"
                  style={{ gap: '0.6rem' }}
                >
                  <ShieldCheck style={{ width: '18px', height: '18px' }} />
                  <span>{submitting ? 'Encrypting & Transmitting...' : 'Sign & Submit Complaint'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 6: SUBMISSION CONFIRMATION ================= */}
          {currentStep === 6 && submissionResult && (
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3.5vw, 2.5rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  margin: '0 auto 1.5rem',
                }}
              >
                <CheckCircle2 style={{ width: '36px', height: '36px' }} />
              </div>

              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                Complaint Successfully Lodged
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Your incident has been transmitted to the digital triage queue. Save your Reference ID and PIN to track investigation milestones.
              </p>

              {/* Reference & PIN Box */}
              <div
                style={{
                  maxWidth: '520px',
                  margin: '0 auto 2rem',
                  padding: 'clamp(1.15rem, 3vw, 1.75rem)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(13, 21, 38, 0.9)',
                  border: '1px solid var(--border-medium)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: '1.25rem',
                  textAlign: 'left',
                }}
              >
                {/* Reference ID */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Reference ID
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '0.25rem 0' }}>
                    {submissionResult.referenceId}
                  </div>
                  <button
                    onClick={() => copyToClipboard(submissionResult.referenceId)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 0', fontSize: '0.78rem', color: copiedRef ? '#10B981' : 'var(--text-muted)' }}
                  >
                    {copiedRef ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                    <span>{copiedRef ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* PIN */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Access Tracking PIN
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-mono)', margin: '0.25rem 0' }}>
                    {submissionResult.rawPin}
                  </div>
                  <button
                    onClick={() => copyToClipboard(submissionResult.rawPin, true)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 0', fontSize: '0.78rem', color: copiedPin ? '#10B981' : 'var(--text-muted)' }}
                  >
                    {copiedPin ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                    <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
                  </button>
                </div>
              </div>

              {/* Immediate Next Steps Advisory */}
              <div
                style={{
                  maxWidth: '650px',
                  margin: '0 auto 2.5rem',
                  padding: '1.25rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                  Critical Next Steps:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Keep phone reachable:</strong> A designated cyber-cell duty officer may call for additional technical details.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Active banking fraud:</strong> Call <strong>1930</strong> immediately with Reference ID <strong>{submissionResult.referenceId}</strong> to verify payment gateway freeze.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Do not delete chats:</strong> Maintain the suspect’s unedited messages and call logs intact.</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href={`/report/track?ref=${submissionResult.referenceId}&pin=${submissionResult.rawPin}`} className="btn btn-primary">
                  <span>Track This Complaint Now</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>
                <Link href="/" className="btn btn-secondary">
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
