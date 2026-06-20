import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authService.mockLogin(data.email, data.password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authService.mockSignup(data.name, data.email),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Even if logout request fails, clear local auth state
      clearAuth();
      queryClient.clear();
    },
  });

  const getCurrentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !!token,
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending ||
      getCurrentUserQuery.isLoading,
    error:
      loginMutation.error ||
      signupMutation.error ||
      logoutMutation.error ||
      getCurrentUserQuery.error,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
