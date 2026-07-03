import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetCompanyById } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import List from '../../common/components/List';
import { useNotification } from '../../common/components/NotificationHost';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

export default function CompanyDashboardPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();

  const { data: company, isLoading, isError, refetch } = useGetCompanyById(company_id || '');

  useEffect(() => {
    setTitle(company ? `${company.name} - Dashboard` : 'Company Dashboard');
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, company, isError, refetch]);

  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        {/* MAIN PANEL */}
        <div className="erp-panel-main flex-1 overflow-y-auto flex flex-col justify-start items-start">
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
                  {/* Company Details Header */}
                  <div className="w-full flex flex-col items-start mb-6">
                    <div className="flex items-baseline gap-2 pb-2 border-b border-[#cbd5e1] w-full">
                      <span className="text-2xl font-bold text-zinc-900">{company.name}</span>
                      {company.gstNumber && (
                        <>
                          <span className="text-zinc-400 font-light mx-1">|</span>
                          <span className="text-base text-zinc-700">{company.gstNumber}</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-zinc-600 flex flex-col gap-0.5 mt-2">
                      <div>
                        {[company.address, company.city, company.state, company.country].filter(Boolean).join(', ')}
                        {company.pincode ? `, PIN: ${company.pincode}` : ''}
                      </div>
                      <div>
                        {company.phone && <span>{company.phone}</span>}
                        {company.phone && company.email && <span className="mx-2 text-zinc-400">•</span>}
                        {company.email && <span>{company.email}</span>}
                      </div>
                    </div>
                  </div>

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
                    } else if (item === 'Suppliers' && company_id) {
                      navigate(APP_ROUTES.SUPPLIER_LIST.create!(company_id));
                    } else if (item === 'Inventory' && company_id) {
                      navigate(APP_ROUTES.STOCK_LIST.create!(company_id));
                    } else if (item === 'Purchase Vouchers' && company_id) {
                      navigate(APP_ROUTES.PURCHASE_VOUCHER_LIST.create!(company_id));
                    } else if (item === 'Sell Vouchers' && company_id) {
                      navigate(APP_ROUTES.SALE_VOUCHER_LIST.create!(company_id));
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
      </div>
      {isLoading && <LoadingPopup message="Loading company details..." />}
    </>
  );
}
