'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, ArrowRight, MailOpen } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState<'loading' | 'awaiting' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    // 1. If there is no token in the URL, they need to check their inbox.
    if (!token) {
      if (session?.user && !!session.user.emailVerified) {
        setStatus('success');
      } else {
        setStatus('awaiting');
      }
      return; // Correctly exits the hook here
    }

    // 2. If a token IS present, execute actual verification handshake code
    async function verifyToken(validToken: string) {
      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token: validToken // Pass the guaranteed string token safely 🚀
          }
        });

        if (error) {
          setStatus('error');
          setErrorMessage(error.message || 'Verification failed. Link may be expired.');
        } else {
          setStatus('success');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred.');
      }
    }

    // We already checked if (!token) above, so TypeScript knows token is a string here
    verifyToken(token);
  }, [token, session, isPending]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">

        {status === 'loading' && (
          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Processing</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we check your account details...
            </p>
          </div>
        )}

        {status === 'awaiting' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <MailOpen className="h-12 w-12 text-indigo-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              We have sent a secure registration verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                Once you click the link in your email, this page will update automatically.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Verified!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you! Your email address has been successfully verified. You now have full access to NexMart.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 rounded-lg max-w-sm mx-auto">
              {errorMessage}
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Try signing up again
              </Link>
              <Link href="/login" className="text-xs text-gray-500 hover:underline mt-1">
                Back to login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
