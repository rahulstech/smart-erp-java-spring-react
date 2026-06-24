import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyFormData, CompanyInputProps } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import ErpInputField from '../../common/components/ErpInputField';

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

export default function CompanyInput({ onSave, initialData }: CompanyInputProps) {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState<CompanyFormData>(initialData || DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});

  // Sync initialData when it changes (e.g. when loaded asynchronously)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Install keyboard shortcuts directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCancel, handleSave]);

  return (
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
            type="button"
            onClick={handleCancel}
            className="smarterp-btn-cancel"
          >
            Cancel (Esc)
          </button>
          <button
            type="submit"
            className="smarterp-btn-save"
          >
            Accept (Ctrl+S)
          </button>
        </div>
      </form>
    </div>
  );
}
