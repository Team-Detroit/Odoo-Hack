import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../constants/routes';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    signup(
      { name, email, password },
      {
        onSuccess: () => {
          navigate(ROUTES.POS);
        },
        onError: (err: any) => {
          setError(err?.message || 'Signup failed');
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">☕ Odoo Cafe</h1>
        <p className="text-gray-600">Create Account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />

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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-teal-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
