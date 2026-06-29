import { api } from '../../common/services/api';
import { Supplier } from '../../common/types/model.types';
import { SupplierFormData } from '../types/supplier.types';

export const createSupplier = async (companyId: string, payload: SupplierFormData): Promise<Supplier> => {
  const response = await api.post<Supplier>(`/companies/${companyId}/suppliers`, payload);
  return response.data;
};

export const getSuppliers = async (companyId: string): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>(`/companies/${companyId}/suppliers`);
  return response.data;
};

export const deleteSupplier = async (companyId: string, supplierId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}/suppliers/${supplierId}`);
};

export const getSupplierById = async (companyId: string, supplierId: string): Promise<Supplier> => {
  const response = await api.get<Supplier>(`/companies/${companyId}/suppliers/${supplierId}`);
  return response.data;
};

export const updateSupplier = async (companyId: string, supplierId: string, payload: SupplierFormData): Promise<Supplier> => {
  const response = await api.put<Supplier>(`/companies/${companyId}/suppliers/${supplierId}`, payload);
  return response.data;
};
