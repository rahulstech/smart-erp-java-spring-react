import { RouteType } from './types/component.types';

export const APP_ROUTES: Record<string, RouteType> = {
  HOME: { path: '/' },
  COMPANY_LIST: { path: '/companies' },
  COMPANY_SELECTION: { path: '/select-company' },
  CREATE_COMPANY: { path: '/create-company' },
  EDIT_COMPANY: { 
    path: '/companies/:company_id/edit', 
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/edit`;
    }
  },
  DASHBOARD: {
    path: '/companies/:company_id/dashboard',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/dashboard`;
    }
  },
  CREATE_CUSTOMER: {
    path: '/companies/:company_id/create-customer',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/create-customer`;
    }
  },
  EDIT_CUSTOMER: {
    path: '/companies/:company_id/customers/:customer_id/edit',
    create: (...params: any[]) => {
      const companyId = params[0];
      const customerId = params[1];
      return `/companies/${companyId}/customers/${customerId}/edit`;
    }
  },
  CUSTOMER_LIST: {
    path: '/companies/:company_id/customers',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/customers`;
    }
  },
  CREATE_SUPPLIER: {
    path: '/companies/:company_id/create-supplier',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/create-supplier`;
    }
  },
  EDIT_SUPPLIER: {
    path: '/companies/:company_id/suppliers/:supplier_id/edit',
    create: (...params: any[]) => {
      const companyId = params[0];
      const supplierId = params[1];
      return `/companies/${companyId}/suppliers/${supplierId}/edit`;
    }
  },
  SUPPLIER_LIST: {
    path: '/companies/:company_id/suppliers',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/suppliers`;
    }
  }
};

export const GLOBAL_SHORTCUTS = [
  { combination: 'F5', label: 'Reload' },
  { combination: 'F6', label: 'Companies' },
  { combination: 'F7', label: 'Dashboard' },
  { combination: 'F8', label: 'Supplier' },
  { combination: 'F9', label: 'Stocks' },
  { combination: 'Esc', label: 'Quit' }
];
