import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
    <div className="text-6xl mb-4">🫙</div>
    <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
    <p className="text-gray-500 mb-6">Page not found.</p>
    <Link to={ROUTES.POS} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
      Go to POS
    </Link>
  </div>
);
