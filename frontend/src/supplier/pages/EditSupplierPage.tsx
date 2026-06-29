import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SupplierInput from '../components/SupplierInput';
import LoadingPopup from '../../common/components/LoadingPopup';
import Card from '../../common/components/Card';
import { useGetSupplierById, useUpdateSupplier } from '../hooks/api.hooks';
import { SupplierFormData } from '../types/supplier.types';
import { useNotification } from '../../common/components/NotificationHost';
import { Supplier } from '../../common/types/model.types';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';

interface EditSupplierMainProps {
  supplier: Supplier;
  onSave: (formData: SupplierFormData) => void;
  serverErrors?: Record<string, string>;
}

function EditSupplierMain({
  supplier,
  onSave,
  serverErrors
}: EditSupplierMainProps) {
  const supplierFormData = useMemo<SupplierFormData | undefined>(() => {
    if (!supplier) return undefined;
    return {
      code: supplier.code || '',
      name: supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      gstNumber: supplier.gstNumber || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
      country: supplier.country || 'India',
      pincode: supplier.pincode || '',
      openingBalance: supplier.openingBalance ?? 0
    };
  }, [supplier]);

  return (
    <>
      {supplierFormData && (
        <SupplierInput onSave={onSave} initialData={supplierFormData} serverErrors={serverErrors} isEditing={true} />
      )}
    </>
  );
}

export default function EditSupplierPage() {
  const { company_id, supplier_id } = useParams<{ company_id: string; supplier_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const [serverErrors, setServerErrors] = useState<Record<string, string> | undefined>(undefined);

  const { data: supplier, isLoading, isError, refetch } = useGetSupplierById(company_id || '', supplier_id || '');
  const updateMutation = useUpdateSupplier(company_id || '');

  useEffect(() => {
    setTitle("Edit Supplier");
    setOnRetry(isError ? refetch : undefined);
  }, [setTitle, setOnRetry, isError, refetch]);

  const handleSave = useCallback((formData: SupplierFormData) => {
    setServerErrors(undefined);

    updateMutation.mutate(
      { supplierId: supplier_id || '', payload: formData },
      {
        onSuccess: (data) => {
          showToast(`Supplier "${data.name}" updated successfully!`);
          navigate(-1);
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            const data = error.response.data;
            if (data && typeof data.reasons === 'object' && data.reasons !== null) {
              setServerErrors(data.reasons as Record<string, string>);
              showToast('Validation failed. Please check input fields.');
              return;
            } else if (data && typeof data.message === 'string') {
              showToast(data.message);
              return;
            }
          }
          showToast("Could not save the supplier due to a saving error.");
        }
      }
    );
  }, [updateMutation, supplier_id, navigate, showToast]);

  return (
    <>
      <div className="erp-panel-main flex-1 overflow-y-auto">
        {isError ? (
          <div className="flex w-full h-full justify-center items-center p-6">
            <Card className="max-w-md w-full mx-auto">
              <p className="text-sm font-semibold text-zinc-800">Could not load supplier details due to a loading error.</p>
              <p className="text-xs text-zinc-500 mt-2">
                <strong>F5</strong>: Retry
              </p>
            </Card>
          </div>
        ) : (
          supplier && <EditSupplierMain supplier={supplier} onSave={handleSave} serverErrors={serverErrors} />
        )}
      </div>
      {(isLoading || updateMutation.isPending) && <LoadingPopup message={updateMutation.isPending ? "Updating supplier details..." : "Loading supplier details..."} />}
    </>
  );
}
