import { Supplier } from '../../common/types/model.types';

export interface PurchaseVoucherItem {
  id: string;
  stockItemId: string;
  stockItemName?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PurchaseVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  items: PurchaseVoucherItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseVoucherRequest {
  supplierId: string;
  voucherDate: string;
}

export interface UpdatePurchaseVoucherRequest {
  supplierId: string;
  voucherDate: string;
}

export interface PurchaseVoucherItemRequest {
  stockItemId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseVoucherItemsRequest {
  items: PurchaseVoucherItemRequest[];
}

export interface SupplierChooserPopupProps {
  companyId: string;
  onSelect: (supplier: Supplier) => void;
  onClose: () => void;
}

export interface PurchaseVoucherFormData {
  supplier: Supplier | null;
  voucherDate: string;
}

export interface PurchaseVoucherInputProps {
  onSave: (data: PurchaseVoucherFormData) => void;
  initialData?: PurchaseVoucherFormData;
  serverErrors?: { supplier?: string; voucherDate?: string };
  voucherNumber?: string;
}

