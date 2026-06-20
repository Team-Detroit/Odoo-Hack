import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(ROUTES.POS)}>
          Go Back to POS
        </Button>
      </div>
    </div>
  );
};
