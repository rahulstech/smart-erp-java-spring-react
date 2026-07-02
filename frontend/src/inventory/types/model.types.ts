export interface Category {
  id: string;
  companyId: string;
  name: string;
}

export interface Unit {
  id: string;
  companyId: string;
  name: string;
  symbol: string;
}

export interface StockItem {
  id: string;
  companyId: string;
  categoryId: string;
  categoryName?: string;
  unitId: string;
  unitName?: string;
  unitSymbol?: string;
  itemCode: string;
  itemName: string;
  currentQuantity: number;
}
