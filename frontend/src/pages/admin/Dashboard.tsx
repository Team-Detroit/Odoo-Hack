import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthContext } from '../../context/AuthContext';
import { 
  UtensilsCrossed, 
  FolderKanban, 
  Armchair, 
  CreditCard, 
  TicketPercent, 
  Users, 
  QrCode, 
  BarChart3 
} from 'lucide-react';

const cards = [
  { label: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: UtensilsCrossed, color: 'text-purple-500', desc: 'Manage menu items' },
  { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: FolderKanban, color: 'text-amber-500', desc: 'Organize products' },
  { label: 'Floors & Tables', path: ROUTES.ADMIN_FLOORS, icon: Armchair, color: 'text-amber-900', desc: 'Floor & table layout' },
  { label: 'Payment Methods', path: ROUTES.ADMIN_PAYMENT_METHODS, icon: CreditCard, color: 'text-blue-500', desc: 'Cash, Card, UPI' },
  { label: 'Coupons & Promos', path: ROUTES.ADMIN_COUPONS, icon: TicketPercent, color: 'text-pink-500', desc: 'Discounts & offers' },
  { label: 'Users', path: ROUTES.ADMIN_USERS, icon: Users, color: 'text-violet-500', desc: 'Staff accounts' },
  { label: 'Self Ordering', path: ROUTES.ADMIN_SELF_ORDERING, icon: QrCode, color: 'text-emerald-500', desc: 'QR menu config' },
  { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: BarChart3, color: 'text-indigo-500', desc: 'Sales analytics' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your cafe from here.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const IconComponent = c.icon;
          return (
            <Link 
              key={c.path} 
              to={c.path}
              className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-[#714B67] cursor-pointer group flex flex-col items-start"
            >
              <div className="mb-3">
                <IconComponent className={`${c.color}`} size={28} />
              </div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-[#714B67]">{c.label}</p>
              <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
