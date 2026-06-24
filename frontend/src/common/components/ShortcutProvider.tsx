import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { KeyboardShortcut } from '../types/component.types';
import { ShortcutContextType } from '../types/shortcut.types';

export const ShortcutContext = createContext<ShortcutContextType | null>(null);

// Helper to parse key combo strings for matching
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

// Helper to check if event matches a key combination
function matchesShortcut(e: KeyboardEvent, comboStr: string): boolean {
  const target = parseCombination(comboStr);
  
  // Standardize modifier key checks
  if (e.ctrlKey !== target.ctrl) return false;
  if (e.altKey !== target.alt) return false;
  if (e.shiftKey !== target.shift) return false;
  if (e.metaKey !== target.meta) return false;
  
  // Match key case-insensitively
  const eventKey = e.key.toLowerCase();
  
  // Handle some common key name mappings
  if (target.key === 'esc' || target.key === 'escape') {
    return eventKey === 'escape';
  }
  if (target.key === 'enter') {
    return eventKey === 'enter';
  }
  if (target.key === 'up' || target.key === 'arrowup') {
    return eventKey === 'arrowup';
  }
  if (target.key === 'down' || target.key === 'arrowdown') {
    return eventKey === 'arrowdown';
  }
  
  return eventKey === target.key;
}

function deduplicateShortcuts(shortcuts: KeyboardShortcut[]): KeyboardShortcut[] {
  const seen = new Set<string>();
  const result: KeyboardShortcut[] = [];
  for (let i = shortcuts.length - 1; i >= 0; i--) {
    const combo = shortcuts[i].combination.toLowerCase();
    if (!seen.has(combo)) {
      seen.add(combo);
      result.unshift(shortcuts[i]);
    }
  }
  return result;
}

export default function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [globalShortcuts, setGlobalShortcutsState] = useState<KeyboardShortcut[]>([]);
  const [pageShortcuts, setPageShortcutsState] = useState<KeyboardShortcut[]>([]);
  const [popupShortcuts, setPopupShortcutsState] = useState<KeyboardShortcut[]>([]);
  const [isPopupActive, setIsPopupActive] = useState(false);

  const setGlobalShortcuts = useCallback((shortcuts: KeyboardShortcut[]) => {
    setGlobalShortcutsState(shortcuts);
  }, []);

  const setPageShortcuts = useCallback((shortcuts: KeyboardShortcut[]) => {
    setPageShortcutsState(shortcuts);
  }, []);

  const registerPopupShortcuts = useCallback((shortcuts: KeyboardShortcut[]) => {
    setPopupShortcutsState(shortcuts);
    setIsPopupActive(true);
  }, []);

  const unregisterPopupShortcuts = useCallback(() => {
    setPopupShortcutsState([]);
    setIsPopupActive(false);
  }, []);

  // Filter out any page shortcuts that conflict with global shortcuts
  const resolvedPageShortcuts = useMemo(() => {
    const deduped = deduplicateShortcuts(pageShortcuts);
    return deduped.filter(shortcut => {
      const isConflicting = globalShortcuts.some(gs => 
        gs.combination.toLowerCase() === shortcut.combination.toLowerCase()
      );
      if (isConflicting) {
        console.warn(
          `Conflict Warning: The shortcut "${shortcut.combination}" is registered globally by Scaffold and cannot be overridden. Discarding dynamic handler for "${shortcut.label}".`
        );
      }
      return !isConflicting;
    });
  }, [pageShortcuts, globalShortcuts]);

  // Filter out any popup shortcuts that conflict with global shortcuts
  const resolvedPopupShortcuts = useMemo(() => {
    const deduped = deduplicateShortcuts(popupShortcuts);
    return deduped.filter(shortcut => {
      const isConflicting = globalShortcuts.some(gs => 
        gs.combination.toLowerCase() === shortcut.combination.toLowerCase()
      );
      if (isConflicting) {
        console.warn(
          `Conflict Warning: The shortcut "${shortcut.combination}" is registered globally by Scaffold and cannot be overridden. Discarding dynamic handler for "${shortcut.label}".`
        );
      }
      return !isConflicting;
    });
  }, [popupShortcuts, globalShortcuts]);

  // Determine active shortcuts based on whether a popup is showing
  const activeShortcuts = useMemo(() => {
    if (isPopupActive) {
      return [...globalShortcuts, ...resolvedPopupShortcuts];
    }
    return [...globalShortcuts, ...resolvedPageShortcuts];
  }, [isPopupActive, globalShortcuts, resolvedPopupShortcuts, resolvedPageShortcuts]);

  // Listen to keydown event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of activeShortcuts) {
        if (matchesShortcut(e, shortcut.combination)) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeShortcuts]);

  const value: ShortcutContextType = useMemo(() => ({
    setGlobalShortcuts,
    setPageShortcuts,
    registerPopupShortcuts,
    unregisterPopupShortcuts,
    activeShortcuts,
    isPopupActive
  }), [setGlobalShortcuts, setPageShortcuts, registerPopupShortcuts, unregisterPopupShortcuts, activeShortcuts, isPopupActive]);

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
}
