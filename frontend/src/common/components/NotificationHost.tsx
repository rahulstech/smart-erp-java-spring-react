import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import ToastNotification from './ToastNotification';

export interface NotificationContextType {
  showToast: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationHost');
  }
  return context;
}

interface NotificationHostProps {
  children: ReactNode;
}

export default function NotificationHost({ children }: NotificationHostProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <ToastNotification message={toastMessage} />
      )}
    </NotificationContext.Provider>
  );
}
