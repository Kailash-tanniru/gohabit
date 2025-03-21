'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { SIDENAV_ITEMS } from '../constants';
import { CgProfile } from "react-icons/cg";
import { useAuthStore } from '@/lib/stores/authStore';

const SideNav: React.FC = () => {

  const { user, fetchUserDetails, refreshToken } = useAuthStore();
  // const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading user data
  
  const memoizedFetchUserDetails = useCallback(async () => {
    try {
      await refreshToken();
      await fetchUserDetails();
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false); // Once the user details are fetched, set loading to false
    }
  }, [fetchUserDetails, refreshToken]);

  useEffect(() => {
    memoizedFetchUserDetails();
  }, [memoizedFetchUserDetails]);



  // If user data is still loading, render a loading state
  if (loading) {
    return (
      <div className="hidden md:flex md:flex-col md:w-64 h-screen fixed top-0 left-0 border-r border-gray-200 bg-white z-40">
        <div className="flex items-center justify-center h-full">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`hidden md:flex md:flex-col h-screen  border-r `}>
      {/* User Profile */}
      <div className="flex items-center p-2 mt-5 h-24 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-black"><CgProfile className='h-8 w-8'/></span>
          </div>
          <div>
            {/* Conditionally render user details if available */}
            <p className="text-gray-800 text-lg">{user?.username || "Guest"}</p>
            <p className="text-sm text-gray-500">{user?.email || "Guest"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {SIDENAV_ITEMS.map((item, idx) => (
          <SideNavMenuItem key={idx} item={item} />
        ))}
      </nav>

      {/* Logout Button */}
      {/* Uncomment this block to enable the logout button */}
      {/* 
      <div className="border-t border-gray-200 p-4">
        <button
          className="block w-full text-center py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          onClick={handleLogout} // Call handleLogout on click
        >
          Logout
        </button>
      </div> 
      */}
    </div>
  );
};

export default SideNav;

/** Individual Menu Item */
const SideNavMenuItem: React.FC<{ item: { title: string; path: string; icon: string } }> = ({
  item,
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`flex items-center space-x-3 p-3 rounded-lg transition ${
        isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
      }`}
    >
      {item.icon && <Icon icon={item.icon} width="20" />}
      <span>{item.title}</span>
    </Link>
  );
};
