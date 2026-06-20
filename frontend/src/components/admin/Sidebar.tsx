import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';
import { useUiStore } from '../../store/uiStore';
import { 
  LayoutDashboard, 
  Utensils, 
  FolderClosed, 
  CreditCard, 
  Grid, 
  Ticket, 
  Users, 
  Smartphone, 
  ChefHat, 
  BarChart3,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: Utensils },
  { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: FolderClosed },
  { label: 'Payment Methods', path: ROUTES.ADMIN_PAYMENT_METHODS, icon: CreditCard },
  { label: 'Floors & Tables', path: ROUTES.ADMIN_FLOORS, icon: Grid },
  { label: 'Coupons & Promos', path: ROUTES.ADMIN_COUPONS, icon: Ticket },
  { label: 'Users', path: ROUTES.ADMIN_USERS, icon: Users },
  { label: 'Self Ordering', path: ROUTES.ADMIN_SELF_ORDERING, icon: Smartphone },
  { label: 'KDS', path: ROUTES.KDS, icon: ChefHat },
  { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const { user, clearAuth } = useAuthContext();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-odoo-purple-light border-r border-gray-200 flex flex-col transition-all duration-200 shrink-0`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <span className="font-script text-2xl font-bold text-odoo-purple">Odoo</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-odoo-teal bg-teal-50 px-2 py-0.5 rounded">Cafe</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-odoo-purple ml-auto">
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-odoo-purple text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-odoo-purple'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 space-y-2">
        <NavLink
          to={ROUTES.POS}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-odoo-purple transition-all"
          title={!sidebarOpen ? 'Go to POS' : undefined}
        >
          <Store className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Go to POS</span>}
        </NavLink>
        
        <div className={`flex items-center gap-2 px-3 py-2 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-odoo-teal text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase">{user?.role}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => { clearAuth(); navigate(ROUTES.LOGIN); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
