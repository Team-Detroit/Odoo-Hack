import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import bgImage from '../../assets/images/img.jpg';
export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    login({ email, password }, {
      onSuccess: () => navigate(ROUTES.POS),
      onError: (err: unknown) => setError((err as Error)?.message ?? 'Login failed'),
    });
  }; return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 w-[500px] border border-gray-100">

        <div className="text-center mb-7">

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-script text-4xl font-bold text-odoo-purple">
              Odoo
            </span>

            <span className="text-sm font-semibold uppercase tracking-wider text-white bg-odoo-teal px-2 py-0.5 rounded shadow-sm">
              Cafe
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Point of Sale
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Sign in to start your session
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Email"
            type="email"
            placeholder="admin@cafe.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Sign In
          </Button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          No account?{" "}
          <Link
            to={ROUTES.SIGNUP}
            className="text-odoo-teal font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-5 p-3.5 bg-odoo-purple-light border border-odoo-purple/10 rounded-lg text-xs text-odoo-purple space-y-1">

          <p className="font-bold uppercase tracking-wider text-[10px]">
            Demo credentials
          </p>

          <p>
            Admin: <span className="font-semibold">admin@cafe.com</span> / password123
          </p>

          <p>
            Employee: <span className="font-semibold">john@cafe.com</span> / password123
          </p>

        </div>

      </div>
    </div>
  );
};