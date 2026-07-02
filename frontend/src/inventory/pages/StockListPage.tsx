import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StockItem } from '../types/model.types';
import { KeyboardShortcut } from '../../common/types/component.types';
import ErpTable from '../../common/components/ErpTable';
import ShortcutRow from '../../common/components/ShortcutRow';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useNotification } from '../../common/components/NotificationHost';
import { useGetStockItems } from '../hooks/api.hooks';
import { APP_ROUTES } from '../../common/constants';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

const COLUMNS: string[] = ['Item Code', 'Item Name', 'Category', 'Unit', 'Current Qty'];

export default function StockListPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [focusedStock, setFocusedStock] = useState<StockItem | undefined>(undefined);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: stocksList = [], isLoading, isError, refetch } = useGetStockItems(company_id || '');

  useEffect(() => {
    setTitle("List of Stock Items");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleFocusedRowChanged = useCallback((_index: number, stock: StockItem | undefined) => {
    setFocusedStock(stock);
  }, []);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+E',
      label: 'Edit Stock',
      handler: () => {
        if (focusedStock && company_id && APP_ROUTES.EDIT_STOCK.create) {
          navigate(APP_ROUTES.EDIT_STOCK.create(company_id, focusedStock.id));
        } else if (!focusedStock) {
          showToast('No stock item selected');
        }
      }
    },
    {
      combination: 'Alt+T',
      label: 'Add Category',
      handler: () => {
        if (company_id && APP_ROUTES.ADD_CATEGORY.create) {
          navigate(APP_ROUTES.ADD_CATEGORY.create(company_id));
        }
      }
    },
    {
      combination: 'Alt+U',
      label: 'Add Unit',
      handler: () => {
        if (company_id && APP_ROUTES.ADD_UNIT.create) {
          navigate(APP_ROUTES.ADD_UNIT.create(company_id));
        }
      }
    }
  ], [focusedStock, company_id, navigate, showToast]);

  useEffect(() => {
    registerShortcuts("StockListLeft", leftShortcuts);
    return () => { unregisterShortcuts("StockListLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  if (isLoading) {
    return <LoadingPopup message="Loading stock items..." />;
  }

  if (isError) {
    return (
      <div className="flex w-full h-full justify-center items-center p-6">
        <Card className="max-w-md w-full mx-auto">
          <p className="text-sm font-semibold text-zinc-800">Could not load the stocks list due to a loading error.</p>
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
          data={stocksList}
          onRowClick={(stock) => {
            showToast(`Selected Stock Item: ${stock.itemName}`);
          }}
          onFocusedRowChanged={handleFocusedRowChanged}
          searchPlaceholder="Search Stock Item (Alt+F)"
          render={(colIndex, stock) => {
            if (colIndex === 0) {
              return <span className="font-mono text-xs">{stock.itemCode}</span>;
            }
            if (colIndex === 1) {
              return <span className="font-bold">{stock.itemName}</span>;
            }
            if (colIndex === 2) {
              return <span>{stock.categoryName || 'N/A'}</span>;
            }
            if (colIndex === 3) {
              return <span>{stock.unitSymbol ? `${stock.unitName} (${stock.unitSymbol})` : stock.unitName || 'N/A'}</span>;
            }
            if (colIndex === 4) {
              return (
                <span className="font-mono font-semibold">
                  {Number(stock.currentQuantity ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              );
            }
            return '';
          }}
          onFilter={(stock: StockItem, query: string) => {
            const q = query.toLowerCase().trim();
            if (!q) return true;
            return (
              stock.itemName.toLowerCase().includes(q) ||
              stock.itemCode.toLowerCase().includes(q) ||
              (stock.categoryName ? stock.categoryName.toLowerCase().includes(q) : false) ||
              (stock.unitName ? stock.unitName.toLowerCase().includes(q) : false) ||
              (stock.unitSymbol ? stock.unitSymbol.toLowerCase().includes(q) : false)
            );
          }}
        />
      </div>
    </div>
  );
}
