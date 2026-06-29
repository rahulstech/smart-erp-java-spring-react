import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Scaffold from '../../common/components/Scaffold';
import CustomerInput from '../components/CustomerInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useGetCustomerById, useUpdateCustomer } from '../hooks/api.hooks';
import { CustomerFormData } from '../types/customer.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Customer } from '../../common/types/model.types';
import { KeyboardShortcut } from '../../common/types/shortcut.types';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { APP_ROUTES } from '@/common/constants';

interface EditCustomerMainProps {
  customer: Customer;
  onSave: (formData: CustomerFormData) => void;
  serverErrors?: Record<string, string>;
}

function EditCustomerMain({
  customer,
  onSave,
  serverErrors
}: EditCustomerMainProps) {
  const customerFormData = useMemo<CustomerFormData | undefined>(() => {
    if (!customer) return undefined;
    return {
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || 'India',
      pincode: customer.pincode || '',
      openingBalance: customer.openingBalance ?? 0
    };
  }, [customer]);

  return (
    <>
      {customerFormData && (
        <CustomerInput onSave={onSave} initialData={customerFormData} serverErrors={serverErrors} />
      )}
    </>
  );
}

export default function EditCustomerPage() {
  const { company_id, customer_id } = useParams<{ company_id: string; customer_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  const { data: customer, isLoading, isError, refetch } = useGetCustomerById(company_id || '', customer_id || '');
  const updateMutation = useUpdateCustomer(company_id || '');

  const handleSave = useCallback((formData: CustomerFormData) => {
    // Clear previous server errors before sending request
    setServerErrors(undefined);

    updateMutation.mutate(
      { customerId: customer_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Customer "${data.name}" updated successfully!`);
          navigate(-1);
        },
        onError: (error: unknown) => {
          // Parse HTTP 400 field validation errors returned by server
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            const data = error.response.data;
            if (data && typeof data.reasons === 'object' && data.reasons !== null) {
              setServerErrors(data.reasons as Record<string, string>);
              showToast('Validation failed. Please check input fields.');
              return;
            }
          }
          showToast("Could not save the customer due to a saving error.");
        }
      }
    );
  }, [updateMutation, customer_id, navigate, showToast]);

  const pageShortcuts = useMemo<KeyboardShortcut[]>(() => [
    { 
      combination: 'F7', 
      label: 'Dashboard', 
      handler: () => { 
        if (company_id && APP_ROUTES.DASHBOARD.create) {
          navigate(APP_ROUTES.DASHBOARD.create(company_id))  
        }
      } 
    },
    { combination: 'F5', 
      label: 'Reload', 
      handler: () => { refetch(); return true; } 
    },
    {
      combination: 'Esc',
      label: 'Quit',
      handler: () => {
        navigate(-1);
        return true;
      }
    }
  ], [navigate, refetch]);

  useEffect(() => {
    registerShortcuts("EditCustomer", pageShortcuts);
    return () => { unregisterShortcuts("EditCustomer"); };
  }, [registerShortcuts, unregisterShortcuts, pageShortcuts]);

  return (
    <>
      <Scaffold
        title="Edit Customer"
        onRetry={isError ? refetch : undefined}
      >
        <div className="flex w-full h-full overflow-hidden">
          {/* MAIN PANEL */}
          <div className="erp-panel-main flex-1 overflow-y-auto">
            {isError ? (
              <div className="flex w-full h-full justify-center items-center p-6">
                <Card className="max-w-md w-full mx-auto">
                  <p className="text-sm font-semibold text-zinc-800">Could not load customer details due to a loading error.</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    <strong>F5</strong>: Retry
                  </p>
                </Card>
              </div>
            ) : (
              customer && <EditCustomerMain customer={customer} onSave={handleSave} serverErrors={serverErrors} />
            )}
          </div>

          {/* COMMAND PANEL */}
          <aside className="erp-panel-right w-[15%] h-full">
            <div className="erp-shortcut-section">
              <div className="erp-shortcut-list">
                {pageShortcuts.map((shortcut, index) => (
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
      </Scaffold>
      {(isLoading || updateMutation.isPending) && <LoadingPopup message={updateMutation.isPending ? "Updating customer details..." : "Loading customer details..."} />}
    </>
  );
}
