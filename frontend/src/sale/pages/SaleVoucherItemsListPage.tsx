import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useGetSaleVoucherById } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { KeyboardShortcut } from '../../common/types/component.types';

const COLUMNS = ['Stock Item', 'HSN Code', 'Quantity', 'Rate', 'Line Total'];

export default function SaleVoucherItemsList() {
  const { company_id, voucher_id } = useParams<{ company_id: string; voucher_id: string }>();
  const navigate = useNavigate();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: voucher, isLoading, isError, refetch } = useGetSaleVoucherById(company_id || '', voucher_id || '');

  useEffect(() => {
    setTitle(voucher ? `Items of ${voucher.voucherNumber}` : "Voucher Items");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch, voucher]);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+L',
      label: 'Sales',
      handler: () => {
        if (company_id && APP_ROUTES.SALE_VOUCHER_LIST.create) {
          navigate(APP_ROUTES.SALE_VOUCHER_LIST.create(company_id));
        }
      }
    },
    {
      combination: 'Alt+M',
      label: 'Manage Items',
      handler: () => {
        if (company_id && voucher_id && APP_ROUTES.ADD_SALE_ITEM.create) {
          navigate(APP_ROUTES.ADD_SALE_ITEM.create(company_id, voucher_id));
        }
      }
    }
  ], [company_id, voucher_id, navigate]);


  useEffect(() => {
    registerShortcuts("SaleItemsLeft", leftShortcuts);
    return () => {
      unregisterShortcuts("SaleItemsLeft");
    };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* LEFT PANEL */}
      <aside className="erp-panel-left h-full">
        <div className="erp-shortcut-section">
          <div className="erp-shortcut-list">
            {leftShortcuts.map((shortcut, index) => (
              <ShortcutRow
                key={`left-${shortcut.combination}-${index}`}
                combination={shortcut.combination}
                label={shortcut.label}
                onClick={shortcut.handler}
                variant="light"
              />
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <div className="erp-panel-main flex-1 flex flex-col overflow-hidden">
        {
          isLoading
          ? <LoadingPopup message="Loading voucher items..." />
          : (isError || !voucher)
          ? (
            <div className="flex w-full h-full justify-center items-center p-6">
              <Card className="max-w-md w-full mx-auto">
                <p className="text-sm font-semibold text-zinc-800">Could not load the sale voucher details.</p>
                <p className="text-xs text-zinc-500 mt-2">
                  <strong>F5</strong>: Retry
                </p>
              </Card>
            </div>
          )
          : (
            <>
              {/* Header Summary Card */}
              <div className="p-4 bg-zinc-50 border-b border-zinc-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Voucher Number</span>
                    <span className="font-mono text-sm font-bold text-zinc-800">{voucher.voucherNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Voucher Date</span>
                    <span className="text-sm font-semibold text-zinc-800">{voucher.voucherDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Customer</span>
                    <span className="text-sm font-bold text-zinc-800">{voucher.customerName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Grand Total</span>
                    <span className="font-mono text-sm font-bold text-emerald-600">
                      ₹ {Number(voucher.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table of Items */}
              <div className="flex-1 min-h-0 relative flex flex-col">
                <ErpTable
                  columns={COLUMNS}
                  data={voucher.items || []}
                  searchPlaceholder="Search Item (Alt+F)"
                  render={(colIndex, item) => {
                    if (colIndex === 0) {
                      return <span className="font-semibold">{item.itemName || 'N/A'}</span>;
                    }
                    if (colIndex === 1) {
                      return <span>{item.hsnCode || '—'}</span>;
                    }
                    if (colIndex === 2) {
                      return <span className="font-mono">{item.quantity}</span>;
                    }
                    if (colIndex === 3) {
                      return <span className="font-mono">₹ {Number(item.rate || 0).toFixed(2)}</span>;
                    }
                    if (colIndex === 4) {
                      return (
                        <span className="font-mono font-bold">
                          ₹ {Number(item.lineTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      );
                    }
                    return '';
                  }}
                  onFilter={(item, query) => {
                    const q = query.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      (item.itemName || '').toLowerCase().includes(q) ||
                      (item.hsnCode || '').toLowerCase().includes(q)
                    );
                  }}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
