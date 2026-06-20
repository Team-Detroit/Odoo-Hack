import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthContext } from '../context/AuthContext';

export const PosLayout: React.FC = () => {
  const { user, clearAuth } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-teal-600">☕ Odoo POS</h1>
          <div className="flex gap-4">
            <Link to={ROUTES.POS} className="px-4 py-2 hover:bg-gray-100 rounded-md font-medium">
              Order
            </Link>
            <Link to={ROUTES.POS_ORDERS} className="px-4 py-2 hover:bg-gray-100 rounded-md font-medium">
              Orders
            </Link>
            <Link to={ROUTES.POS_TABLE_VIEW} className="px-4 py-2 hover:bg-gray-100 rounded-md font-medium">
              Tables
            </Link>
            <Link to={ROUTES.POS_CUSTOMERS} className="px-4 py-2 hover:bg-gray-100 rounded-md font-medium">
              Customers
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-medium">{user?.name}</div>
            <div className="text-gray-500 text-xs">{user?.role}</div>
          </div>
          <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="relative group">
            <button className="ml-4 px-4 py-2 text-gray-700 hover:text-teal-600 font-medium">
              ⋮ Menu
            </button>
            <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Admin Panel
              </Link>
              <Link
                to={ROUTES.KDS}
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                KDS
              </Link>
              <Link
                to={ROUTES.ADMIN_REPORTS}
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
