import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'red' | 'amber' | 'emerald' | 'neutral' | 'blue';
  className?: string;
}

export function Badge({ children, variant = 'cyan', className = '' }: BadgeProps) {
  const variantClass = {
    cyan: 'badge-cyan',
    red: 'badge-red',
    amber: 'badge-amber',
    emerald: 'badge-emerald',
    neutral: 'badge-neutral',
    blue: 'badge-cyan',
  }[variant];

  return <span className={`badge ${variantClass} ${className}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="cyan">Submitted</Badge>;
    case 'UNDER_REVIEW':
      return <Badge variant="amber">Under Review</Badge>;
    case 'ASSIGNED':
      return <Badge variant="cyan">Assigned to Officer</Badge>;
    case 'INVESTIGATION':
      return <Badge variant="amber">In Investigation</Badge>;
    case 'ACTION_TAKEN':
      return <Badge variant="emerald">Action Executed</Badge>;
    case 'RESOLVED':
      return <Badge variant="emerald">Resolved</Badge>;
    case 'REJECTED':
      return <Badge variant="red">Rejected</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case 'CRITICAL':
      return <Badge variant="red">Critical Risk</Badge>;
    case 'HIGH':
      return <Badge variant="amber">High Priority</Badge>;
    case 'MEDIUM':
      return <Badge variant="cyan">Medium</Badge>;
    case 'LOW':
      return <Badge variant="neutral">Low</Badge>;
    default:
      return <Badge variant="neutral">{priority}</Badge>;
  }
}
