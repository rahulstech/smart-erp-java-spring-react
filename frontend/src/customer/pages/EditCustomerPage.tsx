import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerInput from '../components/CustomerInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetCustomerById, useUpdateCustomer } from '../hooks/api.hooks';
import { CustomerFormData } from '../types/customer.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Customer } from '../../common/types/model.types';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

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
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  const { data: customer, isLoading, isError, refetch } = useGetCustomerById(company_id || '', customer_id || '');
  const updateMutation = useUpdateCustomer(company_id || '');

  useEffect(() => {
    setTitle("Edit Customer");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleSave = useCallback((formData: CustomerFormData) => {
    setServerErrors(undefined);

    updateMutation.mutate(
      { customerId: customer_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Customer "${data.name}" updated successfully!`);
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
          showToast("Could not save the customer due to a saving error.");
        }
      }
    );
  }, [updateMutation, customer_id, navigate, showToast]);

  return (
    <>
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
      {(isLoading || updateMutation.isPending) && <LoadingPopup message={updateMutation.isPending ? "Updating customer details..." : "Loading customer details..."} />}
    </>
  );
}
