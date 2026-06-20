import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';

interface NavbarProps { onSearch?: (q: string) => void; tableLabel?: string; }

export const Navbar: React.FC<NavbarProps> = ({ onSearch, tableLabel }) => {
  const { user, clearAuth } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const debounced = useDebounce(search);

  React.useEffect(() => { onSearch?.(debounced); }, [debounced, onSearch]);

  const navLinks = [
    { label: 'Order', path: ROUTES.POS },
    { label: 'Orders', path: ROUTES.POS_ORDERS },
    { label: 'Tables', path: ROUTES.POS_TABLE_VIEW },
    { label: 'Customers', path: ROUTES.POS_CUSTOMERS },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-4 shrink-0">
      <Link to={ROUTES.POS} className="font-bold text-teal-600 text-lg shrink-0">☕ POS</Link>

      <div className="flex gap-1">
        {navLinks.map((l) => (
          <NavLink key={l.path} to={l.path} end={l.path === ROUTES.POS}
            className={({ isActive }) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            {l.label}
          </NavLink>
        ))}
      </div>

      {onSearch && (
        <div className="flex-1 max-w-xs">
          <input
            type="search" placeholder="Search products…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}

      {tableLabel && <span className="ml-2 px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">{tableLabel}</span>}

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">📊 Admin Panel</Link>
              <Link to={ROUTES.KDS} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">🖥️ KDS</Link>
              <Link to={ROUTES.ADMIN_REPORTS} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">📈 Reports</Link>
              <Link to={ROUTES.CUSTOMER_DISPLAY} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">📺 Customer Display</Link>
              <hr className="my-1" />
              <button onClick={() => { clearAuth(); navigate(ROUTES.LOGIN); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">↪ Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
