'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import { useAuthStore } from '@/lib/stores/authStore';

export default function OTPPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { verifyPasswordResetOTP, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyPasswordResetOTP(email, otp, newPassword);
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
                Enter the OTP sent to your email and your new password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

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

                {/* New Password Field */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="••••••••"
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
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </div>

                {/* Display backend errors */}
                {error && (
                  <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
                )}
              </form>

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