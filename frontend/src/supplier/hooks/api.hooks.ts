import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSupplier, getSuppliers, deleteSupplier, getSupplierById, updateSupplier } from '../services/supplier.service';
import { SupplierFormData } from '../types/supplier.types';
import { Supplier } from '../../common/types/model.types';

export function useCreateSupplier(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplierFormData) => createSupplier(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
    }
  });
}

export function useGetSuppliers(companyId: string) {
  return useQuery({
    queryKey: ['suppliers', companyId],
    queryFn: () => getSuppliers(companyId),
    enabled: !!companyId
  });
}

export function useDeleteSupplier(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (supplierId: string) => deleteSupplier(companyId, supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
    }
  });
}

export function useGetSupplierById(companyId: string, supplierId: string) {
  return useQuery<Supplier>({
    queryKey: ['supplier', companyId, supplierId],
    queryFn: () => getSupplierById(companyId, supplierId),
    enabled: !!companyId && !!supplierId
  });
}

export function useUpdateSupplier(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, payload }: { supplierId: string; payload: SupplierFormData }) =>
      updateSupplier(companyId, supplierId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['supplier', companyId, data.id] });
    }
  });
}
