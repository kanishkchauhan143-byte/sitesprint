import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  new: {
    label: 'New',
    bgClass: 'bg-purple-950/40',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
  contacted: {
    label: 'Contacted',
    bgClass: 'bg-blue-950/40',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-500/30',
    dotClass: 'bg-blue-400',
  },
  qualified: {
    label: 'Qualified',
    bgClass: 'bg-amber-950/40',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  proposal_sent: {
    label: 'Proposal Sent',
    bgClass: 'bg-indigo-950/40',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-500/30',
    dotClass: 'bg-indigo-400',
  },
  won: {
    label: 'Won',
    bgClass: 'bg-emerald-950/40',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  lost: {
    label: 'Lost',
    bgClass: 'bg-zinc-900/60',
    textClass: 'text-zinc-400',
    borderClass: 'border-zinc-700/40',
    dotClass: 'bg-zinc-500',
  },
};

export interface InquiryLead {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  businessType: string;
  projectType: string;
  websiteUrl?: string;
  message?: string;
  status: LeadStatus;
  notes: string;
  createdAt: unknown;
  receivedAt?: string;
  updatedAt?: unknown;
}

export interface LeadMetrics {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal_sent: number;
  won: number;
  lost: number;
}

export function calculateLeadMetrics(leads: InquiryLead[]): LeadMetrics {
  const metrics: LeadMetrics = {
    total: leads.length,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
  };

  for (const lead of leads) {
    if (lead.status in metrics) {
      metrics[lead.status]++;
    } else {
      metrics.new++;
    }
  }

  return metrics;
}

/**
 * Robust date extractor returning timestamp in milliseconds
 */
export function getLeadTimestamp(createdAt: unknown, receivedAt?: string): number {
  if (createdAt instanceof Timestamp) {
    return createdAt.toMillis();
  }
  if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
    return (createdAt as { seconds: number }).seconds * 1000;
  }
  if (typeof createdAt === 'string') {
    const parsed = Date.parse(createdAt);
    if (!isNaN(parsed)) return parsed;
  }
  if (receivedAt) {
    const parsed = Date.parse(receivedAt);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

/**
 * Format date for table & details display
 */
export function formatLeadDate(
  createdAt: unknown,
  receivedAt?: string
): { formatted: string; relative: string; full: string } {
  const millis = getLeadTimestamp(createdAt, receivedAt);
  if (!millis) {
    return {
      formatted: 'Recent',
      relative: 'Just now',
      full: receivedAt || 'Recently submitted',
    };
  }

  const date = new Date(millis);
  const now = Date.now();
  const diffMs = now - millis;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relative = 'Just now';
  if (diffMinutes < 1) {
    relative = 'Just now';
  } else if (diffMinutes < 60) {
    relative = `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    relative = `${diffHours}h ago`;
  } else if (diffDays === 1) {
    relative = 'Yesterday';
  } else if (diffDays < 30) {
    relative = `${diffDays}d ago`;
  } else {
    relative = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const formatted = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const full = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { formatted, relative, full };
}

/**
 * Real-time listener for the inquiries collection.
 * Automatically sorts newest leads first and handles missing fields gracefully.
 */
export function subscribeToLeads(
  onData: (leads: InquiryLead[]) => void,
  onError: (err: Error) => void
): () => void {
  const { db, error: dbError } = getFirestoreDb();
  if (!db) {
    onError(new Error(dbError || 'Firestore database is not configured.'));
    return () => {};
  }

  try {
    const colRef = collection(db, 'inquiries');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const leads: InquiryLead[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const validStatuses: LeadStatus[] = [
            'new',
            'contacted',
            'qualified',
            'proposal_sent',
            'won',
            'lost',
          ];
          const rawStatus = (data.status as string) || 'new';
          const status: LeadStatus = validStatuses.includes(rawStatus as LeadStatus)
            ? (rawStatus as LeadStatus)
            : 'new';

          return {
            id: docSnap.id,
            fullName: data.fullName || 'Anonymous',
            businessName: data.businessName || 'Unnamed Business',
            email: data.email || '',
            phone: data.phone || '',
            businessType: data.businessType || 'Other',
            projectType: data.projectType || 'Not specified',
            websiteUrl: data.websiteUrl || '',
            message: data.message || '',
            status,
            notes: data.notes || '',
            createdAt: data.createdAt,
            receivedAt: data.receivedAt,
            updatedAt: data.updatedAt,
          };
        });

        // Sort descending by timestamp so newest leads appear at the top
        leads.sort(
          (a, b) =>
            getLeadTimestamp(b.createdAt, b.receivedAt) -
            getLeadTimestamp(a.createdAt, a.receivedAt)
        );

        onData(leads);
      },
      (error) => {
        console.error('[SiteSprint Leads] onSnapshot error:', error);
        onError(error);
      }
    );

    return unsubscribe;
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError(error);
    return () => {};
  }
}

/**
 * Update lead status in Firestore
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  const { db } = getFirestoreDb();
  if (!db) throw new Error('Firestore not initialized.');

  const leadRef = doc(db, 'inquiries', leadId);
  await updateDoc(leadRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update lead internal notes in Firestore
 */
export async function updateLeadNotes(leadId: string, notes: string): Promise<void> {
  const { db } = getFirestoreDb();
  if (!db) throw new Error('Firestore not initialized.');

  const leadRef = doc(db, 'inquiries', leadId);
  await updateDoc(leadRef, {
    notes,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Clean phone number and generate WhatsApp direct link
 */
export function formatWhatsAppLink(phone?: string, clientName?: string): string | null {
  if (!phone) return null;
  // Strip everything except digits and +
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 7) return null;

  const text = clientName
    ? encodeURIComponent(`Hi ${clientName}, following up regarding your SiteSprint inquiry.`)
    : encodeURIComponent('Hi, following up regarding your SiteSprint inquiry.');

  return `https://wa.me/${digits}?text=${text}`;
}
