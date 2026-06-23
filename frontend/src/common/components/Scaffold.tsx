import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
   faUser, 
   faCog
} from '@fortawesome/free-solid-svg-icons';
import { KeyboardShortcut, ScaffoldProps } from '../types/scaffold.types';
import ShortcutRow from './ShortcutRow';

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

export default function Scaffold({ title, shortcuts = [], leftPanel, mainPanel }: ScaffoldProps) {
  const navigate = useNavigate();

  // Statically defined global shortcuts
  const GLOBAL_SHORTCUTS: KeyboardShortcut[] = useMemo(() => [
    {
      combination: 'Alt+Shift+D',
      label: 'Dashboard',
      handler: () => {
        alert('Dashboard shortcut triggered');
      }
    },
    {
      combination: 'Alt+Shift+K',
      label: 'Cmd Palette',
      handler: () => {
        alert('Command Palette shortcut triggered');
      }
    },
    {
      combination: 'Alt+Shift+H',
      label: 'Home',
      handler: () => {
        navigate('/');
      }
    },
    {
      combination: 'Alt+Shift+B',
      label: 'Back',
      handler: () => {
        navigate(-1);
      }
    },
    {
      combination: 'Alt+Shift+Q',
      label: 'Logout',
      handler: () => {
        alert('Logout shortcut triggered');
      }
    }
  ], [navigate]);

  // Dynamically filter shortcuts passed as props for conflicts
  const resolvedShortcuts = useMemo(() => {
    return shortcuts.filter(shortcut => {
      const isConflicting = GLOBAL_SHORTCUTS.some(gs => 
        gs.combination.toLowerCase() === shortcut.combination.toLowerCase()
      );
      if (isConflicting) {
        console.warn(
          `Conflict Warning: The shortcut "${shortcut.combination}" is registered globally by Scaffold and cannot be overridden. Discarding dynamic handler for "${shortcut.label}".`
        );
      }
      return !isConflicting;
    });
  }, [shortcuts, GLOBAL_SHORTCUTS]);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Match against global shortcuts
      for (const gs of GLOBAL_SHORTCUTS) {
        if (matchesShortcut(e, gs.combination)) {
          e.preventDefault();
          gs.handler();
          return;
        }
      }

      // 2. Match against dynamic shortcuts passed as props
      for (const ds of resolvedShortcuts) {
        if (matchesShortcut(e, ds.combination)) {
          e.preventDefault();
          ds.handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [GLOBAL_SHORTCUTS, resolvedShortcuts]);

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

      {/* Scaffold Body with Panels */}
      <div className="erp-body">
        {/* LEFT PANEL */}
        <aside className="erp-panel-left">
          {leftPanel}
        </aside>

        {/* MAIN PANEL */}
        <div className="erp-panel-main">
          {mainPanel}
        </div>

        {/* RIGHT PANEL - Shortcuts Sidebar */}
        <aside className="erp-panel-right">
          <div className="erp-shortcut-section">
            <div className="erp-shortcut-section-title">Global Short cuts</div>
            <div className="erp-shortcut-list">
              {GLOBAL_SHORTCUTS.map((shortcut, index) => (
                <ShortcutRow
                  key={`global-${shortcut.combination}-${index}`}
                  combination={shortcut.combination}
                  label={shortcut.label}
                  onClick={shortcut.handler}
                  variant="dark"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="erp-bottom-bar"></footer>
    </div>
  );
}
