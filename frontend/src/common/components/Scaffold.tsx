import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
   faUser, 
   faCog
} from '@fortawesome/free-solid-svg-icons';
import { KeyboardShortcut, ScaffoldProps } from '../types/component.types';
import { useShortcuts } from '../hooks/useShortcuts';

// A static, reference-stable EMPTY_SHORTCUTS array is defined outside the component rather than using
// an inline default parameter `shortcuts = []`. An inline `[]` creates a new array instance on every single render.
// Since this array is a dependency in useEffect, a new instance would trigger a shortcut state update, leading
// to an infinite re-render loop when the prop is omitted.
const EMPTY_SHORTCUTS: KeyboardShortcut[] = [];

export default function Scaffold({ title, shortcuts = EMPTY_SHORTCUTS, children }: ScaffoldProps) {
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  // Register page shortcuts
  useEffect(() => {
    registerShortcuts('scaffold', shortcuts);
    return () => unregisterShortcuts('scaffold');
  }, [shortcuts, registerShortcuts, unregisterShortcuts]);

  return (
    <div className="erp-layout">
      {/* Header Bar */}
      <header className="erp-top-bar">
        <div className="flex items-center gap-3">
          <span className="text-md font-bold tracking-wide text-white">SmartERP v1.0.0</span>
          <span className="text-zinc-400 font-light">|</span>
          <span className="text-sm text-zinc-200">{title}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-300">
          <button className="flex items-center gap-2 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="text-zinc-400" />
            <span className="font-semibold text-xs tracking-wider uppercase">ADMIN</span>
          </button>
          <button className="hover:text-white text-zinc-400 transition cursor-pointer">
            <FontAwesomeIcon icon={faCog} className="text-sm" />
          </button>
        </div>
      </header>

      {/* Scaffold Body */}
      <div className="erp-body">
        {children}
      </div>

      {/* Bottom Status Bar */}
      <footer className="erp-bottom-bar"></footer>
    </div>
  );
}
