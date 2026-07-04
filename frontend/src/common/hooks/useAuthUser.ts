import { useQuery } from '@tanstack/react-query';
import { authStorage } from '@/common/storages/AuthStorage';

export function useAuthUser() {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: () => authStorage.getAuthUser(),
  });
}
