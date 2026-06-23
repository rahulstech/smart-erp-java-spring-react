import { useNavigate, useLocation } from 'react-router-dom';
import ShortcutRow from '../../common/components/ShortcutRow';

export default function CompanyPageLeftPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check which path is currently active
  const isSelectActive = location.pathname === '/' || location.pathname === '/';
  const isCreateActive = location.pathname === '/create-company';

  return (
    <div className="flex flex-col gap-2">
      <div className="gateway-title">Company Menu</div>
      <div className="gateway-subtitle">Manage Companies</div>
      <div className="flex flex-col gap-2">
        <ShortcutRow
          combination="Alt+Shift+O"
          label="Select Company"
          onClick={() => navigate('/')}
          selectable={true}
          selected={isSelectActive}
          variant="light"
        />
        <ShortcutRow
          combination="Alt+Shift+N"
          label="Create Company"
          onClick={() => navigate('/create-company')}
          selectable={true}
          selected={isCreateActive}
          variant="light"
        />
      </div>
    </div>
  );
}
