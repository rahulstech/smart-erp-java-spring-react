import React, { createContext, useEffect, useMemo, useCallback, useRef } from 'react';
import { KeyboardShortcut, ShortcutContextType } from '../types/shortcut.types';

export const ShortcutContext = createContext<ShortcutContextType | null>(null);

interface ShortcutScope {
  key: string;
  shortcuts: KeyboardShortcut[];
}

/**
 * Parses hotkey strings (e.g. 'Ctrl+Alt+S') into flags representing 
 * required modifier keys and the targeted action key.
 */
function parseCombination(comboStr: string) {
  const parts = comboStr.toLowerCase().split('+').map(p => p.trim());
  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('win'),
    key: parts.find(p => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd', 'win'].includes(p)) || ''
  };
}

/**
 * Compares event properties of a keydown event against a target combo string.
 * Standardizes common keys like Escape or arrow keys.
 */
function matchesShortcut(e: KeyboardEvent, comboStr: string): boolean {
  const target = parseCombination(comboStr);
  
  if (e.ctrlKey !== target.ctrl) return false;
  if (e.altKey !== target.alt) return false;
  if (e.shiftKey !== target.shift) return false;
  if (e.metaKey !== target.meta) return false;
  
  const eventKey = e.key ? e.key.toLowerCase() : '';
  const eventCode = e.code ? e.code.toLowerCase() : '';
  
  if (target.key === 'esc' || target.key === 'escape') {
    return eventKey === 'escape' || eventKey === 'esc' || eventCode === 'escape';
  }
  if (target.key === 'enter') {
    return eventKey === 'enter' || eventCode === 'enter' || eventCode === 'numpadenter';
  }
  if (target.key === 'up' || target.key === 'arrowup') {
    return eventKey === 'arrowup' || eventCode === 'arrowup';
  }
  if (target.key === 'down' || target.key === 'arrowdown') {
    return eventKey === 'arrowdown' || eventCode === 'arrowdown';
  }
  
  return eventKey === target.key || eventCode === `key${target.key}`;
}

/**
 * Context provider managing keyboard shortcuts across the application.
 * Retains single registerShortcuts / unregisterShortcuts methods to manage shortcut maps.
 */
export default function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const scopesRef = useRef<ShortcutScope[]>([]);

  const registerShortcuts = useCallback((key: string, shortcuts: KeyboardShortcut[]) => {
    const filtered = scopesRef.current.filter(s => s.key !== key);
    scopesRef.current = [...filtered, { key, shortcuts }];
  }, []);

  const unregisterShortcuts = useCallback((key: string) => {
    scopesRef.current = scopesRef.current.filter(s => s.key !== key);
  }, []);

  // Binds keydown event listener to window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evaluate matching shortcuts from latest scope to oldest scope
      const activeShortcuts = [...scopesRef.current].reverse().flatMap(s => s.shortcuts);
      for (let i = 0; i < activeShortcuts.length; i++) {
        const shortcut = activeShortcuts[i];
        if (matchesShortcut(e, shortcut.combination)) {
          const isHandled = shortcut.handler();
          // If handler explicitly returns false, it was not handled; continue to next older matching handler.
          if (isHandled !== false) {
            e.preventDefault();
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value: ShortcutContextType = useMemo(() => ({
    registerShortcuts,
    unregisterShortcuts,
    get activeShortcuts() {
      return [...scopesRef.current].reverse().flatMap(s => s.shortcuts);
    }
  }), [registerShortcuts, unregisterShortcuts]);

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
}

