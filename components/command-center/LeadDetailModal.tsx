'use client';

import React, { useState, useEffect } from 'react';
import {
  InquiryLead,
  LeadStatus,
  LEAD_STATUS_CONFIG,
  formatLeadDate,
  formatWhatsAppLink,
  updateLeadStatus,
  updateLeadNotes,
} from '@/lib/leads';
import {
  X,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Calendar,
  Building,
  User,
  Briefcase,
  FileText,
  Clock,
  Save,
  Check,
  AlertCircle,
  Hash,
  Lock,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: InquiryLead | null;
  onClose: () => void;
  onLeadUpdated?: (updatedLead: InquiryLead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onLeadUpdated,
}) => {
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>('new');
  const [notes, setNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setCurrentStatus(lead.status || 'new');
      setNotes(lead.notes || '');
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [lead]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const dateInfo = formatLeadDate(lead.createdAt, lead.receivedAt);
  const updatedDateInfo = lead.updatedAt
    ? formatLeadDate(lead.updatedAt)
    : null;
  const waLink = formatWhatsAppLink(lead.phone, lead.fullName);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setCurrentStatus(newStatus);
    try {
      await updateLeadStatus(lead.id, newStatus);
      if (onLeadUpdated) {
        onLeadUpdated({ ...lead, status: newStatus });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setErrorMessage(msg);
      // Revert local state on error
      setCurrentStatus(lead.status);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setErrorMessage(null);
    try {
      await updateLeadNotes(lead.id, notes);
      setSaveSuccess(true);
      if (onLeadUpdated) {
        onLeadUpdated({ ...lead, notes });
      }
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save notes';
      setErrorMessage(msg);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const statusConf = LEAD_STATUS_CONFIG[currentStatus] || LEAD_STATUS_CONFIG.new;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[var(--elevated)] border border-[var(--hairline)] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[var(--hairline)] bg-[var(--void)]/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--current)]/20 border border-[var(--current-bright)]/30 flex items-center justify-center font-bold font-mono text-lg text-[var(--current-bright)] shrink-0">
              {lead.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 id="lead-modal-title" className="font-heading text-xl sm:text-2xl font-bold text-[var(--paper)]">
                  {lead.fullName}
                </h2>
                {/* Status Indicator */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${statusConf.bgClass} ${statusConf.textClass} ${statusConf.borderClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dotClass}`} />
                  {statusConf.label}
                </span>
              </div>
              <p className="text-sm text-[var(--mist)] flex items-center gap-2">
                <span className="font-medium text-[var(--paper)]">{lead.businessName}</span>
                <span>•</span>
                <span className="font-mono text-xs">{dateInfo.full}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--mist)] hover:text-white hover:bg-[var(--void)] border border-transparent hover:border-[var(--hairline)] transition-all cursor-pointer"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Email, Call, WhatsApp, Website) */}
        <div className="flex flex-wrap items-center gap-2.5 px-5 sm:px-6 py-3 bg-[var(--void)]/70 border-b border-[var(--hairline)]">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--mist)] mr-1">
            Quick Actions:
          </span>

          {lead.email && (
            <a
              href={`mailto:${lead.email}?subject=Regarding your SiteSprint project inquiry - ${lead.businessName}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--elevated)] hover:bg-[var(--current)]/20 text-xs font-mono text-[var(--paper)] hover:text-white border border-[var(--hairline)] hover:border-[var(--current-bright)]/40 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--current-bright)]" />
              <span>Email</span>
            </a>
          )}

          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--elevated)] hover:bg-[var(--current)]/20 text-xs font-mono text-[var(--paper)] hover:text-white border border-[var(--hairline)] hover:border-[var(--current-bright)]/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Call ({lead.phone})</span>
            </a>
          )}

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--elevated)] hover:bg-emerald-950/30 text-xs font-mono text-emerald-400 border border-[var(--hairline)] hover:border-emerald-500/40 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}

          {lead.websiteUrl && (
            <a
              href={
                lead.websiteUrl.startsWith('http')
                  ? lead.websiteUrl
                  : `https://${lead.websiteUrl}`
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--elevated)] hover:bg-[var(--void)] text-xs font-mono text-[var(--mist)] hover:text-white border border-[var(--hairline)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Website</span>
            </a>
          )}
        </div>

        {/* Modal Body: Two Column Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Lead Information & Original Message (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Client & Project Details Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--void)]/40 border border-[var(--hairline)] space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--mist)] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[var(--current-bright)]" />
                  Client & Project Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Full Name</span>
                    <span className="font-medium text-[var(--paper)] text-sm">{lead.fullName}</span>
                  </div>

                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Business Name</span>
                    <span className="font-medium text-[var(--paper)] text-sm">{lead.businessName}</span>
                  </div>

                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Email</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-mono text-[var(--current-bright)] hover:underline truncate block"
                    >
                      {lead.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Phone</span>
                    <span className="font-mono text-[var(--paper)]">
                      {lead.phone || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Business Type</span>
                    <span className="inline-block px-2.5 py-1 rounded bg-[var(--elevated)] border border-[var(--hairline)] font-mono text-[var(--paper)]">
                      {lead.businessType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[var(--mist)] block text-[11px] mb-0.5">Service Needed</span>
                    <span className="inline-block px-2.5 py-1 rounded bg-[var(--current)]/15 border border-[var(--current-bright)]/30 font-mono text-[var(--current-bright)]">
                      {lead.projectType}
                    </span>
                  </div>

                  {lead.websiteUrl && (
                    <div className="sm:col-span-2">
                      <span className="text-[var(--mist)] block text-[11px] mb-0.5">Current Website</span>
                      <a
                        href={
                          lead.websiteUrl.startsWith('http')
                            ? lead.websiteUrl
                            : `https://${lead.websiteUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm text-[var(--current-bright)] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{lead.websiteUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer's Original Message (Immutable) */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--void)]/40 border border-[var(--hairline)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--mist)] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[var(--current-bright)]" />
                    Customer Project Notes / Message
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[var(--elevated)] text-[10px] font-mono text-[var(--mist)] border border-[var(--hairline)]">
                    Original • Immutable
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] leading-relaxed whitespace-pre-wrap font-sans">
                  {lead.message && lead.message.trim() ? (
                    lead.message
                  ) : (
                    <span className="text-[var(--mist)] italic">
                      No additional project notes were provided by the client.
                    </span>
                  )}
                </div>
              </div>

              {/* System Metadata Card */}
              <div className="p-3.5 rounded-xl bg-[var(--void)]/20 border border-[var(--hairline)] text-[11px] font-mono text-[var(--mist)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Document ID:</span>
                  <span className="text-[var(--paper)]">{lead.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Submitted Date:</span>
                  <span className="text-[var(--paper)]">{dateInfo.full}</span>
                </div>
                {updatedDateInfo && (
                  <div className="flex items-center justify-between">
                    <span>Last Updated:</span>
                    <span className="text-[var(--paper)]">{updatedDateInfo.full}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Status Pipeline & Internal Notes (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Status Pipeline Selector */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--void)]/40 border border-[var(--hairline)] space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--mist)] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--current-bright)]" />
                  Lead Status Pipeline
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'new',
                      'contacted',
                      'qualified',
                      'proposal_sent',
                      'won',
                      'lost',
                    ] as LeadStatus[]
                  ).map((st) => {
                    const conf = LEAD_STATUS_CONFIG[st];
                    const isSelected = currentStatus === st;

                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-left border transition-all cursor-pointer ${
                          isSelected
                            ? `${conf.bgClass} ${conf.textClass} ${conf.borderClass} font-semibold ring-1 ring-[var(--current-bright)]/40 shadow-sm`
                            : 'bg-[var(--elevated)] text-[var(--mist)] border-[var(--hairline)] hover:text-[var(--paper)] hover:border-[var(--hairline)]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${conf.dotClass}`} />
                          {conf.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Internal Notes Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--void)]/40 border border-[var(--hairline)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--mist)] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    Internal Notes
                  </h3>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">
                    Private to SiteSprint
                  </span>
                </div>

                <p className="text-[11px] text-[var(--mist)]">
                  Add private notes on client requirements, budget discussions, follow-up dates, or call outcomes. Never shared with the client.
                </p>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Called on Tuesday; client needs 5-page redesign by end of next month. Quoted standard package..."
                  rows={6}
                  className="w-full p-3 bg-[var(--void)] border border-[var(--hairline)] rounded-lg text-xs font-mono text-[var(--paper)] placeholder:text-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-[var(--mist)]">
                    {notes.length} characters
                  </span>

                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes || notes === (lead.notes || '')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      saveSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[var(--current)] text-white hover:bg-[var(--current-bright)] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_15px_rgba(124,58,237,0.3)]'
                    }`}
                  >
                    {isSavingNotes ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Notes Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
