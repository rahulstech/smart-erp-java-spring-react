import { KeyboardShortcut } from './component.types';

export interface ShortcutContextType {
  setGlobalShortcuts: (shortcuts: KeyboardShortcut[]) => void;
  setPageShortcuts: (shortcuts: KeyboardShortcut[]) => void;
  registerPopupShortcuts: (shortcuts: KeyboardShortcut[]) => void;
  unregisterPopupShortcuts: () => void;
  activeShortcuts: KeyboardShortcut[];
  isPopupActive: boolean;
}
