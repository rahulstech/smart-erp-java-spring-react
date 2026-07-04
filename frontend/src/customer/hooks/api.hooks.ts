import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCustomer, getCustomers, deleteCustomer, getCustomerById, updateCustomer } from '../services/customer.service';
import { CustomerFormData } from '../types/customer.types';
import { Customer } from '../../common/types/model.types';
import { useLogOut } from '@/auth/hooks/api.hooks';

const handleApiError = (error: any, logout: () => void) => {
  if (error.response?.status === 403) {
    logout();
  }
  throw error;
};

export function useCreateCustomer(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: CustomerFormData) => createCustomer(companyId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
    }
  });
}

export function useGetCustomers(companyId: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['customers', companyId],
    queryFn: () => getCustomers(companyId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId
  });
}

export function useDeleteCustomer(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(companyId, customerId).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
    }
  });
}

export function useGetCustomerById(companyId: string, customerId: string) {
  const logout = useLogOut();
  return useQuery<Customer>({
    queryKey: ['customer', companyId, customerId],
    queryFn: () => getCustomerById(companyId, customerId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId && !!customerId
  });
}

export function useUpdateCustomer(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: ({ customerId, payload }: { customerId: string; payload: CustomerFormData }) =>
      updateCustomer(companyId, customerId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['customer', companyId, data.id] });
    }
  });
}

