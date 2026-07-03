import { useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useShortcuts } from '../hooks/useShortcuts';
import { APP_ROUTES } from '../constants';
import { useScaffoldContext } from '../context/ScaffoldContext';
import ShortcutRow from './ShortcutRow';
import { useNotification } from './NotificationHost';
import { KeyboardShortcut } from '../types/component.types';

export default function Scaffold() {
  const navigate = useNavigate();
  const { company_id } = useParams<{ company_id?: string }>();
  const { title, onRetry } = useScaffoldContext();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  // Standard right command panel shortcuts embedded directly in Scaffold
  const rightShortcuts = useMemo<KeyboardShortcut[]>(() => {
    const shortcuts: KeyboardShortcut[] = [];

    if (company_id) {
      shortcuts.push(
        {
          combination: 'Alt+C',
          label: 'Create Customer',
          handler: () => navigate(APP_ROUTES.CREATE_CUSTOMER.create!(company_id))
        },
        {
          combination: 'Alt+S',
          label: 'Create Supplier',
          handler: () => navigate(APP_ROUTES.CREATE_SUPPLIER.create!(company_id))
        },
        {
          combination: 'Alt+I',
          label: 'Add Stock',
          handler: () => navigate(APP_ROUTES.CREATE_STOCK.create!(company_id))
        },
        {
          combination: 'Alt+P',
          label: 'Add Purchase Voucher',
          handler: () => navigate(APP_ROUTES.CREATE_PURCHASE_VOUCHER.create!(company_id))
        },
        {
          combination: 'Alt+V',
          label: 'Add Sell Voucher',
          handler: () => navigate(APP_ROUTES.CREATE_SALE_VOUCHER.create!(company_id))
        }
      );
    }

    return shortcuts;
  }, [company_id, navigate, showToast]);


  const footerShortcuts = useMemo(()=>{ 
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: "Esc",
        label: "Quit",
        handler: () => {
          navigate(-1);
        }
      },
      {
        combination: "F5",
        label: "Reload",
        handler: () => {
          if (onRetry) {
            onRetry();
          } else {
            window.location.reload();
          }
        }
      },
      {
        combination: "F6",
        label: "Companies",
        handler: () => {
          navigate(APP_ROUTES.COMPANY_LIST.path);
        }
      },
      
    ];


    if (company_id) {
      shortcuts.push(
        {
          combination: "F7",
          label: "Dashboard",
          handler: () => navigate(APP_ROUTES.DASHBOARD.create!(company_id))
        },

        {
          combination: 'F8',
          label: 'Stocks',
          handler: () => navigate(APP_ROUTES.STOCK_LIST.create!(company_id))
        },

        {
          combination: 'F9',
          label: 'Suppliers',
          handler: ()=> navigate(APP_ROUTES.SUPPLIER_LIST.create!(company_id))
        },

        {
          combination: 'F10',
          label: 'Customers',
          handler: ()=> navigate(APP_ROUTES.CUSTOMER_LIST.create!(company_id))
        }
      )
    }

    return shortcuts;
  },[company_id,navigate,showToast]);



  // Register global scaffold footer shortcuts & right command panel shortcuts
  useEffect(() => {
    
    registerShortcuts('scaffold-footer', footerShortcuts);
    registerShortcuts('scaffold-right', rightShortcuts);

    return () => {
      unregisterShortcuts('scaffold-footer');
      unregisterShortcuts('scaffold-right');
    };
  }, [registerShortcuts, unregisterShortcuts, onRetry, navigate, company_id, showToast, rightShortcuts]);

  return (
    <div className="erp-layout">
      {/* Header Bar */}
      <header className="erp-top-bar">
        <div className="flex items-center gap-3">
          <span className="text-md font-bold tracking-wide text-white">SmartERP v1.0.0</span>
          <span className="text-zinc-400 font-light">|</span>
          <span className="text-sm text-zinc-200">{title}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-300">
          <button className="flex items-center gap-2 hover:text-white transition cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="text-zinc-400" />
            <span className="font-semibold text-xs tracking-wider uppercase">ADMIN</span>
          </button>
          <button className="hover:text-white text-zinc-400 transition cursor-pointer">
            <FontAwesomeIcon icon={faCog} className="text-sm" />
          </button>
        </div>
      </header>

      {/* Scaffold Body */}
      <div className="erp-body flex w-full h-full overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-row">
          <Outlet />
        </div>
        <aside className="erp-panel-right">
          <div className="erp-shortcut-section">
            <div className="erp-shortcut-list">
              {rightShortcuts.map((shortcut, index) => (
                <ShortcutRow
                  key={`command-${shortcut.combination}-${index}`}
                  combination={shortcut.combination}
                  label={shortcut.label}
                  onClick={shortcut.handler}
                  variant="dark"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="erp-bottom-bar">
        {footerShortcuts.map((shortcut) => (
          <div key={shortcut.combination} className="flex items-center gap-1 text-xs">
            <span className="font-bold text-white">{shortcut.combination}</span>
            <span className="text-zinc-400">: {shortcut.label}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
