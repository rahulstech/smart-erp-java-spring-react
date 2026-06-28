export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  openingBalance: number;
}

export interface CustomerInputProps {
  onSave: (data: CustomerFormData) => void;
  initialData?: CustomerFormData;
}
