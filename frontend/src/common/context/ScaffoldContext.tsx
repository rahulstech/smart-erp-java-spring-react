import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ScaffoldContextType {
  title: string;
  setTitle: (title: string) => void;
  onRetry?: () => void;
  setOnRetry: (onRetry?: () => void) => void;
}

const ScaffoldContext = createContext<ScaffoldContextType | undefined>(undefined);

export function ScaffoldProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string>('SmartERP');
  const [onRetry, setOnRetryState] = useState<(() => void) | undefined>(undefined);

  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
  }, []);

  const setOnRetry = useCallback((fn?: () => void) => {
    setOnRetryState(() => fn);
  }, []);

  return (
    <ScaffoldContext.Provider value={{ title, setTitle, onRetry, setOnRetry }}>
      {children}
    </ScaffoldContext.Provider>
  );
}

export function useScaffoldContext() {
  const context = useContext(ScaffoldContext);
  if (!context) {
    throw new Error('useScaffoldContext must be used within a ScaffoldProvider');
  }
  return context;
}
