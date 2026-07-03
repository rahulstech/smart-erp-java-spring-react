import { Customer } from '../../common/types/model.types';
import { StockItem } from '../../inventory/types/model.types';

export interface SaleVoucherItem {
  id: string;
  itemId: string;
  itemName?: string;
  hsnCode?: string;
  unitName?: string;
  quantity: number;
  rate: number;
  lineTotal: number;
}

export interface SaleVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  customerId: string;
  customerName: string;
  grandTotal: number;
  cancelled: boolean;
  items: SaleVoucherItem[];
}

export interface CreateSaleVoucherRequest {
  customerId: string;
  voucherDate: string;
}

export interface UpdateSaleVoucherRequest {
  customerId: string;
  voucherDate: string;
}

export interface SaleVoucherItemRequest {
  itemId: string;
  hsnCode?: string | null;
  quantity: number;
  rate: number;
}

export interface SaleVoucherItemsRequest {
  items: SaleVoucherItemRequest[];
}

export interface CustomerChooserPopupProps {
  companyId: string;
  onSelect: (customer: Customer) => void;
  onClose: () => void;
}

export interface ItemRow {
  key: string;
  stockItem: StockItem | null;
  hsnCode: string;
  quantity: string;
  rate: string;
}

export interface SaleVoucherFormData {
  customer: Customer | null;
  voucherDate: string;
}

export interface SaleVoucherInputProps {
  onSave: (data: SaleVoucherFormData) => void;
  initialData?: SaleVoucherFormData;
  serverErrors?: { customer?: string; voucherDate?: string };
  voucherNumber?: string;
}

