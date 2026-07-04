import { RouteType } from './types/component.types';

export const APP_ROUTES: Record<string, RouteType> = {
  HOME: { path: '/' },
  LOGIN: { path: '/login' },
  REGISTER: { path: '/register' },
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
  },
  CREATE_STOCK: {
    path: '/companies/:company_id/create-stock',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/create-stock`;
    }
  },
  EDIT_STOCK: {
    path: '/companies/:company_id/stocks/:stock_id/edit',
    create: (...params: any[]) => {
      const companyId = params[0];
      const stockId = params[1];
      return `/companies/${companyId}/stocks/${stockId}/edit`;
    }
  },
  STOCK_LIST: {
    path: '/companies/:company_id/stocks',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/stocks`;
    }
  },
  ADD_CATEGORY: {
    path: '/companies/:company_id/add-category',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/add-category`;
    }
  },
  ADD_UNIT: {
    path: '/companies/:company_id/add-unit',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/add-unit`;
    }
  },
  PURCHASE_VOUCHER_LIST: {
    path: '/companies/:company_id/purchase-vouchers',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/purchase-vouchers`;
    }
  },
  PURCHASE_VOUCHER_ITEMS_LIST: {
    path: '/companies/:company_id/purchase-vouchers/:voucher_id/items',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/purchase-vouchers/${voucherId}/items`;
    }
  },
  CREATE_PURCHASE_VOUCHER: {
    path: '/companies/:company_id/create-purchase-voucher',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/create-purchase-voucher`;
    }
  },
  ADD_PURCHASE_ITEM: {
    path: '/companies/:company_id/purchase-vouchers/:voucher_id/add-item',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/purchase-vouchers/${voucherId}/add-item`;
    }
  },
  EDIT_PURCHASE_VOUCHER: {
    path: '/companies/:company_id/purchase-vouchers/:voucher_id/edit',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/purchase-vouchers/${voucherId}/edit`;
    }
  },
  SALE_VOUCHER_LIST: {
    path: '/companies/:company_id/sale-vouchers',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/sale-vouchers`;
    }
  },
  SALE_VOUCHER_ITEMS_LIST: {
    path: '/companies/:company_id/sale-vouchers/:voucher_id/items',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/sale-vouchers/${voucherId}/items`;
    }
  },
  CREATE_SALE_VOUCHER: {
    path: '/companies/:company_id/create-sale-voucher',
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/companies/${companyId}/create-sale-voucher`;
    }
  },
  ADD_SALE_ITEM: {
    path: '/companies/:company_id/sale-vouchers/:voucher_id/add-item',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/sale-vouchers/${voucherId}/add-item`;
    }
  },
  EDIT_SALE_VOUCHER: {
    path: '/companies/:company_id/sale-vouchers/:voucher_id/edit',
    create: (...params: any[]) => {
      const companyId = params[0];
      const voucherId = params[1];
      return `/companies/${companyId}/sale-vouchers/${voucherId}/edit`;
    }
  }
};

export const GLOBAL_SHORTCUTS = [
  { combination: 'F5', label: 'Reload' },
  { combination: 'F6', label: 'Companies' },
  { combination: 'F7', label: 'Dashboard' },
  { combination: 'F8', label: 'Supplier' },
  { combination: 'F9', label: 'Stocks' },
  { combination: 'F10', label: 'Customers' },
  { combination: 'Esc', label: 'Quit' }
];
