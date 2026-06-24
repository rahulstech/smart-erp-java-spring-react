import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company } from '../../common/types/model.types';
import { getCompanies, createCompany, deleteCompany, getCompanyById, updateCompany } from '../services/company.service';
import { CompanyFormData } from '../types/company.types';

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

export function useGetCompanyById(id: string) {
  return useQuery<Company>({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id),
    enabled: !!id
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CompanyFormData }) => updateCompany(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
    }
  });
}
