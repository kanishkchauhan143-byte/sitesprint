'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from '@/components/command-center/AuthContext';
import { AuthGuard } from '@/components/command-center/AuthGuard';
import { CommandCenterHeader } from '@/components/command-center/CommandCenterHeader';
import { OverviewMetrics } from '@/components/command-center/OverviewMetrics';
import { LeadsTable } from '@/components/command-center/LeadsTable';
import { LeadDetailModal } from '@/components/command-center/LeadDetailModal';
import {
  InquiryLead,
  LeadStatus,
  calculateLeadMetrics,
  subscribeToLeads,
} from '@/lib/leads';
import { AlertCircle } from 'lucide-react';

function CommandCenterContent() {
  const [leads, setLeads] = useState<InquiryLead[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all');
  const [activeLead, setActiveLead] = useState<InquiryLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initSubscription = useCallback(() => {
    setIsRefreshing(true);
    setErrorMessage(null);

    const unsubscribe = subscribeToLeads(
      (newLeads) => {
        setLeads(newLeads);
        setIsLoading(false);
        setIsRefreshing(false);
        // If active lead is open, keep its state synced with real-time updates
        setActiveLead((prev) => {
          if (!prev) return null;
          const updated = newLeads.find((l) => l.id === prev.id);
          return updated || prev;
        });
      },
      (error) => {
        console.error('[SiteSprint Command Center] Subscription error:', error);
        setErrorMessage(
          error.message ||
            'Unable to sync leads from Firestore. Ensure your account is authorized in Firestore Security Rules.'
        );
        setIsLoading(false);
        setIsRefreshing(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = initSubscription();
    return () => unsub();
  }, [initSubscription]);

  const metrics = calculateLeadMetrics(leads);

  return (
    <div className="min-h-screen bg-[var(--void)] text-[var(--paper)] flex flex-col selection:bg-[var(--current)] selection:text-white">
      {/* Top Header */}
      <CommandCenterHeader
        onRefresh={initSubscription}
        isRefreshing={isRefreshing}
        totalCount={leads.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <div className="flex-1">
              <strong>Database Connection Notice:</strong> {errorMessage}
            </div>
            <button
              onClick={initSubscription}
              className="px-2.5 py-1 rounded bg-red-900/50 hover:bg-red-800 text-white font-mono text-[11px] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-[var(--hairline)]">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[var(--paper)]">
              Lead Operations Pipeline
            </h1>
            <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
              Live inquiries from the SiteSprint website contact form
            </p>
          </div>

          <div className="font-mono text-xs text-[var(--mist)]">
            Active Collection:{' '}
            <span className="text-[var(--current-bright)] font-semibold">inquiries</span>
          </div>
        </div>

        {/* 1. Overview Metrics Cards (7 statuses) */}
        <OverviewMetrics
          metrics={metrics}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {/* 2. Leads Table with Search, Filters, and Sorting */}
        <LeadsTable
          leads={leads}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onOpenLead={(lead) => setActiveLead(lead)}
        />
      </main>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={activeLead}
        onClose={() => setActiveLead(null)}
        onLeadUpdated={(updated) => {
          setActiveLead(updated);
          setLeads((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }}
      />
    </div>
  );
}

export default function CommandCenterPage() {
  return (
    <AuthProvider>
      <AuthGuard>
        <CommandCenterContent />
      </AuthGuard>
    </AuthProvider>
  );
}
