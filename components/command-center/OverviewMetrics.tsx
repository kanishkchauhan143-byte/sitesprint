'use client';

import React from 'react';
import { LeadMetrics, LeadStatus } from '@/lib/leads';
import {
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle,
  FileText,
  Trophy,
  XCircle,
} from 'lucide-react';

interface OverviewMetricsProps {
  metrics: LeadMetrics;
  selectedStatus: LeadStatus | 'all';
  onSelectStatus: (status: LeadStatus | 'all') => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards: Array<{
    status: LeadStatus | 'all';
    label: string;
    count: number;
    icon: React.ReactNode;
    colorClasses: {
      border: string;
      activeBorder: string;
      bg: string;
      activeBg: string;
      badge: string;
      text: string;
      icon: string;
    };
  }> = [
    {
      status: 'all',
      label: 'Total Leads',
      count: metrics.total,
      icon: <Users className="w-4 h-4" />,
      colorClasses: {
        border: 'border-[var(--hairline)]',
        activeBorder: 'border-white/50 ring-1 ring-white/30',
        bg: 'hover:bg-white/[0.03]',
        activeBg: 'bg-white/[0.06]',
        badge: 'text-[var(--paper)]',
        text: 'text-[var(--paper)]',
        icon: 'text-[var(--mist)]',
      },
    },
    {
      status: 'new',
      label: 'New',
      count: metrics.new,
      icon: <Sparkles className="w-4 h-4" />,
      colorClasses: {
        border: 'border-purple-500/20',
        activeBorder: 'border-purple-400 ring-1 ring-purple-400/50',
        bg: 'hover:bg-purple-950/20',
        activeBg: 'bg-purple-950/30',
        badge: 'text-purple-300',
        text: 'text-purple-300',
        icon: 'text-purple-400',
      },
    },
    {
      status: 'contacted',
      label: 'Contacted',
      count: metrics.contacted,
      icon: <PhoneCall className="w-4 h-4" />,
      colorClasses: {
        border: 'border-blue-500/20',
        activeBorder: 'border-blue-400 ring-1 ring-blue-400/50',
        bg: 'hover:bg-blue-950/20',
        activeBg: 'bg-blue-950/30',
        badge: 'text-blue-300',
        text: 'text-blue-300',
        icon: 'text-blue-400',
      },
    },
    {
      status: 'qualified',
      label: 'Qualified',
      count: metrics.qualified,
      icon: <CheckCircle className="w-4 h-4" />,
      colorClasses: {
        border: 'border-amber-500/20',
        activeBorder: 'border-amber-400 ring-1 ring-amber-400/50',
        bg: 'hover:bg-amber-950/20',
        activeBg: 'bg-amber-950/30',
        badge: 'text-amber-300',
        text: 'text-amber-300',
        icon: 'text-amber-400',
      },
    },
    {
      status: 'proposal_sent',
      label: 'Proposal Sent',
      count: metrics.proposal_sent,
      icon: <FileText className="w-4 h-4" />,
      colorClasses: {
        border: 'border-indigo-500/20',
        activeBorder: 'border-indigo-400 ring-1 ring-indigo-400/50',
        bg: 'hover:bg-indigo-950/20',
        activeBg: 'bg-indigo-950/30',
        badge: 'text-indigo-300',
        text: 'text-indigo-300',
        icon: 'text-indigo-400',
      },
    },
    {
      status: 'won',
      label: 'Won',
      count: metrics.won,
      icon: <Trophy className="w-4 h-4" />,
      colorClasses: {
        border: 'border-emerald-500/20',
        activeBorder: 'border-emerald-400 ring-1 ring-emerald-400/50',
        bg: 'hover:bg-emerald-950/20',
        activeBg: 'bg-emerald-950/30',
        badge: 'text-emerald-300',
        text: 'text-emerald-300',
        icon: 'text-emerald-400',
      },
    },
    {
      status: 'lost',
      label: 'Lost',
      count: metrics.lost,
      icon: <XCircle className="w-4 h-4" />,
      colorClasses: {
        border: 'border-zinc-700/30',
        activeBorder: 'border-zinc-500 ring-1 ring-zinc-500/50',
        bg: 'hover:bg-zinc-900/30',
        activeBg: 'bg-zinc-900/50',
        badge: 'text-zinc-400',
        text: 'text-zinc-400',
        icon: 'text-zinc-500',
      },
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card) => {
          const isActive = selectedStatus === card.status;
          return (
            <button
              key={card.status}
              onClick={() => onSelectStatus(isActive && card.status !== 'all' ? 'all' : card.status)}
              className={`group flex flex-col justify-between p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer bg-[var(--elevated)] border shadow-md relative overflow-hidden ${
                isActive
                  ? `${card.colorClasses.activeBorder} ${card.colorClasses.activeBg} shadow-lg`
                  : `${card.colorClasses.border} ${card.colorClasses.bg}`
              }`}
            >
              {/* Subtle top indicator bar on active card */}
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--current-bright)] to-transparent" />
              )}

              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-xs text-[var(--mist)] uppercase tracking-wider group-hover:text-[var(--paper)] transition-colors truncate">
                  {card.label}
                </span>
                <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${card.colorClasses.icon}`}>
                  {card.icon}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className={`font-heading text-2xl sm:text-3xl font-bold tracking-tight ${card.colorClasses.text}`}>
                  {card.count}
                </span>
                {metrics.total > 0 && card.status !== 'all' && (
                  <span className="font-mono text-[10px] text-[var(--mist)]/70">
                    {Math.round((card.count / metrics.total) * 100)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
