'use client';

import React from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/ui/LogoMark';
import { useAuth } from './AuthContext';
import { RefreshCw, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalCount: number;
}

export const CommandCenterHeader: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  totalCount,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[var(--hairline)] px-4 sm:px-8 py-3.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            title="Go to SiteSprint Homepage"
          >
            <LogoMark size="md" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-[var(--paper)] leading-tight group-hover:text-white transition-colors">
                SiteSprint
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                Lead Operations
              </span>
            </div>
          </Link>

          <span className="h-5 w-px bg-[var(--hairline)] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--current)]/15 text-[var(--current-bright)] border border-[var(--current-bright)]/30 tracking-wider uppercase">
              Command Center
            </span>

            {/* Live Firestore Sync Indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]"
              title="Real-time listener actively connected to Cloud Firestore inquiries collection"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Live Sync</span>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 text-xs">
          {/* Quick Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--elevated)] border border-[var(--hairline)] text-[var(--mist)] hover:text-white hover:border-[var(--current-bright)]/40 transition-all cursor-pointer disabled:opacity-50"
              title="Re-synchronize leads from Firestore"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[var(--current-bright)] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              <span className="hidden sm:inline font-mono">Refresh</span>
            </button>
          )}

          {/* View Live Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--elevated)] border border-[var(--hairline)] text-[var(--mist)] hover:text-white transition-all"
            title="Open SiteSprint public website in a new tab"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-[var(--mist)]" />
          </Link>

          {/* User Email & Role */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--hairline)]">
            <div className="flex flex-col items-end">
              <span className="font-mono text-xs text-[var(--paper)] max-w-[150px] sm:max-w-[200px] truncate">
                {user?.email || 'SiteSprint Owner'}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-purple-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                Owner
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-950/40 hover:border-red-500/40 transition-all cursor-pointer font-mono ml-1"
              title="Sign out of Command Center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
