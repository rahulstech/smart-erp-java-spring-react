import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompanyInput from '../components/CompanyInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetCompanyById, useUpdateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Company } from '../../common/types/model.types';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

interface EditCompanyMainProps {
  company: Company;
  onSave: (formData: CompanyFormData) => void;
  serverErrors?: Record<string, string>;
}

function EditCompanyMain({
  company,
  onSave,
  serverErrors
}: EditCompanyMainProps) {
  const companyFormData = useMemo<CompanyFormData | undefined>(() => {
    if (!company) return undefined;
    return {
      name: company.name || '',
      phone: company.phone || '',
      email: company.email || '',
      gstNumber: company.gstNumber || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || 'India',
      pincode: company.pincode || ''
    };
  }, [company]);

  return (
    <>
      {companyFormData && (
        <CompanyInput onSave={onSave} initialData={companyFormData} serverErrors={serverErrors} />
      )}
    </>
  );
}

export default function EditCompanyPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  const { data: company, isLoading, isError, refetch } = useGetCompanyById(company_id || '');
  const updateMutation = useUpdateCompany();

  useEffect(() => {
    setTitle("Alter Company");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleSave = useCallback((formData: CompanyFormData) => {
    setServerErrors(undefined);

    updateMutation.mutate(
      { id: company_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Company "${data.name}" updated successfully!`);
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
      }
    );
  }, [updateMutation, company_id, navigate, showToast]);

  return (
    <>
      <div className="erp-panel-main flex-1 overflow-y-auto">
        {isError ? (
          <div className="flex w-full h-full justify-center items-center p-6">
            <Card className="max-w-md w-full mx-auto">
              <p className="text-sm font-semibold text-zinc-800">Could not load the company due to a loading error.</p>
              <p className="text-xs text-zinc-500 mt-2">
                <strong>F5</strong>: Retry
              </p>
            </Card>
          </div>
        ) : (
          company && <EditCompanyMain company={company} onSave={handleSave} serverErrors={serverErrors} />
        )}
      </div>
      {(isLoading || updateMutation.isPending) && <LoadingPopup message={updateMutation.isPending ? "Updating company details..." : "Loading company details..."} />}
    </>
  );
}
