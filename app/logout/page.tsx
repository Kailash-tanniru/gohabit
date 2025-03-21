'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Icon } from '@iconify/react';

const Logout = () => {
  const router = useRouter();
  const { logout,refreshToken } = useAuthStore();


  const handleLogout =async () => {
    await refreshToken();

    await logout();
    router.push('/')
    
    
  };

  return (
    <div className="min-h-screen bg-[#F4F6FF] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200 max-w-md w-full text-center">
        {/* Logout Icon */}
        <div className="flex justify-center">
          <Icon icon="mdi:logout" className="h-12 w-12 text-indigo-600" />
        </div>

        {/* Logout Confirmation Message */}
        <h2 className="text-2xl font-bold text-gray-900 mt-6">Are you sure you want to log out?</h2>
        <p className="text-gray-600 mt-2">
          You will be signed out of your account and redirected to the login page.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.back()} // Go back to the previous page
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;