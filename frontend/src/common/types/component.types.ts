import { ReactNode, ChangeEvent } from 'react';

// Global / Shared Types
export interface KeyboardShortcut {
  combination: string;
  handler: () => void;
  label: string;
}

// Scaffold Component Types
export interface ScaffoldProps {
  title: string;
  shortcuts?: KeyboardShortcut[];
  leftPanel?: ReactNode;
  mainPanel?: ReactNode;
}

// Popup Component Types
export interface PopupProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  showBackdrop?: boolean;
  shortcuts?: KeyboardShortcut[];
  className?: string;
  footerExtra?: ReactNode;
  showCloseButton?: boolean;
}

// ContextMenu Component Types
export interface ContextMenuItem {
  id: string;
  title: string;
  subTitle?: string;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  onItemClick: (id: string) => void;
  title?: string;
}

// ErpInputField Component Types
export interface ErpInputFieldProps {
  label: string;
  error?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
  isTextArea?: boolean;
  className?: string;
}

// ErpTable Component Types
export interface ErpTableProps<T> {
  columns: string[];
  data: T[];
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  emptyContent?: ReactNode;
  loadingContent?: ReactNode;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  onFilter?: (item: T) => boolean;
  render?: (colIndex: number, item: T, rowIndex: number) => ReactNode;
  contextMenu?: (focusedRow: T) => ReactNode;
  onClickContextItem?: (itemId: string, rowData: T) => void;
}

// NotificationHost Component Types
export interface NotificationContextType {
  showToast: (message: string) => void;
}

export interface NotificationHostProps {
  children: ReactNode;
}

// ShortcutRow Component Types
export interface ShortcutRowProps {
  combination: string;
  label: string;
  onClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
  variant?: 'light' | 'dark';
}

// ToastNotification Component Types
export interface ToastNotificationProps {
  message: string;
  onClose?: () => void;
}

// Dialog Component Types
export interface DialogButtonItem {
  id: string;
  label: string;
  combination: string;
  isPrimary?: boolean;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  content: ReactNode;
  buttons?: DialogButtonItem[];
  onClickButton?: (buttonId: string) => void;
}
