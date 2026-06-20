import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    signup({ name, email, password }, {
      onSuccess: () => navigate(ROUTES.POS),
      onError: (err: unknown) => setError((err as Error)?.message ?? 'Signup failed'),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="text-center mb-7">
        <div className="text-4xl mb-2">☕</div>
        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        <p className="text-sm text-gray-400 mt-1">Join Odoo Cafe POS</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
        <Input label="Email" type="email" placeholder="you@cafe.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
        <Input label="Password" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
        <Input label="Confirm Password" type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} disabled={isLoading} />
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Create Account</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account? <Link to={ROUTES.LOGIN} className="text-teal-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
};
