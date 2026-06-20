import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
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
    if (!email || !password) { setError('Please fill in all fields'); return; }
    login({ email, password }, {
      onSuccess: () => navigate(ROUTES.POS),
      onError: (err: unknown) => setError((err as Error)?.message ?? 'Login failed'),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="text-center mb-7">
        <div className="text-4xl mb-2">☕</div>
        <h1 className="text-2xl font-bold text-gray-800">Odoo Cafe POS</h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to continue</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="admin@cafe.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Sign In</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">
        No account? <Link to={ROUTES.SIGNUP} className="text-teal-600 font-medium hover:underline">Sign up</Link>
      </p>
      <div className="mt-5 p-3 bg-blue-50 rounded-lg text-xs text-blue-600 space-y-1">
        <p className="font-semibold">Demo credentials</p>
        <p>Admin: admin@cafe.com / any password</p>
        <p>Employee: john@cafe.com / any password</p>
      </div>
    </div>
  );
};
