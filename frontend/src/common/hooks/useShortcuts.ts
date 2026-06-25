import { useContext } from 'react';
import { ShortcutContext } from '../components/ShortcutProvider';

/**
 * Accesses the active keyboard shortcut context.
 * Throws an error if used outside a ShortcutProvider tree.
 */
export function useShortcuts() {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  return context;
}
