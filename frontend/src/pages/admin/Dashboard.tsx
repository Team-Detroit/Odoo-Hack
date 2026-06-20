import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';

const cards = [
  { label: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: '🍽️', desc: 'Manage menu items' },
  { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: '📂', desc: 'Organize products' },
  { label: 'Floors & Tables', path: ROUTES.ADMIN_FLOORS, icon: '🪑', desc: 'Floor & table layout' },
  { label: 'Payment Methods', path: ROUTES.ADMIN_PAYMENT_METHODS, icon: '💳', desc: 'Cash, Card, UPI' },
  { label: 'Coupons & Promos', path: ROUTES.ADMIN_COUPONS, icon: '🎟️', desc: 'Discounts & offers' },
  { label: 'Users', path: ROUTES.ADMIN_USERS, icon: '👥', desc: 'Staff accounts' },
  { label: 'Self Ordering', path: ROUTES.ADMIN_SELF_ORDERING, icon: '📱', desc: 'QR menu config' },
  { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: '📈', desc: 'Sales analytics' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name} 👋</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your cafe from here.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.path} to={c.path}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">
            <div className="text-2xl mb-2">{c.icon}</div>
            <p className="font-medium text-sm text-gray-800 group-hover:text-teal-600">{c.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
