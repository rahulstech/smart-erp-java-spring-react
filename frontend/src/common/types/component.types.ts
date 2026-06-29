import { ReactNode, ChangeEvent } from 'react';

// Global / Shared Types
import { KeyboardShortcut } from './shortcut.types';

export type { KeyboardShortcut };

export interface RouteType {
  path: string;
  create?: (...params: any[]) => string;
}

// Scaffold Component Types
export interface ScaffoldProps {
  title: string;
  shortcuts?: KeyboardShortcut[];
  children?: ReactNode;
  onRetry?: () => void;
}

// Popup Component Types
export interface PopupProps {
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  showBackdrop?: boolean;
  shortcuts?: KeyboardShortcut[];
  className?: string;
  footer?: ReactNode;
  cancelable?: boolean;
  style?: React.CSSProperties;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
}

// Card Component Types
export interface CardProps {
  cornerRadius?: number;
  elevation?: number;
  borderThickness?: number;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
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

// List Component Types
export interface ListProps<T> {
  data: T[];
  renderItem?: (item: T, index: number) => ReactNode;
  onItemClicked?: (item: T) => void;
  onFocusedItemChanged?: (item: T, index: number) => void;
  autoFocus?: boolean;
}

// ErpTable Component Types
export interface ErpTableProps<T> {
  columns: string[];
  data: T[];
  onRowClick?: (item: T, index: number) => void;
  onFocusedRowChanged?: (index: number, item: T | undefined) => void;
  emptyContent?: ReactNode;
  searchPlaceholder?: string;
  onFilter?: (item: T, query: string) => boolean;
  render?: (colIndex: number, item: T, rowIndex: number) => ReactNode;
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
  onClose?: () => void;
  title?: string;
  icon?: ReactNode;
  content: ReactNode;
  buttons?: DialogButtonItem[];
  onClickButton?: (buttonId: string) => void;
}

// LoadingPopup Component Types
export interface LoadingPopupProps {
  message: string;
}

export interface ConfirmationDialogProps {
  title?: string;
  children: ReactNode;
  onYes?: ()=> void;
  onNo?: ()=> void;
}