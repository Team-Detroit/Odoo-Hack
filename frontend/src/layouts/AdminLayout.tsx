import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/payment-methods': 'Payment Methods',
  '/admin/floors': 'Floors & Tables',
  '/admin/coupons': 'Coupons & Promotions',
  '/admin/users': 'Users',
  '/admin/self-ordering': 'Self Ordering Settings',
  '/admin/reports': 'Reports',
};

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <h1 className="text-base font-semibold text-gray-800">{pageTitles[pathname] ?? 'Admin'}</h1>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
