import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import {
  useCreateStockItem,
  useUpdateStockItem,
  useGetStockItemById,
  useGetCategories,
  useGetUnits
} from '../hooks/api.hooks';
import { StockItemFormData } from '../types/inventory.types';
import { useNotification } from '../../common/components/NotificationHost';
import StockInput from '../components/StockInput';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { KeyboardShortcut } from '../../common/types/component.types';
import { APP_ROUTES } from '../../common/constants';

export default function CreateStockPage() {
  const { company_id, stock_id } = useParams<{ company_id: string; stock_id?: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const isEdit = !!stock_id;

  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useGetCategories(company_id || '');
  const { data: units = [], isLoading: isUnitsLoading, isError: isUnitsError } = useGetUnits(company_id || '');

  const {
    data: stockItem,
    isLoading: isStockLoading,
    isError: isStockError,
    refetch: refetchStockItem
  } = useGetStockItemById(company_id || '', stock_id || '');

  const createMutation = useCreateStockItem(company_id || '');
  const updateMutation = useUpdateStockItem(company_id || '');

  useEffect(() => {
    setTitle(isEdit ? "Edit Stock Item" : "Create Stock Item");
    setOnRetry(isEdit && isStockError ? refetchStockItem : undefined);
  }, [setTitle, setOnRetry, isEdit, isStockError, refetchStockItem]);

  const handleSave = useCallback((formData: StockItemFormData) => {
    setServerErrors(undefined);

    if (isEdit) {
      updateMutation.mutate(
        {
          itemId: stock_id || '',
          payload: {
            itemName: formData.itemName,
            categoryId: formData.categoryId,
            unitId: formData.unitId
          }
        },
        {
          onSuccess: (data) => {
            showToast(`Stock item "${data.itemName}" updated successfully!`);
            navigate(-1);
          },
          onError: (error: unknown) => {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
              const data = error.response.data;
              if (data && typeof data.reasons === 'object' && data.reasons !== null) {
                setServerErrors(data.reasons as Record<string, string>);
                showToast('Validation failed. Please check input fields.');
                return;
              }
            }
            showToast("Could not save the stock item due to an error.");
          }
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          showToast(`Stock item "${data.itemName}" created successfully!`);
          navigate(-1);
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            const data = error.response.data;
            if (data && typeof data.reasons === 'object' && data.reasons !== null) {
              setServerErrors(data.reasons as Record<string, string>);
              showToast('Validation failed. Please check input fields.');
              return;
            }
          }
          showToast("Could not save the stock item due to an error.");
        }
      });
    }
  }, [isEdit, stock_id, createMutation, updateMutation, navigate, showToast]);

  const initialData = useMemo<StockItemFormData | undefined>(() => {
    if (!isEdit || !stockItem) return undefined;
    return {
      itemName: stockItem.itemName || '',
      itemCode: stockItem.itemCode || '',
      categoryId: stockItem.categoryId || '',
      unitId: stockItem.unitId || ''
    };
  }, [isEdit, stockItem]);

  const isLoading = isCategoriesLoading || isUnitsLoading || (isEdit && isStockLoading);
  const isError = isCategoriesError || isUnitsError || (isEdit && isStockError);

  if (isError) {
    return (
      <div className="flex w-full h-full justify-center items-center p-6">
        <Card className="max-w-md w-full mx-auto">
          <p className="text-sm font-semibold text-zinc-800">
            Could not load the required details for the stock form.
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            <strong>F5</strong>: Retry
          </p>
        </Card>
      </div>
    );
  }

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
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
  ], [company_id, navigate]);

  useEffect(() => {
    registerShortcuts("CreateStockLeft", leftShortcuts);
    return () => { unregisterShortcuts("CreateStockLeft"); };
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
        {!isLoading && (
          <StockInput
            onSave={handleSave}
            initialData={initialData}
            serverErrors={serverErrors}
            categories={categories}
            units={units}
            isEdit={isEdit}
          />
        )}
      </div>
      {(isLoading || createMutation.isPending || updateMutation.isPending) && (
        <LoadingPopup
          message={
            createMutation.isPending
              ? "Creating stock item..."
              : updateMutation.isPending
              ? "Updating stock item..."
              : "Loading data..."
          }
        />
      )}
    </div>
  );
}
