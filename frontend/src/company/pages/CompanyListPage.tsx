import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../common/types/model.types';
import { KeyboardShortcut } from '../../common/types/component.types';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useDeleteCompany, useGetCompanies } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import ConfirmationDialog from '../../common/components/ConfirmationDialog';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

const COLUMNS: string[] = ['Name', 'GST Number'];

export default function CompanyListPage() {
  const navigate = useNavigate();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [focusedCompany, setFocusedCompany] = useState<Company | undefined>(undefined);
  const [showDeleteDialog, changeShowDeleteDialog] = useState<boolean>(false);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();
  const { data: companiesList = [], isLoading, isError, refetch } = useGetCompanies();
  const { 
    mutate: deleteCompany, 
    isPending: isDeletePending } = useDeleteCompany();

  useEffect(() => {
    setTitle("List of Companies");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleFocusedRowChanged = useCallback((_index: number, company: Company | undefined) => {
    setFocusedCompany(company);
  }, [setFocusedCompany]);

  // Define left shortcuts for the company list view
  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    { 
      combination: 'Alt+N', 
      label: 'Create Company', 
      handler: () => { navigate(APP_ROUTES.CREATE_COMPANY.path); } 
    },
    {
      combination: 'Alt+E', 
      label: 'Edit Company',
      handler: () => {
        if (focusedCompany && APP_ROUTES.EDIT_COMPANY.create) {
          navigate(APP_ROUTES.EDIT_COMPANY.create(focusedCompany.id));
        }
      }
    },
    {
      combination: 'Alt+D', 
      label: 'Delete Company',
      handler: () => {
        if (focusedCompany) {
          changeShowDeleteDialog(true);
        }
      }
    }
  ], [navigate, focusedCompany]);

  useEffect(() => {
    registerShortcuts("CompanyListLeft", leftShortcuts);
    return () => { unregisterShortcuts("CompanyListLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  if (isLoading) {
    return <LoadingPopup message="Loading companies..." />;
  }

  if (isError) {
    return (
      <div className="flex w-full h-full justify-center items-center p-6">
        <Card className="max-w-md w-full mx-auto">
          <p className="text-sm font-semibold text-zinc-800">Could not load the companies list due to a loading error.</p>
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
          data={companiesList}
          onRowClick={(company) => {
            if (APP_ROUTES.DASHBOARD.create) {
              navigate(APP_ROUTES.DASHBOARD.create(company.id));
            }
          }}
          onFocusedRowChanged={handleFocusedRowChanged}
          searchPlaceholder="Search Company (Alt+F)"
          render={(colIndex, company) => {
            if (colIndex === 0) {
              return <span className="font-bold">{company.name}</span>;
            }
            if (colIndex === 1) {
              return <span className="font-mono">{company.gstNumber || 'N/A'}</span>;
            }
            return '';
          }}
          onFilter={(company: Company, query: string) => {
            const q = query.toLowerCase().trim();
            if (!q) return true;
            return (
              company.name.toLowerCase().includes(q) ||
              (company.gstNumber ? company.gstNumber.toLowerCase().includes(q) : false)
            );
          }}
        />
      </div>

      {/* Delete Dialog */}
      {
        isDeletePending 
        ? <LoadingPopup message={`Deleting ${focusedCompany?.name}`} />

        : showDeleteDialog && 
        <ConfirmationDialog
            onNo={()=> changeShowDeleteDialog(false) }
            onYes={()=> {
              changeShowDeleteDialog(false);
              deleteCompany(focusedCompany!.id, {
                onSuccess: ()=> {
                  setFocusedCompany(undefined)
                }
              })
            }}
        >
          <div>
              <p style={{ margin: '0 0 1rem 0' }}>
                The following company will be deleted permanently. What do you want to do?
              </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="font-bold">{focusedCompany?.name}</span>
              <span>{focusedCompany?.address}</span>
              <span>{focusedCompany?.gstNumber || ''}</span>
            </div>
          </div>
        </ConfirmationDialog>
      }
    </div>
  );
}