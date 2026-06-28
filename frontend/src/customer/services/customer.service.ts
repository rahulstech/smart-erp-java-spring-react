import { api } from '../../common/services/api';
import { Customer } from '../../common/types/model.types';
import { CustomerFormData } from '../types/customer.types';

export const createCustomer = async (companyId: string, payload: CustomerFormData): Promise<Customer> => {
  const response = await api.post<Customer>(`/companies/${companyId}/customers`, payload);
  return response.data;
};
