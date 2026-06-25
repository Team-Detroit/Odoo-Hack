import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Spinner } from '../components/common/Spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Spinner size="lg" />
    </div>
  );

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/pos" replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
