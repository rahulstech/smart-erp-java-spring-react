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

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance: number;
  openingBalance?: number;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  country?: string;
}

