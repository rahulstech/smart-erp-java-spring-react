import { Category, Unit } from './model.types';

export interface StockItemFormData {
  categoryId: string;
  unitId: string;
  itemCode: string;
  itemName: string;
}

export interface StockInputProps {
  onSave: (data: StockItemFormData) => void;
  initialData?: StockItemFormData;
  serverErrors?: Record<string, string>;
  categories: Category[];
  units: Unit[];
  isEdit?: boolean;
}

export interface CategoryFormData {
  name: string;
}

export interface CategoryInputProps {
  onSave: (data: CategoryFormData) => void;
  serverErrors?: Record<string, string>;
}

export interface UnitFormData {
  name: string;
  symbol: string;
}

export interface UnitInputProps {
  onSave: (data: UnitFormData) => void;
  serverErrors?: Record<string, string>;
}
