import { useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import CompanyInput from '../components/CompanyInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useGetCompanyById, useUpdateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Company } from '../../common/types/model.types';
import { APP_ROUTES, GLOBAL_SHORTCUT_RELOAD } from '../../common/constants';
import { KeyboardShortcut } from '../../common/types/shortcut.types';
import { useShortcuts } from '../../common/hooks/useShortcuts';

interface EditCompanyMainProps {
  company: Company;
  onSave: (formData: CompanyFormData)=> void;
}

function EditCompanyMain({
  company,
  onSave
}: EditCompanyMainProps) {
  const companyFormData = useMemo<CompanyFormData | undefined>(() => {
    if (!company) return undefined;
    return {
      name: company.name || '',
      phone: company.phone || '',
      email: company.email || '',
      gstNumber: company.gstNumber || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || 'India',
      pincode: company.pincode || ''
    };
  }, [company]);

  return (
    <>
      {companyFormData && (
        <CompanyInput onSave={onSave} initialData={companyFormData} />
      )}
    </>
  );
}

export default function EditCompanyPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: company, isLoading, isError, refetch } = useGetCompanyById(company_id || '');
  const updateMutation = useUpdateCompany();

  const handleSave = useCallback((formData: CompanyFormData) => {
    updateMutation.mutate(
      { id: company_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Company "${data.name}" updated successfully!`);
          navigate(APP_ROUTES.HOME.path);
        },
        onError: () => {
          showToast("Could not save the company due to a saving error.");
        }
      }
    );
  }, [updateMutation, company_id, navigate, showToast]);

  const pageShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Esc',
      label: 'Quit',
      handler: () => {
        navigate(APP_ROUTES.HOME.path);
        return true;
      }
    },
    { combination: 'F5', label: 'Reload Company', handler: () => { refetch(); return true; } }
  ], [navigate, refetch]);

  useEffect(() => {
    registerShortcuts("EditCompany", pageShortcuts);
    return () => { unregisterShortcuts("EditCompany"); };
  }, [registerShortcuts, unregisterShortcuts, pageShortcuts]);

  return (
    <>
      <Scaffold
        title="Alter Company"
        onRetry={isError ? refetch : undefined}
      >
        <div className="flex w-full h-full overflow-hidden">
          {/* MAIN PANEL */}
          <div className="erp-panel-main flex-1 overflow-y-auto">
            {isError ? (
              <div className="flex w-full h-full justify-center items-center p-6">
                <Card className="max-w-md w-full mx-auto">
                  <p className="text-sm font-semibold text-zinc-800">Could not load the company due to a loading error.</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    <strong>{GLOBAL_SHORTCUT_RELOAD.combination}</strong>: Retry
                  </p>
                </Card>
              </div>
            ) : (
              company && <EditCompanyMain company={company} onSave={handleSave} />
            )}
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
      {(isLoading || updateMutation.isPending) && <LoadingPopup message={updateMutation.isPending ? "Updating company details..." : "Loading company details..."} />}
    </>
  );
}
