import { RouteType } from './types/component.types';



export const APP_ROUTES: Record<string, RouteType> = {
  HOME: { path: '/' },
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
  }
};
