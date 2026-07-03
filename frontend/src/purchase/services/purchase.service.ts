import { api } from '../../common/services/api';
import { Supplier } from '../../common/types/model.types';
import { StockItem } from '../../inventory/types/model.types';
import {
  PurchaseVoucher,
  CreatePurchaseVoucherRequest,
  UpdatePurchaseVoucherRequest,
  PurchaseVoucherItemsRequest,
  PurchaseVoucherItem
} from '../types/purchase.types';

export const createPurchaseVoucher = async (companyId: string, payload: CreatePurchaseVoucherRequest): Promise<PurchaseVoucher> => {
  const response = await api.post<PurchaseVoucher>(`/companies/${companyId}/purchase-vouchers`, payload);
  return response.data;
};

export const getPurchaseVouchers = async (companyId: string): Promise<PurchaseVoucher[]> => {
  const response = await api.get<PurchaseVoucher[]>(`/companies/${companyId}/purchase-vouchers`);
  return response.data;
};

export const getPurchaseVoucherById = async (companyId: string, voucherId: string): Promise<PurchaseVoucher> => {
  const response = await api.get<PurchaseVoucher>(`/companies/${companyId}/purchase-vouchers/${voucherId}`);
  return response.data;
};

export const updatePurchaseVoucher = async (companyId: string, voucherId: string, payload: UpdatePurchaseVoucherRequest): Promise<PurchaseVoucher> => {
  const response = await api.put<PurchaseVoucher>(`/companies/${companyId}/purchase-vouchers/${voucherId}`, payload);
  return response.data;
};

export const deletePurchaseVoucher = async (companyId: string, voucherId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}/purchase-vouchers/${voucherId}`);
};

export const createPurchaseVoucherItems = async (companyId: string, voucherId: string, payload: PurchaseVoucherItemsRequest): Promise<PurchaseVoucher> => {
  const response = await api.post<PurchaseVoucher>(`/companies/${companyId}/purchase-vouchers/${voucherId}/items`, payload);
  return response.data;
};

export const updatePurchaseVoucherItems = async (companyId: string, voucherId: string, payload: PurchaseVoucherItemsRequest): Promise<PurchaseVoucher> => {
  const response = await api.put<PurchaseVoucher>(`/companies/${companyId}/purchase-vouchers/${voucherId}/items`, payload);
  return response.data;
};

export const getPurchaseVoucherItems = async (companyId: string, voucherId: string): Promise<PurchaseVoucherItem[]> => {
  const response = await api.get<PurchaseVoucherItem[]>(`/companies/${companyId}/purchase-vouchers/${voucherId}/items`);
  return response.data;
};

export const getPurchaseVoucherItemById = async (companyId: string, voucherId: string, itemId: string): Promise<PurchaseVoucherItem> => {
  const response = await api.get<PurchaseVoucherItem>(`/companies/${companyId}/purchase-vouchers/${voucherId}/items/${itemId}`);
  return response.data;
};

export const searchSuppliers = async (companyId: string, keyword: string): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>(`/companies/${companyId}/suppliers/search`, {
    params: { keyword }
  });
  return response.data;
};

export const searchStockItems = async (companyId: string, keyword: string): Promise<StockItem[]> => {
  const response = await api.get<StockItem[]>(`/companies/${companyId}/stocks/search`, {
    params: { keyword }
  });
  return response.data;
};
