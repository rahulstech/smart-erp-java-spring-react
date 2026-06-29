import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateSupplier } from '../hooks/api.hooks';
import { SupplierFormData } from '../types/supplier.types';
import { useNotification } from '../../common/components/NotificationHost';
import SupplierInput from '../components/SupplierInput';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

export default function CreateSupplierPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateSupplier(company_id || '');
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    setTitle("Create Supplier");
    setOnRetry(undefined);
  }, [setTitle, setOnRetry]);

  const handleSave = useCallback((formData: SupplierFormData) => {
    setServerErrors(undefined);

    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Supplier "${data.name}" created successfully!`);
        navigate(-1);
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data;
          if (data && typeof data.reasons === 'object' && data.reasons !== null) {
            setServerErrors(data.reasons as Record<string, string>);
            showToast('Validation failed. Please check input fields.');
            return;
          } else if (data && typeof data.message === 'string') {
            showToast(data.message);
            return;
          }
        }
        showToast("Could not save the supplier due to a saving error.");
      }
    });
  }, [createMutation, navigate, showToast]);

  return (
    <>
      <div className="erp-panel-main flex-1 overflow-y-auto">
        <SupplierInput onSave={handleSave} serverErrors={serverErrors} isEditing={false} />
      </div>
      {createMutation.isPending && <LoadingPopup message="Creating supplier..." />}
    </>
  );
}
