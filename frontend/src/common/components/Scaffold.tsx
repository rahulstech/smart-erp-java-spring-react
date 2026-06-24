import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
   faUser, 
   faCog
} from '@fortawesome/free-solid-svg-icons';
import { KeyboardShortcut, ScaffoldProps } from '../types/component.types';
import ShortcutRow from './ShortcutRow';
import { useShortcuts } from '../hooks/useShortcuts';

// A static, reference-stable EMPTY_SHORTCUTS array is defined outside the component rather than using
// an inline default parameter `shortcuts = []`. An inline `[]` creates a new array instance on every single render.
// Since this array is a dependency in useEffect, a new instance would trigger a shortcut state update, leading
// to an infinite re-render loop when the prop is omitted.
const EMPTY_SHORTCUTS: KeyboardShortcut[] = [];

export default function Scaffold({ title, shortcuts = EMPTY_SHORTCUTS, leftPanel, mainPanel, onRetry }: ScaffoldProps) {
  const navigate = useNavigate();
  const { setGlobalShortcuts, registerPageShortcuts, unregisterPageShortcuts } = useShortcuts();

  // Statically defined global shortcuts
  const GLOBAL_SHORTCUTS: KeyboardShortcut[] = useMemo(() => {
    const base = [
      {
        combination: 'Alt+Shift+D',
        label: 'Dashboard',
        handler: () => {
          alert('Dashboard shortcut triggered');
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
        combination: 'Alt+Shift+R',
        label: 'Reload',
        handler: () => {
          onRetry?.();
        }
      },
      {
        combination: 'Alt+Shift+Q',
        label: 'Logout',
        handler: () => {
          alert('Logout shortcut triggered');
        }
      }
    ];

    return base;
  }, [navigate, onRetry]);

  // Register global shortcuts
  useEffect(() => {
    setGlobalShortcuts(GLOBAL_SHORTCUTS);
    return () => setGlobalShortcuts([]);
  }, [GLOBAL_SHORTCUTS, setGlobalShortcuts]);

  // Register page shortcuts
  useEffect(() => {
    registerPageShortcuts('scaffold', shortcuts);
    return () => unregisterPageShortcuts('scaffold');
  }, [shortcuts, registerPageShortcuts, unregisterPageShortcuts]);

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
            <div className="erp-shortcut-section-title">Global Shortcuts</div>
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
