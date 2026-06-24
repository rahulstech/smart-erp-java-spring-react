export interface CompanyFormData {
  name: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface CompanyInputProps {
  onSave: (data: CompanyFormData) => void;
  initialData?: CompanyFormData;
}
