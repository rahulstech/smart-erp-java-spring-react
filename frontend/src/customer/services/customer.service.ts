import { api } from '../../common/services/api';
import { Customer } from '../../common/types/model.types';
import { CustomerFormData } from '../types/customer.types';

export const createCustomer = async (companyId: string, payload: CustomerFormData): Promise<Customer> => {
  const response = await api.post<Customer>(`/companies/${companyId}/customers`, payload);
  return response.data;
};

export const getCustomers = async (companyId: string): Promise<Customer[]> => {
  const response = await api.get<Customer[]>(`/companies/${companyId}/customers`);
  return response.data;
};

export const deleteCustomer = async (companyId: string, customerId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}/customers/${customerId}`);
};

export const getCustomerById = async (companyId: string, customerId: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/companies/${companyId}/customers/${customerId}`);
  return response.data;
};

export const updateCustomer = async (companyId: string, customerId: string, payload: CustomerFormData): Promise<Customer> => {
  const response = await api.put<Customer>(`/companies/${companyId}/customers/${customerId}`, payload);
  return response.data;
};

