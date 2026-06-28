import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '../services/customer.service';
import { CustomerFormData } from '../types/customer.types';

export function useCreateCustomer(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerFormData) => createCustomer(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', companyId] });
    }
  });
}
