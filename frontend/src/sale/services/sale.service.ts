import { api } from '../../common/services/api';
import {
  SaleVoucher,
  CreateSaleVoucherRequest,
  UpdateSaleVoucherRequest,
  SaleVoucherItemsRequest,
  SaleVoucherItem
} from '../types/sale.types';

export const createSaleVoucher = async (companyId: string, payload: CreateSaleVoucherRequest): Promise<SaleVoucher> => {
  const response = await api.post<SaleVoucher>(`/companies/${companyId}/sale-vouchers`, payload);
  return response.data;
};

export const getSaleVouchers = async (companyId: string): Promise<SaleVoucher[]> => {
  const response = await api.get<SaleVoucher[]>(`/companies/${companyId}/sale-vouchers`);
  return response.data;
};

export const getSaleVoucherById = async (companyId: string, voucherId: string): Promise<SaleVoucher> => {
  const response = await api.get<SaleVoucher>(`/companies/${companyId}/sale-vouchers/${voucherId}`);
  return response.data;
};

export const updateSaleVoucher = async (companyId: string, voucherId: string, payload: UpdateSaleVoucherRequest): Promise<SaleVoucher> => {
  const response = await api.put<SaleVoucher>(`/companies/${companyId}/sale-vouchers/${voucherId}`, payload);
  return response.data;
};

export const deleteSaleVoucher = async (companyId: string, voucherId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}/sale-vouchers/${voucherId}`);
};

export const createSaleVoucherItems = async (companyId: string, voucherId: string, payload: SaleVoucherItemsRequest): Promise<SaleVoucher> => {
  const response = await api.post<SaleVoucher>(`/companies/${companyId}/sale-vouchers/${voucherId}/items`, payload);
  return response.data;
};

export const updateSaleVoucherItems = async (companyId: string, voucherId: string, payload: SaleVoucherItemsRequest): Promise<SaleVoucher> => {
  const response = await api.put<SaleVoucher>(`/companies/${companyId}/sale-vouchers/${voucherId}/items`, payload);
  return response.data;
};

export const getSaleVoucherItems = async (companyId: string, voucherId: string): Promise<SaleVoucherItem[]> => {
  const response = await api.get<SaleVoucherItem[]>(`/companies/${companyId}/sale-vouchers/${voucherId}/items`);
  return response.data;
};

export const getSaleVoucherItemById = async (companyId: string, voucherId: string, itemId: string): Promise<SaleVoucherItem> => {
  const response = await api.get<SaleVoucherItem>(`/companies/${companyId}/sale-vouchers/${voucherId}/items/${itemId}`);
  return response.data;
};

export const downloadInvoicePdf = async (companyId: string, voucherId: string): Promise<Blob> => {
  const response = await api.get<Blob>(`/companies/${companyId}/sale-vouchers/${voucherId}/billing/invoice`, {
    responseType: 'blob',
  });
  return response.data;
};
