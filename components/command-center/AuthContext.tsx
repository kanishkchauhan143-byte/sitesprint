'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthorized: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthorized: false,
  authError: null,
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
});

// Authorized owner emails (can be extended via NEXT_PUBLIC_ADMIN_EMAILS comma-separated)
const AUTHORIZED_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'team.sitesprint@gmail.com'
)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const { auth, error } = getFirebaseAuth();
    if (!auth) {
      console.warn('[SiteSprint AuthProvider] Firebase Auth not initialized:', error);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const email = currentUser.email.toLowerCase();
        const authorized = AUTHORIZED_EMAILS.includes(email);
        setIsAuthorized(authorized);
        if (!authorized) {
          setAuthError(
            `Access restricted: "${currentUser.email}" is not authorized for SiteSprint Command Center.`
          );
        } else {
          setAuthError(null);
        }
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    const { auth, error: authInitError } = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      throw new Error(authInitError || 'Authentication service is unavailable.');
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const userEmail = cred.user.email?.toLowerCase();
      if (!userEmail || !AUTHORIZED_EMAILS.includes(userEmail)) {
        setIsAuthorized(false);
        await firebaseSignOut(auth);
        throw new Error(
          `Unauthorized account: ${cred.user.email} is not permitted to access SiteSprint Command Center.`
        );
      }
      setIsAuthorized(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to authenticate. Please check your credentials.';
      // Simplify Firebase error messages for owner UX
      let friendlyMsg = msg;
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        friendlyMsg = 'Invalid email or password. Please verify your credentials.';
      } else if (msg.includes('auth/user-not-found')) {
        friendlyMsg = 'No account found matching this email address.';
      } else if (msg.includes('auth/too-many-requests')) {
        friendlyMsg = 'Access temporarily restricted due to many failed attempts. Try again later.';
      }
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { auth } = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setIsAuthorized(false);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthorized,
        authError,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
