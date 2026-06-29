import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCustomer, getCustomers, deleteCustomer, getCustomerById, updateCustomer } from '../services/customer.service';
import { CustomerFormData } from '../types/customer.types';
import { Customer } from '../../common/types/model.types';

export function useCreateCustomer(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerFormData) => createCustomer(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
    }
  });
}

export function useGetCustomers(companyId: string) {
  return useQuery({
    queryKey: ['customers', companyId],
    queryFn: () => getCustomers(companyId),
    enabled: !!companyId
  });
}

export function useDeleteCustomer(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(companyId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
    }
  });
}

export function useGetCustomerById(companyId: string, customerId: string) {
  return useQuery<Customer>({
    queryKey: ['customer', companyId, customerId],
    queryFn: () => getCustomerById(companyId, customerId),
    enabled: !!companyId && !!customerId
  });
}

export function useUpdateCustomer(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, payload }: { customerId: string; payload: CustomerFormData }) =>
      updateCustomer(companyId, customerId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['customer', companyId, data.id] });
    }
  });
}

