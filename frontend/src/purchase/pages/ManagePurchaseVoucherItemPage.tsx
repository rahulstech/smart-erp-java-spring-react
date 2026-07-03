import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ErpChooser from '../../common/components/ErpChooser';
import { useGetPurchaseVoucherById, useUpdatePurchaseVoucherItems } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { KeyboardShortcut } from '../../common/types/component.types';
import { APP_ROUTES } from '../../common/constants';
import { StockItem } from '../../inventory/types/model.types';
import ShortcutRow from '@/common/components/ShortcutRow';
import StockItemChooserPopup from '../../inventory/components/StockItemChooserPopup';

interface ItemRow {
  key: string;
  stockItem: StockItem | null;
  quantity: string;
  unitPrice: string;
}

export default function AddPurchaseItemPage() {
  const { company_id, voucher_id } = useParams<{ company_id: string; voucher_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const { data: voucher, isLoading, isError, refetch } = useGetPurchaseVoucherById(company_id || '', voucher_id || '');
  const updateItemsMutation = useUpdatePurchaseVoucherItems(company_id || '', voucher_id || '');

  const [rows, setRows] = useState<ItemRow[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<string, { stockItem?: string; quantity?: string; unitPrice?: string }>>({});

  // Sync rows from existing voucher items
  useEffect(() => {
    if (voucher) {
      if (voucher.items && voucher.items.length > 0) {
        setRows(
          voucher.items.map(item => ({
            key: item.id || Math.random().toString(),
            stockItem: {
              id: item.stockItemId,
              itemName: item.stockItemName || '',
              companyId: company_id || '',
              itemCode: ''
            } as StockItem,
            quantity: item.quantity.toString(),
            unitPrice: item.unitPrice.toString()
          }))
        );
      } else {
        // Start with one empty row if no items exist
        setRows([{ key: Math.random().toString(), stockItem: null, quantity: '1', unitPrice: '0' }]);
      }
    }
  }, [voucher, company_id]);

  useEffect(() => {
    setTitle(voucher ? `Manage Items for ${voucher.voucherNumber}` : "Manage Voucher Items");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch, voucher]);



  const handleAddRow = () => {
    setRows(prev => [...prev, { key: Math.random().toString(), stockItem: null, quantity: '1', unitPrice: '0' }]);
  };

  const handleRemoveRow = (key: string) => {
    setRows(prev => {
      const filtered = prev.filter(r => r.key !== key);
      if (filtered.length === 0) {
        return [{ key: Math.random().toString(), stockItem: null, quantity: '1', unitPrice: '0' }];
      }
      return filtered;
    });
    setRowErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleRowChange = (key: string, field: keyof ItemRow, value: StockItem | string | null) => {
    setRows(prev =>
      prev.map(row => (row.key === key ? { ...row, [field]: value } : row))
    );
    if (rowErrors[key]) {
      setRowErrors(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [field]: undefined
        }
      }));
    }
  };

  const handleSave = useCallback(() => {
    const newRowErrors: typeof rowErrors = {};
    let hasValidationError = false;

    rows.forEach(row => {
      const errors: { stockItem?: string; quantity?: string; unitPrice?: string } = {};
      if (!row.stockItem) {
        errors.stockItem = "Stock Item is required.";
        hasValidationError = true;
      }
      const qtyNum = Number(row.quantity);
      if (!row.quantity.trim() || isNaN(qtyNum) || qtyNum <= 0) {
        errors.quantity = "Must be > 0.";
        hasValidationError = true;
      }
      const priceNum = Number(row.unitPrice);
      if (!row.unitPrice.trim() || isNaN(priceNum) || priceNum <= 0) {
        errors.unitPrice = "Must be > 0.";
        hasValidationError = true;
      }

      if (Object.keys(errors).length > 0) {
        newRowErrors[row.key] = errors;
      }
    });

    if (hasValidationError) {
      setRowErrors(newRowErrors);
      showToast("Please fix validation errors in the items table.");
      return;
    }

    const payload = {
      items: rows.map(row => ({
        stockItemId: row.stockItem!.id,
        quantity: Number(row.quantity),
        unitPrice: Number(row.unitPrice)
      }))
    };

    updateItemsMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Voucher items updated successfully!");
        if (company_id && voucher_id && APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create) {
          navigate(APP_ROUTES.PURCHASE_VOUCHER_ITEMS_LIST.create(company_id, voucher_id));
        } else {
          navigate(-1);
        }
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data;
          if (data && typeof data.reasons === 'object' && data.reasons !== null) {
            showToast("Server validation failed. Check your items.");
            return;
          }
        }
        showToast("Could not update voucher items due to an error.");
      }
    });
  }, [rows, updateItemsMutation, company_id, voucher_id, navigate, showToast]);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+L',
      label: 'Purchases',
      handler: () => {
        if (company_id && APP_ROUTES.PURCHASE_VOUCHER_LIST.create) {
          navigate(APP_ROUTES.PURCHASE_VOUCHER_LIST.create(company_id));
        }
      }
    }
  ], [company_id, navigate]);

  useEffect(() => {
    registerShortcuts("AddPurchaseItemLeft", leftShortcuts);
    return () => { unregisterShortcuts("AddPurchaseItemLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  useEffect(() => {
    const actionShortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      },
      {
        combination: 'Alt+N',
        label: 'New Row',
        handler: handleAddRow
      }
    ];
    registerShortcuts("AddPurchaseItemActions", actionShortcuts);
    return () => { unregisterShortcuts("AddPurchaseItemActions"); };
  }, [registerShortcuts, unregisterShortcuts, handleSave]);

  const grandTotal = useMemo(() => {
    return rows.reduce((sum, row) => {
      const q = Number(row.quantity) || 0;
      const p = Number(row.unitPrice) || 0;
      return sum + q * p;
    }, 0);
  }, [rows]);


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

      {
        isLoading
        ? <LoadingPopup message="Loading voucher data..." />

        : (isError || !voucher)
        ? (
            <div className="flex w-full h-full justify-center items-center p-6">
              <Card className="max-w-md w-full mx-auto">
                <p className="text-sm font-semibold text-zinc-800">Could not load the voucher for adding items.</p>
                <p className="text-xs text-zinc-500 mt-2">
                  <strong>F5</strong>: Retry
                </p>
              </Card>
            </div>
        )
        :
        <div className="erp-panel-main flex-1 overflow-y-auto flex flex-col">
          {/* Header Summary */}
          <div className="p-4 bg-zinc-50 border-b border-zinc-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-md font-bold text-zinc-800">Manage Items for Voucher</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Voucher: <strong className="font-mono text-zinc-700">{voucher.voucherNumber}</strong> | Supplier: <strong>{voucher.supplierName}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase text-zinc-500 font-semibold">Running Grand Total</span>
                <span className="font-mono text-lg font-bold text-emerald-600">
                  ₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Rows form */}
          <div className="p-4 flex-1">
            <div className="smarterp-box max-w-full! p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-2 w-1/2">Stock Item</th>
                    <th className="pb-2 px-2 w-1/6">Quantity</th>
                    <th className="pb-2 px-2 w-1/6">Unit Price</th>
                    <th className="pb-2 px-2 w-1/6">Amount (₹)</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const qty = Number(row.quantity) || 0;
                    const price = Number(row.unitPrice) || 0;
                    const amount = qty * price;

                    return (
                      <tr key={row.key} className="border-b border-zinc-100 last:border-0 align-top">
                        <td className="py-3 pr-2">
                          <ErpChooser<StockItem>
                            label=""
                            value={row.stockItem ? (row.stockItem.itemCode ? `${row.stockItem.itemName} (${row.stockItem.itemCode})` : row.stockItem.itemName) : ''}
                            required
                            onSelect={(item) => handleRowChange(row.key, 'stockItem', item)}
                            error={rowErrors[row.key]?.stockItem}
                            vertical={true}
                            hint="Choose stock item"
                            popup={(onSelect, onClose) => (
                              <StockItemChooserPopup
                                companyId={company_id || ''}
                                onSelect={onSelect}
                                onClose={onClose}
                              />
                            )}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            className={`smarterp-input ${rowErrors[row.key]?.quantity ? 'has-error' : ''}`}
                            value={row.quantity}
                            onChange={(e) => handleRowChange(row.key, 'quantity', e.target.value)}
                            placeholder="Qty"
                            min="1"
                          />
                          {rowErrors[row.key]?.quantity && (
                            <span className="smarterp-field-error block mt-1">{rowErrors[row.key].quantity}</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            className={`smarterp-input ${rowErrors[row.key]?.unitPrice ? 'has-error' : ''}`}
                            value={row.unitPrice}
                            onChange={(e) => handleRowChange(row.key, 'unitPrice', e.target.value)}
                            placeholder="Rate"
                            min="0"
                            step="0.01"
                          />
                          {rowErrors[row.key]?.unitPrice && (
                            <span className="smarterp-field-error block mt-1">{rowErrors[row.key].unitPrice}</span>
                          )}
                        </td>
                        <td className="py-4 px-2 font-mono text-sm font-semibold text-zinc-700">
                          {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                            onClick={() => handleRemoveRow(row.key)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded transition-colors"
                    onClick={handleAddRow}
                  >
                    + Add Row (Alt+N)
                  </button>
                </div>
                <button
                  type="button"
                  className="smarterp-btn-save"
                  onClick={handleSave}
                >
                  Save (Ctrl+S)
                </button>
              </div>
            </div>
          </div>
        </div>
      } 

      {updateItemsMutation.isPending && <LoadingPopup message="Saving items..." />}
      
    </div>
  );
}
