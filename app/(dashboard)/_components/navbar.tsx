"use client";

import dynamic from 'next/dynamic';
import { NavbarRoutes } from './navbar-routes';

// تصحيح استيراد التصدير الافتراضي
const MobileSidebar = dynamic(
  () => import('@/app/(dashboard)/_components/mobile-sidebar')
    .then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => (
      <div className="md:hidden pr-4">
        <div className="h-9 w-9 animate-pulse bg-gray-200 rounded-lg" />
      </div>
    )
  }
);

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};
