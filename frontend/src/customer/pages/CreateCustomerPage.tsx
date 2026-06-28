import { useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateCustomer } from '../hooks/api.hooks';
import { CustomerFormData } from '../types/customer.types';
import { useNotification } from '../../common/components/NotificationHost';
import CustomerInput from '../components/CustomerInput';
import { APP_ROUTES } from '../../common/constants';
import { KeyboardShortcut } from '../../common/types/shortcut.types';
import { useShortcuts } from '../../common/hooks/useShortcuts';

export default function CreateCustomerPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateCustomer(company_id || '');
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const handleSave = useCallback((formData: CustomerFormData) => {
    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Customer "${data.name}" created successfully!`);
        if (company_id && APP_ROUTES.DASHBOARD.create) {
          navigate(APP_ROUTES.DASHBOARD.create(company_id));
        } else {
          navigate(APP_ROUTES.HOME.path);
        }
      },
      onError: () => {
        showToast("Could not save the customer due to a saving error.");
      }
    });
  }, [createMutation, navigate, showToast, company_id]);

  const pageShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Esc',
      label: 'Quit',
      handler: () => {
        if (company_id && APP_ROUTES.DASHBOARD.create) {
          navigate(APP_ROUTES.DASHBOARD.create(company_id));
        } else {
          navigate(APP_ROUTES.HOME.path);
        }
        return true;
      }
    }
  ], [navigate, company_id]);

  useEffect(() => {
    registerShortcuts("CreateCustomer", pageShortcuts);
    return () => { unregisterShortcuts("CreateCustomer"); };
  }, [registerShortcuts, unregisterShortcuts, pageShortcuts]);

  return (
    <>
      <Scaffold title="Create Customer">
        <div className="flex w-full h-full overflow-hidden">
          {/* MAIN PANEL */}
          <div className="erp-panel-main flex-1 overflow-y-auto">
            <CustomerInput onSave={handleSave} />
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
      {createMutation.isPending && <LoadingPopup message="Creating customer..." />}
    </>
  );
}
