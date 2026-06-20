import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { 
  Search, 
  Settings, 
  ChefHat, 
  BarChart3, 
  Monitor, 
  LogOut, 
  User 
} from 'lucide-react';

interface NavbarProps { onSearch?: (q: string) => void; tableLabel?: string; }

export const Navbar: React.FC<NavbarProps> = ({ onSearch, tableLabel }) => {
  const { user, clearAuth } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const debounced = useDebounce(search);

  useEffect(() => { onSearch?.(debounced); }, [debounced, onSearch]);

  const navLinks = [
    { label: 'Order', path: ROUTES.POS },
    { label: 'Orders', path: ROUTES.POS_ORDERS },
    { label: 'Tables', path: ROUTES.POS_TABLE_VIEW },
    { label: 'Customers', path: ROUTES.POS_CUSTOMERS },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 shrink-0 shadow-sm">
      <Link to={ROUTES.POS} className="flex items-center gap-1.5 shrink-0">
        <span className="font-script text-2xl font-bold text-odoo-purple">Odoo</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-white bg-odoo-teal px-1.5 py-0.5 rounded shadow-sm">POS</span>
      </Link>

      <div className="flex gap-1 ml-2">
        {navLinks.map((l) => (
          <NavLink key={l.path} to={l.path} end={l.path === ROUTES.POS}
            className={({ isActive }) => `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isActive 
                ? 'bg-odoo-purple text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-odoo-purple'
            }`}>
            {l.label}
          </NavLink>
        ))}
      </div>

      {onSearch && (
        <div className="flex-1 max-w-xs relative ml-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search" placeholder="Search products…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-odoo-teal focus:border-transparent transition-all"
          />
        </div>
      )}

      {tableLabel && (
        <span className="ml-2 px-3 py-1 bg-teal-50 text-odoo-teal border border-teal-200 text-xs font-semibold rounded-full shadow-sm">
          {tableLabel}
        </span>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-gray-800">{user?.name}</p>
          <p className="text-[10px] text-gray-400 capitalize font-medium">{user?.role}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 bg-odoo-purple-light border border-odoo-purple/10 text-odoo-purple rounded-full flex items-center justify-center font-bold text-sm shadow-sm hover:bg-gray-100 transition-all"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-odoo-purple">
                <Settings className="w-4 h-4 text-gray-400" /> Admin Panel
              </Link>
              <Link to={ROUTES.KDS} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-odoo-purple">
                <ChefHat className="w-4 h-4 text-gray-400" /> KDS Dashboard
              </Link>
              <Link to={ROUTES.ADMIN_REPORTS} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-odoo-purple">
                <BarChart3 className="w-4 h-4 text-gray-400" /> Reports
              </Link>
              <Link to={ROUTES.CUSTOMER_DISPLAY} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-odoo-purple">
                <Monitor className="w-4 h-4 text-gray-400" /> Customer Display
              </Link>
              <hr className="my-1.5 border-gray-100" />
              <button onClick={() => { clearAuth(); navigate(ROUTES.LOGIN); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
