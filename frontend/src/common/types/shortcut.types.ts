import { KeyboardShortcut } from './component.types';

export interface ShortcutContextType {
  setGlobalShortcuts: (shortcuts: KeyboardShortcut[]) => void;
  registerPageShortcuts: (key: string, shortcuts: KeyboardShortcut[]) => void;
  unregisterPageShortcuts: (key: string) => void;
  registerPopupShortcuts: (shortcuts: KeyboardShortcut[]) => void;
  unregisterPopupShortcuts: () => void;
  activeShortcuts: KeyboardShortcut[];
  isPopupActive: boolean;
}
