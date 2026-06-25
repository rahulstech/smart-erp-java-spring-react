export interface KeyboardShortcut {
  combination: string;
  handler: () => boolean | void | Promise<any>;
  label: string;
}

/**
 * Interface representing the context state and handler functions for managing keyboard shortcuts across the application.
 */
export interface ShortcutContextType {
  /**
   * Required handler function that registers keyboard shortcuts under a unique scope key.
   * Accepts `key` (a unique string identifier for the scope) and `shortcuts` (an array of `KeyboardShortcut` objects).
   */
  registerShortcuts: (key: string, shortcuts: KeyboardShortcut[]) => void;

  /**
   * Required handler function that unregisters keyboard shortcuts under a unique scope key.
   * Accepts `key` (the unique string identifier of the scope to remove).
   */
  unregisterShortcuts: (key: string) => void;

  /**
   * State field containing the list of all currently active `KeyboardShortcut` objects.
   */
  activeShortcuts: KeyboardShortcut[];
}
