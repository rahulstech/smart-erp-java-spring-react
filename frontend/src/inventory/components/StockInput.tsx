import React, { useState, useEffect, useCallback } from 'react';
import { StockInputProps } from '../types/inventory.types';
import { useNotification } from '../../common/components/NotificationHost';
import ErpInputField from '../../common/components/ErpInputField';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { KeyboardShortcut } from '../../common/types/component.types';
import { useFormNavigation } from '../../common/hooks/useFormNavigation';

interface FormState {
  itemName: string;
  itemCode: string;
  categoryId: string;
  unitId: string;
}

const DEFAULT_FORM_DATA: FormState = {
  itemName: '',
  itemCode: '',
  categoryId: '',
  unitId: ''
};

export default function StockInput({
  onSave,
  initialData,
  serverErrors,
  categories,
  units,
  isEdit = false
}: StockInputProps) {
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();
  useFormNavigation();

  const [formData, setFormData] = useState<FormState>(() => {
    if (initialData) {
      return {
        itemName: initialData.itemName || '',
        itemCode: initialData.itemCode || '',
        categoryId: initialData.categoryId || '',
        unitId: initialData.unitId || ''
      };
    }
    return {
      ...DEFAULT_FORM_DATA,
      categoryId: '',
      unitId: ''
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Sync server errors
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...serverErrors
      }));
    }
  }, [serverErrors]);

  // Sync initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        itemName: initialData.itemName || '',
        itemCode: initialData.itemCode || '',
        categoryId: initialData.categoryId || '',
        unitId: initialData.unitId || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    }

    if (!isEdit && !formData.itemCode.trim()) {
      newErrors.itemCode = 'Item code is required.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    if (!formData.unitId) {
      newErrors.unitId = 'Unit is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors before saving.');
      return;
    }

    onSave({
      itemName: formData.itemName.trim(),
      itemCode: isEdit ? '' : formData.itemCode.trim(),
      categoryId: formData.categoryId,
      unitId: formData.unitId
    });
  }, [formData, onSave, showToast, isEdit]);

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];

    registerShortcuts('StockInput', shortcuts);
    return () => { unregisterShortcuts('StockInput'); };
  }, [registerShortcuts, unregisterShortcuts, handleSave]);

  return (
    <div className="flex flex-col w-full">
      <div className="smarterp-container">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="smarterp-box">
        <div className="smarterp-header">
          <span className="smarterp-title">
            {isEdit ? 'Edit Stock Item' : 'Create Stock Item'}
          </span>
        </div>

        <div className="smarterp-form-grid">
          {/* General Stock Info */}
          <div>
            <div className="smarterp-form-section-title">Stock Details</div>

            <ErpInputField
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter item name..."
              required
              autoFocus
              error={errors.itemName}
            />

            {!isEdit ? (
              <ErpInputField
                label="Item Code"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                placeholder="Enter item code..."
                required
                error={errors.itemCode}
              />
            ) : (
              <div className="smarterp-form-row">
                <label className="smarterp-label">Item Code</label>
                <div className="smarterp-input-wrapper">
                  <input
                    className="smarterp-input bg-zinc-100 text-zinc-500 cursor-not-allowed"
                    value={formData.itemCode}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>

          {/* Classification details */}
          <div>
            <div className="smarterp-form-section-title">Classification</div>

            <div className="smarterp-form-row">
              <label className="smarterp-label">Category</label>
              <div className="smarterp-input-wrapper">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`smarterp-input h-[34px] ${errors.categoryId ? 'has-error' : ''}`}
                  required
                >
                  <option value="" disabled>-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="smarterp-field-error">{errors.categoryId}</span>}
              </div>
            </div>

            <div className="smarterp-form-row">
              <label className="smarterp-label">Unit</label>
              <div className="smarterp-input-wrapper">
                <select
                  name="unitId"
                  value={formData.unitId}
                  onChange={handleChange}
                  className={`smarterp-input h-[34px] ${errors.unitId ? 'has-error' : ''}`}
                  required
                >
                  <option value="" disabled>-- Select Unit --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
                {errors.unitId && <span className="smarterp-field-error">{errors.unitId}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="smarterp-footer">
          <button
            type="submit"
            className="smarterp-btn-save"
          >
            Save (Ctrl+S)
          </button>
        </div>
      </form>
    </div>
    <div className="erp-table-legend mt-4 px-4 pb-2">
      <span className="erp-table-legend-item">Shift + ↑ ↓ ← → Focus Fields</span>
    </div>
  </div>
);
}
