'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/ui/header';
import HeaderMobile from '@/components/ui/header-mobile';
import SideNav from '@/components/ui/sidenav';
import HabitTracker from './components/HabitTracker/page';
import Achievements from '../achievements/page';


export default function DashboardPage() {
  // const { isAuthenticated, verifyAuth, refreshToken } = useAuthStore();
  const pathname = usePathname();


  const renderContent = () => {
    switch (pathname) {
      case '/dashboard':
        return <HabitTracker  />;
      case '/habits':
        return <HabitTracker />;;
      case '/achievements':
        return <Achievements />;
      default:
        return <HabitTracker   />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar Navigation */}
      <div className=' lg:w-1/6'>
      <SideNav  />

      </div>
    
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full md:w-5/6 ">
        <Header />
        <HeaderMobile />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto md:mt-0">{renderContent()}</div>
      </main>
    </div>
  );
}