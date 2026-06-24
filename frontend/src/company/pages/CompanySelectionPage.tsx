import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../common/types/model.types';
import Scaffold from '../../common/components/Scaffold';
import { useGetCompanies } from '../hooks/api.hooks';
import ErpTable from '../../common/components/ErpTable';
import CompanyPageLeftPanel from '../components/CompanyPageLeftPanel';
import { useNotification } from '../../common/components/NotificationHost';
import ContextMenu from '../../common/components/ContextMenu';
import CompanyDeleteDialog from '../components/CompanyDeleteDialog';
import LoadingPopup from '../../common/components/LoadingPopup';
import ErrorRetry from '../../common/components/ErrorRetry';

const columns: string[] = ['ID', 'Name', 'Phone', 'Email', 'Address', 'GST Number'];

interface CompanySelectionMainProps {
  companiesList: Company[];
  showToast: (message: string) => void;
}

function CompanySelectionMain({ companiesList, showToast }: CompanySelectionMainProps) {
  const navigate = useNavigate();
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const handleSelectCompany = useCallback((company: Company) => {
    showToast(`Selected Company: ${company.name}`);
  }, [showToast]);

  
  return (
    <>
      <ErpTable
        columns={columns}
        data={companiesList}
        onRowClick={handleSelectCompany}
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
        contextMenu={() => (
          <ContextMenu
            items={[
              { id: 'delete_company', title: 'Delete Company' },
              { id: 'alter_company', title: 'Alter Company' }
            ]}
            onItemClick={() => {}}
            title="Company Actions"
          />
        )}
        onClickContextItem={(itemId, company) => {
          if (itemId === 'delete_company') {
            setCompanyToDelete(company);
          } else if (itemId === 'alter_company') {
            navigate(`/edit-company/${company.id}`);
          }
        }}
      />

      <CompanyDeleteDialog
        company={companyToDelete}
        onClose={() => setCompanyToDelete(null)}
      />
    </>
  );
}

export default function CompanySelectionPage() {
  const { showToast } = useNotification();
  const { data: companiesList = [], isLoading, isError, refetch } = useGetCompanies();

  return (
    <>
      <Scaffold
        title="List of Companies"
        leftPanel={<CompanyPageLeftPanel />}
        onRetry={refetch}
        mainPanel={
          isLoading ? ( 
            <LoadingPopup message="Loading companies" /> 
          )
          : isError ? (
            <ErrorRetry message="Could not load the companies list due to a loading error." />
          ) : (
            <CompanySelectionMain companiesList={companiesList} showToast={showToast} />
          )
        }
      />
    </>
  );
}
