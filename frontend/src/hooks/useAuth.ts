import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (d: { email: string; password: string }) => authService.mockLogin(d.email, d.password),
    onSuccess: (data) => { setAuth(data.user, data.token); qc.setQueryData(['currentUser'], data.user); },
  });

  const signupMutation = useMutation({
    mutationFn: (d: { name: string; email: string; password: string }) => authService.signup({ name: d.name, email: d.email, password: d.password, role: 'employee' }),
    onSuccess: (data) => { setAuth(data.user, data.token); qc.setQueryData(['currentUser'], data.user); },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => { clearAuth(); qc.clear(); },
    onError: () => { clearAuth(); qc.clear(); },
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || signupMutation.error || logoutMutation.error,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
