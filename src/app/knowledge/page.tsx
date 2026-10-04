'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';
import {
  BookOpen,
  Search,
  Clock,
  User,
  ArrowRight,
  Shield,
  Tag,
  Share2,
} from 'lucide-react';
import { BlogPost } from '@/lib/db/types';

export default function KnowledgeHubPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = `/api/knowledge?category=${selectedCategory}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
        setCategories(json.data.categories);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts();
  };

  const featuredPost = posts.find((p) => p.is_featured) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 150px)', padding: 'clamp(1.75rem, 4vw, 3.5rem) 0 clamp(2.5rem, 5vw, 5rem)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto clamp(1.5rem, 3vw, 3rem)' }}>
            <Badge variant="cyan" className="mb-2">
              Cybersecurity Knowledge & Awareness
            </Badge>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', color: '#F8FAFC', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Security Intel & Fraud Playbooks
            </h1>
            <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              In-depth research, defense tactics, and incident prevention guides developed by cyber-cell investigators and digital forensic analysts.
            </p>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div style={{ maxWidth: '850px', margin: '0 auto clamp(1.75rem, 3vw, 3.5rem)' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
                <input
                  type="text"
                  placeholder="Search articles by title, attack vector, or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', height: '48px', fontSize: '0.95rem' }}
                />
                <Search style={{ width: '18px', height: '18px', color: 'var(--text-dim)', position: 'absolute', left: '14px', top: '15px' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', height: '48px', minWidth: '100px' }}>
                Search
              </button>
            </form>

            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-card)',
                      color: isSelected ? '#000000' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading knowledge guides...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <BookOpen style={{ width: '40px', height: '40px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                No articles match your query
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Try searching for broader keywords like &quot;scam&quot; or selecting &quot;All&quot; categories.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Article Showcase */}
              {featuredPost && (
                <div
                  className="glass-panel"
                  style={{
                    padding: 'clamp(1.25rem, 3vw, 2.5rem)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    marginBottom: 'clamp(1.75rem, 3vw, 3.5rem)',
                    background: 'radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.8) 70%)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'var(--accent-cyan)', color: '#000000', textTransform: 'uppercase' }}>
                      FEATURED INTEL
                    </span>
                    <Badge variant="cyan">{featuredPost.category}</Badge>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      <span>{featuredPost.reading_time_minutes} min read</span>
                    </span>
                  </div>

                  <Link href={`/knowledge/${featuredPost.slug}`}>
                    <h2
                      style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
                        color: '#F8FAFC',
                        lineHeight: 1.3,
                        marginBottom: '1rem',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '850px' }}>
                    {featuredPost.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        <User style={{ width: '18px', height: '18px' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC' }}>
                          {featuredPost.author_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {featuredPost.author_role}
                        </div>
                      </div>
                    </div>

                    <Link href={`/knowledge/${featuredPost.slug}`} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                      <span>Read Full Analysis</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Grid of Regular Posts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: 'clamp(1rem, 2.5vw, 2rem)',
                }}
              >
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <Badge variant="cyan">{post.category}</Badge>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock style={{ width: '13px', height: '13px' }} />
                          <span>{post.reading_time_minutes} min read</span>
                        </span>
                      </div>

                      <Link href={`/knowledge/${post.slug}`}>
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            color: '#F8FAFC',
                            lineHeight: 1.4,
                            marginBottom: '0.75rem',
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {post.title}
                        </h3>
                      </Link>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {post.summary}
                      </p>

                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: 'rgba(148, 163, 184, 0.08)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        By {post.author_name}
                      </div>
                      <Link
                        href={`/knowledge/${post.slug}`}
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--accent-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span>Read</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
