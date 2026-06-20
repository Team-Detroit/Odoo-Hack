import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { PosLayout } from '../layouts/PosLayout';
import { KdsLayout } from '../layouts/KdsLayout';
import { CustomerDisplayLayout } from '../layouts/CustomerDisplayLayout';
import { SelfOrderLayout } from '../layouts/SelfOrderLayout';

// Guards
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Auth
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';

// Admin
import { Dashboard } from '../pages/admin/Dashboard';
import { Products } from '../pages/admin/Products';
import { Categories } from '../pages/admin/Categories';
import { PaymentMethods } from '../pages/admin/PaymentMethods';
import { Floors } from '../pages/admin/Floors';
import { Coupons } from '../pages/admin/Coupons';
import { Users } from '../pages/admin/Users';
import { SelfOrderingSettings } from '../pages/admin/SelfOrderingSettings';
import { Reports } from '../pages/admin/Reports';

// POS
import { OrderView } from '../pages/POS/OrderView';
import { Orders } from '../pages/POS/Orders';
import { OrderDetail } from '../pages/POS/OrderDetail';
import { TableView } from '../pages/POS/TableView';
import { Customers } from '../pages/POS/Customers';

// KDS
import { KdsBoard } from '../pages/KDS/KdsBoard';

// Customer Display
import { CustomerDisplay } from '../pages/customer-display/CustomerDisplay';

// Self Ordering
import { SelfOrderMenu } from '../pages/self-ordering/SelfOrderMenu';
import { QrMenuOnly } from '../pages/self-ordering/QrMenuOnly';

// Not Found
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>

      {/* Auth routes — public only */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={ROUTES.SIGNUP} element={<PublicRoute><Signup /></PublicRoute>} />
      </Route>

      {/* Admin routes — admin role only */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
          <Route path={ROUTES.ADMIN_CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.ADMIN_PAYMENT_METHODS} element={<PaymentMethods />} />
          <Route path={ROUTES.ADMIN_FLOORS} element={<Floors />} />
          <Route path={ROUTES.ADMIN_COUPONS} element={<Coupons />} />
          <Route path={ROUTES.ADMIN_USERS} element={<Users />} />
          <Route path={ROUTES.ADMIN_SELF_ORDERING} element={<SelfOrderingSettings />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<Reports />} />
        </Route>
      </Route>

      {/* POS routes — any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PosLayout />}>
          <Route path={ROUTES.POS} element={<OrderView />} />
          <Route path={ROUTES.POS_ORDERS} element={<Orders />} />
          <Route path={ROUTES.POS_ORDERS_DETAIL} element={<OrderDetail />} />
          <Route path={ROUTES.POS_TABLE_VIEW} element={<TableView />} />
          <Route path={ROUTES.POS_CUSTOMERS} element={<Customers />} />
        </Route>
      </Route>

      {/* KDS — any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<KdsLayout />}>
          <Route path={ROUTES.KDS} element={<KdsBoard />} />
        </Route>
      </Route>

      {/* Customer Display — no auth */}
      <Route element={<CustomerDisplayLayout />}>
        <Route path={ROUTES.CUSTOMER_DISPLAY} element={<CustomerDisplay />} />
        <Route path="/Customer-Display" element={<CustomerDisplay />} />
      </Route>

      {/* Self Ordering — no auth */}
      <Route element={<SelfOrderLayout />}>
        <Route path={ROUTES.SELF_ORDER} element={<SelfOrderMenu />} />
        <Route path={ROUTES.QR_MENU} element={<QrMenuOnly />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  </BrowserRouter>
);
