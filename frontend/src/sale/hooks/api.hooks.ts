import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSaleVoucher,
  getSaleVouchers,
  getSaleVoucherById,
  updateSaleVoucher,
  deleteSaleVoucher,
  createSaleVoucherItems,
  updateSaleVoucherItems,
  getSaleVoucherItems,
  getSaleVoucherItemById,
  downloadInvoicePdf
} from '../services/sale.service';
import {
  CreateSaleVoucherRequest,
  UpdateSaleVoucherRequest,
  SaleVoucherItemsRequest
} from '../types/sale.types';

export function useCreateSaleVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSaleVoucherRequest) => createSaleVoucher(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleVouchers', companyId] });
    }
  });
}

export function useGetSaleVouchers(companyId: string) {
  return useQuery({
    queryKey: ['saleVouchers', companyId],
    queryFn: () => getSaleVouchers(companyId),
    enabled: !!companyId
  });
}

export function useGetSaleVoucherById(companyId: string, voucherId: string) {
  return useQuery({
    queryKey: ['saleVoucher', companyId, voucherId],
    queryFn: () => getSaleVoucherById(companyId, voucherId),
    enabled: !!companyId && !!voucherId
  });
}

export function useUpdateSaleVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ voucherId, payload }: { voucherId: string; payload: UpdateSaleVoucherRequest }) =>
      updateSaleVoucher(companyId, voucherId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saleVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['saleVoucher', companyId, data.id] });
    }
  });
}

export function useDeleteSaleVoucher(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voucherId: string) => deleteSaleVoucher(companyId, voucherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleVouchers', companyId] });
    }
  });
}

export function useCreateSaleVoucherItems(companyId: string, voucherId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaleVoucherItemsRequest) => createSaleVoucherItems(companyId, voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['saleVoucher', companyId, voucherId] });
      queryClient.invalidateQueries({ queryKey: ['saleVoucherItems', companyId, voucherId] });
    }
  });
}

export function useUpdateSaleVoucherItems(companyId: string, voucherId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaleVoucherItemsRequest) => updateSaleVoucherItems(companyId, voucherId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleVouchers', companyId] });
      queryClient.invalidateQueries({ queryKey: ['saleVoucher', companyId, voucherId] });
      queryClient.invalidateQueries({ queryKey: ['saleVoucherItems', companyId, voucherId] });
    }
  });
}

export function useGetSaleVoucherItems(companyId: string, voucherId: string) {
  return useQuery({
    queryKey: ['saleVoucherItems', companyId, voucherId],
    queryFn: () => getSaleVoucherItems(companyId, voucherId),
    enabled: !!companyId && !!voucherId
  });
}

export function useGetSaleVoucherItemById(companyId: string, voucherId: string, itemId: string) {
  return useQuery({
    queryKey: ['saleVoucherItem', companyId, voucherId, itemId],
    queryFn: () => getSaleVoucherItemById(companyId, voucherId, itemId),
    enabled: !!companyId && !!voucherId && !!itemId
  });
}

export function useDownloadInvoicePdf(companyId: string) {
  return useMutation({
    mutationFn: (voucherId: string) => downloadInvoicePdf(companyId, voucherId)
  });
}
