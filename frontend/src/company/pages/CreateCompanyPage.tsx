import { useNavigate } from 'react-router-dom';
import Scaffold from '../../common/components/Scaffold';
import CompanyPageLeftPanel from '../components/CompanyPageLeftPanel';
import { useCreateCompany } from '../hooks/api.hooks';
import { CompanyFormData } from '../types/company.types';
import { useNotification } from '../../common/components/NotificationHost';
import CompanyInput from '../components/CompanyInput';

function CreateCompanyMain() {
  const navigate = useNavigate();
  const mutation = useCreateCompany();
  const { showToast } = useNotification();

  const handleSave = (formData: CompanyFormData) => {
    mutation.mutate(formData, {
      onSuccess: (data) => {
        showToast(`Company "${data.name}" created successfully!`);
        navigate('/');
      },
      onError: () => {
        showToast("Could not save the company due to a saving error.");
      }
    });
  };

  return <CompanyInput onSave={handleSave} />;
}

export default function CreateCompanyPage() {
  return (
    <Scaffold
      title="Create Company"
      leftPanel={<CompanyPageLeftPanel />}
      mainPanel={<CreateCompanyMain />}
    />
  );
}
