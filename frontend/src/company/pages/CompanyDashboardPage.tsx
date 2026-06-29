import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useGetCompanyById } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import List from '../../common/components/List';
import { useNotification } from '../../common/components/NotificationHost';
import { KeyboardShortcut } from '../../common/types/component.types';
import { useShortcuts } from '../../common/hooks/useShortcuts';

export default function CompanyDashboardPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: company, isLoading, isError, refetch } = useGetCompanyById(company_id || '');

  const pageShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'F6',
      label: 'Select Company',
      handler: () => {
        navigate(APP_ROUTES.HOME.path);
      }
    },
    {
      combination: 'F7',
      label: 'Dashboard',
      handler: () => {
        if (company_id && APP_ROUTES.DASHBOARD.create) {
          navigate(APP_ROUTES.DASHBOARD.create(company_id));
        }
      }
    },
    { combination: 'F5', 
      label: 'Reload', 
      handler: () => refetch() 
    },
    {
      combination: 'Alt+C',
      label: 'Create Customer',
      handler: () => {
        if (company_id && APP_ROUTES.CREATE_CUSTOMER.create) {
          navigate(APP_ROUTES.CREATE_CUSTOMER.create(company_id));
        }
      }
    },
    {
      combination: 'Alt+S',
      label: 'Create Supplier',
      handler: () => {
        showToast('Create Supplier under construction');
      }
    },
    {
      combination: 'Alt+I',
      label: 'Add Stock',
      handler: () => {
        showToast('Add Stock under construction');
      }
    },
    {
      combination: 'Alt+P',
      label: 'Add Purchase Voucher',
      handler: () => {
        showToast('Add Purchase Voucher under construction');
      }
    },
    {
      combination: 'Alt+V',
      label: 'Add Sell Voucher',
      handler: () => {
        showToast('Add Sell Voucher under construction');
      }
    }
  ], [navigate, showToast, refetch]);

  useEffect(() => {
    registerShortcuts("CompanyDashboard", pageShortcuts);
    return () => { unregisterShortcuts("CompanyDashboard"); };
  }, [registerShortcuts, unregisterShortcuts, pageShortcuts]);

  return (
    <>
      <Scaffold
        title={company ? `${company.name} - Dashboard` : 'Company Dashboard'}
        onRetry={isError ? refetch : undefined}
      >
        <div className="flex w-full h-full overflow-hidden">
          {/* MAIN PANEL */}
          <div className="erp-panel-main flex-1 overflow-y-auto flex justify-center">
            {isError ? (
              <div className="flex w-full h-full justify-center items-center p-6">
                <Card className="max-w-md w-full mx-auto">
                  <p className="text-sm font-semibold text-zinc-800">Could not load the company due to a loading error.</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    <strong>F5</strong>: Retry
                  </p>
                </Card>
              </div>
            ) : company ? (
              <div className="p-6 w-full flex flex-row gap-6 items-start">
                {/* LEFT SECTION (70%) */}
                <div className="w-[70%] flex flex-col items-center justify-start">
                  <div className="w-full max-w-xl flex flex-col items-center">
                    <div className="flex flex-row items-center justify-between border-b border-[#cbd5e1] pb-2 mb-6 w-full text-center">
                      <span className="text-xl font-bold">
                        Key Performance Index
                      </span>
                      <span className="text-xs font-bold mt-1">
                        1-Apr-2026 to 31-Mar-2027
                      </span>
                    </div>

                    {/* KPI List */}
                    <div className="w-full">
                      <List
                        data={[
                          { label: 'Total Sales', value: '₹ 1,52,40,000.00' },
                          { label: 'Total Purchase', value: '₹ 98,50,000.00' },
                          { label: 'Outstanding Receivables', value: '₹ 24,15,000.00' },
                          { label: 'Outstanding Payables', value: '₹ 12,80,000.00' }
                        ]}
                        renderItem={(item) => (
                          <div className="flex justify-between w-full items-center">
                            <span>{item.label}</span>
                            <span className="font-mono font-semibold">{item.value}</span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION (30%) */}
                <div className="w-[30%] flex flex-col">
                  <List<string>
                    autoFocus
                    data={[
                      'Customers',
                      'Suppliers',
                      'Inventory',
                      'Purchase Vouchers',
                      'Sell Vouchers'
                    ]}
                    onItemClicked={(item) => {
                      if (item === 'Customers' && company_id) {
                        navigate(APP_ROUTES.CUSTOMER_LIST.create!(company_id));
                      } else {
                        showToast(item);
                      }
                    }}
                    onFocusedItemChanged={() => {}}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* COMMAND PANEL */}
          <aside className="erp-panel-right w-[15%] h-full">
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
      {isLoading && <LoadingPopup message="Loading company details..." />}
    </>
  );
}
