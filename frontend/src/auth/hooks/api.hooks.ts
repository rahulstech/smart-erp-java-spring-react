import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authStorage } from '@/common/storages/AuthStorage';
import { login, register } from '../services/auth.service';

export function useIsLoggedIn() {
  const { data } = useQuery({
    queryKey: ['isLoggedIn'],
    queryFn: () => !!authStorage.getToken()?.authToken,
    initialData: () => !!authStorage.getToken()?.authToken,
  });
  return data;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStorage.saveTokens({ authToken: data.authToken });
      authStorage.saveAuthUser({
        displayName: data.userDisplayName,
        email: data.userEmail,
      });
      queryClient.invalidateQueries({ queryKey: ['isLoggedIn'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      authStorage.saveTokens({ authToken: data.authToken });
      authStorage.saveAuthUser({
        displayName: data.userDisplayName,
        email: data.userEmail,
      });
      queryClient.invalidateQueries({ queryKey: ['isLoggedIn'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    authStorage.clear();
    queryClient.invalidateQueries({ queryKey: ['isLoggedIn'] });
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
  }, [queryClient]);
}
