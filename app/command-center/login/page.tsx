'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoMark } from '@/components/ui/LogoMark';
import { AuthProvider, useAuth } from '@/components/command-center/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const { user, isAuthorized, loading: authLoading, login, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already logged in and authorized, redirect straight to dashboard
  useEffect(() => {
    if (!authLoading && user && isAuthorized) {
      router.replace('/command-center');
    }
  }, [user, isAuthorized, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/command-center');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-[var(--void)] text-[var(--paper)] flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Bar with back link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mist)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SiteSprint</span>
        </Link>

        <span className="font-mono text-[11px] text-[var(--mist)] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          Secure Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--elevated)] border border-[var(--hairline)] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl relative overflow-hidden">
          {/* Subtle purple gradient background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--current)]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-7 relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-[var(--void)] border border-[var(--hairline)] mb-4 shadow-[0_0_25px_rgba(124,58,237,0.25)]">
              <LogoMark size="lg" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--paper)]">
              Command Center
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--current-bright)] mt-1">
              SiteSprint Operations & Lead Management
            </p>
          </div>

          {/* Error Message Alert */}
          {activeError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{activeError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Field */}
            <div>
              <label
                htmlFor="command-email"
                className="block text-xs font-mono uppercase tracking-wider text-[var(--mist)] mb-1.5"
              >
                Owner Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mist)] pointer-events-none" />
                <input
                  id="command-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team.sitesprint@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--void)] border border-[var(--hairline)] rounded-xl text-sm text-[var(--paper)] placeholder:text-[var(--mist)]/40 focus:border-[var(--current-bright)] focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="command-password"
                className="block text-xs font-mono uppercase tracking-wider text-[var(--mist)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mist)] pointer-events-none" />
                <input
                  id="command-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--void)] border border-[var(--hairline)] rounded-xl text-sm text-[var(--paper)] placeholder:text-[var(--mist)]/40 focus:border-[var(--current-bright)] focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--mist)] hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--current)] to-[#8B5CF6] text-white font-mono text-xs font-semibold uppercase tracking-wider hover:from-[var(--current-bright)] hover:to-[var(--current)] transition-all shadow-[0_4px_25px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Command Center</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[var(--hairline)] text-center">
            <p className="font-mono text-[10px] text-[var(--mist)]/70 uppercase tracking-widest leading-relaxed">
              Restricted to authorized SiteSprint operators only.
              <br />
              All access attempts are authenticated and logged.
            </p>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-md w-full mx-auto text-center font-mono text-[11px] text-[var(--mist)]/60">
        © {new Date().getFullYear()} SiteSprint Lead Operations
      </div>
    </div>
  );
}

export default function CommandLoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
