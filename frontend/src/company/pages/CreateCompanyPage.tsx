import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useCreateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import CompanyInput from '../components/CompanyInput';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCompany();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    setTitle("Create Company");
    setOnRetry(undefined);
  }, [setTitle, setOnRetry]);

  const handleSave = useCallback((formData: CompanyFormData) => {
    setServerErrors(undefined);

    createMutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Company "${data.name}" created successfully!`);
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
        showToast("Could not save the company due to a saving error.");
      }
    });
  }, [createMutation, navigate, showToast]);

  return (
    <>
      <div className="erp-panel-main flex-1 overflow-y-auto">
        <CompanyInput onSave={handleSave} serverErrors={serverErrors} />
      </div>
      {createMutation.isPending && <LoadingPopup message="Creating company..." />}
    </>
  );
}
