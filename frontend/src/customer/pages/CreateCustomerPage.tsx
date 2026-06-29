import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateCustomer } from '../hooks/api.hooks';
import { CustomerFormData } from '../types/customer.types';
import { useNotification } from '../../common/components/NotificationHost';
import CustomerInput from '../components/CustomerInput';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

export default function CreateCustomerPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateCustomer(company_id || '');
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    setTitle("Create Customer");
    setOnRetry(undefined);
  }, [setTitle, setOnRetry]);

  const handleSave = useCallback((formData: CustomerFormData) => {
    setServerErrors(undefined);

    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Customer "${data.name}" created successfully!`);
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
        showToast("Could not save the customer due to a saving error.");
      }
    });
  }, [createMutation, navigate, showToast]);

  return (
    <>
      <div className="erp-panel-main flex-1 overflow-y-auto">
        <CustomerInput onSave={handleSave} serverErrors={serverErrors} />
      </div>
      {createMutation.isPending && <LoadingPopup message="Creating customer..." />}
    </>
  );
}
