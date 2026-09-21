import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseDiagnostics {
  isConfigured: boolean;
  projectId: string | null;
  hasApiKey: boolean;
  hasAuthDomain: boolean;
  hasStorageBucket: boolean;
  hasMessagingSenderId: boolean;
  hasAppId: boolean;
  missingFields: string[];
}

export function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || '',
  };
}

export function getFirebaseDiagnostics(): FirebaseDiagnostics {
  const config = getFirebaseConfig();
  const missing: string[] = [];

  if (!config.apiKey) missing.push('apiKey');
  if (!config.projectId) missing.push('projectId');
  if (!config.authDomain) missing.push('authDomain');
  if (!config.appId) missing.push('appId');

  return {
    isConfigured: Boolean(config.apiKey && config.projectId),
    projectId: config.projectId || null,
    hasApiKey: Boolean(config.apiKey),
    hasAuthDomain: Boolean(config.authDomain),
    hasStorageBucket: Boolean(config.storageBucket),
    hasMessagingSenderId: Boolean(config.messagingSenderId),
    hasAppId: Boolean(config.appId),
    missingFields: missing,
  };
}

export function getFirestoreDb(): { db: Firestore | null; projectId: string | null; error?: string } {
  const config = getFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    const diag = getFirebaseDiagnostics();
    const errorMsg = `Firebase configuration incomplete. Missing fields: ${diag.missingFields.join(', ')}. Ensure environment variables are set in Vercel.`;
    console.error('[SiteSprint Firebase]', errorMsg);
    return { db: null, projectId: config.projectId || null, error: errorMsg };
  }

  try {
    const app: FirebaseApp = !getApps().length ? initializeApp(config) : getApp();
    const db: Firestore = getFirestore(app);
    return { db, projectId: config.projectId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[SiteSprint Firebase] Initialization error:', errorMsg);
    return { db: null, projectId: config.projectId, error: errorMsg };
  }
}
