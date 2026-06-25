import { useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import CompanyInput from '../components/CompanyInput';
import { APP_ROUTES } from '../../common/constants';
import { KeyboardShortcut } from '../../common/types/shortcut.types';
import { useShortcuts } from '../../common/hooks/useShortcuts';

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCompany();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const handleSave = useCallback((formData: CompanyFormData) => {
    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Company "${data.name}" created successfully!`);
        navigate(APP_ROUTES.HOME.path);
      },
      onError: () => {
        showToast("Could not save the company due to a saving error.");
      }
    });
  }, [createMutation, navigate, showToast]);

  const pageShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Esc',
      label: 'Quit',
      handler: () => {
        navigate(APP_ROUTES.HOME.path);
        return true;
      }
    }
  ], [navigate]);

  useEffect(() => {
    registerShortcuts("CreateCompany", pageShortcuts);
    return () => { unregisterShortcuts("CreateCompany"); };
  }, [registerShortcuts, unregisterShortcuts, pageShortcuts]);

  return (
    <>
      <Scaffold title="Create Company">
        <div className="flex w-full h-full overflow-hidden">
          {/* MAIN PANEL */}
          <div className="erp-panel-main flex-1 overflow-y-auto">
            <CompanyInput onSave={handleSave} />
          </div>

          {/* COMMAND PANEL */}
          <aside className="erp-panel-right" style={{ width: '15%', height: '100%' }}>
            <div className="erp-shortcut-section">
              <div className="erp-shortcut-list">
                {pageShortcuts.map((shortcut, index) => (
                  <ShortcutRow
                    key={`command-${shortcut.combination}-${index}`}
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
      </Scaffold>
      {createMutation.isPending && <LoadingPopup message="Creating company..." />}
    </>
  );
}
