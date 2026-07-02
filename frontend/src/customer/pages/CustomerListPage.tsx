import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Customer } from '../../common/types/model.types';
import { KeyboardShortcut } from '../../common/types/component.types';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useNotification } from '../../common/components/NotificationHost';
import ConfirmationDialog from '../../common/components/ConfirmationDialog';
import { useGetCustomers, useDeleteCustomer } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

const COLUMNS: string[] = ['Name', 'Phone', 'Current Balance'];

export default function CustomerListPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [focusedCustomer, setFocusedCustomer] = useState<Customer | undefined>(undefined);
  const [showDeleteDialog, changeShowDeleteDialog] = useState<boolean>(false);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: customersList = [], isLoading, isError, refetch } = useGetCustomers(company_id || '');
  const { mutate: deleteCustomer, isPending: isDeletePending } = useDeleteCustomer(company_id || '');

  useEffect(() => {
    setTitle("List of Customers");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleFocusedRowChanged = useCallback((_index: number, customer: Customer | undefined) => {
    setFocusedCustomer(customer);
  }, []);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+E',
      label: 'Edit Customer',
      handler: () => {
        if (focusedCustomer && company_id && APP_ROUTES.EDIT_CUSTOMER.create) {
          navigate(APP_ROUTES.EDIT_CUSTOMER.create(company_id, focusedCustomer.id));
        } else if (!focusedCustomer) {
          showToast('No customer selected');
        }
      }
    },
    {
      combination: 'Alt+D',
      label: 'Delete Customer',
      handler: () => {
        if (focusedCustomer) {
          changeShowDeleteDialog(true);
        }
      }
    }
  ], [focusedCustomer, company_id, navigate, showToast]);

  useEffect(() => {
    registerShortcuts("CustomerListLeft", leftShortcuts);
    return () => { unregisterShortcuts("CustomerListLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  if (isLoading) {
    return <LoadingPopup message="Loading customers..." />;
  }

  if (isError) {
    return (
      <div className="flex w-full h-full justify-center items-center p-6">
        <Card className="max-w-md w-full mx-auto">
          <p className="text-sm font-semibold text-zinc-800">Could not load the customers list due to a loading error.</p>
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
        <ErpTable
          columns={COLUMNS}
          data={customersList}
          onRowClick={(customer) => {
            showToast(`Selected Customer: ${customer.name}`);
          }}
          onFocusedRowChanged={handleFocusedRowChanged}
          searchPlaceholder="Search Customer (Alt+F)"
          render={(colIndex, customer) => {
            if (colIndex === 0) {
              return <span className="font-bold">{customer.name}</span>;
            }
            if (colIndex === 1) {
              return <span>{customer.phone || 'N/A'}</span>;
            }
            if (colIndex === 2) {
              return (
                <span className="font-mono font-semibold">
                  {`₹ ${Number(customer.currentBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </span>
              );
            }
            return '';
          }}
          onFilter={(customer: Customer, query: string) => {
            const q = query.toLowerCase().trim();
            if (!q) return true;
            return (
              customer.name.toLowerCase().includes(q) ||
              (customer.phone ? customer.phone.toLowerCase().includes(q) : false) ||
              (customer.email ? customer.email.toLowerCase().includes(q) : false)
            );
          }}
        />
      </div>

      {/* Delete Dialog */}
      {
        isDeletePending 
        ? <LoadingPopup message={`Deleting ${focusedCustomer?.name}`} />

        : showDeleteDialog && 
        <ConfirmationDialog
            onNo={() => changeShowDeleteDialog(false)}
            onYes={() => {
              changeShowDeleteDialog(false);
              deleteCustomer(focusedCustomer!.id, {
                onSuccess: () => {
                  setFocusedCustomer(undefined);
                }
              });
            }}
        >
          <div>
            <p style={{ margin: '0 0 1rem 0' }}>
              The following customer will be deleted permanently. What do you want to do?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="font-bold">{focusedCustomer?.name}</span>
              <span>{focusedCustomer?.phone || ''}</span>
              <span>{focusedCustomer?.email || ''}</span>
            </div>
          </div>
        </ConfirmationDialog>
      }
    </div>
  );
}
