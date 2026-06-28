import { KeyboardShortcut, RouteType } from './types/component.types';

export const GLOBAL_SHORTCUT_DASHBOARD: KeyboardShortcut = {
  combination: 'Alt+Shift+D',
  label: 'Dashboard',
  handler: () => {
    alert('Dashboard shortcut triggered');
  }
};

export const GLOBAL_SHORTCUT_HOME: KeyboardShortcut = {
  combination: 'Alt+Shift+H',
  label: 'Home',
  handler: () => {}
};

export const GLOBAL_SHORTCUT_BACK: KeyboardShortcut = {
  combination: 'Alt+Shift+B',
  label: 'Back',
  handler: () => {}
};

export const GLOBAL_SHORTCUT_RELOAD: KeyboardShortcut = {
  combination: 'Alt+Shift+R',
  label: 'Reload',
  handler: () => {}
};

export const GLOBAL_SHORTCUT_LOGOUT: KeyboardShortcut = {
  combination: 'Alt+Shift+Q',
  label: 'Logout',
  handler: () => {
    alert('Logout shortcut triggered');
  }
};

export const GLOBAL_SHORTCUTS: KeyboardShortcut[] = [
  GLOBAL_SHORTCUT_DASHBOARD,
  GLOBAL_SHORTCUT_HOME,
  GLOBAL_SHORTCUT_BACK,
  GLOBAL_SHORTCUT_RELOAD,
  GLOBAL_SHORTCUT_LOGOUT
];

export const APP_ROUTES: Record<string, RouteType> = {
  HOME: { path: '/' },
  COMPANY_SELECTION: { path: '/select-company' },
  CREATE_COMPANY: { path: '/create-company' },
  EDIT_COMPANY: { 
    path: '/edit-company/:company_id', 
    create: (...params: any[]) => {
      const companyId = params[0];
      return `/edit-company/${companyId}`;
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
  }
};
