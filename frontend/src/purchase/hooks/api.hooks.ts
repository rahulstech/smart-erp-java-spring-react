import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPurchaseVoucher,
  getPurchaseVouchers,
  getPurchaseVoucherById,
  updatePurchaseVoucher,
  deletePurchaseVoucher,
  createPurchaseVoucherItems,
  updatePurchaseVoucherItems,
  getPurchaseVoucherItems,
  getPurchaseVoucherItemById
} from '../services/purchase.service';
import {
  CreatePurchaseVoucherRequest,
  UpdatePurchaseVoucherRequest,
  PurchaseVoucherItemsRequest
} from '../types/purchase.types';

export function useCreatePurchaseVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseVoucherRequest) => createPurchaseVoucher(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseVouchers', companyId] });
    }
  });
}

export function useGetPurchaseVouchers(companyId: string) {
  return useQuery({
    queryKey: ['purchaseVouchers', companyId],
    queryFn: () => getPurchaseVouchers(companyId),
    enabled: !!companyId
  });
}

export function useGetPurchaseVoucherById(companyId: string, voucherId: string) {
  return useQuery({
    queryKey: ['purchaseVoucher', companyId, voucherId],
    queryFn: () => getPurchaseVoucherById(companyId, voucherId),
    enabled: !!companyId && !!voucherId
  });
}

export function useUpdatePurchaseVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ voucherId, payload }: { voucherId: string; payload: UpdatePurchaseVoucherRequest }) =>
      updatePurchaseVoucher(companyId, voucherId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['purchaseVoucher', companyId, data.id] });
    }
  });
}

export function useDeletePurchaseVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voucherId: string) => deletePurchaseVoucher(companyId, voucherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseVouchers', companyId] });
    }
  });
}

export function useCreatePurchaseVoucherItems(companyId: string, voucherId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PurchaseVoucherItemsRequest) => createPurchaseVoucherItems(companyId, voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['purchaseVoucher', companyId, voucherId] });
      queryClient.invalidateQueries({ queryKey: ['purchaseVoucherItems', companyId, voucherId] });
    }
  });
}

export function useUpdatePurchaseVoucherItems(companyId: string, voucherId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PurchaseVoucherItemsRequest) => updatePurchaseVoucherItems(companyId, voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['purchaseVoucher', companyId, voucherId] });
      queryClient.invalidateQueries({ queryKey: ['purchaseVoucherItems', companyId, voucherId] });
    }
  });
}

export function useGetPurchaseVoucherItems(companyId: string, voucherId: string) {
  return useQuery({
    queryKey: ['purchaseVoucherItems', companyId, voucherId],
    queryFn: () => getPurchaseVoucherItems(companyId, voucherId),
    enabled: !!companyId && !!voucherId
  });
}

export function useGetPurchaseVoucherItemById(companyId: string, voucherId: string, itemId: string) {
  return useQuery({
    queryKey: ['purchaseVoucherItem', companyId, voucherId, itemId],
    queryFn: () => getPurchaseVoucherItemById(companyId, voucherId, itemId),
    enabled: !!companyId && !!voucherId && !!itemId
  });
}
