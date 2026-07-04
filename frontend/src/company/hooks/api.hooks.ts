import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company } from '../../common/types/model.types';
import { getCompanies, createCompany, deleteCompany, getCompanyById, updateCompany } from '../services/company.service';
import { CompanyFormData } from '../types/company.types';
import { useLogOut } from '@/auth/hooks/api.hooks';

const handleApiError = (error: any, logout: () => void) => {
  if (error.response?.status === 403) {
    logout();
  }
  throw error;
};

export function useGetCompanies() {
  const logout = useLogOut();
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => getCompanies().catch(err => handleApiError(err, logout))
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: CompanyFormData) => createCompany(payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}

export function useGetCompanyById(id: string) {
  const logout = useLogOut();
  return useQuery<Company>({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id).catch(err => handleApiError(err, logout)),
    enabled: !!id
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CompanyFormData }) => 
      updateCompany(id, payload).catch(err => handleApiError(err, logout)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
    }
  });
}
