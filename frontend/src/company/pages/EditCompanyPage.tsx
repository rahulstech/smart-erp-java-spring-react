import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import CompanyPageLeftPanel from '../components/CompanyPageLeftPanel';
import CompanyInput from '../components/CompanyInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import ErrorRetry from '../../common/components/ErrorRetry';
import { useGetCompanyById, useUpdateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Company } from '../../common/types/model.types';


interface EditCompanyMainProps {
  company: Company;
  onSave: (formData: CompanyFormData)=> void;
}

function EditCompanyMain({
  company,
  onSave
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
        <CompanyInput onSave={onSave} initialData={companyFormData} />
      )}
    </>
  );
}

export default function EditCompanyPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const { data: company, isLoading, isError, refetch } = useGetCompanyById(company_id || '');
  const updateMutation = useUpdateCompany();

  const handleSave = (formData: CompanyFormData) => {
    updateMutation.mutate(
      { id: company_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Company "${data.name}" updated successfully!`);
          navigate('/');
        },
        onError: () => {
          showToast("Could not save the company due to a saving error.");
        }
      }
    );
  };

  return (
    <>
      <Scaffold
        title="Alter Company"
        leftPanel={<CompanyPageLeftPanel />}
        onRetry={isError ? refetch : undefined}
        mainPanel={
          isError ? (
            <ErrorRetry message="Could not load the company due to a loading error." />
          ) : (
            company && <EditCompanyMain company={company} onSave={handleSave} />
          )
        }
      />
      {isLoading && <LoadingPopup message="Loading company details..." />}
    </>
  );
}
