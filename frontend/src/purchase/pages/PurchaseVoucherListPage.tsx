import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PurchaseVoucher } from '../types/purchase.types';
import { KeyboardShortcut } from '../../common/types/component.types';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useNotification } from '../../common/components/NotificationHost';
import ConfirmationDialog from '../../common/components/ConfirmationDialog';
import { useGetPurchaseVouchers, useDeletePurchaseVoucher } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

const COLUMNS: string[] = ['Voucher No.', 'Voucher Date', 'Supplier', 'Total Amount'];

export default function PurchaseVoucherListPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const [focusedVoucher, setFocusedVoucher] = useState<PurchaseVoucher | undefined>(undefined);
  const [showDeleteDialog, changeShowDeleteDialog] = useState<boolean>(false);

  const { data: vouchersList = [], isLoading, isError, refetch } = useGetPurchaseVouchers(company_id || '');
  const { mutate: deleteVoucher, isPending: isDeletePending } = useDeletePurchaseVoucher(company_id || '');

  useEffect(() => {
    setTitle("Purchase Vouchers");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleFocusedRowChanged = useCallback((_index: number, voucher: PurchaseVoucher | undefined) => {
    setFocusedVoucher(voucher);
  }, []);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+L',
      label: 'Purchases',
      handler: () => {
        refetch();
        showToast('Refreshing purchase vouchers list...');
      }
    },
    {
      combination: 'Alt+E',
      label: 'Edit Voucher',
      handler: () => {
        if (focusedVoucher) {
          if (company_id && APP_ROUTES.EDIT_PURCHASE_VOUCHER.create) {
            navigate(APP_ROUTES.EDIT_PURCHASE_VOUCHER.create(company_id, focusedVoucher.id));
          }
        } else {
          showToast('No purchase voucher selected');
        }
      }
    },
    {
      combination: 'Alt+D',
      label: 'Delete Voucher',
      handler: () => {
        if (focusedVoucher) {
          changeShowDeleteDialog(true);
        } else {
          showToast('No purchase voucher selected');
        }
      }
    }
  ], [focusedVoucher, company_id, refetch, showToast, navigate]);

  useEffect(() => {
    registerShortcuts("PurchaseListLeft", leftShortcuts);
    return () => { unregisterShortcuts("PurchaseListLeft"); };
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
      <div className="erp-panel-main flex-1 overflow-y-auto">

        {
          isLoading
          ? <LoadingPopup message="Loading purchase vouchers..." />
          : isError
          ? (
              <div className="flex w-full h-full justify-center items-center p-6">
                <Card className="max-w-md w-full mx-auto">
                  <p className="text-sm font-semibold text-zinc-800">Could not load the purchase vouchers list.</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    <strong>F5</strong>: Retry
                  </p>
                </Card>
              </div>
          )
          :
          <ErpTable
            columns={COLUMNS}
            data={vouchersList}
            onRowClick={(voucher) => {
              if (company_id && APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create) {
                navigate(APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create(company_id, voucher.id));
              }
            }}
            onFocusedRowChanged={handleFocusedRowChanged}
            searchPlaceholder="Search Voucher (Alt+F)"
            render={(colIndex, voucher) => {
              if (colIndex === 0) {
                return <span className="font-mono text-xs">{voucher.voucherNumber}</span>;
              }
              if (colIndex === 1) {
                return <span>{voucher.voucherDate}</span>;
              }
              if (colIndex === 2) {
                return <span className="font-bold">{voucher.supplierName}</span>;
              }
              if (colIndex === 3) {
                return (
                  <span className="font-mono font-semibold">
                    {`₹ ${Number(voucher.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  </span>
                );
              }
              return '';
            }}
            onFilter={(voucher: PurchaseVoucher, query: string) => {
              const q = query.toLowerCase().trim();
              if (!q) return true;
              return (
                voucher.voucherNumber.toLowerCase().includes(q) ||
                voucher.supplierName.toLowerCase().includes(q)
              );
            }}
          />
        }
      </div>

      {/* Delete Dialog */}
      {isDeletePending ? (
        <LoadingPopup message={`Deleting voucher ${focusedVoucher?.voucherNumber}`} />
      ) : showDeleteDialog && (
        <ConfirmationDialog
          onNo={() => changeShowDeleteDialog(false)}
          onYes={() => {
            changeShowDeleteDialog(false);
            deleteVoucher(focusedVoucher!.id, {
              onSuccess: () => {
                setFocusedVoucher(undefined);
                showToast("Purchase voucher deleted successfully.");
              },

              onError: ()=> {
                showToast("Purchase voucher not deleted");
              }
            });
          }}
        >
          <div>
            <p style={{ margin: '0 0 1rem 0' }}>
              The following purchase voucher and its line items will be deleted permanently.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="font-bold">{focusedVoucher?.voucherNumber}</span>
              <span>Date: {focusedVoucher?.voucherDate}</span>
              <span>Supplier: {focusedVoucher?.supplierName}</span>
              <span>Total: ₹ {Number(focusedVoucher?.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </ConfirmationDialog>
      )}
    </div>
  );
}
