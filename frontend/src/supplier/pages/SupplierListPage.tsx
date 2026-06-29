import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Supplier } from '../../common/types/model.types';
import { KeyboardShortcut } from '../../common/types/component.types';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useNotification } from '../../common/components/NotificationHost';
import ConfirmationDialog from '../../common/components/ConfirmationDialog';
import { useGetSuppliers, useDeleteSupplier } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

const COLUMNS: string[] = ['Code', 'Name', 'Phone', 'Outstanding Amount'];

export default function SupplierListPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [focusedSupplier, setFocusedSupplier] = useState<Supplier | undefined>(undefined);
  const [showDeleteDialog, changeShowDeleteDialog] = useState<boolean>(false);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: suppliersList = [], isLoading, isError, refetch } = useGetSuppliers(company_id || '');
  const { mutate: deleteSupplier, isPending: isDeletePending } = useDeleteSupplier(company_id || '');

  useEffect(() => {
    setTitle("List of Suppliers");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleFocusedRowChanged = useCallback((_index: number, supplier: Supplier | undefined) => {
    setFocusedSupplier(supplier);
  }, []);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+E',
      label: 'Edit Supplier',
      handler: () => {
        if (focusedSupplier && company_id && APP_ROUTES.EDIT_SUPPLIER.create) {
          navigate(APP_ROUTES.EDIT_SUPPLIER.create(company_id, focusedSupplier.id));
        } else if (!focusedSupplier) {
          showToast('No supplier selected');
        }
      }
    },
    {
      combination: 'Alt+D',
      label: 'Delete Supplier',
      handler: () => {
        if (focusedSupplier) {
          changeShowDeleteDialog(true);
        }
      }
    }
  ], [focusedSupplier, company_id, navigate, showToast]);

  useEffect(() => {
    registerShortcuts("SupplierListLeft", leftShortcuts);
    return () => { unregisterShortcuts("SupplierListLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  if (isLoading) {
    return <LoadingPopup message="Loading suppliers..." />;
  }

  if (isError) {
    return (
      <div className="flex w-full h-full justify-center items-center p-6">
        <Card className="max-w-md w-full mx-auto">
          <p className="text-sm font-semibold text-zinc-800">Could not load the suppliers list due to a loading error.</p>
          <p className="text-xs text-zinc-500 mt-2">
            <strong>F5</strong>: Retry
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* LEFT PANEL */}
      <aside className="erp-panel-left w-[15%] h-full">
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
        <ErpTable
          columns={COLUMNS}
          data={suppliersList}
          onRowClick={(supplier) => {
            showToast(`Selected Supplier: ${supplier.name}`);
          }}
          onFocusedRowChanged={handleFocusedRowChanged}
          searchPlaceholder="Search Supplier (Alt+F)"
          render={(colIndex, supplier) => {
            if (colIndex === 0) {
              return <span className="font-mono text-xs">{supplier.code}</span>;
            }
            if (colIndex === 1) {
              return <span className="font-bold">{supplier.name}</span>;
            }
            if (colIndex === 2) {
              return <span>{supplier.phone || 'N/A'}</span>;
            }
            if (colIndex === 3) {
              return (
                <span className="font-mono font-semibold">
                  {`₹ ${Number(supplier.outstandingAmount ?? supplier.openingBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </span>
              );
            }
            return '';
          }}
          onFilter={(supplier: Supplier, query: string) => {
            const q = query.toLowerCase().trim();
            if (!q) return true;
            return (
              (supplier.code ? supplier.code.toLowerCase().includes(q) : false) ||
              supplier.name.toLowerCase().includes(q) ||
              (supplier.phone ? supplier.phone.toLowerCase().includes(q) : false) ||
              (supplier.email ? supplier.email.toLowerCase().includes(q) : false)
            );
          }}
        />
      </div>

      {/* Delete Dialog */}
      {
        isDeletePending 
        ? <LoadingPopup message={`Deleting ${focusedSupplier?.name}`} />

        : showDeleteDialog && 
        <ConfirmationDialog
            onNo={() => changeShowDeleteDialog(false)}
            onYes={() => {
              changeShowDeleteDialog(false);
              deleteSupplier(focusedSupplier!.id, {
                onSuccess: () => {
                  setFocusedSupplier(undefined);
                }
              });
            }}
        >
          <div>
            <p style={{ margin: '0 0 1rem 0' }}>
              The following supplier will be deleted permanently. What do you want to do?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="font-bold">{focusedSupplier?.name}</span>
              <span>{focusedSupplier?.phone || ''}</span>
              <span>{focusedSupplier?.email || ''}</span>
            </div>
          </div>
        </ConfirmationDialog>
      }
    </div>
  );
}
