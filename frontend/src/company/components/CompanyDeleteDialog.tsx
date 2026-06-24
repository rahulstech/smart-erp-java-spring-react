import Dialog from '../../common/components/Dialog';
import { Company } from '../../common/types/model.types';
import { useDeleteCompany } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';

interface CompanyDeleteDialogProps {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyDeleteDialog({ company, onClose }: CompanyDeleteDialogProps) {
  const { mutate: deleteCompany } = useDeleteCompany();
  const { showToast } = useNotification();

  const handleButtonClick = (buttonId: string) => {
    if (buttonId === 'delete' && company) {
      deleteCompany(company.id, {
        onSuccess: () => {
          showToast(`Company "${company.name}" deleted successfully.`);
        },
        onError: () => {
          showToast(`Failed to delete company "${company.name}".`);
        }
      });
    }
  };

  return (
    <Dialog
      isOpen={!!company}
      onClose={onClose}
      title="Delete Company"
      content={
        company && (
          <div>
            <p style={{ margin: '0 0 1rem 0' }}>
              The following company will be deleted permanently. What do you want to do?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="font-bold">{company.name}</span>
              <span>{company.address}</span>
              <span>{company.gstNumber || 'N/A'}</span>
            </div>
          </div>
        )
      }
      buttons={[
        { id: 'cancel', label: 'Cancel', combination: 'Esc' },
        { id: 'delete', label: 'Delete', combination: 'Enter', isPrimary: true }
      ]}
      onClickButton={handleButtonClick}
    />
  );
}
