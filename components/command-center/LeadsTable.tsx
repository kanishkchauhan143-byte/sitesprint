'use client';

import React, { useState, useMemo } from 'react';
import {
  InquiryLead,
  LeadStatus,
  LEAD_STATUS_CONFIG,
  formatLeadDate,
  formatWhatsAppLink,
  updateLeadStatus,
} from '@/lib/leads';
import { BUSINESS_TYPES } from '@/lib/content';
import {
  Search,
  ArrowUpDown,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  X,
  Filter,
  Eye,
  Check,
} from 'lucide-react';

interface LeadsTableProps {
  leads: InquiryLead[];
  selectedStatus: LeadStatus | 'all';
  onSelectStatus: (status: LeadStatus | 'all') => void;
  onOpenLead: (lead: InquiryLead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  selectedStatus,
  onSelectStatus,
  onOpenLead,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Quick inline status change handler
  const handleInlineStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    leadId: string
  ) => {
    e.stopPropagation();
    const newStatus = e.target.value as LeadStatus;
    try {
      setUpdatingId(leadId);
      await updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & Search logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Status Filter
      if (selectedStatus !== 'all' && lead.status !== selectedStatus) {
        return false;
      }

      // 2. Business Type Filter
      if (
        selectedBusinessType !== 'all' &&
        lead.businessType.toLowerCase() !== selectedBusinessType.toLowerCase()
      ) {
        return false;
      }

      // 3. Search Query (Name, Business, Email, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = lead.fullName?.toLowerCase().includes(q);
        const matchesBusiness = lead.businessName?.toLowerCase().includes(q);
        const matchesEmail = lead.email?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        if (!matchesName && !matchesBusiness && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [leads, selectedStatus, selectedBusinessType, searchQuery]);

  // Sort logic
  const sortedLeads = useMemo(() => {
    const list = [...filteredLeads];
    list.sort((a, b) => {
      const timeA = a.createdAt
        ? typeof a.createdAt === 'object' && 'seconds' in a.createdAt
          ? (a.createdAt as { seconds: number }).seconds * 1000
          : Date.parse(String(a.createdAt)) || 0
        : Date.parse(a.receivedAt || '') || 0;

      const timeB = b.createdAt
        ? typeof b.createdAt === 'object' && 'seconds' in b.createdAt
          ? (b.createdAt as { seconds: number }).seconds * 1000
          : Date.parse(String(b.createdAt)) || 0
        : Date.parse(b.receivedAt || '') || 0;

      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [filteredLeads, sortOrder]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStatus !== 'all' ||
    selectedBusinessType !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    onSelectStatus('all');
    setSelectedBusinessType('all');
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Controls Bar: Search, Filters, Sort */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--hairline)]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mist)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, business, email, phone..."
            className="w-full pl-10 pr-9 py-2 bg-[var(--void)] border border-[var(--hairline)] rounded-lg text-sm text-[var(--paper)] placeholder:text-[var(--mist)]/60 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mist)] hover:text-white"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value as LeadStatus | 'all')}
              className="appearance-none bg-[var(--void)] border border-[var(--hairline)] rounded-lg pl-3 pr-8 py-2 text-xs font-mono text-[var(--paper)] hover:border-[var(--current-bright)]/40 focus:border-[var(--current-bright)] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist)] pointer-events-none" />
          </div>

          {/* Business Type Filter */}
          <div className="relative">
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              className="appearance-none bg-[var(--void)] border border-[var(--hairline)] rounded-lg pl-3 pr-8 py-2 text-xs font-mono text-[var(--paper)] hover:border-[var(--current-bright)]/40 focus:border-[var(--current-bright)] focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option value="all">All Business Types</option>
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist)] pointer-events-none" />
          </div>

          {/* Date Sort Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--void)] border border-[var(--hairline)] rounded-lg text-xs font-mono text-[var(--paper)] hover:border-[var(--current-bright)]/40 transition-colors cursor-pointer"
            title={`Sort by date: currently ${sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--current-bright)]" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-mono text-[var(--mist)] hover:text-white transition-colors cursor-pointer"
              title="Reset all active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)] px-1">
        <span>
          Showing <strong className="text-[var(--paper)]">{sortedLeads.length}</strong> of{' '}
          <strong className="text-[var(--paper)]">{leads.length}</strong> leads
        </span>
        {hasActiveFilters && (
          <span className="text-[var(--current-bright)]">Filtered View</span>
        )}
      </div>

      {/* Desktop Leads Table */}
      <div className="hidden md:block rounded-xl border border-[var(--hairline)] bg-[var(--elevated)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] bg-[var(--void)]/60 text-xs font-mono text-[var(--mist)] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-medium">Lead Name</th>
                <th className="py-3.5 px-4 font-medium">Business</th>
                <th className="py-3.5 px-4 font-medium">Type</th>
                <th className="py-3.5 px-4 font-medium">Service</th>
                <th className="py-3.5 px-4 font-medium">Contact</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium">Submitted</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--mist)]">
                    <p className="font-heading text-base text-[var(--paper)] mb-1">
                      No leads found
                    </p>
                    <p className="text-xs max-w-sm mx-auto mb-4">
                      {hasActiveFilters
                        ? 'No inquiries match your current search and filter criteria.'
                        : 'No inquiries have been received yet. Test by submitting the contact form on the homepage!'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="px-3.5 py-1.5 rounded-lg bg-[var(--current)] text-white text-xs font-mono cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => {
                  const statusConf = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.new;
                  const dateInfo = formatLeadDate(lead.createdAt, lead.receivedAt);
                  const waLink = formatWhatsAppLink(lead.phone, lead.fullName);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onOpenLead(lead)}
                      className="group hover:bg-[var(--void)]/70 transition-colors cursor-pointer select-none"
                    >
                      {/* Lead Name with avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--current)]/20 border border-[var(--current-bright)]/30 flex items-center justify-center font-bold font-mono text-xs text-[var(--current-bright)] shrink-0">
                            {lead.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-[var(--paper)] group-hover:text-white transition-colors truncate">
                              {lead.fullName}
                            </span>
                            {lead.notes && (
                              <span className="font-mono text-[10px] text-purple-400 truncate max-w-[140px]" title={lead.notes}>
                                📝 {lead.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Business */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[var(--paper)] truncate">
                            {lead.businessName}
                          </span>
                          {lead.websiteUrl && (
                            <a
                              href={
                                lead.websiteUrl.startsWith('http')
                                  ? lead.websiteUrl
                                  : `https://${lead.websiteUrl}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-[var(--mist)] hover:text-[var(--current-bright)] inline-flex items-center gap-1 truncate max-w-[140px]"
                            >
                              <span className="truncate">{lead.websiteUrl.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Business Type */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-[var(--void)] text-[var(--mist)] border border-[var(--hairline)] text-xs font-mono truncate max-w-[130px]">
                          {lead.businessType}
                        </span>
                      </td>

                      {/* Project Need */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[var(--paper)] font-mono truncate max-w-[120px] block">
                          {lead.projectType}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-xs font-mono">
                          <span className="text-[var(--paper)] truncate max-w-[160px]" title={lead.email}>
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="text-[var(--mist)] text-[11px]">
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown Badge */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id}
                            onChange={(e) => handleInlineStatusChange(e, lead.id)}
                            className={`appearance-none text-xs font-mono font-medium pl-6 pr-6 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--current-bright)] transition-colors ${statusConf.bgClass} ${statusConf.textClass} ${statusConf.borderClass}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                          <span
                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${statusConf.dotClass}`}
                          />
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60 pointer-events-none" />
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-xs font-mono text-[var(--mist)]" title={dateInfo.full}>
                        <span>{dateInfo.relative}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}?subject=Regarding your SiteSprint inquiry - ${lead.businessName}`}
                              className="p-1.5 rounded-lg bg-[var(--void)] text-[var(--mist)] hover:text-white hover:border-[var(--current-bright)]/40 border border-[var(--hairline)] transition-colors"
                              title={`Email ${lead.fullName}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 rounded-lg bg-[var(--void)] text-[var(--mist)] hover:text-white hover:border-[var(--current-bright)]/40 border border-[var(--hairline)] transition-colors"
                              title={`Call ${lead.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[var(--void)] text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 border border-[var(--hairline)] transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => onOpenLead(lead)}
                            className="p-1.5 rounded-lg bg-[var(--void)] text-[var(--current-bright)] hover:bg-[var(--current)]/20 border border-[var(--hairline)] transition-colors ml-1 cursor-pointer"
                            title="View full lead details & notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card List */}
      <div className="md:hidden flex flex-col gap-3">
        {sortedLeads.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[var(--elevated)] border border-[var(--hairline)] text-[var(--mist)]">
            <p className="font-heading text-base text-[var(--paper)] mb-1">
              No leads found
            </p>
            <p className="text-xs mb-3">
              {hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'No inquiries have been received yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--current)] text-white text-xs font-mono"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          sortedLeads.map((lead) => {
            const statusConf = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.new;
            const dateInfo = formatLeadDate(lead.createdAt, lead.receivedAt);
            const waLink = formatWhatsAppLink(lead.phone, lead.fullName);

            return (
              <div
                key={lead.id}
                onClick={() => onOpenLead(lead)}
                className="p-4 rounded-xl bg-[var(--elevated)] border border-[var(--hairline)] flex flex-col gap-3 hover:border-[var(--current-bright)]/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--current)]/20 border border-[var(--current-bright)]/30 flex items-center justify-center font-bold font-mono text-xs text-[var(--current-bright)] shrink-0">
                      {lead.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--paper)] text-sm">
                        {lead.fullName}
                      </h4>
                      <p className="text-xs text-[var(--mist)]">{lead.businessName}</p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div onClick={(e) => e.stopPropagation()} className="relative">
                    <select
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => handleInlineStatusChange(e, lead.id)}
                      className={`appearance-none text-[11px] font-mono font-medium pl-5 pr-5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusConf.bgClass} ${statusConf.textClass} ${statusConf.borderClass}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                    <span
                      className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${statusConf.dotClass}`}
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[var(--void)] text-[var(--mist)] border border-[var(--hairline)]">
                    {lead.businessType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--void)] text-[var(--paper)] border border-[var(--hairline)]">
                    {lead.projectType}
                  </span>
                  <span className="text-[var(--mist)]/70 ml-auto">
                    {dateInfo.relative}
                  </span>
                </div>

                {/* Notes preview if any */}
                {lead.notes && (
                  <p className="text-xs font-mono text-purple-300/80 bg-purple-950/20 p-2 rounded border border-purple-500/20 truncate">
                    📝 {lead.notes}
                  </p>
                )}

                {/* Action Buttons */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-[var(--hairline)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs font-mono text-[var(--mist)] truncate max-w-[160px]">
                    {lead.email}
                  </span>
                  <div className="flex items-center gap-2">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=Regarding your SiteSprint inquiry`}
                        className="p-1.5 rounded-lg bg-[var(--void)] text-[var(--mist)] hover:text-white border border-[var(--hairline)]"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 rounded-lg bg-[var(--void)] text-[var(--mist)] hover:text-white border border-[var(--hairline)]"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-[var(--void)] text-emerald-400 border border-[var(--hairline)]"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
