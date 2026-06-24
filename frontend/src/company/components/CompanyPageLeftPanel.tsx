import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { KeyboardShortcut } from '../../common/types/component.types';

export default function CompanyPageLeftPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerPageShortcuts, unregisterPageShortcuts } = useShortcuts();

  // Check which path is currently active
  const isSelectActive = location.pathname === '/' || location.pathname === '/';
  const isCreateActive = location.pathname === '/create-company';

  // Shortcuts are registered directly from this shared left panel component instead of each individual page.
  // Since the left panel is the 'owner' of these navigation items (it displays the labels and handles the click events)
  // and is shared across all company pages, it is responsible for managing the corresponding keyboard shortcuts.
  // This keeps the shortcuts tightly coupled to the UI that represents them, and avoids duplicate code across page components.
  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Alt+O',
        label: 'Select Company',
        handler: () => {
          navigate('/');
        }
      },
      {
        combination: 'Alt+N',
        label: 'Create Company',
        handler: () => {
          navigate('/create-company');
        }
      }
    ];

    registerPageShortcuts('left-panel', shortcuts);
    return () => unregisterPageShortcuts('left-panel');
  }, [navigate, registerPageShortcuts, unregisterPageShortcuts]);

  return (
    <div className="flex flex-col gap-2">
      <div className="gateway-title">Company Menu</div>
      <div className="gateway-subtitle">Manage Companies</div>
      <div className="flex flex-col gap-2">
        <ShortcutRow
          combination="Alt+O"
          label="Select Company"
          onClick={() => navigate('/')}
          selectable={true}
          selected={isSelectActive}
          variant="light"
        />
        <ShortcutRow
          combination="Alt+N"
          label="Create Company"
          onClick={() => navigate('/create-company')}
          selectable={true}
          selected={isCreateActive}
          variant="light"
        />
      </div>
    </div>
  );
}
