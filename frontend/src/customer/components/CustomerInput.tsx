import React, { useState, useEffect, useCallback } from 'react';
import { CustomerInputProps } from '../types/customer.types';
import { useNotification } from '../../common/components/NotificationHost';
import ErpInputField from '../../common/components/ErpInputField';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { KeyboardShortcut } from '../../common/types/component.types';

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  openingBalance: string;
}

const DEFAULT_FORM_DATA: FormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  openingBalance: '0'
};

/**
 * Renders the form interface to create or edit a Customer's details.
 * Contains client-side field validation and binds component-level Ctrl+S shortcut.
 */
export default function CustomerInput({ onSave, initialData, serverErrors }: CustomerInputProps) {
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const [formData, setFormData] = useState<FormState>(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        pincode: initialData.pincode || '',
        openingBalance: initialData.openingBalance.toString()
      };
    }
    return DEFAULT_FORM_DATA;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Syncs server-side field validation errors into form error state.
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...serverErrors
      }));
    }
  }, [serverErrors]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        pincode: initialData.pincode || '',
        openingBalance: initialData.openingBalance.toString()
      });
    }
  }, [initialData]);

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
      newErrors.name = 'Customer Name is required.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format.';
    }
    if (!formData.openingBalance.trim() || isNaN(Number(formData.openingBalance))) {
      newErrors.openingBalance = 'Valid opening balance is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors before saving.');
      return;
    }

    onSave({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      country: formData.country.trim() || undefined,
      pincode: formData.pincode.trim() || undefined,
      openingBalance: Number(formData.openingBalance)
    });
  }, [formData, onSave, showToast]);

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];

    registerShortcuts('CustomerInput', shortcuts);
    return () => { unregisterShortcuts('CustomerInput'); };
  }, [registerShortcuts, unregisterShortcuts, handleSave]);

  return (
    <div className="smarterp-container">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="smarterp-box">
        <div className="smarterp-header">
          <span className="smarterp-title">
            {initialData ? 'Edit Customer' : 'Create Customer'}
          </span>
        </div>

        <div className="smarterp-form-grid">
          {/* Left Column: General Info */}
          <div>
            <div className="smarterp-form-section-title">General Information</div>

            <ErpInputField
              label="Customer Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name..."
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
              required
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
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter opening balance..."
              required
              error={errors.openingBalance}
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
  );
}
