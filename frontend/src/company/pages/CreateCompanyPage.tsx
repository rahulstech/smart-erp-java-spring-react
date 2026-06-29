import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  const handleSave = useCallback((formData: CompanyFormData) => {
    // Clear previous server errors before sending request
    setServerErrors(undefined);

    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Company "${data.name}" created successfully!`);
        navigate(APP_ROUTES.HOME.path);
      },
      onError: (error: unknown) => {
        // Parse HTTP 400 field validation errors returned by server
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data;
          if (data && typeof data.reasons === 'object' && data.reasons !== null) {
            setServerErrors(data.reasons as Record<string, string>);
            showToast('Validation failed. Please check input fields.');
            return;
          }
        }
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
            <CompanyInput onSave={handleSave} serverErrors={serverErrors} />
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
