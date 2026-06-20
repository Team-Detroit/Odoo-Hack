import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';
import { useUiStore } from '../../store/uiStore';

const navItems = [
  { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
  { label: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: '🍽️' },
  { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: '📂' },
  { label: 'Payment Methods', path: ROUTES.ADMIN_PAYMENT_METHODS, icon: '💳' },
  { label: 'Floors & Tables', path: ROUTES.ADMIN_FLOORS, icon: '🪑' },
  { label: 'Coupons & Promos', path: ROUTES.ADMIN_COUPONS, icon: '🎟️' },
  { label: 'Users', path: ROUTES.ADMIN_USERS, icon: '👥' },
  { label: 'Self Ordering', path: ROUTES.ADMIN_SELF_ORDERING, icon: '📱' },
  { label: 'KDS', path: ROUTES.KDS, icon: '🖥️' },
  { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: '📈' },
];

export const Sidebar: React.FC = () => {
  const { user, clearAuth } = useAuthContext();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  return (
    <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-200 shrink-0`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {sidebarOpen && <span className="font-bold text-teal-400 text-lg">☕ Odoo Cafe</span>}
        <button onClick={toggleSidebar} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white ml-auto">
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!sidebarOpen ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
            }
          >
            <span className="text-base">{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 px-2 py-3 space-y-1">
        <NavLink
          to={ROUTES.POS}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          title={!sidebarOpen ? 'Go to POS' : undefined}
        >
          <span className="text-base">🏪</span>
          {sidebarOpen && <span>Go to POS</span>}
        </NavLink>
        <div className={`flex items-center gap-2 px-3 py-2 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => { clearAuth(); navigate(ROUTES.LOGIN); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <span>↪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
