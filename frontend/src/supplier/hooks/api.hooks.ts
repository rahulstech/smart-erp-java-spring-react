import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSupplier, getSuppliers, deleteSupplier, getSupplierById, updateSupplier } from '../services/supplier.service';
import { SupplierFormData } from '../types/supplier.types';
import { Supplier } from '../../common/types/model.types';
import { useLogOut } from '@/auth/hooks/api.hooks';

const handleApiError = (error: any, logout: () => void) => {
  if (error.response?.status === 403) {
    logout();
  }
  throw error;
};

export function useCreateSupplier(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: SupplierFormData) => createSupplier(companyId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
    }
  });
}

export function useGetSuppliers(companyId: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['suppliers', companyId],
    queryFn: () => getSuppliers(companyId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId
  });
}

export function useDeleteSupplier(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (supplierId: string) => deleteSupplier(companyId, supplierId).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
    }
  });
}

export function useGetSupplierById(companyId: string, supplierId: string) {
  const logout = useLogOut();
  return useQuery<Supplier>({
    queryKey: ['supplier', companyId, supplierId],
    queryFn: () => getSupplierById(companyId, supplierId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId && !!supplierId
  });
}

export function useUpdateSupplier(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: ({ supplierId, payload }: { supplierId: string; payload: SupplierFormData }) =>
      updateSupplier(companyId, supplierId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['supplier', companyId, data.id] });
    }
  });
}
