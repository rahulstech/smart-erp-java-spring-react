import { api } from '../../common/services/api';
import { StockItem, Category, Unit } from '../types/model.types';
import { StockItemFormData, CategoryFormData, UnitFormData } from '../types/inventory.types';

// Stock Item Services
export const getStockItems = async (companyId: string): Promise<StockItem[]> => {
  const response = await api.get<StockItem[]>(`/companies/${companyId}/stocks`);
  return response.data;
};

export const getStockItemById = async (companyId: string, itemId: string): Promise<StockItem> => {
  const response = await api.get<StockItem>(`/companies/${companyId}/stocks/${itemId}`);
  return response.data;
};

export const createStockItem = async (companyId: string, payload: StockItemFormData): Promise<StockItem> => {
  const response = await api.post<StockItem>(`/companies/${companyId}/stocks`, payload);
  return response.data;
};

export const updateStockItem = async (
  companyId: string,
  itemId: string,
  payload: Omit<StockItemFormData, 'itemCode'>
): Promise<StockItem> => {
  const response = await api.put<StockItem>(`/companies/${companyId}/stocks/${itemId}`, payload);
  return response.data;
};

export const deleteStockItem = async (companyId: string, itemId: string): Promise<void> => {
  await api.delete(`/companies/${companyId}/stocks/${itemId}`);
};

export const searchStockItems = async (companyId: string, keyword: string): Promise<StockItem[]> => {
  const response = await api.get<StockItem[]>(`/companies/${companyId}/stocks/search`, {
    params: { keyword }
  });
  return response.data;
};

// Category Services
export const getCategories = async (companyId: string): Promise<Category[]> => {
  const response = await api.get<Category[]>(`/companies/${companyId}/categories`);
  return response.data;
};

export const createCategory = async (companyId: string, payload: CategoryFormData): Promise<Category> => {
  const response = await api.post<Category>(`/companies/${companyId}/categories`, payload);
  return response.data;
};

// Unit Services
export const getUnits = async (companyId: string): Promise<Unit[]> => {
  const response = await api.get<Unit[]>(`/companies/${companyId}/units`);
  return response.data;
};

export const createUnit = async (companyId: string, payload: UnitFormData): Promise<Unit> => {
  const response = await api.post<Unit>(`/companies/${companyId}/units`, payload);
  return response.data;
};
