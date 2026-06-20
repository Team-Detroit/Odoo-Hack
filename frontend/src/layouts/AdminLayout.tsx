import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthContext } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, clearAuth } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Products', path: ROUTES.ADMIN_PRODUCTS },
    { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES },
    { label: 'Payment Methods', path: ROUTES.ADMIN_PAYMENT_METHODS },
    { label: 'Floors & Tables', path: ROUTES.ADMIN_FLOORS },
    { label: 'Coupons', path: ROUTES.ADMIN_COUPONS },
    { label: 'Promotions', path: ROUTES.ADMIN_PROMOTIONS },
    { label: 'Users', path: ROUTES.ADMIN_USERS },
    { label: 'Self-Ordering', path: ROUTES.ADMIN_SELF_ORDERING },
    { label: 'KDS', path: ROUTES.KDS },
    { label: 'Reports', path: ROUTES.ADMIN_REPORTS },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Odoo Cafe' : '☕'}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors mb-2"
              title={!isSidebarOpen ? item.label : undefined}
            >
              {isSidebarOpen ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-2 truncate" title={user?.name}>
            {user?.name}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            {isSidebarOpen ? 'Logout' : '↪'}
          </button>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="m-4 p-2 hover:bg-gray-700 rounded-md"
        >
          {isSidebarOpen ? '←' : '→'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin</h2>
          <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
