'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DayData {
  day: string;
  count: number;
  blocked: number;
  highlight?: string;
}

const WEEKLY_DATA: DayData[] = [
  { day: 'Mon', count: 420, blocked: 380 },
  { day: 'Tue', count: 560, blocked: 510 },
  { day: 'Wed', count: 680, blocked: 620, highlight: 'Phishing SMS Alert' },
  { day: 'Thu', count: 510, blocked: 470 },
  { day: 'Fri', count: 790, blocked: 710, highlight: 'Weekend Wave' },
  { day: 'Sat', count: 880, blocked: 820, highlight: 'High Weekend Activity' },
  { day: 'Sun', count: 640, blocked: 590 },
];

export function IncidentVolumeGraph() {
  const [activeIdx, setActiveIdx] = useState<number>(5);

  const width = 480;
  const height = 140;
  const paddingX = 30;
  const paddingY = 20;

  const maxVal = 1000;
  const stepX = (width - paddingX * 2) / (WEEKLY_DATA.length - 1);

  const points = WEEKLY_DATA.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - (d.count / maxVal) * (height - paddingY * 2);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  const activePoint = points[activeIdx];

  return (
    <div
      className="glass-panel"
      style={{
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(7, 10, 18, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShieldCheck style={{ width: '15px', height: '15px', color: '#38BDF8' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38BDF8' }}>
                Weekly Activity
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', color: '#F8FAFC', marginTop: '0.2rem' }}>
              Complaints Filed & Accounts Blocked
            </h3>
          </div>

          <div
            style={{
              fontSize: '0.725rem',
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34D399',
              fontWeight: 700,
            }}
          >
            89% Fast Triage Rate
          </div>
        </div>

        {/* SVG Area Chart */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <defs>
              <linearGradient id="cyberAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="cyberStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

            <path d={areaD} fill="url(#cyberAreaGrad)" />
            <path d={pathD} fill="none" stroke="url(#cyberStrokeGrad)" strokeWidth="2.5" strokeLinecap="round" />

            {points.map((p, i) => {
              const isSelected = activeIdx === i;
              return (
                <g key={p.data.day} onClick={() => setActiveIdx(i)} style={{ cursor: 'pointer' }}>
                  {isSelected && (
                    <line
                      x1={p.x}
                      y1={paddingY}
                      x2={p.x}
                      y2={height - paddingY}
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeDasharray="2 2"
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? '5.5' : '3.5'}
                    fill={isSelected ? '#06B6D4' : '#0F172A'}
                    stroke={isSelected ? '#FFFFFF' : '#38BDF8'}
                    strokeWidth={isSelected ? '2' : '1.5'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <text
                    x={p.x}
                    y={height - 4}
                    textAnchor="middle"
                    fill={isSelected ? '#F8FAFC' : 'var(--text-muted)'}
                    fontSize="10"
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {p.data.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Day Info */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(7, 10, 18, 0.75)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {activePoint.data.day}:
          </span>
          <span style={{ fontSize: '0.825rem', color: '#F8FAFC' }}>
            <strong>{activePoint.data.count}</strong> reports filed
          </span>
          <span style={{ fontSize: '0.78rem', color: '#10B981' }}>
            ({activePoint.data.blocked} bank holds requested)
          </span>
        </div>

        {activePoint.data.highlight && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#FBBF24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            {activePoint.data.highlight}
          </span>
        )}
      </div>
    </div>
  );
}
