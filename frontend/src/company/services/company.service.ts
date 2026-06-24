import { api } from '../../common/services/api';
import { Company } from '../../common/types/model.types';
import { CompanyFormData } from '../types/company.types';

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>('/companies');
  return response.data;
};

export const createCompany = async (payload: CompanyFormData): Promise<Company> => {
  const response = await api.post<Company>('/companies', payload);
  return response.data;
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}`);
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
};

export const updateCompany = async (id: string, payload: CompanyFormData): Promise<Company> => {
  const response = await api.put<Company>(`/companies/${id}`, payload);
  return response.data;
};
