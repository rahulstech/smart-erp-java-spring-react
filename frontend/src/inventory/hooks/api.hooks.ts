import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getStockItems,
  getStockItemById,
  createStockItem,
  updateStockItem,
  deleteStockItem,
  searchStockItems,
  getCategories,
  createCategory,
  getUnits,
  createUnit
} from '../services/inventory.service';
import { StockItemFormData, CategoryFormData, UnitFormData } from '../types/inventory.types';
import { StockItem } from '../types/model.types';
import { useLogOut } from '@/auth/hooks/api.hooks';

const handleApiError = (error: any, logout: () => void) => {
  if (error.response?.status === 403) {
    logout();
  }
  throw error;
};

// Stock Item Hooks
export function useGetStockItems(companyId: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['stocks', companyId],
    queryFn: () => getStockItems(companyId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId
  });
}

export function useGetStockItemById(companyId: string, itemId: string) {
  const logout = useLogOut();
  return useQuery<StockItem>({
    queryKey: ['stock', companyId, itemId],
    queryFn: () => getStockItemById(companyId, itemId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId && !!itemId
  });
}

export function useCreateStockItem(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: StockItemFormData) => createStockItem(companyId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
    }
  });
}

export function useUpdateStockItem(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: Omit<StockItemFormData, 'itemCode'> }) =>
      updateStockItem(companyId, itemId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['stock', companyId, data.id] });
    }
  });
}

export function useDeleteStockItem(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (itemId: string) => deleteStockItem(companyId, itemId).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
    }
  });
}

export function useSearchStockItems(companyId: string, keyword: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['stocks', 'search', companyId, keyword],
    queryFn: () => searchStockItems(companyId, keyword).catch(err => handleApiError(err, logout)),
    enabled: !!companyId && keyword.length > 0
  });
}

// Category Hooks
export function useGetCategories(companyId: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['categories', companyId],
    queryFn: () => getCategories(companyId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId
  });
}

export function useCreateCategory(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: CategoryFormData) => createCategory(companyId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
    }
  });
}

// Unit Hooks
export function useGetUnits(companyId: string) {
  const logout = useLogOut();
  return useQuery({
    queryKey: ['units', companyId],
    queryFn: () => getUnits(companyId).catch(err => handleApiError(err, logout)),
    enabled: !!companyId
  });
}

export function useCreateUnit(companyId: string) {
  const queryClient = useQueryClient();
  const logout = useLogOut();
  return useMutation({
    mutationFn: (payload: UnitFormData) => createUnit(companyId, payload).catch(err => handleApiError(err, logout)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units', companyId] });
    }
  });
}
