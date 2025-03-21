'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter, useSearchParams  } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
function VerifyEmailPageContent() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const { verifyEmailWithOTP, loading, error } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');
  useEffect(() => {
 
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [emailFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyEmailWithOTP(email, otp);
    if (success) {
      router.push('/auth/email-verified'); // Redirect to email verified page
    }
  };

  return (
    <Suspense fallback = {<div>Loading....</div>}>
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8 md:gap-16">
          {/* Left Section - App Info */}
          <div className="w-full md:w-1/2 text-center md:text-left p-4 sm:p-6 md:p-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600">GoHabit</h1>
            <p className="text-lg sm:text-xl text-gray-700 mt-4 leading-relaxed">
              Track every habit and achieve success with discipline and consistency.
            </p>
          </div>

          {/* Right Section - OTP Form */}
          <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xl border border-gray-200">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Verify Email</h2>
              <p className="text-sm text-gray-600 text-center">
                We&apos;ve sent a 6-digit OTP to your email address. Please enter it below to verify your email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* OTP Field */}
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    OTP
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {/* Verify OTP Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 disabled:bg-indigo-300"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>

                {/* Display backend errors */}
                {error && (
                  <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
                )}
              </form>

              {/* Resend OTP Link */}
              <div className="text-center">
                <button
                  className="text-sm text-indigo-600 hover:text-indigo-500 transition duration-300"
                  onClick={() => {
                    // Logic to resend the OTP
                    alert('Resending OTP...');
                  }}
                >
                  Didn&apos;t receive the OTP? Resend it.
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-indigo-500 transition duration-300"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </Suspense>
  );
}
