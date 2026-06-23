import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import CompanyPageLeftPanel from '../components/CompanyPageLeftPanel';
import { useCreateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import ErpInputField from '../../common/components/ErpInputField';

function CreateCompanyMain() {
  const navigate = useNavigate();
  const mutation = useCreateCompany();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    phone: '',
    email: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});

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

    mutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Company "${data.name}" created successfully!`);
        navigate('/');
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.message || err.message || 'Error occurred';
        showToast(`Failed to create company: ${errorMsg}`);
      }
    });
  }, [formData, mutation, navigate, showToast]);

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Keyboard navigation & shortcuts
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
          <span className="smarterp-title">Create Company</span>
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
            disabled={mutation.isPending}
          >
            Cancel (Esc)
          </button>
          <button
            type="submit"
            className="smarterp-btn-save"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Accept (Ctrl+S)'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateCompanyPage() {
  const navigate = useNavigate();

  const shortcuts = useMemo(() => [
    {
      combination: 'Alt+Shift+O',
      label: 'Select Company',
      handler: () => {
        navigate('/');
      }
    },
    {
      combination: 'Alt+Shift+N',
      label: 'Create Company',
      handler: () => {
        navigate('/create-company');
      }
    }
  ], [navigate]);

  return (
    <Scaffold
      title="Create Company"
      shortcuts={shortcuts}
      leftPanel={<CompanyPageLeftPanel />}
      mainPanel={<CreateCompanyMain />}
    />
  );
}
