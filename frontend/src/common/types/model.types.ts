export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gstNumber?: string;
}
