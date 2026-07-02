import React, { useState, useEffect, useCallback } from 'react';
import { CompanyFormData, CompanyInputProps } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import ErpInputField from '../../common/components/ErpInputField';
import { useShortcuts } from '@/common/hooks/useShortcuts';
import { KeyboardShortcut } from '@/common/types/component.types';
import { useFormNavigation } from '@/common/hooks/useFormNavigation';

const DEFAULT_FORM_DATA: CompanyFormData = {
  name: '',
  phone: '',
  email: '',
  gstNumber: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: ''
};

/**
 * Renders the form interface to create or edit a Company's details.
 * Contains client-side field validation and binds component-level Esc and Ctrl+S shortcuts.
 */
export default function CompanyInput({ onSave, initialData, serverErrors }: CompanyInputProps) {
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();
  useFormNavigation();

  const [formData, setFormData] = useState<CompanyFormData>(initialData || DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});

  // Syncs server-side field validation errors into form error state.
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...serverErrors
      }));
    }
  }, [serverErrors]);

  // Keeps local form state in sync when initial data loads asynchronously
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  /**
   * Updates state on text input and clears the active validation error for that field.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  /**
   * Validates input fields and triggers the save callback if no issues are found.
   */
  const handleSave = useCallback(() => {
    const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Company Name is required.';
    }
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors before saving.');
      return;
    }

    onSave(formData);
  }, [formData, onSave, showToast]);


  useEffect(()=> {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];

    registerShortcuts('CompanyInput', shortcuts);

    return ()=> { unregisterShortcuts('CompanyInput'); };
  }, [registerShortcuts, unregisterShortcuts, handleSave]);


  return (
    <div className="flex flex-col w-full">
      <div className="smarterp-container">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="smarterp-box">
        <div className="smarterp-header">
          <span className="smarterp-title">
            {initialData ? 'Edit Company' : 'Create Company'}
          </span>
        </div>

        <div className="smarterp-form-grid">
          {/* Left Column: General Info */}
          <div>
            <div className="smarterp-form-section-title">General Information</div>
            
            <ErpInputField
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name..."
              required
              autoFocus
              error={errors.name}
            />

            <ErpInputField
              label="Phone No."
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number..."
              error={errors.phone}
            />

            <ErpInputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address..."
              error={errors.email}
            />

            <ErpInputField
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST number..."
              required
              error={errors.gstNumber}
            />
          </div>

          {/* Right Column: Contact Details */}
          <div>
            <div className="smarterp-form-section-title">Contact Details</div>

            <ErpInputField
              label="Address"
              name="address"
              isTextArea
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address..."
              error={errors.address}
            />

            <ErpInputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city..."
              error={errors.city}
            />

            <ErpInputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state..."
              error={errors.state}
            />

            <ErpInputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country..."
              error={errors.country}
            />

            <ErpInputField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode..."
              error={errors.pincode}
            />
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
