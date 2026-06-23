import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../common/types/model.types';
import Scaffold from '../../common/components/Scaffold';
import { useGetCompanies } from '../hooks/api.hooks';
import ErpTable from '../../common/components/ErpTable';
import CompanyPageLeftPanel from '../components/CompanyPageLeftPanel';
import { useNotification } from '../../common/components/NotificationHost';

interface CompanySelectionMainProps {
  showToast: (message: string) => void;
}

function CompanySelectionMain({ showToast }: CompanySelectionMainProps) {
  // Fetch companies using the custom hook
  const { data: companiesList = [], isLoading } = useGetCompanies();

  const handleSelectCompany = useCallback((company: Company) => {
    showToast(`Selected Company: ${company.name}`);
  }, [showToast]);

  const columns: string[] = ['ID', 'Name', 'Phone', 'Email', 'Address', 'GST Number'];

  return (
    <ErpTable
      columns={columns}
      data={companiesList}
      onRowClick={handleSelectCompany}
      isLoading={isLoading}
      searchPlaceholder="Search Company (Alt+F)"
      render={(colIndex, company) => {
        if (colIndex === 0) {
          return <span className="font-mono">{company.id.substring(0, 8)}</span>;
        }
        if (colIndex === 1) {
          return <span className="font-bold">{company.name}</span>;
        }
        if (colIndex === 2) {
          return company.phone;
        }
        if (colIndex === 3) {
          return company.email;
        }
        if (colIndex === 4) {
          return <span title={company.address}>{company.address}</span>;
        }
        if (colIndex === 5) {
          return <span className="font-mono">{company.gstNumber || 'N/A'}</span>;
        }
        return '';
      }}
    />
  );
}

export default function CompanySelectionPage() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const shortcuts = useMemo(() => [
    {
      combination: 'Alt+Shift+O',
      label: 'Select Company',
      handler: () => {
        navigate('/companies');
      }
    },
    {
      combination: 'Alt+Shift+N',
      label: 'Create Company',
      handler: () => {
        navigate('/companies/new');
      }
    }
  ], [navigate]);

  return (
    <Scaffold
      title="List of Companies"
      shortcuts={shortcuts}
      leftPanel={<CompanyPageLeftPanel />}
      mainPanel={<CompanySelectionMain showToast={showToast} />}
    />
  );
}
