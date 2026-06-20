import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../constants/routes';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate(ROUTES.POS);
        },
        onError: (err: any) => {
          setError(err?.message || 'Login failed');
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">☕ Odoo Cafe</h1>
        <p className="text-gray-600">Point of Sale System</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Login
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to={ROUTES.SIGNUP} className="text-teal-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <p>Email: admin@cafe.com or john@cafe.com</p>
        <p>Password: Any password</p>
      </div>
    </div>
  );
};
