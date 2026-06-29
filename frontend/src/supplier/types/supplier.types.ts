export interface SupplierFormData {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  openingBalance: number;
}

export interface SupplierInputProps {
  onSave: (data: SupplierFormData) => void;
  initialData?: SupplierFormData;
  serverErrors?: Record<string, string>;
  isEditing?: boolean;
}
