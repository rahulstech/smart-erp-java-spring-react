import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company } from '../../common/types/model.types';
import { getCompanies, createCompany, deleteCompany } from '../services/company.service';

export function useGetCompanies() {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: getCompanies
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}
