'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';
import {
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  ShieldCheck,
  BookOpen,
  Calendar,
  AlertCircle,
  Bookmark,
} from 'lucide-react';
import { BlogPost } from '@/lib/db/types';

export default function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/knowledge/${slug}`);
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Article not found.');
      } else {
        setPost(json.data.post);
        setRelated(json.data.related || []);
      }
    } catch {
      setError('Connection failure while loading article.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container-narrow">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              href="/knowledge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}
            >
              <ArrowLeft style={{ width: '15px', height: '15px' }} />
              <span>Back to Knowledge Hub</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading security intelligence analysis...
            </div>
          ) : error || !post ? (
            <div className="alert alert-danger">
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              <span>{error || 'The requested article could not be retrieved.'}</span>
            </div>
          ) : (
            <article>
              {/* Header */}
              <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <Badge variant="cyan">{post.category}</Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock style={{ width: '13px', height: '13px' }} />
                    <span>{post.reading_time_minutes} min read</span>
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar style={{ width: '13px', height: '13px' }} />
                    <span>Published {formatDate(post.published_at)}</span>
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(1.6rem, 3.8vw, 2.8rem)',
                    color: '#F8FAFC',
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                  }}
                >
                  {post.title}
                </h1>

                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                    fontStyle: 'italic',
                  }}
                >
                  {post.summary}
                </p>

                {/* Author Card & Share Button */}
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                        flexShrink: 0,
                      }}
                    >
                      <User style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#F8FAFC' }}>
                        {post.author_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {post.author_role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleShare}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    {copiedShare ? <Check style={{ width: '14px', height: '14px', color: '#10B981' }} /> : <Share2 style={{ width: '14px', height: '14px' }} />}
                    <span>{copiedShare ? 'Link Copied' : 'Share Article'}</span>
                  </button>
                </div>
              </div>

              {/* Main Content Body */}
              <div
                className="glass-panel"
                style={{
                  padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                  borderRadius: 'var(--radius-xl)',
                  lineHeight: 1.8,
                  fontSize: 'clamp(0.925rem, 1.8vw, 1.05rem)',
                  color: '#CBD5E1',
                  marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  {post.content.split('\n\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={idx} style={{ fontSize: '1.45rem', color: '#F8FAFC', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('#### ')) {
                      return (
                        <h4 key={idx} style={{ fontSize: '1.2rem', color: '#38BDF8', marginTop: '1rem', marginBottom: '0.35rem' }}>
                          {trimmed.replace('#### ', '')}
                        </h4>
                      );
                    }
                    if (trimmed.startsWith('> ')) {
                      return (
                        <blockquote
                          key={idx}
                          style={{
                            padding: '1rem 1.5rem',
                            borderLeft: '4px solid var(--accent-cyan)',
                            backgroundColor: 'rgba(6, 182, 212, 0.08)',
                            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                            color: '#F8FAFC',
                            fontStyle: 'italic',
                          }}
                        >
                          {trimmed.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      const items = trimmed.split('\n');
                      return (
                        <ul key={idx} style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {items.map((it, i) => (
                            <li key={i}>{it.replace(/^[-*]\s+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
                      const items = trimmed.split('\n');
                      return (
                        <ol key={idx} style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {items.map((it, i) => (
                            <li key={i}>{it.replace(/^\d+\.\s+/, '')}</li>
                          ))}
                        </ol>
                      );
                    }

                    return <p key={idx}>{trimmed}</p>;
                  })}
                </div>

                {/* Tags List */}
                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Keywords:</span>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(6, 182, 212, 0.1)',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Triage Callout Banner */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid var(--danger-border)',
                  marginBottom: '3.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                    Have you been impacted by this specific attack vector?
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', margin: 0 }}>
                    File an official cyber incident report. Cases are triaged directly toward cyber-cells and financial freeze units.
                  </p>
                </div>
                <Link href="/report" className="btn btn-danger" style={{ gap: '0.5rem' }}>
                  <ShieldCheck style={{ width: '18px', height: '18px' }} />
                  <span>File Incident Report</span>
                </Link>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>
                    Related Cyber Intel Guides
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {related.map((rel) => (
                      <div
                        key={rel.id}
                        className="card"
                        style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div>
                          <Badge variant="cyan" className="mb-2">
                            {rel.category}
                          </Badge>
                          <Link href={`/knowledge/${rel.slug}`}>
                            <h4 style={{ fontSize: '1.05rem', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                              {rel.title}
                            </h4>
                          </Link>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {rel.summary.slice(0, 110)}...
                          </p>
                        </div>
                        <Link
                          href={`/knowledge/${rel.slug}`}
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--accent-cyan)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            marginTop: '1rem',
                          }}
                        >
                          <span>Read Guide</span>
                          <ArrowRight style={{ width: '13px', height: '13px' }} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
