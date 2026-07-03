import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import ErpInputField from '../../common/components/ErpInputField';
import { useCreateUnit } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { KeyboardShortcut } from '../../common/types/component.types';
import ShortcutRow from '../../common/components/ShortcutRow';
import { APP_ROUTES } from '../../common/constants';

interface FormState {
  name: string;
  symbol: string;
}

export default function AddUnitPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const [formData, setFormData] = useState<FormState>({ name: '', symbol: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const createMutation = useCreateUnit(company_id || '');

  useEffect(() => {
    setTitle("Add Stock Unit");
    setOnRetry(undefined);
  }, [setTitle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormState]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSave = useCallback(() => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Unit Name is required.';
    }
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Unit Symbol is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors before saving.');
      return;
    }

    createMutation.mutate(
      {
        name: formData.name.trim(),
        symbol: formData.symbol.trim()
      },
      {
        onSuccess: (data) => {
          showToast(`Unit "${data.name}" added successfully!`);
          setFormData({ name: '', symbol: '' });
        },
        onError: (err: unknown) => {
          if (axios.isAxiosError(err) && err.response?.status === 400) {
            const data = err.response.data;
            if (data && typeof data.reasons === 'object' && data.reasons !== null) {
              setErrors(data.reasons as Record<string, string>);
              showToast('Validation failed. Please check input fields.');
              return;
            }
          }
          showToast("Could not save the unit due to a saving error.");
        }
      }
    );
  }, [formData, createMutation, showToast]);

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
        showToast('Already on Add Unit page');
      }
    }
  ], [company_id, navigate, showToast]);

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];

    registerShortcuts('AddUnit', shortcuts);
    registerShortcuts('AddUnitLeft', leftShortcuts);
    return () => {
      unregisterShortcuts('AddUnit');
      unregisterShortcuts('AddUnitLeft');
    };
  }, [registerShortcuts, unregisterShortcuts, handleSave, leftShortcuts]);

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
        <div className="smarterp-container">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="smarterp-box flex-1 max-w-[600px] m-0"
          >
            <div className="smarterp-header">
              <span className="smarterp-title">Add New Unit</span>
            </div>

            <div className="flex flex-col gap-3">
              <ErpInputField
                label="Unit Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kilogram, Pieces..."
                required
                autoFocus
                error={errors.name}
              />

              <ErpInputField
                label="Unit Symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g. kg, pcs..."
                required
                error={errors.symbol}
              />
            </div>

            <div className="smarterp-footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="submit"
                className="smarterp-btn-save"
              >
                Save (Ctrl+S)
              </button>
            </div>
          </form>
        </div>
      </div>
      {createMutation.isPending && <LoadingPopup message="Adding unit..." />}
    </div>
  );
}
