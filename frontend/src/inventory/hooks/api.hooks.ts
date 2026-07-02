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

// Stock Item Hooks
export function useGetStockItems(companyId: string) {
  return useQuery({
    queryKey: ['stocks', companyId],
    queryFn: () => getStockItems(companyId),
    enabled: !!companyId
  });
}

export function useGetStockItemById(companyId: string, itemId: string) {
  return useQuery<StockItem>({
    queryKey: ['stock', companyId, itemId],
    queryFn: () => getStockItemById(companyId, itemId),
    enabled: !!companyId && !!itemId
  });
}

export function useCreateStockItem(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockItemFormData) => createStockItem(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
    }
  });
}

export function useUpdateStockItem(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: Omit<StockItemFormData, 'itemCode'> }) =>
      updateStockItem(companyId, itemId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['stock', companyId, data.id] });
    }
  });
}

export function useDeleteStockItem(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deleteStockItem(companyId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', companyId] });
    }
  });
}

export function useSearchStockItems(companyId: string, keyword: string) {
  return useQuery({
    queryKey: ['stocks', 'search', companyId, keyword],
    queryFn: () => searchStockItems(companyId, keyword),
    enabled: !!companyId && keyword.length > 0
  });
}

// Category Hooks
export function useGetCategories(companyId: string) {
  return useQuery({
    queryKey: ['categories', companyId],
    queryFn: () => getCategories(companyId),
    enabled: !!companyId
  });
}

export function useCreateCategory(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryFormData) => createCategory(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
    }
  });
}

// Unit Hooks
export function useGetUnits(companyId: string) {
  return useQuery({
    queryKey: ['units', companyId],
    queryFn: () => getUnits(companyId),
    enabled: !!companyId
  });
}

export function useCreateUnit(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UnitFormData) => createUnit(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units', companyId] });
    }
  });
}
