'use client';

import Link from 'next/link';
import Footer from '@/components/shared/Footer';

export default function EmailVerificationSuccessPage() {
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

          {/* Right Section - Success Message */}
          <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xl border border-gray-200">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Email Verified</h2>
              <p className="text-sm text-gray-600 text-center">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 inline-block"
                >
                  Log In
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