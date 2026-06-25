import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useGetCompanyById } from '../hooks/api.hooks';
import { APP_ROUTES, GLOBAL_SHORTCUT_RELOAD } from '../../common/constants';
import Table from '../../common/components/Table';
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
      combination: 'Alt+O',
      label: 'Select Company',
      handler: () => {
        navigate(APP_ROUTES.HOME.path);
      }
    },
    {
      combination: 'Alt+C',
      label: 'Create Customer',
      handler: () => {
        showToast('Create Customer under construction');
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
    },
    { combination: 'F5', label: 'Reload Dashboard', handler: () => refetch() }
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
            ) : company ? (
              <div className="p-6 w-full max-w-4xl">
                {/* Dashboard top row */}
                <div className="flex justify-between items-center border-b border-[#cbd5e1] pb-2 mb-6">
                  <span className="text-xl font-bold text-[#002c66]">
                    Key Performance Index
                  </span>
                  <span className="text-sm font-bold text-[#475569]">
                    1-Apr-2026 to 31-Mar-2027
                  </span>
                </div>

                {/* KPI Two-column Table */}
                <Table
                  data={[
                    { label: 'Total Sales', value: '₹ 1,52,40,000.00' },
                    { label: 'Total Purchase', value: '₹ 98,50,000.00' },
                    { label: 'Outstanding Receivables', value: '₹ 24,15,000.00' },
                    { label: 'Outstanding Payables', value: '₹ 12,80,000.00' }
                  ]}
                  renderHeaderCell={(header) => (
                    <span className={header === 'the value' ? 'block text-right font-bold' : 'font-bold'}>
                      {header}
                    </span>
                  )}
                  renderRowCell={(row, colIndex) => {
                    if (colIndex === 0) {
                      return <span>{row.label}</span>;
                    } else {
                      return <span className="block text-right font-mono font-semibold">{row.value}</span>;
                    }
                  }}
                />
              </div>
            ) : null}
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
      {isLoading && <LoadingPopup message="Loading company details..." />}
    </>
  );
}
