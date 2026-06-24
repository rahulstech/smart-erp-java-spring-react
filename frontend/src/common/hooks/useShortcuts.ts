import { useContext } from 'react';
import { ShortcutContext } from '../components/ShortcutProvider';

export function useShortcuts() {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  return context;
}
