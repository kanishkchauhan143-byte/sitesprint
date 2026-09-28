'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { LogoMark } from '@/components/ui/LogoMark';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isAuthorized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAuthorized)) {
      router.replace('/command-center/login');
    }
  }, [user, isAuthorized, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--void)] flex flex-col items-center justify-center p-6 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-20 h-20 rounded-full bg-[var(--current)]/20 animate-ping" />
          <div className="relative z-10 p-3 rounded-2xl bg-[var(--elevated)] border border-[var(--hairline)] shadow-[0_0_30px_rgba(124,58,237,0.25)]">
            <LogoMark size="lg" />
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--mist)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--current-bright)] animate-pulse" />
          Authenticating SiteSprint Command Center...
        </p>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};
