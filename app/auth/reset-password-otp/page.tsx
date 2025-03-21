'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default function ResetPasswordOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordOTPPageContent />
    </Suspense>
  );
}

 function ResetPasswordOTPPageContent() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const { verifyPasswordResetOTP, resetPassword, loading, error, requestPasswordReset } = useAuthStore();
  const router = useRouter();

  const [canResendOTP, setCanResendOTP] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  // Use `useSearchParams` to access query parameters
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');

  // Extract email from query parameters
  useEffect(() => {
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [emailFromQuery]);

  // Handle OTP resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleResendOTP = async () => {
    if (!canResendOTP) return;

    const success = await requestPasswordReset(email);
    if (success) {
      setCanResendOTP(false);
      setCooldown(60); // 60 seconds cooldown
      setTimeout(() => setCanResendOTP(true), 60000);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyPasswordResetOTP(email, otp);
    if (success) {
      setIsOTPVerified(true);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const success = await resetPassword(email, otp, newPassword, confirmPassword);
    if (success) {
      router.push('/auth/password-reset-success');
    }
  };

  return (
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
              <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h2>
              <p className="text-sm text-gray-600 text-center">
                {isOTPVerified
                  ? 'Enter your new password.'
                  : 'Enter the OTP sent to your email to reset your password.'}
              </p>

              {!isOTPVerified ? (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
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
                        onChange={handleOTPChange}
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
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter new password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Confirm new password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  {/* Reset Password Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 disabled:bg-indigo-300"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>

                  {/* Display backend errors */}
                  {error && (
                    <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
                  )}
                </form>
              )}

              {/* Resend OTP Link */}
              {!isOTPVerified && (
                <div className="text-center">
                  <button
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition duration-300"
                    onClick={handleResendOTP}
                    disabled={!canResendOTP}
                  >
                    {canResendOTP ? "Didn't receive the OTP? Resend it." : `Resend OTP in ${cooldown}s`}
                  </button>
                </div>
              )}

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
  );
}
